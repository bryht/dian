import React from 'react';
import ReactDOM from 'react-dom';
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

ReactDOM.render(
  <Provider store={store()}>
    <React.StrictMode>
      <HomePage />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
