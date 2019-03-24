import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteMenuSellPlan,
  fetchMenuClassList,
  fetchSellPlanList,
  getAllMSection,
  getAllMarea,
  getAllSellDay,
  getSellPlanDetail,
  saveMenuSellPlan
} from 'api/dishes';

// initial state
export const state = {
  sellPlan: {
    tree: [],
    sellPlanList: [],
    allMareaList: [],
    allMSectionList: [],
    sellDayList: [],
    sellPlanDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchSellPlanList: async ({ commit }, params) => {
    const result = await fetchSellPlanList(params);
    commit(types.FETCH_SELL_PLAN_LIST, result);
  },
  saveMenuSellPlan: async ({ commit }, params) => {
    await saveMenuSellPlan(params);
  },
  deleteMenuSellPlan: async ({ commit }, params) => {
    await deleteMenuSellPlan(params);
    commit(types.DELETE_MENU_SELL_PLAN, params);
  },
  getAllMarea: async ({ commit }) => {
    const allMareaList = await getAllMarea();
    commit(types.GET_ALL_MAREA, allMareaList);
  },
  getAllMSection: async ({ commit }) => {
    const allMSectionList = await getAllMSection();
    commit(types.GET_ALL_MSECTION, allMSectionList);
  },
  getAllSellDay: async ({ commit }) => {
    const sellDayList = await getAllSellDay();
    commit(types.GET_SELL_DAY_LIST, sellDayList);
  },
  getSellPlanDetail: async ({ commit }, guid) => {
    const sellPlanDetail = await getSellPlanDetail(guid);
    commit(types.GET_SELL_PLAN_DETAIL, sellPlanDetail);
  },
  fetchSellPlanTrees: async ({ commit }, params) => {
    const result = await fetchMenuClassList(params);
    commit(types.FETCH_CLASS_LIST_TYPE, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SELL_PLAN_LIST]: (state, result) => {
    const { sellPlan } = state;
    const { sellPlans, pageIndex, recordCount } = result;
    state.sellPlan = { ...sellPlan, sellPlanList: sellPlans, pageIndex, recordCount };
  },
  [types.DELETE_MENU_SELL_PLAN]: (state, params) => {
    const newList = state.sellPlan.sellPlanList.filter(item => !params.guids.includes(item.guid));
    state.sellPlan.sellPlanList = newList;
    state.sellPlan.recordCount = newList.length;
  },
  [types.GET_ALL_MAREA]: (state, allMareaList) => {
    state.sellPlan.allMareaList = allMareaList.data;
  },
  [types.GET_ALL_MSECTION]: (state, allMSectionList) => {
    state.sellPlan.allMSectionList = allMSectionList.data;
  },
  [types.GET_SELL_DAY_LIST]: (state, sellDayList) => {
    state.sellPlan.sellDayList = sellDayList.data;
  },
  [types.GET_SELL_PLAN_DETAIL]: (state, sellPlanDetail) => {
    state.sellPlan.sellPlanDetail = sellPlanDetail.data;
  },
  [types.FETCH_CLASS_LIST_TYPE]: (state, result) => {
    const tree = [{ menuClsName: '全部分类', children: result.menuClsViewDto.children || [] }];
    state.sellPlan = { ...state.sellPlan, tree };
  }
};
