import 'babel-polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import io from 'socket.io-client';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import Root from './Root';
import configStore from './common/configStore';

const store = configStore();
const history = syncHistoryWithStore(browserHistory, store);

const socket = io();
socket.on('connect', () => {
  console.log('[PORTAL] connected.');
});

socket.on('fileChanged', (data) => {
  store.dispatch({
    type: 'PROJECT_FILE_CHANGED',
    data,
  });
});

socket.on('disconnect', () => {
  console.log('[PORTAL] disconnected.');
});

let root = document.getElementById('react-root');
if (!root) {
  root = document.createElement('div');
  root.id = 'react-root';
  document.body.appendChild(root);
}

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  root
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const NextRoot = require('./Root').default; // eslint-disable-line
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      root
    );
  });
}
