import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteNoticesById,
  fetchNoticesList,
  getNoticesDetail,
  insertNoticesEntity
} from 'api/companyAnnouncement';

// initial state
export const state = {
  notices: {
    noticesList: [],
    noticesDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchNoticesList: async ({ commit }, params) => {
    const result = await fetchNoticesList(params);
    commit(types.FETCH_NOTICES_LIST, result);
  },
  getNoticesDetail: async ({ commit }, id) => {
    const detail = await getNoticesDetail(id);
    commit(types.GET_NOTICES_DETAIL, detail);
  },
  deleteNoticesById: async ({ commit }, id) => {
    await deleteNoticesById(id);
    commit(types.DELETE_NOTICES_BY_ID, id);
  },
  insertNoticesEntity: async ({ commit }, params) => {
    await insertNoticesEntity(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_NOTICES_LIST]: (state, result) => {
    const { notices } = state;
    const { rows, recordCount, pageIndex } = result.data;
    state.notices = { ...notices, noticesList: rows, recordCount, pageIndex };
  },
  [types.GET_NOTICES_DETAIL]: (state, detail) => {
    state.notices.noticesDetail = detail.data;
  },
  [types.DELETE_NOTICES_BY_ID]: (state, id) => {
    const newList = state.notices.noticesList.filter(item => item.Id !== id);
    state.notices.noticesList = newList;
    state.notices.recordCount--;
  }
};
