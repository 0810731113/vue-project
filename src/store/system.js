/**
 * Created by liuyu on 2017/9/5.
 */

import * as types from 'store/mutationTypes';

import {
  fetchCitys,
  fetchDistrict,
  fetchMenu,
  fetchProvinces,
  fetchUserInfo,
  fetchUserRight,
  updateShopData
} from 'api/system';

import { handleError } from './common';

// initial state
const state = {
  sideBarMenu: [],
  userRights: [],
  citys: [],
  iframeInfo: {
    isIframe: false,
    route: ''
  }
};

// actions
const actions = {
  fetchSystemMenu: async ({ commit }) => {
    const result = await fetchMenu();
    handleError(commit, types.FETCH_SYSTEM_MENU, result, result.err);
  },
  fetchUserInfo: async ({ commit }) => {
    const result = await fetchUserInfo();
    handleError(commit, types.FETCH_USER_INFO, result, result.err);
  },
  fetchUserRight: async ({ commit }) => {
    const result = await fetchUserRight();
    commit(types.FETCH_USER_AUTH_LIST, result);
  },
  fetchProvinces: async ({ commit }) => {
    const result = await fetchProvinces();
    commit(types.FETCH_PROVINCE_LIST, result);
  },
  fetchCitys: async ({ commit }, params) => {
    const result = await fetchCitys(params);
    commit(types.FETCH_CITY_LIST, result);
  },
  fetchDistrict: async ({ commit }, params) => {
    const result = await fetchDistrict(params);
    commit(types.FETCH_DISTRICT_LIST, result);
  },
  setIframeInfo: async ({ commit }, params) => {
    commit(types.SET_IFRAME_INFO, params);
  },
  updateShopData: async ({ commit }, params) => {
    return await updateShopData(params);
  }
};

// mutations
const mutations = {
  [types.FETCH_SYSTEM_MENU]: (state, result) => {
    const { leftMenuDtos } = result;
    state.sideBarMenu = leftMenuDtos;
  },
  [types.FETCH_USER_INFO]: (state, result) => {
    delete result.err;
    for (let key in result) {
      state[key] = result[key];
    }
  },
  [types.FETCH_USER_AUTH_LIST]: (state, result) => {
    state.userRights = result.userRights;
  },
  [types.SET_IFRAME_INFO]: (state, result) => {
    state.iframeInfo = result;
  },
  [types.FETCH_PROVINCE_LIST]: (state, result) => {
    const citys = (result.data || []).map(item => {
      item.children = [];
      return item;
    });
    state.citys = citys;
  },
  [types.FETCH_CITY_LIST]: (state, result) => {
    const { data, provinceId } = result;
    if (!+provinceId) return;
    const citys = (data || []).map(item => {
      item.children = [];
      return item;
    });

    state.citys[+provinceId - 1].children = citys;
  },
  [types.FETCH_DISTRICT_LIST]: (state, result) => {
    const { data, provinceId, cityId } = result;
    if (!+provinceId) return;
    const citys = state.citys[+provinceId - 1].children.map(item => {
      if (+item.id === +cityId) {
        item.children = data;
      }
      return item;
    });

    state.citys[+provinceId - 1].children = citys;
  }
};

export default {
  state,
  actions,
  mutations
};

