import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import WebFont from 'webfontloader';
import { store, sagaMiddleware } from './store';
import rootSaga from './saga/rootSaga';
import Home from './components/landing/Home';
import AdminPage from './components/admin/AdminPage';

import Forgot from './components/forgot/Forgot';
import ResetPassword from './components/reset/ResetPassword';
import InvalidToken from './components/invalidtoken/InvalidToken';

WebFont.load({
  google: {
    families: ['Ubuntu:300,400,700', 'Roboto'],
  },
});

render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path={'/forgot'} component={Forgot} />
        <Route path={'/reset'} component={ResetPassword} />
        <Route path={'/invalidtoken'} component={InvalidToken} />
        <Route path={'/admin'} component={AdminPage} />
        <Route component={Home} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

sagaMiddleware.run(rootSaga);
