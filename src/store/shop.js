import * as types from 'store/mutationTypes';

import {
  addFeedbackInfo,
  deleteShopInfoImage,
  fetchBaseInfo,
  fetchShopInfo,
  unbindShop,
  updateShopInfo,
  switchReportToken,
  checkReportLogin
} from 'api/shop';

import { USAGE } from 'constant/constants';

// initial state
const state = {
  shopInfo: {},
  baseData: [],
  pieData: [],
  lineData: {},
  salesList: [],

  report: {
    reportToken: '',
    shopKind: '',
    account: {},
    isStg: ''
  }
};

// actions
const actions = {
  async fetchBaseInfo ({ commit }, params) {
    const result = await fetchBaseInfo(params);
    commit(types.FETCH_SHOP_USAGE_DATA, { result });
  },
  async fetchShopInfo ({ commit }) {
    const result = await fetchShopInfo();
    commit(types.FETCH_SHOP_INFO, { result });
  },
  async updateShopInfo ({ commit }, params) {
    const result = await updateShopInfo(params);
    commit(types.UPDATE_SHOP_INFO, result.item);
  },
  async unbindShop ({ commit }, params) {
    await unbindShop(params);
  },
  updateInfo ({ commit }, payload) {
    commit(types.UPDATE_SHOP_INFO, payload);
  },
  async deleteShopInfoImage ({ commit }, params) {
    await deleteShopInfoImage(params);
  },
  addFeedbackInfo: async ({ commit }, params) => {
    await addFeedbackInfo(params);
  },
  async switchReportToken ({ commit }, params) {
    const result = await switchReportToken(params);
    commit(types.SWITCH_REPORT_TOKEN, { result });
  },
  async checkReportLogin ({ commit }, params) {
    await checkReportLogin(params);
  }
};

// mutations
const mutations = {
  [types.FETCH_SHOP_USAGE_DATA] (state, { result }) {
    const { paymentRatio = [], dailyReceipts = [], menuItemSort = [] } = result;
    let baseData = [];
    for (let key in USAGE) {
      USAGE[key].count = result[key] || 0;
      baseData.push(USAGE[key]);
    }
    let lineData = {
      data: [],
      lables: []
    };
    dailyReceipts && dailyReceipts.map(item => {
      lineData.data.push(item.receipts);
      lineData.lables.push(item.strDate);
    });
    state.baseData = baseData;
    state.pieData = paymentRatio || [];
    state.lineData = lineData;
    state.salesList = menuItemSort || [];
  },
  [types.FETCH_SHOP_INFO] (state, { result }) {
    state.shopInfo = result.item || {};
  },
  [types.UPDATE_SHOP_INFO] (state, payload) {
    const shopInfo = { ...state.shopInfo, ...payload };
    state.shopInfo = shopInfo;
  },
  [types.SWITCH_REPORT_TOKEN] (state, payload) {
    const { token, shopKind, isStg, account } = payload.result;
    const { report } = state;
    state.report = { ...report, reportToken: token, shopKind, isStg, account };
  }
};

export default {
  state,
  actions,
  mutations
};
