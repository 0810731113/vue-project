import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  getAllShopList,
  getShopGroupDetail,
  getShopGroupList,
  saveManageShopGroup,
  updateManageShopGroup,
  updateShopGroupStatus
} from 'api/shopManagement';

// initial state
export const state = {
  shopGroup: {
    shopGroupList: [], // 分页列表
    shopGroupDetail: {},
    allShopList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: ''
  }
};

// actions
export const actions = {
  getShopGroupList: async ({ commit }, params = {}) => {
    const result = await getShopGroupList(params);
    commit(types.GET_SHOP_GROUP_LIST, result);
  },
  getShopGroupDetail: async ({ commit }, shopGroupId) => {
    const detail = await getShopGroupDetail(shopGroupId);
    commit(types.GET_SHOP_GROUP_DETAIL, detail);
  },
  updateManageShopGroup: async ({ commit }, params) => {
    const result = await updateManageShopGroup(params);
    commit(types.UPDATE_MANAGE_SHOP_GROUP, result);
  },
  saveManageShopGroup: async ({ commit }, params) => {
    await saveManageShopGroup(params);
  },
  getAllShopList: async ({ commit }) => {
    const list = await getAllShopList();
    commit(types.GET_ALL_SHOP_LIST, list);
  },
  updateShopGroupStatus: async ({ commit }, params) => {
    await updateShopGroupStatus(params);
  }
};

// mutations
export const mutations = {
  [types.GET_SHOP_GROUP_LIST]: (state, result) => {
    const { shopGroup } = state;
    const { list, pageIndex, recordCount } = result;
    state.shopGroup = { ...shopGroup, shopGroupList: list, pageIndex, recordCount };
  },
  [types.GET_SHOP_GROUP_DETAIL]: (state, detail) => {
    state.shopGroup.shopGroupDetail = detail.dto;
  },
  [types.UPDATE_MANAGE_SHOP_GROUP]: (state, params) => {
    const newList = state.shopGroup.shopGroupList.map(item => {
      if (item.shopGroupId === params.shopGroupId) {
        return params;
      }
      return item;
    });

    state.shopGroup.shopGroupList = newList;
  },
  [types.GET_ALL_SHOP_LIST]: (state, list) => {
    state.shopGroup.allShopList = list.data;
  }
};
