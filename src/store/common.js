import * as API from 'api/common';
import * as types from './mutationTypes';
import { SUCCESS } from 'constant/statusCode';

// initial state
const state = {
  menuClassifyList: [],
  menuRelation: {
    menuClsList: [],
    menuList: []
  }
};

// actions
const actions = {
  fetchCompanyMenuClassify: async ({ commit }, params) => {
    const result = await API.fetchCompanyMenuClassify(params);
    commit(types.FETCH_COMPANY_MENU_CLASSIFY_LIST, result);
  },
  fetchMenuClassifyList: async ({ commit }, params) => {
    const result = await API.fetchMenuClassifyList(params);
    commit(types.FETCH_MENU_CLASSIFY_LIST, result);
  },
  fetchMenuList: async ({ commit }, params) => {
    const result = await API.fetchMenuList(params);
    commit(types.FETCH_MENU_LIST, result);
  }
};

// mutations
const mutations = {
  [types.FETCH_COMPANY_MENU_CLASSIFY_LIST]: (state, result) => {
    const menuClassifyList = [{ menuClsName: '全部分类', children: result.menuClsViewDto.children || [] }];
    state.menuClassifyList = menuClassifyList;
  },
  [types.FETCH_MENU_CLASSIFY_LIST]: (state, result) => {
    const menuClsList = [{ menuClsName: '全部分类', children: result.menuClsViewDto.children || [] }];
    state.menuRelation.menuClsList = menuClsList;
  },
  [types.FETCH_MENU_LIST]: (state, result) => {
    state.menuRelation.menuList = result.menuFoods || [];
  }
};

export const handleError = (commit, type, params, error) => {
  // TODO handle module error
  if (SUCCESS === error.errNo) {
    commit(type, params);
  }
};

export default {
  state,
  actions,
  mutations
};
