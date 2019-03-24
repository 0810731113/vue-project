import * as API from 'api/release';
import * as types from './mutationTypes';
import { ALL } from 'constant/statusCode';

// initial state
export const state = {
  functionDetection: {
    companyList: [],
    shopGroupList: [],
    shopList: [],
    shopDetectionToken: '',
    shopDetectionResult: null,
    shopVersion: [],
    shopCentral: []
  }
};

// actions
export const actions = {
  fetchCompanyList: async ({ commit }, params) => {
    const result = await API.fetchCompanyList({ shopNames: params });
    commit(types.FETCH_COMPANY_LIST, result);
  },
  fetchShopGroupList: async ({ commit }, params) => {
    const result = await API.fetchShopGroupList(params);
    commit(types.FETCH_SHOP_GROUP_LIST, result);
  },
  fetchShopList: async ({ commit }, params) => {
    const result = await API.fetchShopList(params);
    commit(types.FETCH_SHOP_LIST, result);
  },
  fetchShopDetectionToken: async ({ commit }, params) => {
    const result = await API.fetchShopDetectionToken(params);
    commit(types.FETCH_SHOP_DETECTION_TOKEN, result);
  },
  fetchShopDetectionResult: async ({ commit }, params) => {
    const result = await API.fetchShopDetectionResult(params);
    commit(types.FETCH_SHOP_DETECTION_RESULT, result);
  },
  fetchShopCentral: async ({ commit }, params) => {
    const result = await API.fetchShopCentral(params);
    commit(types.FETCH_SHOP_CENTRAL_DATA, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_COMPANY_LIST]: (state, result) => {
    const { functionDetection } = state;
    const { shopCompanyDtos } = result;
    state.functionDetection = { ...functionDetection, companyList: shopCompanyDtos };
  },
  [types.FETCH_SHOP_GROUP_LIST]: (state, result) => {
    const insertItem = { shopGroupId: ALL, shopGroupName: '全部' };
    state.functionDetection.shopGroupList = result.shopGroupDtos;
    state.functionDetection.shopGroupList
      ? state.functionDetection.shopGroupList.splice(0, 0, insertItem)
      : state.functionDetection.shopGroupList = [insertItem];
  },
  [types.FETCH_SHOP_LIST]: (state, result) => {
    state.functionDetection.shopList = result.shopListDtos;
  },
  [types.FETCH_SHOP_DETECTION_TOKEN]: (state, result) => {
    state.functionDetection.shopDetectionToken = result.shopCheckDataDto.data;
  },
  [types.FETCH_SHOP_DETECTION_RESULT]: (state, result) => {
    state.functionDetection.shopDetectionResult = result.shopCheckDataDto.data;
  },
  [types.FETCH_SHOP_CENTRAL_DATA]: (state, result) => {
    state.functionDetection.shopVersion = result.shopVersionDtos || [];
    state.functionDetection.shopCentral = result.neutralStatusDtos || [];
  }
};
