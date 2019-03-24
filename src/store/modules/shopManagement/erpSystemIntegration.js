import * as API from 'api/shopManagement';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  erpSystemIntegration: {
    erpSystemIntegrationList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchERPSystemIntegrationList: async ({ commit }, params) => {
    const result = await API.fetchERPSystemIntegrationList(params);
    commit(types.FETCH_ERP_SYSTEM_INTEGRATION_LIST, result);
  },
  batchUploadShopData: async ({ commit }, params) => {
    await API.batchUploadShopData(params);
  },
  batchChangeUploadWay: async ({ commit }, params) => {
    await API.batchChangeUploadWay(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ERP_SYSTEM_INTEGRATION_LIST]: (state, result) => {
    const { erpSystemIntegration } = state;
    const { erpSystemPageDtos, pageSize, pageIndex, recordCount } = result;
    state.erpSystemIntegration = { ...erpSystemIntegration, pageSize, pageIndex, recordCount, erpSystemIntegrationList: erpSystemPageDtos };
  }
};
