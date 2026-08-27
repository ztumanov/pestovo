import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function serverStoragePlugin(): Plugin {
  return {
    name: 'server-storage-backend',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // Handle settings save: POST /save_settings.php or POST /api/save_settings
        if (url === '/save_settings.php' || url === '/api/save_settings') {
          if (req.method === 'POST') {
            let rawBody = '';
            req.on('data', chunk => {
              rawBody += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(rawBody);
                const siteData = parsed.siteData || (parsed.resortInfo ? parsed : null);

                if (!siteData) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json; charset=utf-8');
                  res.end(JSON.stringify({ error: 'Некорректные данные настроек (siteData).' }));
                  return;
                }

                const publicDir = path.resolve(__dirname, 'public');
                if (!fs.existsSync(publicDir)) {
                  fs.mkdirSync(publicDir, { recursive: true });
                }
                const siteDataPath = path.resolve(publicDir, 'site-data.json');
                const encoded = JSON.stringify(siteData, null, 2);
                fs.writeFileSync(siteDataPath, encoded, 'utf-8');

                // Also sync to dist if present
                const distDir = path.resolve(__dirname, 'dist');
                if (fs.existsSync(distDir)) {
                  fs.writeFileSync(path.resolve(distDir, 'site-data.json'), encoded, 'utf-8');
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({
                  success: true,
                  message: 'Настройки и медиа успешно сохранены на сервере в файле site-data.json!',
                  bytes_written: Buffer.byteLength(encoded),
                  timestamp: new Date().toISOString()
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: err?.message || 'Ошибка сервера при сохранении' }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            const siteDataPath = path.resolve(__dirname, 'public/site-data.json');
            const exists = fs.existsSync(siteDataPath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({
              status: 'online',
              file_exists: exists,
              writable: true,
              file_size_bytes: exists ? fs.statSync(siteDataPath).size : 0,
              php_version: 'Vite Storage Node Engine'
            }));
            return;
          }
        }

        // Handle reviews: /reviews.php or /api/reviews
        if (url === '/reviews.php' || url === '/api/reviews') {
          const reviewsPath = path.resolve(__dirname, 'public/reviews_data.json');

          if (req.method === 'POST') {
            let rawBody = '';
            req.on('data', chunk => {
              rawBody += chunk;
            });
            req.on('end', () => {
              try {
                const parsed = JSON.parse(rawBody);
                let currentReviews: any[] = [];
                if (fs.existsSync(reviewsPath)) {
                  try {
                    currentReviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));
                  } catch {}
                }

                if (parsed.action === 'save_all' && Array.isArray(parsed.reviews)) {
                  currentReviews = parsed.reviews;
                } else if (parsed.author && parsed.content) {
                  const newReview = {
                    id: parsed.id || `rev-${Date.now()}`,
                    author: parsed.author,
                    city: parsed.city || 'Гость санатория',
                    date: parsed.date || new Date().toLocaleDateString('ru-RU'),
                    content: parsed.content,
                    rating: parsed.rating || 5,
                    stayDate: parsed.stayDate || '',
                    verified: false,
                    avatar: parsed.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  };
                  currentReviews.unshift(newReview);
                }

                fs.writeFileSync(reviewsPath, JSON.stringify(currentReviews, null, 2), 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ success: true, count: currentReviews.length }));
              } catch (e: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify({ error: e?.message || 'Error processing reviews' }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            if (fs.existsSync(reviewsPath)) {
              res.end(fs.readFileSync(reviewsPath, 'utf-8'));
            } else {
              res.end(JSON.stringify([]));
            }
            return;
          }
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serverStoragePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
