import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteDeliverer,
  fetchAllDeliverer,
  fetchDelivererDetail,
  getDelivererLastId,
  saveDeliverer,
  updateDeliverer
} from 'api/business';

import { handleError } from '../../common';

// initial state
export const state = {
  deliverer: {
    delivererList: [],
    delivererDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0
  }
};

// actions
export const actions = {
  fetchAllDeliverer: async ({ commit }, params) => {
    const result = await fetchAllDeliverer(params);
    commit(types.FETCH_ALL_DELIVERER, result);
  },
  saveDeliverer: async ({ commit }, params) => {
    const result = await saveDeliverer(params);
    handleError(commit, types.SAVE_DELIVERER_SUCCESS, params, result.err);
  },
  updateDeliverer: async ({ commit }, params) => {
    const result = await updateDeliverer(params);
    handleError(commit, types.UPDATE_DELIVERER_SUCCESS, params, result.err);
  },
  deleteDeliverer: async ({ commit }, delivererId) => {
    await deleteDeliverer(delivererId);
    commit(types.DELETE_DELIVERER_BY_ID, delivererId);
  },
  getDelivererLastId: async({ commit }) => {
    const lastId = await getDelivererLastId();
    commit(types.GET_DELIVERER_LAST_ID, lastId);
  },
  fetchDelivererDetail: async ({ commit }, delivererId) => {
    const detail = await fetchDelivererDetail(delivererId);
    commit(types.FETCH_DELIVERER_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_DELIVERER]: (state, result) => {
    const { deliverer } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.deliverer = { ...deliverer, delivererList: list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_DELIVERER_SUCCESS]: (state, params) => {
    const { delivererList } = state.deliverer;
    state.deliverer.delivererList = [...delivererList, params];
    state.deliverer.recordCount++;
  },
  [types.UPDATE_DELIVERER_SUCCESS]: (state, params) => {
    const newList = state.deliverer.delivererList.map(item => {
      if (item.delivererId === params.delivererId) {
        return params;
      }
      return item;
    });

    state.deliverer.delivererList = newList;
  },
  [types.DELETE_DELIVERER_BY_ID]: (state, delivererId) => {
    const newList = state.deliverer.delivererList.filter(item => item.delivererId !== delivererId);
    state.deliverer.delivererList = newList;
    state.deliverer.recordCount--;
  },
  [types.GET_DELIVERER_LAST_ID]: (state, lastId) => {
    state.deliverer.lastId = lastId;
  },
  [types.FETCH_DELIVERER_DETAIL]: (state, detail) => {
    state.deliverer.delivererDetail = detail;
  }
};
