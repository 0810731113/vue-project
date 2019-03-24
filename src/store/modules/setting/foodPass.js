import * as API from 'api/setting';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  foodPass: {
    deptList: [],
    recordCount: 0,
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    printerList: [],
    department: '',
    checkedPrnList: [],
    mareaList:[], //下餐区域
    transferAreaList:[],
  }
};

// actions
export const actions = {
  fetchFoodPassDeptList: async ({ commit }, params) => {
    const result = await API.fetchFoodPassDeptList(params);
    commit(types.FETCH_FOOD_PASS_DEPT_LIST, result);
  },
  fetchFoodPassDeptItem: async ({ commit }, params) => {
    const result = await API.fetchFoodPassDeptItem(params);
    commit(types.FETCH_FOOD_PASS_DEPT_ITEM, result);
  },
  deleteFoodOPassDeptItem: async ({ dispatch, state }, params) => {
    const result = await API.deleteFoodOPassDeptItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateFoodPassDeptItem: async ({ commit }, params) => {
    await API.updateFoodPassDeptItem(params);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.foodPass;
    await dispatch('fetchFoodPassDeptList', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_FOOD_PASS_DEPT_LIST]: (state, result) => {
    const { foodPass } = state;
    const { deptList, recordCount, pageIndex, pageSize } = result;
    state.foodPass = { ...foodPass, deptList, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_FOOD_PASS_DEPT_ITEM]: (state, result) => {
    const { dept, printerList, deptList, transferPrnList,mareaList ,transferAreaList} = result;
    const { foodPass } = state;
    state.foodPass = { ...foodPass, department: dept, printerList, deptList, checkedPrnList: transferPrnList,mareaList,transferAreaList };
  }
};
