import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteSoftware,
  fetchSoftwareDetail,
  fetchSoftwareList,
  saveSoftware
} from 'api/release';

// initial state
export const state = {
  software: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchSoftwareList: async ({ commit }, params) => {
    const result = await fetchSoftwareList(params);
    commit(types.FETCH_SOFTWARE_LIST, result);
  },
  fetchSoftwareDetail: async ({ commit }, params) => {
    const result = await fetchSoftwareDetail(params);
    commit(types.FETCH_SOFTWARE_DETAIL, result);
  },
  saveSoftware: async ({ commit }, params) => {
    await saveSoftware(params);
  },
  deleteSoftware: async ({ commit }, params) => {
    await deleteSoftware(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SOFTWARE_LIST]: (state, result) => {
    const { pageIndex, pageSize, recordCount, list } = result;
    state.software = { ...state.software, pageIndex, pageSize, recordCount, list };
  },
  [types.FETCH_SOFTWARE_DETAIL]: (state, result) => {
    state.software.detail = result.itemDto;
  }
};
