import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteCashier,
  fetchAllCashier,
  fetchCashierDetail,
  getCashierLastId,
  saveCashier,
  updateCashier,
  updateCashierStatus
} from 'api/business';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  cashier: {
    cashierList: [],
    cashierDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllCashier: async ({ commit }, params) => {
    const result = await fetchAllCashier(params);
    commit(types.FETCH_ALL_CASHIER, result);
  },
  saveCashier: async ({ dispatch, state }, params) => {
    const result = await saveCashier(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateCashier: async ({ dispatch, state }, params) => {
    const result = await updateCashier(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deleteCashier: async ({ commit }, shiftId) => {
    await deleteCashier(shiftId);
    commit(types.DELETE_CASHIER_BY_ID, shiftId);
  },
  getCashierLastId: async ({ commit }) => {
    const lastId = await getCashierLastId();
    commit(types.GET_CASHIER_LAST_ID, lastId);
  },
  fetchCashierDetail: async ({ commit }, shiftId) => {
    const detail = await fetchCashierDetail(shiftId);
    commit(types.FETCH_CASHIER_DETAIL, detail);
  },
  updateCashierStatus: async ({ dispatch, state }, params) => {
    const result = await updateCashierStatus(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.cashier;
    await dispatch('fetchAllCashier', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_ALL_CASHIER]: (state, result) => {
    const { cashier } = state;
    const { list, recordCount, pageIndex } = result;
    state.cashier = { ...cashier, cashierList: list, recordCount, pageIndex };
  },
  [types.DELETE_CASHIER_BY_ID]: (state, shiftId) => {
    const newList = state.cashier.cashierList.filter(item => item.shiftId !== shiftId);
    state.cashier.cashierList = newList;
    state.cashier.recordCount--;
  },
  [types.GET_CASHIER_LAST_ID]: (state, lastId) => {
    state.cashier.lastId = lastId;
  },
  [types.FETCH_CASHIER_DETAIL]: (state, detail) => {
    state.cashier.cashierDetail = detail;
  }
};
