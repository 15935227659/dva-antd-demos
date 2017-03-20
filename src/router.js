import React from 'react';
import { Router, Route } from 'dva/router';
import IndexPage from './routes/IndexPage';

import Users from "./routes/Users.js";

import Categories from "./routes/Categories.js";

import Menus from "./routes/Menus.js";

import Authorities from "./routes/Authorities.js";

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={IndexPage} />
      <Route path="/users" component={Users} />
      <Route path="/categories" component={Categories} />
      <Route path="/menus" component={Menus} />
      <Route path="/authorities" component={Authorities} />
    </Router>
  );
}

export default RouterConfig;
