import * as types from './mutationTypes';

import {
  fetchCompanyDetail,
  fetchManageCompanyDetail,
  saveManageCompanyInfo
} from 'api/cateringCompany';

// initial state
export const state = {
  companyInfo: {
    shopAmount: 0,
    ascMemberShip: 0,
    detail: {},
    shopAmountList: []
  }
};

// actions
export const actions = {
  saveManageCompanyInfo: async ({ commit }, params) => {
    const result = await saveManageCompanyInfo(params);
    commit(types.SAVE_MANAGE_COMPANY_INFO, result);
  },
  updateCompany: async ({ commit }, payload) => {
    commit(types.SAVE_MANAGE_COMPANY_INFO, payload);
  },
  fetchManageCompanyDetail: async ({ commit }) => {
    const detail = await fetchManageCompanyDetail();
    commit(types.FETCH_MANAGE_COMPANY_DETAIL, detail);
  },
  fetchCompanyDetail: async ({ commit }) => {
    const detail = await fetchCompanyDetail();
    commit(types.FETCH_COMPANY_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_MANAGE_COMPANY_DETAIL]: (state, detail) => {
    state.companyInfo.detail = detail.dto;
  },
  [types.FETCH_COMPANY_DETAIL]: (state, detail) => {
    const { shopAmount, ascMemberShip, shopAmountList } = detail;
    state.companyInfo = { ...state.companyInfo, shopAmount, ascMemberShip, shopAmountList };
  },
  [types.SAVE_MANAGE_COMPANY_INFO] (state, payload) {
    const detail = { ...state.companyInfo.detail, ...payload };
    state.companyInfo.detail = detail;
  }
};
