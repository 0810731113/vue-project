import * as API from 'api/shopManagement';
import * as types from './mutationTypes';

// initial state
export const state = {
  chainsSetting: {
    list: [],
    notMainTain: ''
  }
};

// actions
export const actions = {
  fetchChainsSettings: async ({ commit }, params) => {
    const result = await API.fetchChainsSettings(params);
    commit(types.FETCH_CHAINS_SETTINGS, result);
  },
  saveChainsSettings: async ({ commit }, params) => {
    await API.saveChainsSettings(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_CHAINS_SETTINGS]: (state, result) => {
    const { list, notMainTain } = result;
    state.chainsSetting = { ...state.chainsSetting, list, notMainTain };
  }
};
