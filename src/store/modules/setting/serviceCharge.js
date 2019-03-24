import * as API from 'api/setting';
import * as types from './mutationTypes';

// initial state
export const state = {
  serviceCharge: {
    paramItems: {},
    areaList: []
  }
};

// actions
export const actions = {
  fetchServiceItems: async ({ commit }, params) => {
    const result = await API.fetchServiceItems(params);
    commit(types.FETCH_SERVICE_ITEMS, result);
  },
  fetchServiceAreaList: async ({ commit }, params) => {
    const result = await API.fetchServiceAreaList(params);
    commit(types.FETCH_SERVICE_AREA_LIST, result);
  },
  saveServiceCharge: async ({ commit }, params) => {
    await API.saveServiceCharge(params);
  },
  updateAreaService: async ({ commit }, params) => {
    await API.updateAreaService(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SERVICE_ITEMS]: (state, result) => {
    state.serviceCharge.paramItems = { ...result.paramServiceDto };
  },
  [types.FETCH_SERVICE_AREA_LIST]: (state, result) => {
    state.serviceCharge.areaList = result.itemDtos;
  }
};
