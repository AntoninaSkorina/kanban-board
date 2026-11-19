import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.scss';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root not found in public/index.html');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
