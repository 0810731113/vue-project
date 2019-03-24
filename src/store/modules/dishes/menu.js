import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  batchMoveMenus,
  deleteMenuByIds,
  deleteMenuUnit,
  exportMenuList,
  fetchAllMenu,
  fetchMenuClassList,
  fetchMenuDetail,
  fetchMenuPrintList,
  fetchMenuSettingList,
  fetchSortMenuList,
  getMenuHelpCode,
  saveMenuItem,
  updateMenuItem,
  updateMenuSettingByIds,
  updateMenuSortList,
  uploadMenuToCloud,
  getMenuUploadResult,
  fetchAllExpcls,
  fetchAllRevenueType,

} from 'api/dishes';

import { handleError } from '@/store/common';

// initial state
export const state = {
  menu: {
    list: [],
    settingList: [],
    sortList: [],
    classList: [],
    printList: [],
    menuUnit: {},
    detail: {},
    downloadFile: null,
    helpCode: '',
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: 0,
    uploadResult: '',
    expclsList: [], //批量销售归属
    revenueTypeList: [],  //批量收入归属
  }
};

// actions
export const actions = {
  fetchAllMenu: async ({ commit }, params) => {
    const result = await fetchAllMenu(params);
    commit(types.FETCH_ALL_MENU, result);
  },
  updateMenuSettingByIds: async ({ commit }, params) => {
    await updateMenuSettingByIds(params);
  },
  deleteMenuByIds: async ({ commit }, params) => {
    await deleteMenuByIds(params);
  },
  fetchMenuSettingList: async ({ commit },params) => {
    const result = await fetchMenuSettingList(params);
    console.log(result)
    var list = result.list
    var maxMergeDish = [] //云溪最大并菜数选项
    var retireDishExpireDate = [  ////退菜有效期选项
      {text: "1", value: "1"},
      {text: "5", value: "5"},
      {text: "10", value: "10"},
      {text: "15", value: "15"},
      {text: "20", value: "20"},
      // {text: "25", value: "25"},
    ]
    for(var i = 0 ; i < 5; i++){
      var item = {
        text: i+1 + "",
        value: i+1 + ""
      }
      maxMergeDish.push(item)
    }

    for(var i = 0 ; i < list.length; i++){
      var selectId = list[i].value
      if(selectId == 'fiMaxTogetherMenu'){
        list[i].items = maxMergeDish
      }
      if(selectId == "fiRetireMenuTime"){
        list[i].items = retireDishExpireDate
      }
    }

    commit(types.FETCH_MENU_SETTING_LIST, result);
  },
  fetchSortMenuList: async ({ commit }, params) => {
    const result = await fetchSortMenuList(params);
    commit(types.FETCH_MENU_SORT_LIST, result);
  },
  updateMenuSortList: async ({ commit }, params) => {
    await updateMenuSortList(params);
    commit(types.UPDATE_MENU_SORT_LIST, params);
  },
  fetchMenuClassList: async ({ commit }, params) => {
    const result = await fetchMenuClassList(params);
    commit(types.FETCH_MENU_CLASS_LIST, result);
  },
  exportMenuList: async ({ commit }) => {
    const result = await exportMenuList();
    commit(types.DOWNLOAD_MENU_FILE, result);
  },
  saveMenuItem: async ({ commit }, params) => {
    const result = await saveMenuItem(params);
    commit(types.MENU_SAVE, result);
    handleError(commit, types.SAVE_MENU_SUCCESS, params, result.err);
  },
  getMenuHelpCode: async ({ commit }, params) => {
    const result = await getMenuHelpCode(params);
    commit(types.FETCH_MENU_HELP_CODE, result);
  },
  getMenuLastId: async ({ commit }) => {
    const result = await fetchMenuDetail();
    commit(types.FETCH_MENU_MAX_ID, result);
  },
  getPrintList: async ({ commit }) => {
    const result = await fetchMenuPrintList();
    commit(types.FETCH_MENU_PRINT_LIST, result);
  },
  uploadMenuToCloud: async ({ commit }, params) => {
    return await uploadMenuToCloud(params);
  },
  getMenuUploadResult: async ({ commit }) => {
    return await getMenuUploadResult();
  },
  batchMoveMenus: async ({ commit }, params) => {
    await batchMoveMenus(params);
  },
  getMenuDetail: async ({ commit }, params) => {
    const result = await fetchMenuDetail(params);
    commit(types.FETCH_MENU_DETAIL, result);
  },
  updateMenuItem: async ({ commit }, params) => {
    const result = await updateMenuItem(params);
    commit(types.MENU_EDIT, result);
  },
  deleteMenuUnit: async ({ commit }, params) => {
    const result = await deleteMenuUnit(params);
    commit(types.DELETE_MENU_UNIT, result);
  },
  fetchAllExpclsBatch: async ({ commit }) => {
    const result = await fetchAllExpcls();
    commit(types.FETCH_EXPCLS_LIST_BATCH, result);
  },
  fetchAllRevenueTypeBatch: async ({ commit }) => {
    const result = await fetchAllRevenueType();
    commit(types.FETCH_REVENUE_TYPE_LIST_BATCH, result);
  },
};

// mutations
export const mutations = {
  [types.FETCH_ALL_MENU]: (state, result) => {
    const { menu } = state;
    const { dtoList, recordCount, pageIndex, pageSize } = result;
    state.menu = { ...menu, list: dtoList, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_MENU_SUCCESS]: (state, result) => {
    const { menu } = state;
    state.menu = { ...menu };
  },
  [types.FETCH_MENU_SETTING_LIST]: (state, result) => {
    state.menu.settingList = result.list || [];
  },
  [types.FETCH_MENU_SORT_LIST]: (state, result) => {
    state.menu.sortList = result.dtos || [];
  },
  [types.UPDATE_MENU_SORT_LIST]: (state, params) => {
    state.menu.sortList = params.dtos || [];
  },
  [types.FETCH_MENU_CLASS_LIST]: (state, params) => {
    if (!params) return;
    const { children } = params.menuClsViewDto;
    state.menu.classList = children || [];
  },
  [types.DOWNLOAD_MENU_FILE]: (state, result) => {
    state.menu.downloadFile = result;
  },
  [types.FETCH_MENU_HELP_CODE]: (state, result) => {
    state.menu.helpCode = result.pinyin;
  },
  [types.FETCH_MENU_MAX_ID]: (state, result) => {
    state.menu.lastId = result.menuItemViewDto ? result.menuItemViewDto.itemId : null;
    state.menu.detail = result.menuItemViewDto || {};
  },
  [types.FETCH_MENU_PRINT_LIST]: (state, result) => {
    state.menu.printList = result.deptList || [];
  },
  [types.FETCH_MENU_DETAIL]: (state, result) => {
    state.menu.detail = result.menuItemViewDto || {};
  },
  [types.DELETE_MENU_UNIT]: (state, result) => {
    const { message, msgType } = result;
    state.menu.menuUnit = { message, msgType };
  },
  [types.FETCH_EXPCLS_LIST_BATCH]: (state, result) => {
    state.menu.expclsList = result.data || [];
  },
  [types.FETCH_REVENUE_TYPE_LIST_BATCH]: (state, result) => {
    state.menu.revenueTypeList = result.data || [];
  },
  [types.MENU_EDIT] : (state,result) =>{
    state.menu.editResult = result;
  },
  [types.MENU_SAVE] : (state,result) =>{
    state.menu.editResult = result;
  }
};
