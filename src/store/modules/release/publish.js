import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deletePublish,
  fetchPublishDetail,
  fetchPublishList,
  savePublish
} from 'api/release';

// initial state
export const state = {
  publish: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchPublishList: async ({ commit }, params) => {
    const result = await fetchPublishList(params);
    commit(types.FETCH_PUBLISH_LIST, result);
  },
  fetchPublishDetail: async ({ commit }, params) => {
    const result = await fetchPublishDetail(params);
    commit(types.FETCH_PUBLISH_DETAIL, result);
  },
  savePublish: async ({ commit }, params) => {
    await savePublish(params);
  },
  deletePublish: async ({ commit }, params) => {
    await deletePublish(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_PUBLISH_LIST]: (state, result) => {
    const { pageIndex, pageSize, recordCount, list } = result;
    state.publish = { ...state.publish, pageIndex, pageSize, recordCount, list };
  },
  [types.FETCH_PUBLISH_DETAIL]: (state, result) => {
    state.publish.detail = result.itemDto;
  }
};
