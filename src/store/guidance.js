import * as types from 'store/mutationTypes';

import {
  fetchAllGuidance,
  updateStepOfGuidance
} from 'api/guidance';

// initial state
const state = {
  steps: []
};

// actions
const actions = {
  fetchAllGuidance: async ({ commit }) => {
    const result = await fetchAllGuidance();
    commit(types.FETCH_ALL_GUIDANCE, result);
  },
  updateStepOfGuidance: async ({ commit }, params) => {
    await updateStepOfGuidance(params);
    commit(types.UPDATE_STEP_OF_GUIDANCE, params);
  }
};

// mutations
const mutations = {
  [types.FETCH_ALL_GUIDANCE] (state, result) {
    state.steps = result.list || [];
  },
  [types.UPDATE_STEP_OF_GUIDANCE] (state, params) {
    const { steps } = state;
    steps.push(params);
    state.steps = steps;
  }
};

export default {
  state,
  actions,
  mutations
};
