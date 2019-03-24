import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteOrderSource,
  fetchAllOrderSource,
  fetchOrderSourceDetail,
  fetchSortOrderSource,
  getOrderSourceLastId,
  saveOrderSource,
  updateOrderSource,
  updateOrderSourceSort
} from 'api/business';

import { handleError } from '../../common';

// initial state
export const state = {
  orderSource: {
    sortList: [],
    orderSourceList: [],
    orderSourceDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllOrderSource: async ({ commit }, params) => {
    const result = await fetchAllOrderSource(params);
    commit(types.FETCH_ALL_ORDER_SOURCE, result);
  },
  fetchSortOrderSource: async ({ commit }) => {
    const result = await fetchSortOrderSource();
    commit(types.FETCH_SORT_ORDER_SOURCE, result);
  },
  saveOrderSource: async ({ commit }, params) => {
    const result = await saveOrderSource(params);
    const { err, item } = result;
    handleError(commit, types.SAVE_ORDER_SOURCE_SUCCESS, item, err);
  },
  updateOrderSource: async ({ commit }, params) => {
    const result = await updateOrderSource(params);
    handleError(commit, types.UPDATE_ORDER_SOURCE_SUCCESS, params, result.err);
  },
  deleteOrderSource: async ({ commit }, billSourceId) => {
    await deleteOrderSource(billSourceId);
    commit(types.DELETE_ORDER_SOURCE_BY_ID, billSourceId);
  },
  updateOrderSourceSort: async ({ commit }, params) => {
    await updateOrderSourceSort(params);
  },
  getOrderSourceLastId: async ({ commit }) => {
    const lastId = await getOrderSourceLastId();
    commit(types.GET_ORDER_SOURCE_LAST_ID, lastId);
  },
  fetchOrderSourceDetail: async ({ commit }, billSourceId) => {
    const detail = await fetchOrderSourceDetail(billSourceId);
    commit(types.FETCH_ORDER_SOURCE_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_ORDER_SOURCE]: (state, result) => {
    const { orderSource } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.orderSource = { ...orderSource, orderSourceList: list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_SORT_ORDER_SOURCE]: (state, result) => {
    state.orderSource.sortList = result.list;
  },
  [types.SAVE_ORDER_SOURCE_SUCCESS]: (state, item) => {
    const { orderSourceList } = state.orderSource;
    state.orderSource.orderSourceList = [...orderSourceList, item];
    state.orderSource.recordCount++;
  },
  [types.UPDATE_ORDER_SOURCE_SUCCESS]: (state, params) => {
    const newList = state.orderSource.orderSourceList.map(item => {
      if (item.billSourceId === params.billSourceId) {
        return params;
      }
      return item;
    });

    state.orderSource.orderSourceList = newList;
  },
  [types.DELETE_ORDER_SOURCE_BY_ID]: (state, billSourceId) => {
    const newList = state.orderSource.orderSourceList.filter(item => item.billSourceId !== billSourceId);
    state.orderSource.orderSourceList = newList;
    state.orderSource.recordCount--;
  },
  [types.UPDATE_ORDER_SOURCE_SORT]: (state, newList) => {
    state.orderSource.orderSourceList = newList;
  },
  [types.GET_ORDER_SOURCE_LAST_ID]: (state, lastId) => {
    state.orderSource.lastId = lastId;
  },
  [types.FETCH_ORDER_SOURCE_DETAIL]: (state, detail) => {
    state.orderSource.orderSourceDetail = detail;
  }
};
