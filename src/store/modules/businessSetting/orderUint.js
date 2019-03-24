import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteOrderUint,
  fetchAllOrderUint,
  fetchOrderUintDetail,
  saveOrderUint,
  updateOrderUint,
  fetchAllOrderUintList
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  orderUint: {
    list: [],
    orderUnitList: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllOrderUint: async ({ commit }, params) => {
    const result = await fetchAllOrderUint(params);
    commit(types.FETCH_ALL_ORDER_UINT, result);
  },
  fetchAllOrderUintList: async ({ commit }, params) => {
    const result = await fetchAllOrderUintList(params);
    commit(types.FETCH_ALL_ORDER_UINT_LIST, result);
  },
  fetchOrderUintDetail: async ({ commit }, id) => {
    const detail = await fetchOrderUintDetail(id);
    commit(types.FETCH_ORDER_UINT_DETAIL, detail);
  },
  saveOrderUint: async ({ commit }, params) => {
    const result = await saveOrderUint(params);
    handleError(commit, types.SAVE_ORDER_UINT, params, result.err);
  },
  updateOrderUint: async ({ commit }, params) => {
    const result = await updateOrderUint(params);
    handleError(commit, types.UPDATE_ORDER_UINT, params, result.err);
  },
  deleteOrderUint: async ({ commit }, params) => {
    await deleteOrderUint(params);
    commit(types.DELETE_ORDER_UINT_BY_ID, params.id );
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_ORDER_UINT]: (state, result) => {
    const { orderUint } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.orderUint = { ...orderUint, list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_ORDER_UINT]: (state, params) => {
    const { list } = state.orderUint;
    state.orderUint.list = [...list, params];
  },
  [types.FETCH_ALL_ORDER_UINT_LIST]: (state, result) => {
    state.orderUint.orderUnitList = result.list;
  },
  [types.UPDATE_ORDER_UINT]: (state, params) => {
    const newList = state.orderUint.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.orderUint.list = newList;
  },
  [types.DELETE_ORDER_UINT_BY_ID]: (state, id) => {
    const newList = state.orderUint.list.filter(item => item.id !== id);
    state.orderUint.list = newList;
    state.orderUint.recordCount--;
  },
  [types.FETCH_ORDER_UINT_DETAIL]: (state, detail) => {
    state.orderUint.detail = detail;
  }
};
