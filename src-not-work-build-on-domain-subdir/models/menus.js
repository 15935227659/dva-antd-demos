import * as servs from '../services/menus'
import { parse } from 'qs'
import { ADMIN_PREFIX } from '../constants'

export default {
  namespace: 'menus',
  state: {
    list: [],
    categories: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    authVisible: false,
    isMotion: localStorage.getItem('idataUserIsMotion') === 'true',
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: null,
    },
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/' + ADMIN_PREFIX + 'menus') {
          dispatch({
            type: 'query',
            payload: location.query,
          })
        }
      })
    },
  },

  effects: {
    *query ({ payload }, { call, put }) {
      const { data, headers } = yield call(servs.query, parse(payload))
      yield put({
        type: 'querySuccess',
        payload: {
          list: data['data']['menus']['data'],
          categories: data['data']['categories'],
          total: data['data']['menus'].total,
          pagination: {
            current: data['data']['menus'].current_page,
            total: data['data']['menus'].total,
          }
        },
      });
    },
    *auth({ payload: values }, { call, put }) {
      yield put({ type: 'hideAuth' })
      yield call(servs.auth, values);
      yield put({ type: 'reload' });
    },
    *'delete' ({ payload }, { call, put }) {
      const data = yield call(servs.remove, payload)
      yield put({ type: 'reload' })
    },
    *create ({ payload }, { call, put }) {
      yield put({ type: 'hideModal' })
      const { data, headers } = yield call(servs.create, payload)
      yield put({ type: 'reload' });
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const id = yield select(({ menus }) => menus.currentItem.id)
      const newItem = { ...payload, id }
      const { data, headers } = yield call(servs.update, newItem)
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const pagination = yield select(state => {
        return state.menus.pagination
      });
      //yield put({ type: 'query', payload: { pagination } });
      // 编辑、删除、新增、权限保存后都重新刷新列表
      yield put({ type: 'query', payload: { } });
    },
    *switchIsMotion ({
      payload,
    }, { put }) {
      yield put({
        type: 'handleSwitchIsMotion',
      })
    },
  },

  reducers: {
    querySuccess (state, action) {
      const { list, pagination, categories } = action.payload
      return { ...state,
        list,
        categories,
        pagination: {
          ...state.pagination,
          ...pagination,
        } }
    },
    showModal (state, action) {
      return { ...state, ...action.payload, modalVisible: true }
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showAuth (state, action) {
      return { ...state, ...action.payload, authVisible: true }
    },
    hideAuth (state) {
      return { ...state, authVisible: false }
    },
    handleSwitchIsMotion (state) {
      localStorage.setItem('idataUserIsMotion', !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },
  },
}
