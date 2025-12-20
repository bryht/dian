import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import HomePage from 'application/HomePage';
import store from './core/Store';
import { Provider } from 'react-redux';
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
    <Provider store={store()}>
      <React.StrictMode>
        <HomePage />
      </React.StrictMode>
    </Provider>
  );
}, 300);

