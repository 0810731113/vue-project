import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteRevenueGroup,
  fetchRevenueGroupList,
  getRevenueGroupDetail,
  insertRevenueGroup,
  updateRevenueGroup
} from 'api/business';

// initial state
export const state = {
  revenueGroup: {
    allGroupList: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchRevenueGroupList: async ({ commit }, params) => {
    const result = await fetchRevenueGroupList(params);
    commit(types.FETCH_REVENUE_GROUP_LIST, result);
  },
  insertRevenueGroup: async ({ commit }, params) => {
    await insertRevenueGroup(params);
  },
  updateRevenueGroup: async ({ commit }, params) => {
    await updateRevenueGroup(params);
  },
  deleteRevenueGroup: async ({ commit }, revenueGroupId) => {
    await deleteRevenueGroup(revenueGroupId);
  },
  getRevenueGroupDetail: async({ commit }, revenueGroupId) => {
    const detail = await getRevenueGroupDetail(revenueGroupId);
    commit(types.GET_REVENUE_GROUP_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_REVENUE_GROUP_LIST]: (state, result) => {
    const { revenueGroup } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.revenueGroup = { ...revenueGroup, allGroupList: list, recordCount, pageIndex, pageSize };
  },
  [types.GET_REVENUE_GROUP_DETAIL]: (state, detail) => {
    state.revenueGroup.detail = detail;
  }
};
