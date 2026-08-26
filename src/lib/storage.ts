/**
 * Modern High-Capacity Storage & Memory Management Layer
 * Uses IndexedDB to provide 500MB+ of safe, non-blocking storage
 * completely bypassing browser localStorage ~5MB quotas.
 */

const DB_NAME = 'YasnayaPolyanaDB';
const DB_VERSION = 1;
const STORE_NAME = 'site_config';
const CONFIG_KEY = 'editable_site_data';
const LEGACY_STORAGE_KEY = 'pestovo_resort_editable_data';

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
      return idbData;
    }
  } catch (err) {
    console.warn('IndexedDB unavailable, checking localStorage fallback:', err);
  }

  // Fallback: check legacy localStorage
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsed = JSON.parse(legacy) as T;
      // Auto-migrate to IndexedDB and clean up localStorage to prevent memory quota block
      setStorageData(parsed, key).catch(() => {});
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch {}
      return parsed;
    }
  } catch (e) {
    console.warn('Error reading fallback localStorage:', e);
  }

  return null;
}

/**
 * Save data asynchronously to high-capacity IndexedDB
 */
export async function setStorageData<T>(data: T, key: string = CONFIG_KEY): Promise<boolean> {
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
    console.warn('IndexedDB write failed, trying localStorage fallback:', err);
    try {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (lsErr) {
      console.error('LocalStorage also exceeded quota:', lsErr);
      return false;
    }
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
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          const optimized = canvas.toDataURL('image/jpeg', quality);
          resolve(optimized);
        } else {
          resolve(originalResult);
        }
      };
      img.onerror = () => resolve(originalResult);
      img.src = originalResult;
    };
    reader.readAsDataURL(file);
  });
}
