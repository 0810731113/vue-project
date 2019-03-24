import * as API from 'api/tables';
import * as types from './mutationTypes';

// initial state
export const state = {
  tableStates: {
    tableColorlist: []
  }
};

// actions
export const actions = {
  fetchAllTableColorList: async ({ commit }) => {
    const result = await API.fetchAllTableColorList();
    commit(types.FETCH_ALL_TABLE_COLORS, result);
  },
  saveTableColorList: async ({ commit }, params) => {
    await API.saveTableColorList(params);
  },
  setStateStatus: ({ commit }, params) => {
    commit(types.SET_STATE_STATUS, params);
  },
  setStateColor: ({ commit }, params) => {
    commit(types.SET_STATE_COLOR, params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_TABLE_COLORS]: (state, result) => {
    const { tableStates } = state;
    state.tableStates = { ...tableStates, tableColorList: result.tableColorlist };
  },
  [types.SET_STATE_STATUS]: (state, result) => {
    const { mtableSteId, mtableSteStatus } = result;
    state.tableStates.tableColorList.map(item => {
      if (item.mtableSteId === mtableSteId) {
        item.mtableSteStatus = mtableSteStatus;
      }
    });
  },
  [types.SET_STATE_COLOR]: (state, result) => {
    const { mtableSteId, mtableSteColor } = result;
    state.tableStates.tableColorList.map(item => {
      if (item.mtableSteId === mtableSteId) {
        item.mtableSteColor = mtableSteColor;
      }
    });
  }
};
