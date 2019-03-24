import * as API from 'api/dishLibrary';
import * as types from './mutationTypes';

// initial state
export const state = {
  shopUpdate: {
    dishContentTypes: [],
    companyDishMenuList: []
  }
};

// actions
export const actions = {
  fetchContentTypes: async ({ commit }, params) => {
    const result = await API.fetchContentTypes(params);
    commit(types.FETCH_CONTENT_TYPES, result);
  },
  fetchCompanyDishMenuList: async ({ commit }, params) => {
    const result = await API.fetchCompanyDishMenuList(params);
    commit(types.FETCH_COMPANY_DISH_MENU_ITEM, result);
  },
  sendCompanyData: async ({ commit }, params) => {
    await API.sendCompanyData(params);
  },
  sendImmediateCompanyData: async ({ commit }, params) => {
    await API.sendImmediateCompanyData(params);
  },
  fetchHistoryShop: async ({ commit }, params) => {
    return await API.fetchHistoryShop(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_CONTENT_TYPES]: (state, result) => {
    state.shopUpdate.dishContentTypes = result.businessList || [];
  },
  [types.FETCH_COMPANY_DISH_MENU_ITEM]: (state, result) => {
    state.shopUpdate.companyDishMenuList = result.menulist;
  }
};
