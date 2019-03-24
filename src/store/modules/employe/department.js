import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteShopDept,
  fetchShopDeptList,
  getShopDeptDetail,
  updateShopDeptInfo
} from 'api/employe';

// initial state
export const state = {
  department: {
    deparmentList: [],
    shopDeptDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchShopDeptList: async ({ commit }, params) => {
    const result = await fetchShopDeptList(params);
    commit(types.FETCH_SHOP_DEPARTMENT_LIST, result);
  },
  getShopDeptDetail: async ({ commit }, params) => {
    const result = await getShopDeptDetail(params);
    commit(types.GET_SHOP_DEPT_DETAIL, result);
  },
  updateShopDeptInfo: async ({ commit }, params) => {
    await updateShopDeptInfo(params);
  },
  deleteShopDept: async ({ commit }, params) => {
    await deleteShopDept(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SHOP_DEPARTMENT_LIST]: (state, result) => {
    const { department } = state;
    const { shopDeptPageDtos, recordCount, pageIndex, pageSize } = result;
    state.department = { ...department, deparmentList: shopDeptPageDtos, recordCount, pageIndex, pageSize };
  },
  [types.GET_SHOP_DEPT_DETAIL]: (state, result) => {
    const { department } = state;
    const { shopDeptItemDto } = result;
    state.department = { ...department, shopDeptDetail: shopDeptItemDto };
  }
};
