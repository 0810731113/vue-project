import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteCreditAccount,
  fetchAllCreditAccount,
  fetchCreditAccountDetail,
  getCreditAccountLastId,
  saveCreditAccount,
  updateCreditAccount
} from 'api/business';

import { handleError } from '../../common';

// initial state
export const state = {
  creditAccount: {
    creditAccountList: [],
    creditAccountDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllCreditAccount: async ({ commit }, params) => {
    const result = await fetchAllCreditAccount(params);
    commit(types.FETCH_ALL_CREDIT_ACCOUNT, result);
  },
  saveCreditAccount: async ({ commit }, params) => {
    const result = await saveCreditAccount(params);
    handleError(commit, types.SAVE_CREDIT_ACCOUNT_SUCCESS, params, result.err);
  },
  updateCreditAccount: async ({ commit }, params) => {
    const result = await updateCreditAccount(params);
    handleError(commit, types.UPDATE_CREDIT_ACCOUNT_SUCCESS, params, result.err);
  },
  deleteCreditAccount: async ({ commit }, creditAccountId) => {
    await deleteCreditAccount(creditAccountId);
    commit(types.DELETE_CREDIT_ACCOUNT_BY_ID, creditAccountId);
  },
  getCreditAccountLastId: async ({ commit }) => {
    const lastId = await getCreditAccountLastId();
    commit(types.GET_CREDIT_ACCOUNT_LAST_ID, lastId);
  },
  fetchCreditAccountDetail: async ({ commit }, creditAccountId) => {
    const detail = await fetchCreditAccountDetail(creditAccountId);
    commit(types.FETCH_CREDIT_ACCOUNT_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_CREDIT_ACCOUNT]: (state, result) => {
    const { creditAccount } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.creditAccount = { ...creditAccount, creditAccountList: list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_CREDIT_ACCOUNT_SUCCESS]: (state, params) => {
    const { creditAccountList } = state.creditAccount;
    state.creditAccount.creditAccountList = [...creditAccountList, params];
    state.creditAccount.recordCount++;
  },
  [types.UPDATE_CREDIT_ACCOUNT_SUCCESS]: (state, params) => {
    const newList = state.creditAccount.creditAccountList.map(item => {
      if (item.creditAccountId === params.creditAccountId) {
        return params;
      }
      return item;
    });

    state.creditAccount.creditAccountList = newList;
  },
  [types.DELETE_CREDIT_ACCOUNT_BY_ID]: (state, creditAccountId) => {
    const item = state.creditAccount.creditAccountList.find(item => item.creditAccountId === creditAccountId);
    const { debtAmt, creditAmt } = item;
    if (debtAmt !== creditAmt) return;

    const newList = state.creditAccount.creditAccountList.filter(item => item.creditAccountId !== creditAccountId);
    state.creditAccount.creditAccountList = newList;
    state.creditAccount.recordCount--;
  },
  [types.GET_CREDIT_ACCOUNT_LAST_ID]: (state, lastId) => {
    state.creditAccount.lastId = lastId;
  },
  [types.FETCH_CREDIT_ACCOUNT_DETAIL]: (state, detail) => {
    state.creditAccount.creditAccountDetail = detail;
  }
};
