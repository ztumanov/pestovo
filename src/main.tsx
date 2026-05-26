import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AdminDataProvider } from './context/AdminDataContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminDataProvider>
      <App />
    </AdminDataProvider>
  </StrictMode>,
);
