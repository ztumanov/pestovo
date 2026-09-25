import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminDataProvider } from './context/AdminDataContext.tsx';

async function bootstrap() {
  // In incognito mode or fresh visits, await early fetch promise (with max 550ms safety timeout)
  // This guarantees that the very first React paint already has user's uploaded photos from site-data.json
  if (typeof window !== 'undefined') {
    const earlyPromise = (window as any).__SITE_DATA_EARLY_PROMISE__;
    if (!(window as any).__EARLY_SITE_DATA__ && earlyPromise) {
      try {
        const res = await Promise.race([
          earlyPromise,
          new Promise((resolve) => setTimeout(resolve, 550))
        ]);
        if (res && res.data) {
          (window as any).__EARLY_SITE_DATA__ = res.data;
        }
      } catch {
        // Continue smoothly if network fails or times out
      }
    }
  }

  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <AdminDataProvider>
          <App />
        </AdminDataProvider>
      </StrictMode>,
    );
  }
}

bootstrap();
