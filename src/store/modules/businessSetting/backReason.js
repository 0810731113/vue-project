import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteBackReason,
  fetchAllBackReason,
  fetchBackReasonDetail,
  saveBackReason,
  updateBackReason,
  fetchAllBackReasonWithoutPage,
  updateSortBackReasonList
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  backReason: {
    list: [],
    listWithoutPage: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllBackReason: async ({ commit }, params) => {
    const result = await fetchAllBackReason(params);
    commit(types.FETCH_ALL_BACK_REASON, result);
  },
  fetchAllBackReasonWithoutPage: async ({ commit }, params) => {
    const result = await fetchAllBackReasonWithoutPage(params);
    commit(types.FETCH_ALL_BACK_REASON_WITHOUT_PAGE, result);
  },
  updateSortBackReasonList: async ({ commit }, params) => {
    await updateSortBackReasonList(params);
  },
  fetchBackReasonDetail: async ({ commit }, id) => {
    const detail = await fetchBackReasonDetail(id);
    commit(types.FETCH_BACK_REASON_DETAIL, detail);
  },
  saveBackReason: async ({ commit }, params) => {
    const result = await saveBackReason(params);
    handleError(commit, types.SAVE_BACK_REASON, params, result.err);
  },
  updateBackReason: async ({ commit }, params) => {
    const result = await updateBackReason(params);
    handleError(commit, types.UPDATE_BACK_REASON, params, result.err);
  },
  deleteBackReason: async ({ commit }, id) => {
    await deleteBackReason(id);
    commit(types.DELETE_BACK_REASON_BY_ID, id);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_BACK_REASON]: (state, result) => {
    const { backReason } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.backReason = { ...backReason, list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_ALL_BACK_REASON_WITHOUT_PAGE]: (state, result) => {
    const { backReason } = state;
    const { list } = result;
    state.backReason = { ...backReason, listWithoutPage: list };
  },
  [types.SAVE_BACK_REASON]: (state, params) => {
    const { list } = state.backReason;
    state.backReason.list = [...list, params];
  },
  [types.UPDATE_BACK_REASON]: (state, params) => {
    const newList = state.backReason.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.backReason.list = newList;
  },
  [types.DELETE_BACK_REASON_BY_ID]: (state, id) => {
    const newList = state.backReason.list.filter(item => item.id !== id);
    state.backReason.list = newList;
    state.backReason.recordCount--;
  },
  [types.FETCH_BACK_REASON_DETAIL]: (state, detail) => {
    state.backReason.detail = detail;
  }
};
