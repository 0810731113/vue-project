import * as API from 'api/tables';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  diningArea: {
    diningAreaList: [],
    totalCountOfDiningAreas: 0,
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    diningAreaSortList: [],
    diningAreaItem: null,
    printerList: []
  }
};

// actions
export const actions = {
  fetchAllDiningArea: async ({ commit }, params) => {
    const result = await API.fetchAllDiningArea(params);
    commit(types.FETCH_ALL_DINING_AREA, result);
  },
  fetchDiningAreaItem: async ({ commit }, params) => {
    const result = await API.fetchDiningAreaItem(params);
    commit(types.FETCH_DINING_AREA_ITEM, result);
  },
  fetchPrinterListForTable: async ({ commit }, params) => {
    const result = await API.fetchPrinterListForTable(params);
    commit(types.FETCH_PRINTER_LIST_FOR_TABLE, result);
  },
  saveDiningArea: async ({ commit }, params) => {
    await API.saveDiningArea(params);
  },
  editDiningArea: async ({ commit }, params) => {
    await API.editDiningArea(params);
  },
  updateDiningAreaStatus: async ({ dispatch, commit, state }, params) => {
    const result = await API.updateDiningAreaStatus(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  fetchDiningAreaSortList: async ({ commit }) => {
    const result = await API.fetchDiningAreaSortList();
    commit(types.FETCH__DINING_AREA_SORT_LIST, result);
  },
  updateDiningAreaSortList: async ({ dispatch, commit, state }, params) => {
    const result = await API.updateDiningAreaSortList(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.diningArea;
    await dispatch('fetchAllDiningArea', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_ALL_DINING_AREA]: (state, result) => {
    let { pageSize, pageIndex, tableArealist, recordCount } = result;
    const { diningArea } = state;
    state.diningArea = { ...diningArea, diningAreaList: tableArealist, totalCountOfDiningAreas: recordCount, pageSize, pageIndex };
  },
  [types.FETCH__DINING_AREA_SORT_LIST]: (state, result) => {
    state.diningArea.diningAreaSortList = result.tableAreaSortList;
  },
  [types.FETCH_DINING_AREA_ITEM]: (state, result) => {
    state.diningArea.diningAreaItem = result.dto;
  },
  [types.FETCH_PRINTER_LIST_FOR_TABLE]: (state, result) => {
    state.diningArea.printerList = result.tableAreaPrinterList || [];
  }
};
