import * as API from 'api/tables';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  tableType: {
    tableTypeList: [],
    totalCountOfTableTypes: 0,
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    tableTypeItem: null
  }
};

// actions
export const actions = {
  fetchAllTableTypes: async ({ commit }, params) => {
    const result = await API.fetchAllTableTypes(params);
    commit(types.FETCH_ALL_TABLE_TYPES, result);
  },
  fetchTableTypeItem: async ({ commit }, params) => {
    const result = await API.fetchTableTypeItem(params);
    commit(types.FETCH_NEW_TABLE_TYPE_ITEM, result);
  },
  saveTableType: async ({ commit }, params) => {
    await API.saveTableType(params);
  },
  editTableType: async ({ commit }, params) => {
    await API.editTableType(params);
  },
  updateTableStatus: async ({ commit, dispatch, state }, params) => {
    const result = await API.updateTableStatus(params);
    // fetch after save
    if (result.err.errNo === SUCCESS) {
      const { pageSize, pageIndex } = state.tableType;
      await dispatch('fetchAllTableTypes', { pageSize, pageIndex });
    }
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_TABLE_TYPES]: (state, result) => {
    let { pageSize, pageIndex, mtClslist, recordCount } = result;
    const { tableType } = state;
    state.tableType = { ...tableType, pageSize, pageIndex, tableTypeList: mtClslist, totalCountOfTableTypes: recordCount };
  },
  [types.FETCH_NEW_TABLE_TYPE_ITEM]: (state, result) => {
    state.tableType.tableTypeItem = result.itemDTO;
  }
};
