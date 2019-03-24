import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteBuyGift,
  fetchBargainMenus,
  fetchBuyGiftDetail,
  fetchBuyGiftList,
  fetchMenuTrees,
  getBargainMaxId,
  saveBuyGift,
  updateBuyGift
} from 'api/preferential';

// initial state
export const state = {
  menuList: [],
  treeDatas: [],
  buyGift: {
    lastId: 0,
    list: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchBuyGiftList: async ({ commit }, params) => {
    const result = await fetchBuyGiftList(params);
    commit(types.FETCH_BUY_GIFT_LIST, result);
  },
  deleteBuyGift: async ({ commit }, params) => {
    await deleteBuyGift(params);
  },
  fetchBargainMenus: async ({ commit }, params) => {
    const result = await fetchBargainMenus(params);
    commit(types.FETCH_BARGAIN_MENUS, result);
  },
  fetchMenuTrees: async ({ commit }, params) => {
    const result = await fetchMenuTrees(params);
    commit(types.FETCH_BARGAIN_TREES, result);
  },
  getBuyGiftMaxId: async ({ commit }) => {
    const result = await getBargainMaxId();
    commit(types.GET_BUY_GIFT_MAXID, result);
  },
  saveBuyGift: async ({ commit }, params) => {
    await saveBuyGift(params);
  },
  updateBuyGift: async ({ commit }, params) => {
    await updateBuyGift(params);
  },
  fetchBuyGiftDetail: async ({ commit }, params) => {
    const result = await fetchBuyGiftDetail(params);
    commit(types.GET_BUY_GIFT_DETAIL, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_BUY_GIFT_LIST]: (state, result) => {
    const { list, recordCount, pageIndex, pageSize } = result;
    state.buyGift = { ...state.buyGift, list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_BARGAIN_MENUS]: (state, result) => {
    state.menuList = result.list;
  },
  [types.FETCH_BARGAIN_TREES]: (state, result) => {
    const { children } = result.menuClsViewDto;
    state.treeDatas = [{ children: children || [], menuClsName: '全部分类' }];
  },
  [types.GET_BUY_GIFT_MAXID]: (state, result) => {
    state.buyGift.lastId = result.data.maxBargainId;
  },
  [types.GET_BUY_GIFT_DETAIL]: (state, result) => {
    state.buyGift.detail = result.dto;
  }
};
