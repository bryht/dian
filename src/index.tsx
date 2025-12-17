import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import HomePage from 'application/HomePage';
import store from './core/Store';
import { Provider } from 'react-redux';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/modal';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Wait a bit for Electron to fully initialize before rendering
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
}, 100);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

