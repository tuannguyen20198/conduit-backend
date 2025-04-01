import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TanstackQueryProvider from './lib/tanstack-query-provider';
import App from './App';
import { AuthProvider } from './context/AuthContext';
createRoot(document.getElementById('root')).render(_jsx(StrictMode, { children: _jsx(TanstackQueryProvider, { children: _jsx(AuthProvider, { children: _jsx(App, {}) }) }) }));
