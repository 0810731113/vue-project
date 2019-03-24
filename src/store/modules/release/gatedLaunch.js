import * as API from 'api/release';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  gatedLaunch: {
    list: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchGatedLaunchList: async ({ commit }, params = {}) => {
    const result = await API.fetchGatedLaunchList(params);
    commit(types.FETCH_GATED_LAUNCH_LIST, result);
  },
  saveGatedLaunch: async ({ commit }, params) => {
    await API.saveGatedLaunch(params);
  },
  deleteGatedLaunch: async ({ commit }, params) => {
    await API.deleteGatedLaunch(params);
    commit(types.DELETE_GATED_LAUNCH, params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_GATED_LAUNCH_LIST]: (state, result) => {
    const { grayList, recordCount, pageIndex, pageSize } = result;
    state.gatedLaunch = { ...state.gatedLaunch, list: grayList || [], recordCount, pageIndex, pageSize };
  },
  [types.DELETE_GATED_LAUNCH]: (state, result) => {
    state.gatedLaunch.list = state.gatedLaunch.list.filter(item => item.shopGUID !== result.operaShopGUID);
  }
};
