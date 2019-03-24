import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteSales,
  fetchAllSales,
  fetchSalesDetail,
  getSalesLastId,
  saveSales,
  updateSales
} from 'api/business';

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
  fetchAllSales: async ({ commit }, params) => {
    let result = await fetchAllSales(params);
    result = { ...result, ...params };
    commit(types.FETCH_ALL_SALES, result);
  },
  saveSales: async ({ commit }, params) => {
    await saveSales(params);
  },
  updateSales: async ({ commit }, params) => {
    await updateSales(params);
  },
  deleteSales: async ({ commit }, expClsId) => {
    await deleteSales(expClsId);
  },
  getSalesLastId: async ({ commit }) => {
    const lastId = await getSalesLastId();
    commit(types.GET_SALES_LAST_ID, lastId);
  },
  fetchSalesDetail: async ({ commit }, expClsId) => {
    const detail = await fetchSalesDetail(expClsId);
    commit(types.FETCH_SALES_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_SALES]: (state, result) => {
    const { list, recordCount, pageIndex, pageSize } = result;
    const { sales } = state;
    state.sales = { ...sales, salesList: list, recordCount, pageIndex, pageSize };
  },
  [types.GET_SALES_LAST_ID]: (state, lastId) => {
    state.sales.lastId = lastId;
  },
  [types.FETCH_SALES_DETAIL]: (state, detail) => {
    state.sales.saleDetail = detail;
  }
};
