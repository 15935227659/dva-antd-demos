import './index.html'
import 'babel-polyfill'
import dva from 'dva'
import createLoading from 'dva-loading'
import { browserHistory } from 'dva/router'

/**
 * @desc 以下是解决域名下面子目录部署问题
 * 域名项目下面一般会有多个子项目，那么部署的时候，子目录的作用就至关重要了。
 * 不借助basename不太容易实现。
 */
import { useRouterHistory } from 'dva/router'
import createBrowserHistory from 'history/lib/createBrowserHistory'

const history = useRouterHistory(createBrowserHistory)({basename: '/console-ct'})

// 1. Initialize
const app = dva({
  ...createLoading(),
//  history: browserHistory,
  history,
  onError (error) {
    console.error('app onError -- ', error)
  },
})

// 2. Model
app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
