import * as servs from '../services/reports'
import { parse } from 'qs'
const Cookie = require('js-cookie')

export default {
  namespace: 'reports',
  state: {
    list: [],
    currentItem: {},
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
  },
  effects: {
    *query ({ payload }, { call, put }) {
      const { data, headers } = yield call(servs.query, parse(payload))
      yield put({
        type: 'querySuccess',
        payload: {
          list: data['data']['reports']['data'],
          categories: data['data']['categories'],
          total: data['data']['reports'].total,
          pagination: {
            current: data['data']['reports'].current_page,
            total: data['data']['reports'].total,
          }
        },
      });
    },
    *create ({ payload }, { call, put }) {
      yield put({
        type: 'hideModal',
      })
      const { data, headers } = yield call(servs.create, {...payload, username: Cookie.get('user_name')})
      yield put({ type: 'reload' });
    },
    *update ({ payload }, { select, call, put }) {
      yield put({
        type: 'hideModal',
      })

      const { data, headers } = yield call(servs.create, payload)

      yield put({
        type: 'reload',
      })
    },
    *reload (action, { put, select }) {
      const pagination = yield select(state => {
        return state.reports.pagination
      })

      yield put({
        type: 'query',
        payload: {}
      })
    }
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
