import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchShopRoleList,
  getShopRoleDetail,
  getShopRoleInfo,
  updateShopRoleInfo,
  updateShopRoleStatus
} from 'api/employe';

// initial state
export const state = {
  shopRole: {
    shopRoleList: [],
    shopRoleDetail: {},
    shopRoleInfo: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchShopRoleList: async ({ commit }, params) => {
    const result = await fetchShopRoleList(params);
    commit(types.FETCH_SHOP_ROLE_LIST, result);
  },
  getShopRoleDetail: async ({ commit }, params) => {
    const result = await getShopRoleDetail(params);
    commit(types.GET_SHOP_ROLE_DETAIL, result);
  },
  updateShopRoleInfo: async ({ commit }, params) => {
    await updateShopRoleInfo(params);
  },
  updateShopRoleStatus: async ({ commit }, params) => {
    await updateShopRoleStatus(params);
  },
  getShopRoleInfo: async ({ commit }, params) => {
    const result = await getShopRoleInfo(params);
    commit(types.GET_SHOP_ROLE_INFO, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SHOP_ROLE_LIST]: (state, result) => {
    const { shopRole } = state;
    const { shopRolePageDtoList, recordCount, pageIndex, pageSize } = result;
    state.shopRole = { ...shopRole, shopRoleList: shopRolePageDtoList, recordCount, pageIndex, pageSize };
  },
  [types.GET_SHOP_ROLE_DETAIL]: (state, result) => {
    const { shopRole } = state;
    const { shopRoleItemDto } = result;
    state.shopRole = { ...shopRole, shopRoleDetail: shopRoleItemDto };
  },
  [types.GET_SHOP_ROLE_INFO]: (state, result) => {
    const { shopRole } = state;
    const { shopRoleItemDto } = result;
    state.shopRole = { ...shopRole, shopRoleInfo: shopRoleItemDto };
  }
};
