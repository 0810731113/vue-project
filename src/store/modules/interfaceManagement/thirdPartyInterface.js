import * as API from 'api/interfaceManagement';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  thirdPartyInterface: {
    thirdPartyInterfaceList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    interfaceShopList: [],
    thirdPartyInterfaceItem: {},
    interfaceTypeList: []
  }
};

// actions
export const actions = {
  fetchThirdPartyInterfaceList: async ({ commit }, params) => {
    const result = await API.fetchThirdPartyInterfaceList(params);
    commit(types.FETCH_THIRD_PARTY_INTERFACE_LIST, result);
  },
  deleteThirdPartyInterfaceItem: async ({ commit }, params) => {
    await API.deleteThirdPartyInterfaceItem(params);
  },
  fetchThirdPartyInterfaceItem: async ({ commit }, params) => {
    const result = await API.fetchThirdPartyInterfaceItem(params);
    commit(types.FETCH_THIRD_PARTY_INTERFACE_ITEM, result);
  },
  fetchInterfaceTypeListWithoutPagination: async ({ commit }, params) => {
    const result = await API.fetchInterfaceTypeListWithoutPagination(params);
    commit(types.FETCH_INTERFACE_TYPE_WITHOUT_PAGINATION, result);
  },
  fetchShopDataSource: async ({ commit }, params) => {
    const result = await API.fetchShopDataSource(params);
    commit(types.FETCH_SHOP_DATASOURCE, result);
  },
  saveThirdPartyInterfaceItem: async ({ commit }, params) => {
    await API.saveThirdPartyInterfaceItem(params);
  },
  updateThirdPartyInterfaceItem: async ({ commit }, params) => {
    await API.updateThirdPartyInterfaceItem(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_THIRD_PARTY_INTERFACE_LIST]: (state, result) => {
    const { thirdPartyInterface } = state;
    const { interfaceManagePageDtos, pageSize, pageIndex, recordCount } = result;
    state.thirdPartyInterface = { ...thirdPartyInterface, thirdPartyInterfaceList: interfaceManagePageDtos, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_SHOP_DATASOURCE]: (state, result) => {
    state.thirdPartyInterface.interfaceShopList = result.interfaceShopDtos;
  },
  [types.FETCH_THIRD_PARTY_INTERFACE_ITEM]: (state, result) => {
    state.thirdPartyInterface.thirdPartyInterfaceItem = result.itemDto;
  },
  [types.FETCH_INTERFACE_TYPE_WITHOUT_PAGINATION]: (state, result) => {
    state.thirdPartyInterface.interfaceTypeList = result.dllDtos;
  }
};
