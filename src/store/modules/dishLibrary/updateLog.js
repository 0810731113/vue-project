import * as API from 'api/dishLibrary';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  updateLog: {
    updateLogList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    updateLogDetail: {
      dataSend: {},
      dataSendItem: [],
      menuItem: [],
      cookbook: []
    }
  }
};

// actions
export const actions = {
  fetchUpdateLogList: async ({ commit }, params) => {
    const result = await API.fetchUpdateLogList(params);
    commit(types.FETCH_UPDATE_LOG_LIST, result);
  },
  cancelTimedUpdate: async ({ commit }, params) => {
    await API.cancelTimedUpdate(params);
  },
  fetchUpdateLogDetail: async ({ commit }, params) => {
    const result = await API.fetchUpdateLogDetail(params);
    commit(types.FETCH_UPDATE_LOG_DETAIL, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_UPDATE_LOG_LIST]: (state, result) => {
    const { updateLog } = state;
    const { dataSendList, pageSize, pageIndex, recordCount } = result;
    state.updateLog = { ...updateLog, updateLogList: dataSendList, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_UPDATE_LOG_DETAIL]: (state, result) => {
    const { updateLog } = state;
    state.updateLog = { ...updateLog, updateLogDetail: { ...result.data } };
  }
};
