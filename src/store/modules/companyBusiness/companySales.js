import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import * as API from 'api/companyBusiness';

// initial state
export const state = {
  sales: {
    salesList: [],
    saleDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllCompanySales: async ({ commit }, params) => {
    let result = await API.fetchAllCompanySales(params);
    result = { ...result, ...params };
    commit(types.FETCH_ALL_COMPANY_SALES, result);
  },
  saveCompanySales: async ({ commit }, params) => {
    await API.saveCompanySales(params);
  },
  updateCompanySales: async ({ commit }, params) => {
    await API.updateCompanySales(params);
  },
  deleteCompanySales: async ({ commit }, expClsId) => {
    await API.deleteCompanySales(expClsId);
  },
  getCompanySalesLastId: async ({ commit }) => {
    const lastId = await API.getCompanySalesLastId();
    commit(types.GET_COMPANY_SALES_LAST_ID, lastId);
  },
  fetchCompanySalesDetail: async ({ commit }, expClsId) => {
    const detail = await API.fetchCompanySalesDetail(expClsId);
    commit(types.FETCH_COMPANY_SALES_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_COMPANY_SALES]: (state, result) => {
    const { list, recordCount, pageIndex, pageSize } = result;
    const { sales } = state;
    state.sales = { ...sales, salesList: list, recordCount, pageIndex, pageSize };
  },
  [types.GET_COMPANY_SALES_LAST_ID]: (state, lastId) => {
    state.sales.lastId = lastId;
  },
  [types.FETCH_COMPANY_SALES_DETAIL]: (state, detail) => {
    state.sales.saleDetail = detail;
  }
};
