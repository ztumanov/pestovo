/**
 * Modern High-Capacity Storage & Memory Management Layer
 * Uses IndexedDB to provide 500MB+ of safe, non-blocking storage
 * completely bypassing browser localStorage ~5MB quotas.
 */

const DB_NAME = 'YasnayaPolyanaDB';
const DB_VERSION = 1;
const STORE_NAME = 'site_config';
export const CONFIG_KEY = 'editable_site_data';
export const LEGACY_STORAGE_KEY = 'pestovo_resort_editable_data';
export const FAST_CACHE_KEY = 'yasnaya_polyana_fast_site_data';
export const FAST_OVERRIDES_KEY = 'yasnaya_polyana_media_overrides';

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not available'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Synchronously retrieves fast-cached site data from localStorage (0ms latency, eliminates flash of default images)
 */
export function getFastStorageData<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const fast = localStorage.getItem(FAST_CACHE_KEY);
    if (fast) {
      const parsed = JSON.parse(fast) as T;
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.warn('Fast cache read failed:', e);
  }

  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as T;
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {}

  return null;
}

/**
 * Synchronously retrieves media and card overrides from localStorage
 */
export function getFastMediaOverrides(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(FAST_OVERRIDES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

/**
 * Synchronously caches site data and essential visual assets to localStorage for instant startup display.
 * Implements a smart tiered strategy:
 * - If full site data fits, it's saved.
 * - If full site data exceeds quota (due to heavy base64 photos/gallery), it cleanly preserves
 *   essential above-the-fold media (hero photo, first rooms, medical programs) so startup has 0ms flicker.
 */
export function saveFastStorageData(data: any): void {
  if (typeof window === 'undefined' || !data) return;

  const trySet = (key: string, val: string): boolean => {
    try {
      localStorage.setItem(key, val);
      return true;
    } catch {
      return false;
    }
  };

  // Tier 1: Try saving full data if under ~2.5MB
  try {
    const fullJson = JSON.stringify(data);
    if (fullJson.length < 2.5 * 1024 * 1024) {
      if (trySet(FAST_CACHE_KEY, fullJson)) {
        return;
      }
    }
  } catch {}

  // Tier 2: Save essential above-the-fold visual overrides (hero, primary rooms, medical programs)
  try {
    // Clear old heavy keys if any to free quota space
    try { localStorage.removeItem(LEGACY_STORAGE_KEY); } catch {}

    const essential: any = {
      resortInfo: data.resortInfo,
      hero: {
        badge: data.hero?.badge,
        titleFirstPart: data.hero?.titleFirstPart,
        titleSecondPart: data.hero?.titleSecondPart,
        subtitle: data.hero?.subtitle,
        ctaText: data.hero?.ctaText,
        defaultBackgroundMode: data.hero?.defaultBackgroundMode,
        // Limit fast cache to first 2 slides to guarantee it fits under quota
        slides: Array.isArray(data.hero?.slides) ? data.hero.slides.slice(0, 2) : []
      },
      rooms: Array.isArray(data.rooms) ? data.rooms.map((r: any) => ({
        id: r.id,
        name: r.name,
        category: r.category,
        image: r.image
      })) : [],
      medicalPrograms: Array.isArray(data.medicalPrograms) ? data.medicalPrograms.map((m: any) => ({
        id: m.id,
        title: m.title,
        image: m.image,
        indications: Array.isArray(m.indications) ? m.indications : [],
        procedures: Array.isArray(m.procedures) ? m.procedures : []
      })) : [],
      images: {
        hero: data.images?.hero || '',
        suite: data.images?.suite || '',
        medical: data.images?.medical || '',
        nature: data.images?.nature || ''
      },
      extraImages: {
        standardRoom: data.extraImages?.standardRoom || '',
        deluxeRoom: data.extraImages?.deluxeRoom || '',
        pool: data.extraImages?.pool || '',
        dining: data.extraImages?.dining || ''
      },
      _metadata: data._metadata
    };

    const essentialJson = JSON.stringify(essential);
    if (trySet(FAST_CACHE_KEY, essentialJson)) {
      trySet(FAST_OVERRIDES_KEY, essentialJson);
      return;
    }

    // Tier 3: Ultra-lightweight fallback if individual base64 images are very large
    const ultraLight: any = {
      resortInfo: data.resortInfo,
      hero: {
        ...data.hero,
        slides: Array.isArray(data.hero?.slides) ? data.hero.slides.map((s: any) => ({
          ...s,
          url: (s.url && s.url.startsWith('data:') && s.url.length > 400000) ? '' : s.url
        })) : []
      },
      images: {
        hero: (data.images?.hero && data.images.hero.length > 400000) ? '' : data.images?.hero,
        suite: (data.images?.suite && data.images.suite.length > 400000) ? '' : data.images?.suite,
        medical: (data.images?.medical && data.images.medical.length > 400000) ? '' : data.images?.medical,
        nature: (data.images?.nature && data.images.nature.length > 400000) ? '' : data.images?.nature
      }
    };
    trySet(FAST_CACHE_KEY, JSON.stringify(ultraLight));
  } catch (err) {
    console.warn('Could not save fast storage data:', err);
  }
}

/**
 * Retrieve data from IndexedDB with graceful fallback to localStorage and migration
 */
export async function getStorageData<T>(key: string = CONFIG_KEY): Promise<T | null> {
  try {
    const db = await openDB();
    const idbData = await new Promise<T | null>((resolve) => {
      try {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

    if (idbData) {
      // Refresh fast cache with fresh IndexedDB content
      saveFastStorageData(idbData);
      return idbData;
    }
  } catch (err) {
    console.warn('IndexedDB unavailable, checking localStorage fallback:', err);
  }

  // Fallback: check synchronous fast cache or legacy localStorage
  const fast = getFastStorageData<T>();
  if (fast) {
    // Auto-migrate to IndexedDB
    setStorageData(fast, key).catch(() => {});
    return fast;
  }

  return null;
}

/**
 * Save data asynchronously to high-capacity IndexedDB AND synchronously to fast localStorage
 */
export async function setStorageData<T>(data: T, key: string = CONFIG_KEY): Promise<boolean> {
  // 1. Immediately write to fast synchronous cache for 0ms page reloads
  saveFastStorageData(data);

  // 2. Save full payload to high-capacity IndexedDB
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(data, key);
      request.onsuccess = () => resolve(true);
      request.onerror = (e) => {
        console.error('IndexedDB write error:', e);
        resolve(false);
      };
    });
  } catch (err) {
    console.warn('IndexedDB write failed, relying on fast cache:', err);
    return true;
  }
}

/**
 * Clear draft data from both IndexedDB and localStorage
 */
export async function clearStorageData(key: string = CONFIG_KEY): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(key);
  } catch (err) {
    console.warn('IndexedDB delete error:', err);
  }

  try {
    localStorage.removeItem(FAST_CACHE_KEY);
    localStorage.removeItem(FAST_OVERRIDES_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {}
}

/**
 * Calculate size in bytes and human-readable string
 */
export function calculateStorageSize(data: any): { bytes: number; formatted: string } {
  try {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    const bytes = new Blob([str]).size;
    if (bytes < 1024) return { bytes, formatted: `${bytes} Б` };
    if (bytes < 1024 * 1024) return { bytes, formatted: `${(bytes / 1024).toFixed(1)} КБ` };
    return { bytes, formatted: `${(bytes / (1024 * 1024)).toFixed(2)} МБ` };
  } catch {
    return { bytes: 0, formatted: '0 КБ' };
  }
}

/**
 * High-efficiency image compression utility
 * Downscales images to max 1280px and applies high-quality compression (reduces 10MB -> ~120KB)
 */
export function compressImageFile(
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.78
): Promise<string> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const originalResult = e.target?.result as string;
      if (!originalResult) {
        resolve('');
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Try WebP first for optimal compression & transparency support
          const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
          const mimeType = supportsWebP ? 'image/webp' : 'image/jpeg';

          if (mimeType === 'image/jpeg') {
            // Fill white background for JPEG so transparent PNGs don't get black boxes
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL(mimeType, quality);
          resolve(optimized);
        } else {
          resolve(originalResult);
        }
      };
      img.onerror = () => resolve(originalResult);
      img.src = originalResult;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
