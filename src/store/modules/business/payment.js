import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deletePayment,
  deletePaymentByIds,
  fetchAllPayment,
  fetchMWCoupons,
  fetchPaymentDetail,
  fetchShortCutKeys,
  fetchSortPayment,
  getPaymentLastId,
  savePayment,
  updateColorOrPremium,
  updatePayment,
  updatePaymentByBatch,
  updatePaymentShortCut,
  updateSortPayment
} from 'api/business';

import { handleError } from '../../common';

// initial state
export const state = {
  payment: {
    paymentList: [],
    sortList: [],
    mwCouponsList: [],
    shortCutKeys: [],
    paymentDetail: {},
    couponRecordCount: 0,
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllPayment: async ({ commit }, params) => {
    const result = await fetchAllPayment(params);
    //console.log(result)
    commit(types.FETCH_ALL_PAYMENT, result);
  },
  fetchSortPayment: async ({ commit }) => {
    const result = await fetchSortPayment();
    commit(types.FETCH_SORT_PAYMENT, result);
  },
  updateSortPayment: async ({ commit }, params) => {
    await updateSortPayment(params);
    commit(types.UPDATE_SORT_PAYMENT, params);
  },
  updateColorOrPremium: async ({ commit }, params) => {
    await updateColorOrPremium(params);
  },
  deletePayment: async ({ commit }, paymentId) => {
    await deletePayment(paymentId);
    commit(types.DELETE_PAYMENT_BY_ID, paymentId);
  },
  deletePaymentByIds: async ({ commit }, paymentIds) => {
    await deletePaymentByIds(paymentIds);
  },
  updatePaymentByBatch: async ({ commit }, params) => {
    await updatePaymentByBatch(params);
  },
  updatePayment: async ({ commit }, params) => {
    const result = await updatePayment(params);
    handleError(commit, types.UPDATE_PAYMENT_SUCCESS, params, result.err);
  },
  savePayment: async ({ commit }, params) => {
    const result = await savePayment(params);
    handleError(commit, types.SAVE_PAYMENT_SUCCESS, params, result.err);
  },
  getPaymentLastId: async ({ commit }) => {
    const lastId = await getPaymentLastId();
    commit(types.GET_PAYMENT_LAST_ID, lastId);
  },
  fetchPaymentDetail: async ({ commit }, paymentId) => {
    const detail = await fetchPaymentDetail(paymentId);
    commit(types.FETCH_PAYMENT_DETAIL, detail);
  },
  fetchMWCoupons: async ({ commit }, params) => {
    const result = await fetchMWCoupons(params);
    commit(types.FETCH_MW_COUPONS, result);
  },
  updatePaymentShortCut: async ({ commit }, params) => {
    await updatePaymentShortCut(params);
  },
  fetchShortCutKeys: async ({ commit }) => {
    const result = await fetchShortCutKeys();
    commit(types.FETCH_SHORTCUT_KEYS, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_PAYMENT]: (state, result) => {
    const { payment } = state;
    //console.log(result)
    const { list, recordCount, pageIndex, pageSize } = result;
    state.payment = { ...payment, paymentList: list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_SORT_PAYMENT]: (state, result) => {
    state.payment.sortList = result.list;
  },
  [types.UPDATE_SORT_PAYMENT]: (state, params) => {
    state.payment.sortList = params;
  },
  [types.DELETE_PAYMENT_BY_ID]: (state, paymentId) => {
    const newList = state.payment.paymentList.filter(item => item.paymentId !== paymentId);
    state.payment.paymentList = newList;
    state.payment.recordCount--;
  },
  [types.UPDATE_PAYMENT_SUCCESS]: (state, item) => {
    const newList = state.payment.paymentList.map(payment => {
      if (payment.paymentId === item.paymentId) {
        return item;
      }
      return payment;
    });
    state.payment.paymentList = newList;
  },
  [types.SAVE_PAYMENT_SUCCESS]: (state, params) => {
    const { paymentList } = state.payment;
    state.payment.paymentList = [...paymentList, params];
    state.payment.recordCount++;
  },
  [types.GET_PAYMENT_LAST_ID]: (state, lastId) => {
    state.payment.lastId = lastId;
  },
  [types.FETCH_PAYMENT_DETAIL]: (state, detail) => {
    state.payment.paymentDetail = detail;
  },
  [types.FETCH_MW_COUPONS] (state, result) {
    const { list, recordCount } = result;
    const { payment } = state;
    state.payment = { ...payment, mwCouponsList: list, couponRecordCount: recordCount };
  },
  [types.FETCH_SHORTCUT_KEYS]: (state, result) => {
    state.payment.shortCutKeys = result.list;
  }
};
