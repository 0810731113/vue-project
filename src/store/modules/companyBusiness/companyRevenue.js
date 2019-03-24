import * as types from './mutationTypes';
import * as API from 'api/companyBusiness';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  revenue: {
    revenueList: [],
    revenueDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllCompanyRevenue: async ({ commit }, params) => {
    const result = await API.fetchAllCompanyRevenue(params);
    commit(types.FETCH_ALL_COMPANY_REVENUE, result);
  },
  saveCompanyRevenue: async ({ commit }, params) => {
    await API.saveCompanyRevenue(params);
  },
  updateCompanyRevenue: async ({ commit }, params) => {
    await API.updateCompanyRevenue(params);
  },
  deleteCompanyRevenue: async ({ commit }, revenueTypeId) => {
    await API.deleteCompanyRevenue(revenueTypeId);
  },
  getCompanyRevenueLastId: async({ commit }) => {
    const lastId = await API.getCompanyRevenueLastId();
    commit(types.GET_COMPANY_REVENUE_LAST_ID, lastId);
  },
  fetchCompanyRevenueDetail: async({ commit }, revenueTypeId) => {
    const detail = await API.fetchCompanyRevenueDetail(revenueTypeId);
    commit(types.FETCH_COMPANY_REVENUE_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_COMPANY_REVENUE]: (state, result) => {
    const { revenue } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.revenue = { ...revenue, revenueList: list, recordCount, pageIndex, pageSize };
  },
  [types.GET_COMPANY_REVENUE_LAST_ID]: (state, lastId) => {
    state.revenue.lastId = lastId;
  },
  [types.FETCH_COMPANY_REVENUE_DETAIL]: (state, detail) => {
    state.revenue.revenueDetail = detail;
  }
};
