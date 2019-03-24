import * as API from 'api/setting';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  foodOut: {
    deptList: [],
    recordCount: 0,
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    printerList: [],
    department: ''
  }
};

// actions
export const actions = {
  fetchFoodOutDeptList: async ({ commit }, params) => {
    const result = await API.fetchFoodOutDeptList(params);
    commit(types.FETCH_FOOD_OUT_DEPT_LIST, result);
  },
  fetchFoodOutDeptItem: async ({ commit }, params) => {
    const result = await API.fetchFoodOutDeptItem(params);
    commit(types.FETCH_FOOD_OUT_DEPT_ITEM, result);
  },
  updateFoodOutDeptItem: async ({ dispatch, state }, params) => {
    const result = await API.updateFoodOutDeptItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateFoodOutDeptStatus: async ({ dispatch, state }, params) => {
    const result = await API.updateFoodOutDeptStatus(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deleteFoodOutDeptItem: async ({ dispatch, state }, params) => {
    const result = await API.deleteFoodOutDeptItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.foodOut;
    await dispatch('fetchFoodOutDeptList', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_FOOD_OUT_DEPT_LIST]: (state, result) => {
    const { foodOut } = state;
    const { deptList, recordCount, pageIndex, pageSize } = result;
    state.foodOut = { ...foodOut, deptList, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_FOOD_OUT_DEPT_ITEM]: (state, result) => {
    const { dept, printerList } = result;
    const { foodOut } = state;
    state.foodOut = { ...foodOut, department: dept, printerList };
  }
};
