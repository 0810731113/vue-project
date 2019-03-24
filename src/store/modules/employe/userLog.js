import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchUserLogList,
  fetchUserOperationList
} from 'api/employe';

// initial state
export const state = {
  userLog: {
    list: [],
    operateUserlist: [],
    operateTypeList: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchUserLogList: async ({ commit }, params) => {
    const result = await fetchUserLogList(params);
    commit(types.FETCH_ALL_USER_LOG, result);
  },
  fetchUserOperationList: async ({ commit }) => {
    const result = await fetchUserOperationList();
    commit(types.FETCH_ALL_USER_OPERATION, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_USER_LOG]: (state, result) => {
    const { userLog } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.userLog = { ...userLog, list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_ALL_USER_OPERATION]: (state, result) => {
    const { userLog } = state;
    const { operateUserlist, operateTypeList } = result;
    state.userLog = { ...userLog, operateUserlist, operateTypeList };
  }
};
