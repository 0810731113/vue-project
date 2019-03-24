import * as API from 'api/setting';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  printer: {
    printerList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    printerNameList: [],
    printer: null
  }
};

// actions
export const actions = {
  fetchPrinterList: async ({ commit }, params) => {
    const result = await API.fetchPrinterList(params);
    commit(types.FETCH_PRINTER_LIST, result);
  },
  fetchPrinterItem: async ({ commit }, params) => {
    const result = await API.fetchPrinterItem(params);
    commit(types.FETCH_PRINTER_ITEM, result);
  },
  savePrinterItem: async ({ dispatch, state }, params) => {
    const result = await API.savePrinterItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  updatePrinterItem: async ({ dispatch, state }, params) => {
    const result = await API.updatePrinterItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deletePrinterItem: async ({ dispatch, state }, params) => {
    const result = await API.deletePrinterItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  bindCloudPrinter: async ({ commit }, params) => {
    await API.bindCloudPrinter(params);
  },
  unbindCloudPrinter: async ({ commit }, params) => {
    await API.unbindCloudPrinter(params);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.printer;
    await dispatch('fetchPrinterList', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_PRINTER_LIST]: (state, result) => {
    const { printer } = state;
    const { printerList, pageSize, pageIndex, recordCount } = result;
    state.printer = { ...printer, printerList, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_PRINTER_ITEM]: (state, result) => {
    state.printer.printer = result.printer;
    state.printer.printerNameList = result.printerNameList;
  }
};
