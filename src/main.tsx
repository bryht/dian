import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import HomePage from './pages/HomePage';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Wait longer for Electron to fully initialize before rendering
setTimeout(() => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  );
}, 300);

