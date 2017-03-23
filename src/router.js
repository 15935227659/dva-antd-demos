import React, { PropTypes } from 'react'
import { Router } from 'dva/router'
import App from './routes/app'

// 注册model
const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}


const Routers = function({ history, app }) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/dashboard'))
          cb(null, { component: require('./routes/dashboard/') })
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'dashboard',
          name: 'dashboard',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'menus',
          name: 'menus',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/menus'))
              cb(null, require('./routes/menus/'))
            }, 'menus')
          }
        }
      ]
    }
  ];


  return <Router history={history} routes={routes} />
}

export default Routers
