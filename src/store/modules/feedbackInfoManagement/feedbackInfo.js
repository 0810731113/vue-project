import * as API from 'api/feedbackInfoManagement';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  feedbackInfo: {
    feedbackInfoList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    feedbackInfoItem: {}
  }
};

// actions
export const actions = {
  fetchFeedbackInfoList: async ({ commit }, params) => {
    const result = await API.fetchFeedbackInfoList(params);
    commit(types.FETCH_FEEDBACK_INFO_LIST, result);
  },
  fetchFeedbackInfoItem: async ({ commit }, params) => {
    const result = await API.fetchFeedbackInfoItem(params);
    commit(types.FETCH_FEEDBACK_INFO_ITEM, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_FEEDBACK_INFO_LIST]: (state, result) => {
    const { feedbackInfo } = state;
    const { feedbackPageDtos, pageSize, pageIndex, recordCount } = result;
    state.feedbackInfo = {
      ...feedbackInfo,
      feedbackInfoList: feedbackPageDtos,
      pageSize,
      pageIndex,
      recordCount
    };
  },
  [types.FETCH_FEEDBACK_INFO_ITEM]: (state, result) => {
    state.feedbackInfo.feedbackInfoItem = result.itemDto;
  }
};
