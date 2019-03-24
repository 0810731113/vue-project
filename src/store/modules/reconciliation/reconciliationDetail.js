import * as API from 'api/reconciliation';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  reconciliationDetail: {
    reconciliationDetailList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    shopList: [],
    userList: [],
    accountInfo: {},
    paymentInfo: {},
    historyList: [],
    paymentList: []
  }
};

// actions
export const actions = {
  fetchReconciliationShopList: async ({ commit }, params = {}) => {
    const result = await API.fetchReconciliationShopList(params);
    commit(types.FETCH_RECONCILIATION_SHOP_LIST, result);
  },
  fetchReconciliationUserList: async ({ commit }, params = {}) => {
    const result = await API.fetchReconciliationUserList(params);
    commit(types.FETCH_RECONCILIATION_USER_LIST, result);
  },
  fetchReconciliationDetailList: async ({ commit }, params = {}) => {
    const result = await API.fetchReconciliationDetailList(params);
    commit(types.FETCH_RECONCILIATION_DETAIL_LIST, result);
  },
  fetchReconciliationDetailItem: async ({ commit }, params = {}) => {
    const result = await API.fetchReconciliationDetailItem(params);
    commit(types.FETCH_RECONCILIATION_DETAIL_ITEM, result);
  },
  fetchReconciliationPaymentList: async ({ commit }, params = {}) => {
    const result = await API.fetchReconciliationPaymentList(params);
    commit(types.FETCH_RECONCILIATION_PAYMENTLIST, result);
  },
  saveReconciliationDetail: async ({ commit }, params = {}) => {
    await API.saveReconciliationDetail(params);
  },
  updateReconciliationMsg: async ({ commit }, params = {}) => {
    await API.updateReconciliationMsg(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_RECONCILIATION_SHOP_LIST]: (state, result) => {
    const { list } = result;
    state.reconciliationDetail = { ...state.reconciliationDetail, shopList: list || [] };
  },
  [types.FETCH_RECONCILIATION_USER_LIST]: (state, result) => {
    const { list } = result;
    state.reconciliationDetail = { ...state.reconciliationDetail, userList: list || [] };
  },
  [types.FETCH_RECONCILIATION_DETAIL_LIST]: (state, result) => {
    const { list, pageIndex, pageSize, recordCount } = result;
    state.reconciliationDetail = { ...state.reconciliationDetail, reconciliationDetailList: list || [], pageIndex, pageSize, recordCount };
  },
  [types.FETCH_RECONCILIATION_DETAIL_ITEM]: (state, result) => {
    const { accountInfo, paymentInfo, adjustings } = result;
    adjustings ? adjustings.map((item, index) => {
      item.map(subItem => {
        subItem['length'] = item.length;
        subItem['type'] = index === adjustings.length - 1 ? '当前单据' : '原始单据';
      });
    }) : [];
    state.reconciliationDetail = { ...state.reconciliationDetail, accountInfo, paymentInfo, historyList: adjustings.reverse() };
  },
  [types.FETCH_RECONCILIATION_PAYMENTLIST]: (state, result) => {
    const { list } = result;
    state.reconciliationDetail = { ...state.reconciliationDetail, paymentList: list || [] };
  }
};
