import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteShift,
  fetchAllShift,
  fetchShiftDetail,
  getShiftLastId,
  saveShift,
  updateShift
} from 'api/business';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  shift: {
    shiftList: [],
    shiftDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllShift: async ({ commit }, params) => {
    const result = await fetchAllShift(params);
    commit(types.FETCH_ALL_SHIFT, result);
  },
  saveShift: async ({ dispatch, state }, params) => {
    const result = await saveShift(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateShift: async ({ dispatch, state }, params) => {
    const result = await updateShift(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deleteShift: async ({ commit }, msectionId) => {
    await deleteShift(msectionId);
    commit(types.DELETE_SHIFT_BY_ID, msectionId);
  },
  fetchShiftDetail: async ({ commit }, msectionId) => {
    const detail = await fetchShiftDetail(msectionId);
    commit(types.FETCH_SHIFT_DETAIL, detail);
  },
  getShiftLastId: async ({ commit }, msectionId) => {
    const lastId = await getShiftLastId(msectionId);
    commit(types.GET_SHIFT_LAST_ID, lastId);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.shift;
    await dispatch('fetchAllShift', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_ALL_SHIFT]: (state, result) => {
    const { shift } = state;
    const { list, recordCount, pageIndex } = result;
    state.shift = { ...shift, shiftList: list, recordCount, pageIndex };
  },
  [types.DELETE_SHIFT_BY_ID]: (state, msectionId) => {
    const newList = state.shift.shiftList.filter(item => item.msectionId !== msectionId);
    state.shift.shiftList = newList;
    state.shift.recordCount--;
  },
  [types.FETCH_SHIFT_DETAIL]: (state, detail) => {
    state.shift.shiftDetail = detail;
  },
  [types.GET_SHIFT_LAST_ID]: (state, lastId) => {
    state.shift.lastId = lastId;
  }
};
