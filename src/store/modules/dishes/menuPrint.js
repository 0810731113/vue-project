import * as types from './mutationTypes';
import { ITEMKIND } from 'constant/constants';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
    batchUpdatePrintDept,
    fetchAllMenuPrint,
    fetchPrintPlanList,
    getAllPrintDept,
    getPrintNameList,
    getPrintPlanDetail,
    getSetMealPrintDetail,
    isPrintPlanExist,
    saveMenuPrintPlan,
    updateMenuPrint,
    updateSetMealMenuPrint,
    getListPrintPlanDetail,
    editMenuPrintPlan,
    deletePrintPlan,
    getInitPrintPlanDetail
} from 'api/dishes';

import { handleError } from '../../common';

// initial state
export const state = {
  menuPrint: {
    menuPrintList: [],
    printDeptList: [],
    printPlanList: [],
    printNameList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    isExist: '',
    itemKind: ITEMKIND.DISH,
    printPlanDetail: {
      isMulDept: '',
      isPrn: '',
      deptId: '',
      itemKind: '',
      list: [{
        deptId: '',
        mareaId: ''
      }]
    },
    setMealPrintDetail: {
      isPrn: '',
      itemKind: '',
      deptId: '',
      isSetDtlPrn: ''
    },
    ListPrintPlanDetail: []
  }
};

// actions
export const actions = {
  fetchAllMenuPrint: async ({ commit }, params) => {
    const result = await fetchAllMenuPrint(params);
    commit(types.FETCH_ALL_MENU_PRINT, result);
  },
  getAllPrintDept: async ({ commit }, params) => {
    const result = await getAllPrintDept(params);
    commit(types.GET_ALL_PRINT_DEPT, result);
  },
  batchUpdatePrintDept: async ({ commit }, params) => {
    const result = await batchUpdatePrintDept(params);
    handleError(commit, types.BATCH_UPDATE_PRINT_SUCCESS, params, result.err);
  },
  isPrintPlanExist: async ({ commit }, params) => {
    const result = await isPrintPlanExist(params);
    commit(types.IS_PRINT_PLAN_EXIST, result);
    return result;
  },
  saveMenuPrintPlan: async ({ commit }, params) => {
    await saveMenuPrintPlan(params);
  },
  editMenuPrintPlan: async ({ commit }, params) => {
    await editMenuPrintPlan(params);
  },
  deletePrintPlan: async ({ commit }, params) => {
    return await deletePrintPlan(params);
  },
  fetchPrintPlanList: async ({ commit }, params) => {
    const result = await fetchPrintPlanList(params);
    commit(types.FETCH_PRINT_PLAN_LIST, result);
  },
  getPrintNameList: async ({ commit }) => {
    const result = await getPrintNameList();
    commit(types.GET_PRINT_NAME_LIST, result);
  },
  getPrintPlanDetail: async ({ commit }, params) => {
    const result = await getPrintPlanDetail(params);
    commit(types.GET_PRINT_PLAN_DETAIL, result);
    return result;
  },
  getInitPrintPlanDetail: async ({ commit }, params) => {
    const result = await getInitPrintPlanDetail(params);
    commit(types.GET_INIT_PRINT_PLAN_DETAIL, result);
    return result;
  },
  getSetMealPrintDetail: async ({ commit }, params) => {
    const result = await getSetMealPrintDetail(params);
    commit(types.GET_SET_MEAL_PRINT_DETAIL, result);
  },
  updateMenuPrint: async ({ commit }, params) => {
    const result = await updateMenuPrint(params);
    commit(types.UPDATE_MENU_PRINT_SUCCESS, result);
  },
  updateSetMealMenuPrint: async ({ commit }, params) => {
    const result = await updateSetMealMenuPrint(params);
    commit(types.UPDATE_MENU_PRINT_SUCCESS, result);
  },
  setItemKind: async ({ commit }, params) => {
    commit(types.SET_ITEM_KIND, params);
  },
  getListPrintPlanDetail: async ({ commit }, params) => {
    const result = await getListPrintPlanDetail(params);
    // const result = [
    //   {
    //     printName: '打印方案1',
    //     printId: 123,
    //     detailList: [
    //       {
    //         deptName: '外卖',
    //         deptId: '571',
    //         mareaName: '打印部门1',
    //         mareaId: '3'
    //       },
    //       {
    //         deptName: 'asdf',
    //         deptId: '575',
    //         mareaName: '打印部门3',
    //         mareaId: '11'
    //       }
    //     ]
    //   },
    //   {
    //     printName: '打印方案2',
    //     printId: 124,
    //     detailList: [
    //       {
    //         deptName: '笨蛋',
    //         deptId: '578',
    //         mareaName: '打印部门1',
    //         mareaId: '3'
    //       },
    //       {
    //         deptName: '哈哈哈',
    //         deptId: '579',
    //         mareaName: '打印部门3',
    //         mareaId: '11'
    //       }
    //     ]
    //   }
    // ];
    commit(types.LIST_PRINT_PLAN_DETAIL, result);
  }
};

// mutationss
export const mutations = {
  [types.FETCH_ALL_MENU_PRINT]: (state, result) => {
    const { menuPrint } = state;
    const { rows, pageIndex, recordCount } = result.data || {};
    state.menuPrint = { ...menuPrint, menuPrintList: rows || [], pageIndex, recordCount };
  },
  [types.GET_ALL_PRINT_DEPT]: (state, result) => {
    state.menuPrint.printDeptList = result.data;
  },
  [types.BATCH_UPDATE_PRINT_SUCCESS]: (state, params) => {
    const { deptId, itemCds } = params;
    const newList = state.menuPrint.menuPrintList.map(item => {
      if (itemCds.includes(item.itemCd)) {
        item.deptId = deptId;
      }
      return item;
    });
    state.menuPrint.menuPrintList = newList;
  },
  [types.SAVE_MENU_PRINT_PLAN]: (state, params) => {
    const { printPlanList } = state.menuPrint;
    state.menuPrint.printPlanList = [...printPlanList, params];
  },
  [types.IS_PRINT_PLAN_EXIST]: (state, result) => {
    state.menuPrint.isExist = result.exist;
  },
  [types.FETCH_PRINT_PLAN_LIST]: (state, result) => {
    state.menuPrint.printPlanList = result.list;
  },
  [types.GET_PRINT_NAME_LIST]: (state, result) => {
    state.menuPrint.printNameList = result.list;
  },
  [types.GET_PRINT_PLAN_DETAIL]: (state, result) => {
    state.menuPrint.printPlanDetail = result;
  },
  [types.GET_INIT_PRINT_PLAN_DETAIL]: (state, result) => {
    state.menuPrint.printPlanList = result.list;
  },
  [types.GET_SET_MEAL_PRINT_DETAIL]: (state, result) => {
    state.menuPrint.setMealPrintDetail = result;
  },
  [types.UPDATE_MENU_PRINT_SUCCESS]: (state, params) => {
    const newList = state.menuPrint.menuPrintList.map(item => {
      if (item.itemCd === params.itemCd) {
        return params;
      }
      return item;
    });
    state.menuPrint.menuPrintList = newList;
  },
  [types.SET_ITEM_KIND]: (state, result) => {
    state.menuPrint.itemKind = result.itemKind;
  },
  [types.LIST_PRINT_PLAN_DETAIL]: (state, result) => {
    state.menuPrint.ListPrintPlanDetail = result.list;
  }
};
