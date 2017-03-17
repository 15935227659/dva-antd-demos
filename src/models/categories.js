import * as categoriesService from '../services/categories';

export default {
  namespace: 'categories',
  state: {
    list: [],
    total: null,
    page: null,
  },
  reducers: {
    save(state, { payload: { data: list, total, page } }) {
      return { ...state, list, total, page };
    },
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      const { data, headers } = yield call(categoriesService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data: data['data']['data'],
          total: data['data'].total,
          page: parseInt(page, 10),
//          total: parseInt(headers['x-total-count'], 10),
//          page: parseInt(page, 10),
        },
      });
    },
    *remove({ payload: id }, { call, put }) {
      yield call(categoriesService.remove, id);
      yield put({ type: 'reload' });
    },
    *patch({ payload: { id, values } }, { call, put }) {
      yield call(categoriesService.patch, id, values);
      yield put({ type: 'reload' });
    },
    *create({ payload: values }, { call, put }) {
      yield call(categoriesService.create, values);
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const page = yield select(state => state.categories.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/categories') {
          dispatch({ type: 'fetch', payload: query });
        }
      });
    },
  },
};
