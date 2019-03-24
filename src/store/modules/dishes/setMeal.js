import * as types from './mutationTypes';

import {
  addSetSideDtl,
  batchMoveSetMeal,
  batchSetMealSetting,
  deleteSetMeals,
  deleteSetSideDtl,
  fetchAllSetMeal,
  fetchGarnishList,
  fetchMenuClassList,
  fetchSelectedGarnishList,
  fetchSetSideDtlDetail,
  fetchSetSideDtlList,
  fetchSetSideDtlTree,
  getSetMealDetail,
  saveGarnishMenus,
  fetchSetMealBillSplitDetail,
  saveSetMealBillSplitDetail,
  fetchSetMealPrinterList,
  fetchSetMealMenuClsList,
  updateSetMeal,
  saveSetMeal,
  fetchCopySetSideItem
} from 'api/dishes';

// initial state
export const state = {
  setMeal: {
    list: [],
    trees: [],
    detail: {},
    setSideDtlTree: [],
    setSideDtlList: [],
    setSideDtlDetail: {},
    garnishList: [],
    linkedGarnishs: [],
    billSplitDetail: {},
    printerList: [],
    menuClsList: []
  }
};

// actions
export const actions = {
  fetchAllSetMeal: async ({ commit }, params = {}) => {
    const result = await fetchAllSetMeal(params);
    commit(types.FETCH_ALL_SET_MEALS, result);
  },
  fetchSetMealTrees: async ({ commit }, params = {}) => {
    const result = await fetchMenuClassList(params);
    commit(types.FETCH_ALL_SET_MEAL_TREE, result);
  },
  deleteSetMeals: async ({ commit }, params) => {
    await deleteSetMeals(params);
    commit(types.DELETE_SET_MEALS_SUCCESS, params);
  },
  batchSetMealSetting: async ({ commit }, params) => {
    await batchSetMealSetting(params);
  },
  batchMoveSetMeal: async ({ commit }, params) => {
    await batchMoveSetMeal(params);
  },
  getSetMealDetail: async ({ commit }, params) => {
    const result = await getSetMealDetail(params);
    commit(types.FETCH_SET_MEAL_DETAIL, result);
  },
  saveSetMeal: async ({ commit }, params) => {
    await saveSetMeal(params);
  },
  updateSetMeal: async ({ commit }, params) => {
    await updateSetMeal(params);
  },
  fetchSetSideDtlTree: async ({ commit }, params = {}) => {
    const result = await fetchSetSideDtlTree(params);
    commit(types.FETCH_SET_SIDE_DTL_TREE, result);
  },
  fetchSetSideDtlList: async ({ commit }, params = {}) => {
    const result = await fetchSetSideDtlList(params);
    commit(types.FETCH_SET_SIDE_DTL_LIST, result);
  },
  clearSetSideDtlList: async ({ commit }) => {
    commit(types.CLEAR_SET_SIDE_DTL_LIST);
  },
  deleteSetSideDtl: async ({ commit }, params = {}) => {
    await deleteSetSideDtl(params);
  },
  addSetSideDtl: async ({ commit }, params = {}) => {
    await addSetSideDtl(params);
  },
  fetchSetSideDtlDetail: async ({ commit }, params = {}) => {
    const result = await fetchSetSideDtlDetail(params);
    commit(types.FETCH_SET_SIDE_DTL_DETAIL, result);
  },
  fetchGarnishList: async ({ commit }, params = {}) => {
    const result = await fetchGarnishList(params);
    commit(types.FETCH_GARNISH_LIST, result);
  },
  fetchSelectedGarnishList: async ({ commit }, params = {}) => {
    const result = await fetchSelectedGarnishList(params);
    commit(types.FETCH_SELECTED_GARNISH_LIST, result);
  },
  saveGarnishMenus: async ({ commit }, params = {}) => {
    await saveGarnishMenus(params);
  },
  fetchSetMealBillSplitDetail: async ({ commit }, params = {}) => {
    const result = await fetchSetMealBillSplitDetail(params);
    commit(types.FETCH_SET_MEAL_BILL_SPLIT_DETAIL, result);
  },
  saveSetMealBillSplitDetail: async ({ commit }, params = {}) => {
    await saveSetMealBillSplitDetail(params);
  },
  fetchSetMealPrinterList: async ({ commit }, params = {}) => {
    const result = await fetchSetMealPrinterList(params);
    commit(types.FETCH_SET_MEAL_PRINTER_LIST, result);
  },
  fetchSetMealMenuClsList: async ({ commit }, params = {}) => {
    const result = await fetchSetMealMenuClsList(params);
    commit(types.FETCH_SET_MEAL_MENUCLS_LIST, result);
  },
  // 复制套餐
  fetchCopySetSideItem: async ({ commit }, params = {}) => {
    await fetchCopySetSideItem(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_SET_MEALS]: (state, result) => {
    state.setMeal = { ...state.setMeal, list: result.menuItemDtos };
  },
  [types.FETCH_ALL_SET_MEAL_TREE]: (state, result) => {
    const trees = [{ menuClsName: '全部分类', children: result.menuClsViewDto.children || [] }];
    state.setMeal = { ...state.setMeal, trees };
  },
  [types.DELETE_SET_MEALS_SUCCESS]: (state, params) => {
    const newList = state.setMeal.list.filter(item => !params.itemCds.includes(item.itemCd));
    state.setMeal.list = newList;
  },
  [types.FETCH_SET_MEAL_DETAIL]: (state, result) => {
    const { info, menuClsDtos, tbmsection, menuItemUintDtos } = result;
    state.setMeal.detail = { info, menuClsDtos, tbmsection, menuItemUintDtos };
  },
  [types.FETCH_SET_SIDE_DTL_TREE]: (state, result) => {
    state.setMeal.setSideDtlTree = result.bootrapTreeNodeDtos || [];
  },
  [types.FETCH_SET_SIDE_DTL_LIST]: (state, result) => {
    state.setMeal.setSideDtlList = result.setSidelist || [];
  },
  [types.CLEAR_SET_SIDE_DTL_LIST]: (state) => {
    state.setMeal.setSideDtlList = [];
  },
  [types.FETCH_SET_SIDE_DTL_DETAIL]: (state, result) => {
    state.setMeal.setSideDtlDetail = result.info || {};
  },
  [types.FETCH_GARNISH_LIST]: (state, result) => {
    state.setMeal.garnishList = result.tbMenuItemAskGpViewModelDtos || [];
  },
  [types.FETCH_SELECTED_GARNISH_LIST]: (state, result) => {
    state.setMeal.linkedGarnishs = result.setSideDtlDataModelDtos || [];
  },
  [types.FETCH_SET_MEAL_BILL_SPLIT_DETAIL]: (state, result) => {
    const { ledgerMode, status, menuSalePrice, itemLedgerDtos, isStatus } = result;
    state.setMeal.billSplitDetail = { ledgerMode, status, menuSalePrice, isStatus, itemLedgerDtos: itemLedgerDtos || [] };
  },
  [types.FETCH_SET_MEAL_PRINTER_LIST]: (state, result) => {
    state.setMeal.printerList = result.deptList || [];
  },
  [types.FETCH_SET_MEAL_MENUCLS_LIST]: (state, result) => {
    state.setMeal.menuClsList = result.itemDtos || [];
  }
};
