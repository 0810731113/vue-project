import * as API from 'api/tables';
import * as types from './mutationTypes';

import { ALL, SUCCESS } from 'constant/statusCode';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  management: {
    tableManagerPageList: [],
    tableManagerPageSortList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    tableTypelist: [],
    tableAreaList: [],
    selectedTableArea: ALL,
    selectedTableType: ALL
  }
};

// actions
export const actions = {
  fetchTableManagementList: async ({ commit }, params) => {
    const result = await API.fetchTableManagementList(params);
    commit(types.FETCH_TABLE_MANAGEMENT_LIST, result);
  },
  fetchTableManagementSortList: async ({ commit }, params) => {
    const result = await API.fetchTableManagementSortList(params);
    commit(types.FETCH_TABLE_MANAGEMENT_SORT_LIST, result);
  },
  updateManagementSortList: async ({ dispatch, state }, params) => {
    const result = await API.updateManagementSortList(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  initTableFilter: async ({ commit }) => {
    commit(types.INIT_TABLE_FILTER);
  },
  getTableTypelist: async ({ commit }, params) => {
    const result = await API.getTableTypelist(params);
    commit(types.GET_TABLE_TYPE_LIST, result);
  },
  getTableArealist: async ({ commit }, params) => {
    const result = await API.getTableArealist(params);
    commit(types.GET_TABLE_AREA_LIST, result);
    return result;
  },
  fetchManagementItem: async ({ commit }, params) => {
    const result = await API.fetchManagementItem(params);
    commit(types.FETCH_MANAGEMENT_ITEM, result);
  },
  saveTableManagementItem: async ({ dispatch, state }, params) => {
    const result = await API.saveTableManagementItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  saveBatchTableManagement: async ({ dispatch, state }, params) => {
    const result = await API.saveBatchTableManagement(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateBatchTableManagement: async ({ dispatch, state }, params) => {
    const result = await API.updateBatchTableManagement(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateTableManagementItem: async ({ dispatch, state }, params) => {
    const result = await API.updateTableManagementItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updateTableManagementStatus: async ({ dispatch, state }, params) => {
    const result = await API.updateTableManagementStatus(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deleteBatchTableManagement: async ({ dispatch, state }, params) => {
    const result = await API.deleteBatchTableManagement(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  setManagementSelectedType: ({ commit }, params) => {
    commit(types.SET_SELECTED_TYPE, params);
  },
  setManagementSelectedArea: ({ commit }, params) => {
    commit(types.SET_SELECTED_AREA, params);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    let { pageSize, pageIndex, selectedTableType, selectedTableArea } = state.management;
    if (selectedTableArea === ALL) { selectedTableArea = null; }
    if (selectedTableType === ALL) { selectedTableType = null; }
    await dispatch('fetchTableManagementList', { pageSize, pageIndex, mtableClsId: selectedTableType, mareaId: selectedTableArea });
  }
}

// mutations
export const mutations = {
  [types.FETCH_TABLE_MANAGEMENT_LIST]: (state, result) => {
    const { tableManagerPageList, pageSize, pageIndex, recordCount } = result;
    const { management } = state;
    state.management = {
      ...management,
      tableManagerPageList,
      pageSize,
      pageIndex,
      countOfManagementList: recordCount
    };
  },
  [types.FETCH_TABLE_MANAGEMENT_SORT_LIST]: (state, result) => {
    state.management.tableManagerPageSortList = result.tableManagerSortOrderList;
  },
  [types.INIT_TABLE_FILTER]: (state) => {
    state.management.selectedTableArea = ALL;
    state.management.selectedTableType = ALL;
  },
  [types.GET_TABLE_TYPE_LIST]: (state, result) => {
    state.management.tableTypelist = result.tableClsDLLList;
  },
  [types.GET_TABLE_AREA_LIST]: (state, result) => {
    state.management.tableAreaList = result.tableMareaDLLList;
  },
  [types.SET_SELECTED_TYPE]: (state, result) => {
    state.management.selectedTableType = result;
  },
  [types.SET_SELECTED_AREA]: (state, result) => {
    state.management.selectedTableArea = result;
  },
  [types.FETCH_MANAGEMENT_ITEM]: (state, result) => {
    state.management.managementItem = result.tableManagerItemDto;
  }
};
