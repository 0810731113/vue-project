import * as API from 'api/preferential';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  discountScheme: {
    discountSchemeList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    allowedUserList: [],
    discountSchemeDetail: {
      bargainItems: []
    },
    discountSchemeId: '',
    discountSchemeCopyList: [],
    discountMenuClsList: [],
    discountLinkedMenus: [],
    allCardsLevel:[]
  }
};

// actions
export const actions = {
  fetchDiscountSchemeList: async ({ commit }, params) => {
    const result = await API.fetchDiscountSchemeList(params);
    commit(types.FETCH_DISCOUNT_SCHEME_LIST, result);
  },
  fetchDiscountSchemeDetail: async ({ commit }, params) => {
    const result = await API.fetchDiscountSchemeDetail(params);
    commit(types.FETCH_DISCOUNT_SCHEME_DETAIL, result);
  },
  fetchAllowedUserList: async ({ commit }, params) => {
    const result = await API.fetchAllowedUserList(params);
    commit(types.FETCH_ALLOWED_USER_LIST, result);
  },
  fetchMaxDiscountId: async ({ commit }, params) => {
    const result = await API.fetchMaxDiscountId(params);
    commit(types.FETCH_MAX_DISCOUNT_SCHEME_ID, result);
  },
  saveDiscountSchemeItem: async ({ commit }, params) => {
    await API.saveDiscountSchemeItem(params);
  },
  updateDiscountSchemeItem: async ({ commit }, params) => {
    await API.updateDiscountSchemeItem(params);
  },
  updateDiscountStatus: async ({ commit }, params) => {
    await API.updateDiscountStatus(params);
  },
  copyDiscountScheme: async ({ commit }, params) => {
    await API.copyDiscountScheme(params);
  },
  fetchDiscountSchemeCopyList: async ({ commit }, params) => {
    const result = await API.fetchDiscountSchemeCopyList(params);
    commit(types.FETCH_DISCOUNT_SCHEME_COPY_LIST, result);
  },
  fetchDiscountMenuClsList: async ({ commit }, params) => {
    const result = await API.fetchDiscountMenuClsList(params);
    commit(types.FETCH_DISCOUNT_MENU_CLS_LIST, result);
  },
  fetchDiscountLinkedMenus: async ({ commit }, params) => {
    const result = await API.fetchDiscountLinkedMenus(params);
    commit(types.FETCH_DISCOUNT_LINKED_MENUS, result);
  },
  saveDiscountLinkedMenus: async ({ commit }, params) => {
    await API.saveDiscountLinkedMenus(params);
  },
  saveDiscountLinkedMenuCls: async ({ commit }, params) => {
    await API.saveDiscountLinkedMenuCls(params);
  },
  getAllCardsLevel: async ({ commit }, params) => {
    const result = await API.getAllCardsLevel(params);
    commit(types.GET_ALL_CARDS_LEVEL, result);
  },
  getCompanyAllCardsLevel: async ({ commit }, params) => {
    const result = await API.getCompanyAllCardsLevel(params);
    commit(types.GET_COMPANY_ALL_CARDS_LEVEL, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_DISCOUNT_SCHEME_LIST]: (state, result) => {
    const { discountScheme } = state;
    const { list, pageSize, pageIndex, recordCount } = result;
    state.discountScheme = { ...discountScheme, discountSchemeList: list, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_ALLOWED_USER_LIST]: (state, result) => {
    state.discountScheme.allowedUserList = result.allowUser;
  },
  [types.FETCH_DISCOUNT_SCHEME_DETAIL]: (state, result) => {
    state.discountScheme.discountSchemeDetail = result.dto;
  },
  [types.FETCH_MAX_DISCOUNT_SCHEME_ID]: (state, result) => {
    const { maxDiscountId } = result.data;
    state.discountScheme.discountSchemeId = maxDiscountId;
  },
  [types.FETCH_DISCOUNT_SCHEME_COPY_LIST]: (state, result) => {
    state.discountScheme.discountSchemeCopyList = result.data;
  },
  [types.UPDATE_LINKED_MENUS]: (state, result) => {
    state.discountScheme.discountSchemeDetail.bargainItems = result.slice();
  },
  [types.FETCH_DISCOUNT_MENU_CLS_LIST]: (state, result) => {
    state.discountScheme.discountMenuClsList = result.menuClsDiscountDto.children || [];
  },
  [types.FETCH_DISCOUNT_LINKED_MENUS]: (state, result) => {
    state.discountScheme.discountLinkedMenus = result.discountMenuList || [];
  },
  [types.GET_ALL_CARDS_LEVEL]: (state, result) => {
    state.discountScheme.allCardsLevel = result.vipCardLevels || [];
  },
  [types.GET_COMPANY_ALL_CARDS_LEVEL]: (state, result) => {
    state.discountScheme.allCardsLevel = result.vipCardLevels || [];
  }
};
