import * as types from './mutationTypes';

import {
  fetchTerminalList,
  fetchTerminalSummary,
  fetchVersionList
} from 'api/release';

// initial state
export const state = {
  terminal: {
    summary: {},
    versionList: [],
    terminalList: []
  }
};

// actions
export const actions = {
  fetchTerminalSummary: async ({ commit }, params) => {
    const result = await fetchTerminalSummary(params);
    commit(types.FETCH_TERMINAL_SUMMARY, result);
  },
  fetchVersionList: async ({ commit }, params) => {
    const result = await fetchVersionList(params);
    commit(types.FETCH_TERMINAL_VERSION_LIST, result);
  },
  fetchTerminalList: async ({ commit }, params) => {
    const result = await fetchTerminalList(params);
    commit(types.FETCH_TERMINAL_LIST, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_TERMINAL_SUMMARY]: (state, result) => {
    state.terminal.summary = result.itemDto;
  },
  [types.FETCH_TERMINAL_VERSION_LIST]: (state, result) => {
    state.terminal.versionList = result.list;
  },
  [types.FETCH_TERMINAL_LIST]: (state, result) => {
    state.terminal.terminalList = result.list;
  }
};
