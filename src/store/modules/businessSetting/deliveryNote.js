import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteDeliveryNote,
  fetchAllDeliveryNote,
  fetchDeliveryNoteDetail,
  saveDeliveryNote,
  updateDeliveryNote
} from 'api/businessSetting';

import { handleError } from '../../common';

// initial state
export const state = {
  deliveryNote: {
    list: [],
    detail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllDeliveryNote: async ({ commit }, params) => {
    const result = await fetchAllDeliveryNote(params);
    commit(types.FETCH_ALL_DELIVERY_NOTE, result);
  },
  fetchDeliveryNoteDetail: async ({ commit }, id) => {
    const detail = await fetchDeliveryNoteDetail(id);
    commit(types.FETCH_DELIVERY_NOTE_DETAIL, detail);
  },
  saveDeliveryNote: async ({ commit }, params) => {
    const result = await saveDeliveryNote(params);
    handleError(commit, types.SAVE_DELIVERY_NOTE, params, result.err);
  },
  updateDeliveryNote: async ({ commit }, params) => {
    const result = await updateDeliveryNote(params);
    handleError(commit, types.UPDATE_DELIVERY_NOTE, params, result.err);
  },
  deleteDeliveryNote: async ({ commit }, id) => {
    await deleteDeliveryNote(id);
    commit(types.DELETE_DELIVERY_NOTE_BY_ID, id);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_DELIVERY_NOTE]: (state, result) => {
    const { deliveryNote } = state;
    const { list, recordCount, pageIndex } = result;
    state.deliveryNote = { ...deliveryNote, list, recordCount, pageIndex };
  },
  [types.SAVE_DELIVERY_NOTE]: (state, params) => {
    const { list } = state.deliveryNote;
    state.deliveryNote.list = [...list, params];
  },
  [types.UPDATE_DELIVERY_NOTE]: (state, params) => {
    const newList = state.deliveryNote.list.map(item => {
      if (item.id === params.id) {
        return params;
      }
      return item;
    });

    state.deliveryNote.list = newList;
  },
  [types.DELETE_DELIVERY_NOTE_BY_ID]: (state, id) => {
    const newList = state.deliveryNote.list.filter(item => item.id !== id);
    state.deliveryNote.list = newList;
    state.deliveryNote.recordCount--;
  },
  [types.FETCH_DELIVERY_NOTE_DETAIL]: (state, detail) => {
    state.deliveryNote.detail = detail;
  }
};
