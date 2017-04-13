import * as servs from '../services/reports'
import { parse } from 'qs'
const Cookie = require('js-cookie')

export default {
  namespace: 'reports',
  state: {
    list: [],
    currentItem: {},
    curQuotes: [],
    curDims: [],
    modalVisible: false,
    modalType: 'create',
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
        if (location.pathname === '/reports') {
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
          list: data['data']['data'],
          total: data['data'].total,
          pagination: {
            current: data['data'].current_page,
            total: data['data'].total,
          }
        },
      });
    },
    *create ({ payload }, { call, put }) {
      yield put({
        type: 'hideModal',
      })
      const { data, headers } = yield call(servs.create, {
        ...payload,
        username: Cookie.get('user_name'),
      })
      yield put({ type: 'reload' })
    },
    *update ({ payload }, { select, call, put }) {
      yield put({ type: 'hideModal' })
      const id = yield select(({ reports }) => reports.currentItem.id)
      const newItem = {
        ...payload,
        id,
      }
      const { data, headers } = yield call(servs.update, newItem)
      yield put({ type: 'reload' })
    },
    *'delete' ({ payload }, { call, put }) {
      const { data, headers } = yield call(servs.remove, payload)
      yield put({ type: 'reload' })
    },
    *reload (action, { put, select }) {
      const pagination = yield select(state => {
        return state.reports.pagination
      })

      yield put({
        type: 'query',
        payload: {},
        currentItem: {},
      })
    }
  },
  reducers: {
    querySuccess (state, action) {
      const { list, pagination } = action.payload
      return { ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        }
      }
    },
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: true,
      }
    },
    hideModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: false,
      }
    },
  }
}
