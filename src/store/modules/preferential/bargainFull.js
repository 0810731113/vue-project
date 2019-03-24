import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteBargainFull,
  fetchBargainFullDetail,
  fetchBargainFullList,
  getBargainMaxId,
  getCutPaymentsList,
  insertBargainFull,
  updateBargainFull,
  fetchBargainFullLinkedMenus,
  updateBargainFullLinkedMenus
} from 'api/preferential';

// initial state
export const state = {
  bargainFull: {
    bargainFullList: [],
    cutPaymentsList: [],
    lastId: '',
    bargainFullDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    linkedMenus: []
  }
};

// actions
export const actions = {
  fetchBargainFullList: async ({ commit }, params) => {
    const result = await fetchBargainFullList(params);
    commit(types.FETCH_BARGAIN_FULL_LIST, result);
  },
  insertBargainFull: async ({ commit }, params) => {
    await insertBargainFull(params);
  },
  deleteBargainFull: async ({ commit }, params) => {
    await deleteBargainFull(params);
    commit(types.DELETE_BARGAIN_FULL_SUCCESS, params);
  },
  updateBargainFull: async ({ commit }, params) => {
    const result = await updateBargainFull(params);
    commit(types.UPDATE_BARGAIN_FULL_SUCCESS, result);
  },
  fetchBargainFullDetail: async ({ commit }, bargainId) => {
    const bargainFullDetail = await fetchBargainFullDetail(bargainId);
    commit(types.FETCH_BARGAIN_FULL_DETAIL, bargainFullDetail);
  },
  getCutPaymentsList: async ({ commit }) => {
    const data = await getCutPaymentsList();
    commit(types.GET_CUT_PAYMENTS_LIST, data);
  },
  getBargainMaxId: async ({ commit }) => {
    const lastId = await getBargainMaxId();
    commit(types.GET_BARGAIN_MAX_ID, lastId);
  },
  fetchBargainFullLinkedMenus: async ({ commit }, params) => {
    const result = await fetchBargainFullLinkedMenus(params);
    commit(types.FETCH_BARGAIN_FULL_LINKED_MENUS, result);
  },
  updateBargainFullLinkedMenus: async ({ commit }, params) => {
    await updateBargainFullLinkedMenus(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_BARGAIN_FULL_LIST]: (state, result) => {
    const { bargainFull } = state;
    const { list, pageIndex, recordCount } = result;
    state.bargainFull = { ...bargainFull, bargainFullList: list, pageIndex, recordCount };
  },
  [types.DELETE_BARGAIN_FULL_SUCCESS]: (state, bargainId) => {
    const newList = state.bargainFull.bargainFullList.filter(item => bargainId !== item.bargainId);
    state.bargainFull.bargainFullList = newList;
    state.bargainFull.recordCount = newList.length;
  },
  [types.UPDATE_BARGAIN_FULL_SUCCESS]: (state, params) => {
    const newList = state.bargainFull.bargainFullList.map(item => {
      if (item.bargainId === params.bargainId) {
        return params;
      }
      return item;
    });

    state.bargainFull.bargainFullList = newList;
  },
  [types.FETCH_BARGAIN_FULL_DETAIL]: (state, bargainFullDetail) => {
    state.bargainFull.bargainFullDetail = bargainFullDetail.dto;
  },
  [types.GET_CUT_PAYMENTS_LIST]: (state, data) => {
    state.bargainFull.cutPaymentsList = data.list;
  },
  [types.GET_BARGAIN_MAX_ID]: (state, lastId) => {
    state.bargainFull.lastId = lastId.data.maxBargainId;
  },
  [types.FETCH_BARGAIN_FULL_LINKED_MENUS]: (state, result) => {
    state.bargainFull.linkedMenus = result.bargainFullItems;
  }
};
