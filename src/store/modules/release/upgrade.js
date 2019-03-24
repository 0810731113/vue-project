import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteUpgrade,
  fetchUpgradeDetail,
  fetchUpgradeList,
  pushUpgradeVersion,
  saveUpgrade
} from 'api/release';

// initial state
export const state = {
  upgrade: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchUpgradeList: async ({ commit }, params) => {
    const result = await fetchUpgradeList(params);
    commit(types.FETCH_UPGRADE_LIST, result);
  },
  fetchUpgradeDetail: async ({ commit }, params) => {
    const result = await fetchUpgradeDetail(params);
    commit(types.FETCH_UPGRADED_ETAIL, result);
  },
  saveUpgrade: async ({ commit }, params) => {
    await saveUpgrade(params);
  },
  deleteUpgrade: async ({ commit }, params) => {
    await deleteUpgrade(params);
  },
  pushUpgradeVersion: async ({ commit }, params) => {
    await pushUpgradeVersion(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_UPGRADE_LIST]: (state, result) => {
    const { pageIndex, pageSize, recordCount, list } = result;
    state.upgrade = { ...state.upgrade, pageIndex, pageSize, recordCount, list };
  },
  [types.FETCH_UPGRADED_ETAIL]: (state, result) => {
    state.upgrade.detail = result.itemDto;
  }
};
