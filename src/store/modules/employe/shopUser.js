import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteShopUser,
  fetchAllDiscountPlan,
  fetchShopUserList,
  getShopUserDetail,
  updateShopUserInfo,
  updateUserPrintStatus
} from 'api/employe';

// initial state
export const state = {
  shopUser: {
    shopUserList: [],
    discountPlanList: [],
    shopUserDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchShopUserList: async ({ commit }, params) => {
    const result = await fetchShopUserList(params);
    commit(types.FETCH_SHOP_USER_LIST, result);
  },
  getShopUserDetail: async ({ commit }, params) => {
    const result = await getShopUserDetail(params);
    console.log(result);
    commit(types.GET_SHOP_USER_DETAIL, result);
  },
  updateShopUserInfo: async ({ commit }, params) => {
    await updateShopUserInfo(params);
  },
  deleteShopUser: async ({ commit }, params) => {
    await deleteShopUser(params);
  },
  updateUserPrintStatus: async ({ commit }, params) => {
    await updateUserPrintStatus(params);
  },
  fetchAllDiscountPlan: async ({ commit }) => {
    const result = await fetchAllDiscountPlan();
    commit(types.FETCH_DISCOUNT_PLAN_LIST, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SHOP_USER_LIST]: (state, result) => {
    const { shopUser } = state;
    const { shopUserPageDtos, recordCount, pageIndex, pageSize } = result;
    state.shopUser = { ...shopUser, shopUserList: shopUserPageDtos, recordCount, pageIndex, pageSize };
  },
  [types.GET_SHOP_USER_DETAIL]: (state, result) => {
    const { shopUser } = state;
    const { shopUserItemDto } = result;
    state.shopUser = { ...shopUser, shopUserDetail: shopUserItemDto };
  },
  [types.FETCH_DISCOUNT_PLAN_LIST]: (state, result) => {
    const { shopUser } = state;
    const { discountItemList } = result;
    state.shopUser = { ...shopUser, discountPlanList: discountItemList || [] };
  }
};
