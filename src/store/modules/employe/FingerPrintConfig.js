import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchFingerConfigList,
  getManagersFingerList,
  getShopSuperFingerList,
  saveFingerConfig
} from 'api/employe';

// initial state
export const state = {
  fingerPrintConfig: {
    datas: [],
    superFingerList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchFingerConfigList: async ({ commit }) => {
    const result = await fetchFingerConfigList();
    commit(types.FETCH_FINGER_PRINT_LIST, result);
  },
  saveFingerConfig: async ({ commit }, params) => {
    await saveFingerConfig(params);
    commit(types.FETCH_FINGER_PRINT_LIST, params);
  },
  getManagersFingerList: async ({ commit }, params) => {
    const result = await getManagersFingerList(params);
    commit(types.GET_MANAGERS_FINGER_LIST, result);
  },
  getShopSuperFingerList: async ({ commit }, params) => {
    const result = await getShopSuperFingerList(params);
    commit(types.GET_SHOP_SUPER_FINGER_LIST, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_FINGER_PRINT_LIST]: (state, result) => {
    const { fingerPrintConfig } = state;
    const { menuList, cashList, billList, vipList, sysList, reportList } = result;
    state.fingerPrintConfig.datas = [
      { name: '点菜', children: menuList, key: 'menuList' },
      { name: '收银', children: cashList, key: 'cashList' },
      { name: '账单', children: billList, key: 'billList' },
      { name: '会员', children: vipList, key: 'vipList' },
      { name: '系统设置', children: sysList, key: 'sysList' },
      { name: '小票报表', children: reportList, key: 'reportList' }
    ];
    state.fingerPrintConfig = { ...fingerPrintConfig, datas: state.fingerPrintConfig.datas };
  },
  [types.GET_MANAGERS_FINGER_LIST]: (state, result) => {
    const { fingerPrintConfig } = state;
    const { superUserPageDtos, recordCount, pageIndex, pageSize } = result;
    state.fingerPrintConfig = { ...fingerPrintConfig, superFingerList: superUserPageDtos, recordCount, pageIndex, pageSize };
  },
  [types.GET_SHOP_SUPER_FINGER_LIST]: (state, result) => {
    const { fingerPrintConfig } = state;
    const { superUserPageDtos, recordCount, pageIndex, pageSize } = result;
    state.fingerPrintConfig = { ...fingerPrintConfig, superFingerList: superUserPageDtos, recordCount, pageIndex, pageSize };
  }
};
