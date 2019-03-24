import * as types from './mutationTypes';

import {
  fetchTakeoutDetail,
  updateTakeout
} from 'api/business';

export const state = {
  takeout: {
    info: {},
    conlists: []
  }
};

// actions
export const actions = {
  fetchTakeoutDetail: async ({ commit }, params) => {
    const result = await fetchTakeoutDetail(params);
    commit(types.FETCH_TAKEOUT_DETAIL, result);
  },
  updateTakeout: async ({ commit }, params) => {
    await updateTakeout(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_TAKEOUT_DETAIL]: (state, result) => {
    const { info, conlists } = result;
    state.takeout = { info, conlists };
  }
};
