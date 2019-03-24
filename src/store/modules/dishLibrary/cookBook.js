import * as API from 'api/dishLibrary';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  cookBook: {
    cookBookList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    cookBookItem: {},
    linkedMenuList: [],
    menuList: [],
    cookVisible: false,          // 决定CookBook组件展示状态
    treeData: []
  }
};

// actions
export const actions = {
  fetchCookBookList: async ({ commit }, params) => {
    const result = await API.fetchCookBookList(params);
    commit(types.FETCH_COOK_BOOK_LIST, result);
  },
  fetchCookBookItem: async ({ commit }, params) => {
    const result = await API.fetchCookBookItem(params);
    commit(types.FETCH_COOK_BOOK_ITEM, result);
  },
  saveCookBookItem: async ({ commit }, params) => {
    await API.saveCookBookItem(params);
  },
  deleteCookBookItem: async ({ commit }, params) => {
    await API.deleteCookBookItem(params);
  },
  copyCookBookItem: async ({ commit }, params) => {
    await API.copyCookBookItem(params);
  },
  fetchCompanyMenuList: async ({ commit }, params) => {
    const result = await API.fetchCompanyMenuList(params);
    commit(types.FETCH_COMPANY_MENU_LIST, result);
  },
  fetchCompanyLinkedMenuList: async ({ commit }, params) => {
    const result = await API.fetchCompanyLinkedMenuList(params);
    commit(types.FETCH_COMPANY_LINKED_MENU_LIST, result);
  },
  // 获取点击门店数量后的树组建的数据
  fetchCompanyDetails: async ({ commit }, params) => {
    const result = await API.fetchCompanyDetails(params);
    commit(types.FETCH_COMPANY_DETAILS, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_COOK_BOOK_LIST]: (state, result) => {
    const { cookBook } = state;
    const { dtoList, pageSize, pageIndex, recordCount } = result;
    state.cookBook = { ...cookBook, cookBookList: dtoList, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_COOK_BOOK_ITEM]: (state, result) => {
    const { info, cookbookmenuDtos } = result;
    state.cookBook.cookBookItem = info || {};
    state.cookBook.linkedMenus = cookbookmenuDtos || [];
  },
  [types.FETCH_COMPANY_MENU_LIST]: (state, result) => {
    state.cookBook.menuList = result.tbMenuItemAskGpViewModelDtos || [];
  },
  [types.FETCH_COMPANY_LINKED_MENU_LIST]: (state, result) => {
    state.cookBook.linkedMenuList = result.menulist || [];
  },
  [types.CHANGE_COOK_VISIBLE]: (state) => {
    state.cookBook.cookVisible = !state.cookBook.cookVisible;
  },
  [types.FETCH_COMPANY_DETAILS]: (state, result) => {
    state.cookBook.treeData = result.data.children;
  }
};
