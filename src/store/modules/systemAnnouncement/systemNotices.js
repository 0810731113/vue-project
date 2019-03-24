import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteSystemNotices,
  fetchSystemNoticesList,
  getSystemNoticesDetail,
  saveSystemNotices
} from 'api/systemAnnouncement';

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
  fetchSystemNoticesList: async ({ commit }, params) => {
    const result = await fetchSystemNoticesList(params);
    commit(types.FETCH_SYSTEM_NOTICES_LIST, result);
  },
  getSystemNoticesDetail: async ({ commit }, id) => {
    const detail = await getSystemNoticesDetail(id);
    commit(types.GET_SYSTEM_NOTICES_DETAIL, detail);
  },
  deleteSystemNotices: async ({ commit }, id) => {
    await deleteSystemNotices(id);
    commit(types.DELETE_SYSTEM_NOTICES, id);
  },
  saveSystemNotices: async ({ commit }, params) => {
    await saveSystemNotices(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SYSTEM_NOTICES_LIST]: (state, result) => {
    const { notices } = state;
    const { itemDto, recordCount, pageIndex } = result;
    state.notices = { ...notices, noticesList: itemDto, recordCount, pageIndex };
  },
  [types.GET_SYSTEM_NOTICES_DETAIL]: (state, detail) => {
    state.notices.noticesDetail = detail.data;
  },
  [types.DELETE_SYSTEM_NOTICES]: (state, id) => {
    const newList = state.notices.noticesList.filter(item => item.id !== id);
    state.notices.noticesList = newList;
    state.notices.recordCount--;
  }
};
