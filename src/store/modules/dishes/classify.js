import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteClassify,
  fetchAllClassify,
  fetchAllExpcls,
  fetchAllRevenueType,
  fetchClassifyDetail,
  getClassifyNewId,
  saveClassify,
  saveExpcls,
  saveRevenueType,
  updateClassify,
  updateClassifySort,
  fetchUploadImg
} from 'api/dishes';

import { SUCCESS } from '@/constant/statusCode';
import { handleError } from '../../common';

// initial state
export const state = {
  classify: {
    list: [],                       // 分页列表
    allClassify: [],                // 级联列表
    detail: {},
    expclsList: [],
    revenueTypeList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: '',
    uploadImages: [],

  }
};

// actions
export const actions = {
  fetchAllClassify: async ({ commit }, params = {}) => {
    const result = await fetchAllClassify(params);
    commit(types.FETCH_ALL_CLASSIFY, result);
  },
  fetchClassifyByPage: async ({ commit }, params = {}) => {
    const result = await fetchAllClassify(params);
    commit(types.FETCH_CLASSIFY_BY_PAGE, result);
  },
  saveClassify: async ({ commit }, params) => {
    const result = await saveClassify(params);
    handleError(commit, types.SAVE_CLASSIFY_SUCCESS, params, result.err);
  },
  updateClassify: async ({ commit }, params) => {
    const result = await updateClassify(params);
    commit(types.UPDATE_CLASSIFY_SUCCESS, result);
  },
  deleteClassify: async ({ commit }, menuClsId) => {
    await deleteClassify(menuClsId);
    commit(types.DELETE_CLASSIFY_BY_ID, menuClsId);
  },
  getClassifyNewId: async ({ commit }) => {
    const lastId = await getClassifyNewId();
    commit(types.GET_CLASSIFY_LAST_ID, lastId);
  },
  fetchClassifyDetail: async ({ commit }, menuClsId) => {
    const detail = await fetchClassifyDetail(menuClsId);
    commit(types.FETCH_CLASSIFY_DETAIL, detail);
  },
  updateClassifySort: async ({ commit }, params) => {
    await updateClassifySort(params);
  },
  fetchAllExpcls: async ({ commit }) => {
    const result = await fetchAllExpcls();
    commit(types.FETCH_EXPCLS_LIST, result);
  },
  saveExpcls: async ({ commit }, params) => {
    const result = await saveExpcls(params);
    params = { ...params, ...result };
    commit(types.SAVE_EXPCLS_SUCCESS, params);
  },
  fetchAllRevenueType: async ({ commit }) => {
    const result = await fetchAllRevenueType();
    commit(types.FETCH_REVENUE_TYPE_LIST, result);
  },
  saveRevenueType: async ({ commit }, params) => {
    const result = await saveRevenueType(params);
    params = { ...params, ...result };
    commit(types.SAVE_REVENUE_TYPE_SUCCESS, params);
  },
  // 获取菜品推荐的配图
  fetchUploadImg: async ({ commit }, params) => {
    const result = await fetchUploadImg(params);

    commit(types.FETCH_MENU_PICTURE_LIST, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_CLASSIFY]: (state, result) => {
    const { foodCategories, menuClsViewDto } = result;
    if (!foodCategories && !menuClsViewDto) return;
    state.classify = { ...state.classify, allClassify: foodCategories || menuClsViewDto.children };
  },
  [types.FETCH_CLASSIFY_BY_PAGE]: (state, result) => {
    if (!result.foodCategories) return;
    const { classify } = state;
    const { foodCategories, pageIndex, recordCount } = result;
    state.classify = { ...classify, list: foodCategories, pageIndex, recordCount };
  },
  [types.SAVE_CLASSIFY_SUCCESS]: (state, params) => {
    const { list } = state.classify;
    state.classify.list = [...list, params];
  },
  [types.UPDATE_CLASSIFY_SUCCESS]: (state, params) => {
    const newList = state.classify.list.map(item => {
      if (item.menuClsId === params.menuClsId) {
        return params;
      }
      return item;
    });

    state.classify.list = newList;
  },
  [types.FETCH_CLASSIFY_DETAIL]: (state, detail) => {
    state.classify.detail = detail;
  },
  [types.DELETE_CLASSIFY_BY_ID]: (state, menuClsId) => {
    const newList = state.classify.list.filter(item => item.menuClsId !== menuClsId);
    state.classify.list = newList || [];
  },
  [types.GET_CLASSIFY_LAST_ID]: (state, lastId) => {
    state.classify.lastId = lastId;
  },
  [types.FETCH_EXPCLS_LIST]: (state, result) => {
    state.classify.expclsList = result.data || [];
  },
  [types.SAVE_EXPCLS_SUCCESS]: (state, params) => {
    const { errNo } = params.err;
    if (errNo !== SUCCESS) return;
    const { expclsList } = state.classify;
    state.classify.expclsList = [...expclsList, params];
  },
  [types.FETCH_REVENUE_TYPE_LIST]: (state, result) => {
    state.classify.revenueTypeList = result.data || [];
  },
  [types.SAVE_REVENUE_TYPE_SUCCESS]: (state, params) => {
    const { errNo } = params.err;
    if (errNo !== SUCCESS) return;
    const { revenueTypeList } = state.classify;
    state.classify.revenueTypeList = [...revenueTypeList, params];
  },
  [types.FETCH_MENU_PICTURE_LIST]: (state, result) => {
    state.classify.uploadImages = result.list || [];
  }
};
