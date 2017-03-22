import * as menusService from '../services/menus';

export default {
  namespace: 'menus',
  state: {
    list: [],
    total: null,
    page: null,
    categories: [],
  },
  reducers: {
    save(state, { payload: { data: list, total, page, categories } }) {
      return { ...state, list, total, page, categories };
    },
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      const { data, headers } = yield call(menusService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data: data['data']['menus']['data'],
          categories: data['data']['categories'],
          total: data['data']['menus'].total,
          page: parseInt(page, 10),
//          total: parseInt(headers['x-total-count'], 10),
//          page: parseInt(page, 10),
        },
      });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(menusService.remove, id);
      yield put({ type: 'reload' });
    },
    *patch({ payload: { id, values } }, { call, put }) {
      yield call(menusService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *auth({ payload: values }, { call, put }) {
      yield call(menusService.auth, values);
      yield put({ type: 'reload' });
    },
    *create({ payload: values }, { call, put }) {
      yield call(menusService.create, values);
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const page = yield select(state => state.menus.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/menus') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
