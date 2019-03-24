import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deletePaymentType,
  fetchAllPaymentTypes,
  fetchPaymentTypeDetail,
  fetchPaymentTypesByPage,
  getPaymentTypeLastId,
  savePaymentType,
  updatePaymentType
} from 'api/business';

import { handleError } from '../../common';

// initial state
export const state = {
  paymentType: {
    typesList: [],
    paymentTypeList: [],
    paymentTypeDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchPaymentTypesByPage: async ({ commit }, params) => {
    const result = await fetchPaymentTypesByPage(params);
    commit(types.FETCH_PAYMENT_TYPES_BY_PAGE, result);
  },
  fetchAllPaymentTypes: async ({ commit }, params) => {
    const result = await fetchAllPaymentTypes(params);
    commit(types.FETCH_PAYMENT_TYPES, result);
  },
  deletePaymentType: async ({ commit }, paymentTypeId) => {
    const result = await deletePaymentType(paymentTypeId);
    const { errNo } = result.err;
    if (!+errNo) {
      commit(types.DELETE_PAYMENT_TYPE_BY_ID, paymentTypeId);
    }
  },
  savePaymentType: async ({ commit }, params) => {
    const result = await savePaymentType(params);
    handleError(commit, types.SAVE_PAYMENT_TYPE_SUCCESS, params, result.err);
  },
  updatePaymentType: async ({ commit }, params) => {
    const result = await updatePaymentType(params);
    handleError(commit, types.UPDATE_PAYMENT_TYPE_SUCCESS, params, result.err);
  },
  getPaymentTypeLastId: async ({ commit }) => {
    const lastId = await getPaymentTypeLastId();
    commit(types.GET_PAYMENT_TYPE_LAST_ID, lastId);
  },
  fetchPaymentTypeDetail: async ({ commit }, paymentTypeId) => {
    const detail = await fetchPaymentTypeDetail(paymentTypeId);
    commit(types.FETCH_PAYMENT_TYPE_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_PAYMENT_TYPES_BY_PAGE] (state, result) {
    const { paymentType } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.paymentType = { ...paymentType, paymentTypeList: list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_PAYMENT_TYPES] (state, result) {
    state.paymentType.typesList = result.list;
  },
  [types.DELETE_PAYMENT_TYPE_BY_ID] (state, paymentTypeId) {
    const newList = state.paymentType.paymentTypeList.filter(item => item.paymentTypeId !== paymentTypeId);
    state.paymentType.paymentTypeList = newList;
    state.paymentType.recordCount--;
  },
  [types.UPDATE_PAYMENT_TYPE_SUCCESS] (state, item) {
    const newList = state.paymentType.paymentTypeList.map(payment => {
      if (payment.paymentTypeId === item.paymentTypeId) {
        return item;
      }
      return payment;
    });
    state.paymentType.paymentTypeList = newList;
  },
  [types.SAVE_PAYMENT_TYPE_SUCCESS] (state, params) {
    const { paymentTypeList } = state.paymentType;
    state.paymentType.paymentTypeList = [...paymentTypeList, params];
    state.paymentType.recordCount++;
  },
  [types.GET_PAYMENT_TYPE_LAST_ID]: (state, lastId) => {
    state.paymentType.lastId = lastId;
  },
  [types.FETCH_PAYMENT_TYPE_DETAIL]: (state, detail) => {
    state.paymentType.paymentTypeDetail = detail;
  }
};
