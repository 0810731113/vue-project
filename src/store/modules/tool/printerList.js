import * as API from 'api/tool';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  printerList: {
    list: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    printerType: {},
    printerBuyAddress: {}
  }
};

// actions
export const actions = {
  fetchSystemPrinterList: async ({ commit }, params) => {
    const result = await API.fetchSystemPrinterList(params);
    commit(types.FETCH_SYSTEM_PRINTER_LIST, result);
  },
  fetchSystemPrinterType: async ({ commit }, params) => {
    const result = await API.fetchSystemPrinterType(params);
    commit(types.FETCH_SYSTEM_PRINTER_TYPE, result);
  },
  updateSystemPrinterType: async ({ commit }, params) => {
    await API.updateSystemPrinterType(params);
  },
  // 打印机购买地址
  fetchPrinterBuyAddress: async ({ commit }, params) => {
    const result = await API.fetchPrinterBuyAddress(params);
    commit(types.FETCH_PRINTER_BUY_ADDRESS, result);
  },
  savePrinterBuyAddress: async ({ commit }, params) => {
    await API.savePrinterBuyAddress(params);
  },
  updatePrinterBuyAddress: async ({ commit }, params) => {
    await API.updatePrinterBuyAddress(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SYSTEM_PRINTER_LIST]: (state, result) => {
    const { printerList } = state;
    const { list, pageSize, pageIndex, recordCount } = result;
    state.printerList = {
      ...printerList,
      list,
      pageSize,
      pageIndex,
      recordCount
    };
  },
  [types.FETCH_SYSTEM_PRINTER_TYPE]: (state, result) => {
    const { printerList } = state;
    const { item } = result;
    state.printerList = {
      ...printerList,
      printerType: item
    };
  },
  [types.FETCH_PRINTER_BUY_ADDRESS]: (state, result) => {
    const { printerList } = state;
    const { item } = result;
    state.printerList = {
      ...printerList,
      printerBuyAddress: item
    };
  }
};
