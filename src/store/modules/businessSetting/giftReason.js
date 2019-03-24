import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteGiftReason,
  fetchAllGiftReason,
  fetchGiftReasonDetail,
  saveGiftReason,
  updateGiftReason
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  giftReason: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllGiftReason: async ({ commit }, params) => {
    const result = await fetchAllGiftReason(params);
    commit(types.FETCH_ALL_GIFT_REASON, result);
  },
  fetchGiftReasonDetail: async ({ commit }, id) => {
    const detail = await fetchGiftReasonDetail(id);
    commit(types.FETCH_GIFT_REASON_DETAIL, detail);
  },
  saveGiftReason: async ({ commit }, params) => {
    const result = await saveGiftReason(params);
    handleError(commit, types.SAVE_GIFT_REASON, params, result.err);
  },
  updateGiftReason: async ({ commit }, params) => {
    const result = await updateGiftReason(params);
    handleError(commit, types.UPDATE_GIFT_REASON, params, result.err);
  },
  deleteGiftReason: async ({ commit }, id) => {
    await deleteGiftReason(id);
    commit(types.DELETE_GIFT_REASON_BY_ID, id);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_GIFT_REASON]: (state, result) => {
    const { giftReason } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.giftReason = { ...giftReason, list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_GIFT_REASON]: (state, params) => {
    const { list } = state.giftReason;
    state.giftReason.list = [...list, params];
  },
  [types.UPDATE_GIFT_REASON]: (state, params) => {
    const newList = state.giftReason.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.giftReason.list = newList;
  },
  [types.DELETE_GIFT_REASON_BY_ID]: (state, id) => {
    const newList = state.giftReason.list.filter(item => item.id !== id);
    state.giftReason.list = newList;
    state.giftReason.recordCount--;
  },
  [types.FETCH_GIFT_REASON_DETAIL]: (state, detail) => {
    state.giftReason.detail = detail;
  }
};
