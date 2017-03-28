import * as mainService from '../services/app';
import { parse } from 'qs';
const Cookie = require('js-cookie')

export default {
  namespace: 'app',
  state: {
    login: false, // 登录状态标志
    user: { // 登录用户信息
      name: '',
    },
    loginButtonLoading: false, // 登录按钮加载中
    menuPopoverVisible: false,
    loginMsgShow: false, // 是否显示登录错误信息
    errMsg: '', // 登录错误信息
    siderFold: localStorage.getItem('idataSiderFold') === 'true',
    darkTheme: localStorage.getItem('idataDarkTheme') !== 'false',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem('navOpenKeys') || '[]'),
  },
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'queryUser' })
      window.onresize = () => {
        dispatch({ type: 'changeNavbar' })
      }
    },
  },
  effects: {
    *login ({
      payload,
    }, { call, put }) {
      yield put({ type: 'showLoginButtonLoading' })
      const { data, headers } = yield call(mainService.login, parse(payload))
      if (data['data']['status'] == '0') {
        // 登陆成功，写cookie, 这里不太安全，后续扩展
        const now = new Date()
        now.setDate(now.getDate() + 1)
        Cookie.set('user_session', now.getTime(), { path: '/' })
        Cookie.set('user_name', payload.username, { path: '/' })

        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: payload.username,
            },
          }
        })
      } else {
        yield put({
          type: 'loginFail',
          payload: {
            loginMsgShow: true,
            errMsg: data['data']['msg']
          }
        })
      }
    },
    *queryUser ({
      payload,
    }, { call, put }) {
      // const data = yield call(mainService.userInfo, parse(payload))
      //if (data.success) {
      // 这里改成同步处理，检查cookie, 待重构
      if ( Cookie.get('user_session') && Cookie.get('user_session') > (new Date).getTime() ) {
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: Cookie.get('user_name'),
            },
          },
        })
      }
    },
    *logout ({
      payload,
    }, { call, put }) {
      //const data = yield call(mainService.logout, parse(payload))
      Cookie.remove('user_session', { path: '/' })
      Cookie.remove('user_name', { path: '/' })
      yield put({
        type: 'logoutSuccess',
      })
    },
    *switchSider ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchSider',
      })
    },
    *changeTheme ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleChangeTheme',
      })
    },
    *changeNavbar ({
      payload,
    }, { put }) {
      if (document.body.clientWidth < 769) {
        yield put({ type: 'showNavbar' })
      } else {
        yield put({ type: 'hideNavbar' })
      }
    },
    *switchMenuPopver ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchMenuPopver',
      })
    },
  },
  reducers: {
    loginSuccess (state, action) {
      return {
        ...state,
        ...action.payload,
        login: true,
        loginButtonLoading: false,
      }
    },
    logoutSuccess (state) {
      return {
        ...state,
        login: false,
        loginMsgShow: false,
      }
    },
    loginFail (state, action) {
      return {
        ...state,
        ...action.payload,
        login: false,
        loginButtonLoading: false,
        loginMsgShow: true,
      }
    },
    showLoginButtonLoading (state) {
      return {
        ...state,
        loginButtonLoading: true,
      }
    },
    handleSwitchSider (state) {
      localStorage.setItem('idataSiderFold', !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    handleChangeTheme (state) {
      localStorage.setItem('idataDarkTheme', !state.darkTheme)
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },
    showNavbar (state) {
      return {
        ...state,
        isNavbar: true,
      }
    },
    hideNavbar (state) {
      return {
        ...state,
        isNavbar: false,
      }
    },
    handleSwitchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavOpenKeys (state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
}
