import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteBillNote,
  fetchAllBillNote,
  fetchBillNoteDetail,
  saveBillNote,
  updateBillNote
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  billNote: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllBillNote: async ({ commit }, params) => {
    const result = await fetchAllBillNote(params);
    commit(types.FETCH_ALL_BILL_NOTE, result);
  },
  fetchBillNoteDetail: async ({ commit }, id) => {
    const detail = await fetchBillNoteDetail(id);
    commit(types.FETCH_BILL_NOTE_DETAIL, detail);
  },
  saveBillNote: async ({ commit }, params) => {
    const result = await saveBillNote(params);
    handleError(commit, types.SAVE_BILL_NOTE, params, result.err);
  },
  updateBillNote: async ({ commit }, params) => {
    const result = await updateBillNote(params);
    handleError(commit, types.UPDATE_BILL_NOTE, params, result.err);
  },
  deleteBillNote: async ({ commit }, id) => {
    await deleteBillNote(id);
    commit(types.DELETE_BILL_NOTE_BY_ID, id);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_BILL_NOTE]: (state, result) => {
    const { billNote } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.billNote = { ...billNote, list, recordCount, pageIndex, pageSize };
  },
  [types.SAVE_BILL_NOTE]: (state, params) => {
    const { list } = state.billNote;
    state.billNote.list = [...list, params];
  },
  [types.UPDATE_BILL_NOTE]: (state, params) => {
    const newList = state.billNote.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.billNote.list = newList;
  },
  [types.DELETE_BILL_NOTE_BY_ID]: (state, id) => {
    const newList = state.billNote.list.filter(item => item.id !== id);
    state.billNote.list = newList;
    state.billNote.recordCount--;
  },
  [types.FETCH_BILL_NOTE_DETAIL]: (state, detail) => {
    state.billNote.detail = detail;
  }
};
