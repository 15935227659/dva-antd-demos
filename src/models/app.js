import * as loginService from '../services/app'

export default {
  namespace: 'app',
  state: {
    login: false,
    loginButtonLoading: false,
    user: {
      name: '',
    }
  },
  subscriptions: {
    setup ({ dispatch }) {
      dispatch({ type: 'queryUser' })
/*      window.onresize = () => {
        dispatch({ type: 'changeNavbar' })
      }*/
    },
  },
  effects: {
    *login ({ payload, }, { call, put }) {
      yield put({ type: 'showLoginButtonLoading' })
      const { data }  = yield call(loginService.login, payload)
      if (data.status === 'success') {
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: payload.username,
            },
          } })
      } else {
        yield put({
          type: 'loginFail',
        })
      }
    },
    *queryUser ({ payload, }, { call, put }) {
      const { data } = yield call(loginService.userInfo, payload)
      if (data.status === 'success') {
        yield put({
          type: 'loginSuccess',
          payload: {
            user: {
              name: data.username,
            },
          },
        })
      }
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
      }
    },
    loginFail (state) {
      return {
        ...state,
        login: false,
        loginButtonLoading: false,
      }
    },
    showLoginButtonLoading (state) {
      return {
        ...state,
        loginButtonLoading: true,
      }
    },
  }
};
