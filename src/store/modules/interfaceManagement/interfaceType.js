import * as API from 'api/interfaceManagement';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  interfaceType: {
    interfaceTypeList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    interfaceTypeItem: {}
  }
};

// actions
export const actions = {
  fetchInterfaceTypeList: async ({ commit }, params) => {
    const result = await API.fetchInterfaceTypeList(params);
    commit(types.FETCH_INTERFACE_TYPE_LIST, result);
  },
  deleteInterfaceTypeItem: async ({ commit }, params) => {
    await API.deleteInterfaceTypeItem(params);
  },
  fetchInterfaceTypeItem: async ({ commit }, params) => {
    const result = await API.fetchInterfaceTypeItem(params);
    commit(types.FETCH_INTERFACE_TYPE_ITEM, result);
  },
  updateInterfaceTypeItem: async ({ commit }, params) => {
    await API.updateInterfaceTypeItem(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_INTERFACE_TYPE_LIST]: (state, result) => {
    const { interfaceType } = state;
    const { itemTypeDtos, pageSize, pageIndex, recordCount } = result;
    state.interfaceType = {
      ...interfaceType,
      interfaceTypeList: itemTypeDtos,
      pageSize,
      pageIndex,
      recordCount
    };
  },
  [types.FETCH_INTERFACE_TYPE_ITEM]: (state, result) => {
    state.interfaceType.interfaceTypeItem = result.itemDto;
  }
};
