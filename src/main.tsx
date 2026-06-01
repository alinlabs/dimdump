import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import App from './App.tsx';
import AdminApp from './admin/AdminApp';
import Info from './pages/Info';
import Login from './admin/pages/Login';
import Secret from './pages/Secret';
import './index.css';

// Suppress Vite websocket connection errors in development
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const msg = typeof reason === 'string' ? reason : reason?.message || '';
  if (msg.includes('WebSocket closed') || msg.includes('failed to connect to websocket')) {
    event.preventDefault();
  }
});

const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && (args[0].includes('failed to connect to websocket') || args[0].includes('WebSocket closed'))) {
    return;
  }
  originalConsoleError(...args);
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const email = localStorage.getItem('admin_email') || sessionStorage.getItem('admin_email_temp');
  if (!email) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={
          <RequireAuth>
            <AdminApp />
          </RequireAuth>
        } />
        <Route path="/info" element={
          <RequireAuth>
            <Navigate to="/info/sumber" replace />
          </RequireAuth>
        } />
        <Route path="/info/:section" element={
          <RequireAuth>
            <Info />
          </RequireAuth>
        } />
        <Route path="/secret" element={<Secret />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
