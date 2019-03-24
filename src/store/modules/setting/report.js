import * as API from 'api/setting';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  report: {
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    totalCount: 0,
    reportTemplateId: '',
    reportTemplateList: [],
    reportList: [],
    reportTemplateAttributeList: [],
    reportTemplateDataSources: [],
    reportTemplateItem: {},
    systemTemplateList: [],
    operation: {}
  }
};

// actions
export const actions = {
  fetchReportList: async ({ commit }, params) => {
    const result = await API.fetchReportList(params);
    commit(types.FETCH_REPORT_LIST, result);
  },
  fetchReportTemplateList: async ({ commit }, params) => {
    const result = await API.fetchReportTemplateList(params);
    commit(types.FETCH_REPORT_TEMPLATE_LIST, result);
  },
  updateReportTemplate: async ({ dispatch, state }, params) => {
    const result = await API.updateReportTemplate(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  fetchReportTemplateItem: async ({ commit }, params) => {
    const result = await API.fetchReportTemplateItem(params);
    commit(types.FETCH_REPORT_TEMPLATE_ITEM, result);
  },
  updateReportTemplateItem: async ({ commit }, params) => {
    await API.updateReportTemplateItem(params);
  },
  deleteReportTemplateItem: async ({ dispatch }, params) => {
    await API.deleteReportTemplateItem(params);
    const { reportTempletId, reportId } = params;
    dispatch('fetchReportTemplateList', { reportTempletId, reportId });
  },
  saveReportTemplateItem: async ({ dispatch }, params) => {
    await API.saveReportTemplateItem(params);
  },
  updateReportStatus: async ({ dispatch, state }, params) => {
    const result = await API.updateReportStatus(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  fetchSystemTemplateList: async ({ commit }, params) => {
    const result = await API.fetchSystemTemplateList(params);
    commit(types.FETCH_SYSTEM_TEMPLATE_LIST, result);
  },
  checkAddOrEditSystemTemplate: async ({ commit }, params) => {
    const result = await API.checkAddOrEditSystemTemplate(params);
    commit(types.CHECK_ADD_OR_EDIT_SYSTEMPLATE, result);
  },
  saveSystemTemplateItem: async ({ commit }, params) => {
    await API.saveSystemTemplateItem(params);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    let { pageSize, pageIndex } = state.report;
    await dispatch('fetchReportList', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_REPORT_LIST]: (state, result) => {
    const { report } = state;
    let { pageSize, pageIndex, list, recordCount } = result;
    state.report = { ...report, reportList: list, totalCount: recordCount, pageSize, pageIndex };
  },
  [types.FETCH_REPORT_TEMPLATE_LIST]: (state, result) => {
    state.report.reportTemplateList = result.list;
  },
  [types.FETCH_REPORT_TEMPLATE_ITEM]: (state, result) => {
    state.report.reportTemplateItem = result.responseData;
  },
  [types.FETCH_SYSTEM_TEMPLATE_LIST]: (state, result) => {
    state.report.systemTemplateList = result.syslist;
  },
  [types.CHECK_ADD_OR_EDIT_SYSTEMPLATE]: (state, result) => {
    state.report.operation = result.data;
  }
};
