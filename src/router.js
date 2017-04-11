import React, { PropTypes } from 'react'
import { Router } from 'dva/router'
import App from './routes/app'

const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}

const Routers = function ({ history, app }) {
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
          path: 'reports',
          name: 'reports',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/reports'))
              cb(null, require('./routes/reports/'))
            }, 'reports')
          },
        }, {
          path: 'categories',
          name: 'categories',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/categories'))
              cb(null, require('./routes/categories/'))
            }, 'categories')
          },
        }, {
          path: 'menus',
          name: 'menus',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/menus'))
              cb(null, require('./routes/menus/'))
            }, 'menus')
          },
        }, {
          path: '*',
          name: 'error',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers
