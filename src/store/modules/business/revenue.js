import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteRevenue,
  fetchAllRevenue,
  fetchRevenueDetail,
  getRevenueGroupList,
  getRevenueLastId,
  saveRevenue,
  updateRevenue
} from 'api/business';

// initial state
export const state = {
  revenue: {
    revenueList: [],
    revenueDetail: {},
    revenueGroupList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllRevenue: async ({ commit }, params) => {
    const result = await fetchAllRevenue(params);
    commit(types.FETCH_ALL_REVENUE, result);
  },
  saveRevenue: async ({ commit }, params) => {
    await saveRevenue(params);
  },
  updateRevenue: async ({ commit }, params) => {
    await updateRevenue(params);
  },
  deleteRevenue: async ({ commit }, revenueTypeId) => {
    await deleteRevenue(revenueTypeId);
  },
  getRevenueLastId: async({ commit }) => {
    const lastId = await getRevenueLastId();
    commit(types.GET_REVENUE_LAST_ID, lastId);
  },
  fetchRevenueDetail: async({ commit }, revenueTypeId) => {
    const detail = await fetchRevenueDetail(revenueTypeId);
    commit(types.FETCH_REVENUE_DETAIL, detail);
  },
  getRevenueGroupList: async({ commit }) => {
    const list = await getRevenueGroupList();
    commit(types.GET_REVENUE_GROUP_LIST, list);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_REVENUE]: (state, result) => {
    const { revenue } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.revenue = { ...revenue, revenueList: list, recordCount, pageIndex, pageSize };
  },
  [types.GET_REVENUE_LAST_ID]: (state, lastId) => {
    state.revenue.lastId = lastId;
  },
  [types.FETCH_REVENUE_DETAIL]: (state, detail) => {
    state.revenue.revenueDetail = detail;
  },
  [types.GET_REVENUE_GROUP_LIST]: (state, list) => {
    state.revenue.revenueGroupList = list;
  }
};
