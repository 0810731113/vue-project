import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteBargainSale,
  fetchBargainSaleDetail,
  fetchBargainSaleList,
  insertBargainSale,
  updateBargainSale
} from 'api/preferential';

// initial state
export const state = {
  bargainSale: {
    bargainSaleList: [],
    bargainSaleDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchBargainSaleList: async ({ commit }, params) => {
    const result = await fetchBargainSaleList(params);
    commit(types.FETCH_BARGAIN_SALE_LIST, result);
  },
  fetchBargainSaleDetail: async ({ commit }, bargainId) => {
    const bargainSaleDetail = await fetchBargainSaleDetail(bargainId);
    commit(types.FETCH_BARGAIN_SALE_DETAIL, bargainSaleDetail);
  },
  insertBargainSale: async ({ commit }, params) => {
    await insertBargainSale(params);
  },
  deleteBargainSale: async ({ commit }, params) => {
    await deleteBargainSale(params);
    commit(types.DELETE_BARGAIN_SALE, params);
  },
  updateBargainSale: async ({ commit }, params) => {
    const result = await updateBargainSale(params);
    commit(types.UPDATE_BARGAIN_SALE, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_BARGAIN_SALE_LIST]: (state, result) => {
    const { bargainSale } = state;
    const { list, pageIndex, recordCount } = result;
    state.bargainSale = { ...bargainSale, bargainSaleList: list, pageIndex, recordCount };
  },
  [types.FETCH_BARGAIN_SALE_DETAIL]: (state, bargainSaleDetail) => {
    state.bargainSale.bargainSaleDetail = bargainSaleDetail.dto;
  },
  [types.DELETE_BARGAIN_SALE]: (state, params) => {
    const newList = state.bargainSale.bargainSaleList.filter(item => !params.bargainId.includes(item.bargainId));
    state.bargainSale.bargainSaleList = newList;
    state.bargainSale.recordCount = newList.length;
  },
  [types.UPDATE_BARGAIN_SALE]: (state, params) => {
    const newList = state.bargainSale.bargainSaleList.map(item => {
      if (item.bargainId === params.bargainId) {
        return params;
      }
      return item;
    });
    state.bargainSale.bargainSaleList = newList;
  }
};
