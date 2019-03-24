import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteRechecReason,
  fetchAllRechecReason,
  fetchRechecReasonDetail,
  saveRechecReason,
  updateRechecReason
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  rechecReason: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllRechecReason: async ({ commit }, params) => {
    const result = await fetchAllRechecReason(params);
    commit(types.FETCH_ALL_RECHEC_REASON, result);
  },
  fetchRechecReasonDetail: async ({ commit }, id) => {
    const detail = await fetchRechecReasonDetail(id);
    commit(types.FETCH_RECHEC_REASON_DETAIL, detail);
  },
  saveRechecReason: async ({ commit }, params) => {
    const result = await saveRechecReason(params);
    handleError(commit, types.SAVE_RECHEC_REASON, params, result.err);
  },
  updateRechecReason: async ({ commit }, params) => {
    const result = await updateRechecReason(params);
    handleError(commit, types.UPDATE_RECHEC_REASON, params, result.err);
  },
  deleteRechecReason: async ({ commit }, id) => {
    await deleteRechecReason(id);
    commit(types.DELETE_RECHEC_REASON_BY_ID, id);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_RECHEC_REASON]: (state, result) => {
    const { rechecReason } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.rechecReason = { ...rechecReason, list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_RECHEC_REASON]: (state, params) => {
    const { list } = state.rechecReason;
    state.rechecReason.list = [...list, params];
  },
  [types.UPDATE_RECHEC_REASON]: (state, params) => {
    const newList = state.rechecReason.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.rechecReason.list = newList;
  },
  [types.DELETE_RECHEC_REASON_BY_ID]: (state, id) => {
    const newList = state.rechecReason.list.filter(item => item.id !== id);
    state.rechecReason.list = newList;
    state.rechecReason.recordCount--;
  },
  [types.FETCH_RECHEC_REASON_DETAIL]: (state, detail) => {
    state.rechecReason.detail = detail;
  }
};
