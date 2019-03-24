import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteDiscountReason,
  fetchAllDiscountReason,
  fetchDiscountReasonDetail,
  saveDiscountReason,
  updateDiscountReason
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  discountReason: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllDiscountReason: async ({ commit }, params) => {
    const result = await fetchAllDiscountReason(params);
    commit(types.FETCH_ALL_DISCOUNT_REASON, result);
  },
  fetchDiscountReasonDetail: async ({ commit }, id) => {
    const detail = await fetchDiscountReasonDetail(id);
    commit(types.FETCH_DISCOUNT_REASON_DETAIL, detail);
  },
  saveDiscountReason: async ({ commit }, params) => {
    const result = await saveDiscountReason(params);
    handleError(commit, types.SAVE_DISCOUNT_REASON, params, result.err);
  },
  updateDiscountReason: async ({ commit }, params) => {
    const result = await updateDiscountReason(params);
    handleError(commit, types.UPDATE_DISCOUNT_REASON, params, result.err);
  },
  deleteDiscountReason: async ({ commit }, id) => {
    await deleteDiscountReason(id);
    commit(types.DELETE_DISCOUNT_REASON_BY_ID, id);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_DISCOUNT_REASON]: (state, result) => {
    const { discountReason } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.discountReason = { ...discountReason, list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_DISCOUNT_REASON]: (state, params) => {
    const { list } = state.discountReason;
    state.discountReason.list = [...list, params];
  },
  [types.UPDATE_DISCOUNT_REASON]: (state, params) => {
    const newList = state.discountReason.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.discountReason.list = newList;
  },
  [types.DELETE_DISCOUNT_REASON_BY_ID]: (state, id) => {
    const newList = state.discountReason.list.filter(item => item.id !== id);
    state.discountReason.list = newList;
    state.discountReason.recordCount--;
  },
  [types.FETCH_DISCOUNT_REASON_DETAIL]: (state, detail) => {
    state.discountReason.detail = detail;
  }
};
