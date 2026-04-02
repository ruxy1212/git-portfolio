import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App config={CONFIG} />
    </BrowserRouter>
  </React.StrictMode>,
);
