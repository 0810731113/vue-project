import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchValueAddedDetail,
  fetchValueAddedList,
  saveValueAdded
} from 'api/businessManage';

// initial state
export const state = {
  valueAdded: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchValueAddedList: async ({ commit }, params) => {
    const result = await fetchValueAddedList(params);
    commit(types.FETCH_VALUE_ADDED_LIST, result);
  },
  fetchValueAddedDetail: async ({ commit }, params) => {
    const result = await fetchValueAddedDetail(params);
    commit(types.FETCH_VALUE_ADDED_DETAIL, result);
  },
  saveValueAdded: async ({ commit }, params) => {
    await saveValueAdded(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_VALUE_ADDED_LIST]: (state, result) => {
    const { list, pageIndex, pageSize, recordCount } = result;
    state.valueAdded = { ...state.valueAdded, list, pageIndex, pageSize, recordCount };
  },
  [types.FETCH_VALUE_ADDED_DETAIL]: (state, result) => {
    state.valueAdded.detail = result.shopServiceItemDto;
  }
};
