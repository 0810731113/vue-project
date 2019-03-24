import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteExplain,
  deleteExplainContent,
  fetchAllExplain,
  fetchAllMenuItems,
  fetchExplainContentList,
  fetchExplainDetail,
  fetchExplainMenuCls,
  fetchLinkedMenuItems,
  getExplainNewId,
  saveExplain,
  saveExplainContent,
  saveExplainMenu,
  saveExplainMenuCls,
  updateExplain,
  updateExplainContent
} from 'api/dishes';

// initial state
export const state = {
  explain: {
    list: [],
    detail: {},
    contentList: [],
    menuList: [],
    linkedMenuList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: '',
    menuClsList: []
  }
};

// actions
export const actions = {
  fetchAllExplain: async ({ commit }, params) => {
    const result = await fetchAllExplain(params);
    commit(types.FETCH_ALL_EXPLAIN, result);
  },
  saveExplain: async ({ commit }, params) => {
    const result = await saveExplain(params);
    commit(types.SAVE_EXPLAIN_SUCCESS, result);
  },
  updateExplain: async ({ commit }, params) => {
    const result = await updateExplain(params);
    commit(types.UPDATE_EXPLAIN_SUCCESS, result);
  },
  deleteExplain: async ({ commit }, params) => {
    await deleteExplain(params);
    commit(types.DELETE_EXPLAIN_BY_IDS, params);
  },
  getExplainNewId: async ({ commit }) => {
    const lastId = await getExplainNewId();
    commit(types.GET_EXPLAIN_LAST_ID, lastId);
  },
  fetchExplainDetail: async ({ commit }, params) => {
    const detail = await fetchExplainDetail(params);
    commit(types.FETCH_EXPLAIN_DETAIL, detail);
  },
  fetchExplainContentList: async ({ commit }, params) => {
    const lists = await fetchExplainContentList(params);
    commit(types.FETCH_EXPLAIN_CONTENTS, lists);
  },
  saveExplainContent: async ({ commit }, params) => {
    const result = await saveExplainContent(params);
    commit(types.SAVE_EXPLAIN_CONTENT, result);
  },
  updateExplainContent: async ({ commit }, params) => {
    await updateExplainContent(params);
    commit(types.UPDATE_EXPLAIN_CONTENT, params);
  },
  deleteExplainContent: async ({ commit }, params) => {
    await deleteExplainContent(params);
    commit(types.DELETE_EXPLAIN_CONTENT, params);
  },
  fetchAllMenuItems: async ({ commit }, params) => {
    const result = await fetchAllMenuItems(params);
    commit(types.FETCH_ALL_MENUS, result);
  },
  fetchLinkedMenuItems: async ({ commit }, params) => {
    const result = await fetchLinkedMenuItems(params);
    commit(types.FETCH_LINKED_MENUS, result);
  },
  saveExplainMenu: async ({ commit }, params) => {
    await saveExplainMenu(params);
  },
  saveExplainMenuCls: async ({ commit }, params) => {
    await saveExplainMenuCls(params);
  },
  fetchExplainMenuCls: async ({ commit }, params) => {
    const result = await fetchExplainMenuCls(params);
    commit(types.FETCH_EXPLAIN_MENUCLS, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_EXPLAIN]: (state, result) => {
    const { explain } = state;
    const { datas, dtoList, pageIndex, recordCount } = result;
    state.explain = { ...explain, list: datas || dtoList, pageIndex, recordCount };
  },
  [types.SAVE_EXPLAIN_SUCCESS]: (state, params) => {
    if (!params.success) return;
    const { list } = state.explain;
    state.explain.list = [...list, params];
    state.explain.recordCount++;
  },
  [types.UPDATE_EXPLAIN_SUCCESS]: (state, params) => {
    const newList = state.explain.list.map(item => {
      if (item.askGpId === params.askGpId) {
        return params;
      }
      return item;
    });

    state.explain.list = newList;
  },
  [types.DELETE_EXPLAIN_BY_IDS]: (state, params) => {
    const ids = params.ids || params.askGpIds;
    const newList = state.explain.list.filter(item => !ids.includes(item.askGpId));
    state.explain.list = newList;
    state.explain.recordCount = newList.length;
  },
  [types.GET_EXPLAIN_LAST_ID]: (state, lastId) => {
    state.explain.lastId = lastId;
  },
  [types.FETCH_EXPLAIN_DETAIL]: (state, detail) => {
    state.explain.detail = detail;
  },
  [types.FETCH_EXPLAIN_CONTENTS]: (state, lists) => {
    state.explain.contentList = lists || [];
  },
  [types.SAVE_EXPLAIN_CONTENT]: (state, result) => {
    const { contentList } = state.explain;
    state.explain.contentList = [...contentList, result];
  },
  [types.UPDATE_EXPLAIN_CONTENT]: (state, params) => {
    const newList = state.explain.contentList.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.explain.contentList = newList;
  },
  [types.DELETE_EXPLAIN_CONTENT]: (state, params) => {
    const { id } = params;
    const newList = state.explain.contentList.filter(item => id !== item.id);
    state.explain.contentList = newList;
  },
  [types.FETCH_ALL_MENUS]: (state, result) => {
    const { menuFoods, tbMenuItemAskGpViewModelDtos } = result;
    state.explain.menuList = menuFoods || tbMenuItemAskGpViewModelDtos || [];
  },
  [types.FETCH_LINKED_MENUS]: (state, result) => {
    const { data, tbMenuItemAskGpViewDtos } = result;
    state.explain.linkedMenuList = data || tbMenuItemAskGpViewDtos || [];
  },
  [types.FETCH_EXPLAIN_MENUCLS]: (state, result) => {
    state.explain.menuClsList = result.askGpMenuClsDtos || [];
  }
};
