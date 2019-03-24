import * as API from 'api/setting';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  takeoutMapping: {
    takeoutMappingList: [],
    noPageTakeoutList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    vendorList: [],
    dishList: [],
    takeoutLink: ''
  }
};

// actions
export const actions = {
  fetchTakeoutMappingList: async ({ commit }, params) => {
    const result = await API.fetchTakeoutMappingList(params);
    commit(types.FETCH_TAKEOUT_MAPPING_LIST, result);
  },
  fetchNoPageTakeoutList: async ({ commit }, params) => {
    const result = await API.fetchNoPageTakeoutList(params);
    commit(types.FETCH_NO_PAGE_TAKEOUT_LIST, result);
  },
  fetchVendorList: async ({ commit }, params) => {
    const result = await API.fetchVendorList(params);
    commit(types.FETCH_VENDOR_LIST, result);
  },
  fetchDishList: async ({ commit }, params) => {
    const result = await API.fetchDishList(params);
    commit(types.FETCH_DISH_LIST, result);
  },
  saveVendorList: async ({ state }, params) => {
    await API.saveVendorList(params);
  },
  fetchTakeoutLink: async ({ commit }, params) => {
    const result = await API.fetchTakeoutLink(params);
    commit(types.TAKEOUT_LINK, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_TAKEOUT_MAPPING_LIST]: (state, result) => {
    const { takeoutMapping } = state;
    const { list, pageIndex, pageSize, recordCount } = result;
    state.takeoutMapping = { ...takeoutMapping, takeoutMappingList: list, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_NO_PAGE_TAKEOUT_LIST]: (state, result) => {
    const { takeoutMapping } = state;
    const { list } = result;
    state.takeoutMapping = { ...takeoutMapping, noPageTakeoutList: list };
  },
  [types.FETCH_VENDOR_LIST]: (state, result) => {
    state.takeoutMapping.vendorList = result.list;
  },
  [types.FETCH_DISH_LIST]: (state, result) => {
    state.takeoutMapping.dishList = result.list;
  },
  [types.TAKEOUT_LINK]: (state, result) => {
    state.takeoutMapping.takeoutLink = result.data.url;
  }
};
