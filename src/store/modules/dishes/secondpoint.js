import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchAllClassify,
  fetchSecondpointList,
  fetchDishRequireGroup,
  fetchDishRequireBatchDetail,
  fetchDishRequireSingleDetail,
} from 'api/dishes';

import { handleError } from '@/store/common';

// initial state
export const state = {
  secondpoint: {
    list: [],
    // classList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    // selectedIds:[], //选择的表格行
    recordCount: 0,
    allClassify: [],
    dishRequireGroup:[], //菜品要求批量
    dishRequireBatch:{}, //菜品要求批量
    dishRequireSingle:{}, //菜品要求单个
  }
};

// actions
export const actions = {
  fetchAllClassifySP: async ({ commit }, params = {}) => {
    const result = await fetchAllClassify(params);
    //console.log(result)
    commit(types.FETCH_DISH_CLASSIFY_LIST_SP, result);
  },
  fetchSecondpointList: async ({ commit }, params = {}) => {
    const result = await fetchSecondpointList(params);
    //console.log(result)
    commit(types.FETCH_SECOND_POINT_LIST, result);
  },
  fetchDishRequireGroupListSP: async ({commit},params = {}) => {
    const result = await fetchDishRequireGroup(params)
    console.log(result)
    commit(types.FETCH_DISH_REQUIRE_GRP_LIST_SP, result);
  },
  fetchSingleDishRequireSP: async({commit}, params = {}) => {
    const result = await fetchDishRequireSingleDetail(params)
    console.log(result)

    commit(types.FETCH_DISH_REQUIRE_SINGLE_LIST_SP, result);
  },
  fetchBatchDishRequireSP: async({commit}, params = {}) => {
    const result = await fetchDishRequireBatchDetail(params)
    console.log(result)
    commit(types.FETCH_DISH_REQUIRE_BATCH_LIST_SP, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_DISH_CLASSIFY_LIST_SP]: (state, result) => {
    const { foodCategories, menuClsViewDto } = result;
    if (!foodCategories && !menuClsViewDto) return;
    state.secondpoint = { ...state.secondpoint, allClassify: foodCategories || menuClsViewDto.children };
  },
  [types.FETCH_SECOND_POINT_LIST]: (state, result) => {
    if (!result.menuAskGpList) return;
    const { secondpoint } = state;
    const { menuAskGpList, pageIndex, recordCount } = result;
    //console.log(menuAskGpList)
    state.secondpoint = { ...secondpoint, list: menuAskGpList, pageIndex, recordCount };
  },
  [types.FETCH_DISH_REQUIRE_GRP_LIST_SP]: (state, result) => {
    if (!result.askGpList) return;
    const { secondpoint } = state;
    const { askGpList } = result;
    //console.log(menuAskGpList)
    state.secondpoint = { ...secondpoint, dishRequireGroup: askGpList,};
  },
  [types.FETCH_DISH_REQUIRE_SINGLE_LIST_SP]: (state, result) => {
    if (!result.menuAskGpList) return;
    const { secondpoint } = state;

    //console.log(menuAskGpList)
    state.secondpoint = { ...secondpoint, dishRequireSingle: {} };
  },
  [types.FETCH_DISH_REQUIRE_BATCH_LIST_SP]: (state, result) => {
    if (!result.dishRequireBatch) return;
    const { secondpoint } = state;
    //console.log(menuAskGpList)
    state.secondpoint = { ...secondpoint, dishRequireBatch: {} };
  },


};
