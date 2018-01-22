import 'babel-polyfill';
import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { render } from 'react-dom';
import io from 'socket.io-client';
import { browserHistory } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
import Root from './Root';
import routeConfig from './common/routeConfig';
import configStore from './common/configStore';

const store = configStore();
// const history = syncHistoryWithStore(browserHistory, store);

if (process.env.NODE_ENV !== 'test') {
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

  socket.on('output', (data) => {
    store.dispatch({
      type: 'REKIT_PORTAL_OUTPUT',
      data,
    });
  });

  socket.on('build-finished', (data) => {
    store.dispatch({
      type: 'REKIT_TOOLS_BUILD_FINISHED',
      data,
    });
  });

  socket.on('test-finished', (data) => {
    store.dispatch({
      type: 'REKIT_TOOLS_TEST_FINISHED',
      data,
    });
  });

  socket.on('disconnect', () => {
    console.log('[PORTAL] disconnected.');
  });
}

let root = document.getElementById('react-root');
if (!root) {
  root = document.createElement('div');
  root.id = 'react-root';
  document.body.appendChild(root);
}

function renderApp(app) {
  render(
    <AppContainer>
      {app}
    </AppContainer>,
    root,
  );
}

renderApp(<Root store={store} routeConfig={routeConfig} />);

if (module.hot) {
  module.hot.accept('./common/routeConfig', () => {
    const nextRouteConfig = require('./common/routeConfig').default; // eslint-disable-line
    renderApp(<Root store={store} routeConfig={nextRouteConfig} />);
  });
}
