import * as API from 'api/tool';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  systemReportTemplate: {
    systemReportTemplateList: [],
    recordCount: 0,
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    systemReportTypeList: [],
    systemReportAttributeList: [],
    systemReportTemplateDataSource: [],
    systemReportTemplateItem: {}
  }
};

// actions
export const actions = {
  fetchSystemReportTemplateList: async ({ commit }, params) => {
    const result = await API.fetchSystemReportTemplateList(params);
    commit(types.FETCH_SYSTEM_REPORT_TEMPLATE_LIST, result);
  },
  fetchSystemReportTypeList: async ({ commit }, params) => {
    const result = await API.fetchSystemReportTypeList(params);
    commit(types.FETCH_SYSTEM_REPORT_TYPE_LIST, result);
  },
  fetchSysReportAttributeList: async ({ commit }, params) => {
    const result = await API.fetchSysReportAttributeList(params);
    commit(types.FETCH_SYSTEM_REPORT_ATTRIBUTE_LIST, result);
  },
  fetchSysReportTemplateDataSources: async ({ commit }, params) => {
    const result = await API.fetchSysReportTemplateDataSources(params);
    commit(types.FETCH_SYSTEM_REPORT_TEMPLATE_DATASOURCE, result);
  },
  saveSysReportTemplateItem: async ({ commit }, params) => {
    await API.saveSysReportTemplateItem(params);
  },
  updateSysReportTemplateStatus: async ({ commit }, params) => {
    await API.updateSysReportTemplateStatus(params);
  },
  fetchSysReportTemplateItem: async ({ commit }, params) => {
    const result = await API.fetchSysReportTemplateItem(params);
    commit(types.FETCH_SYSTEM_REPORT_TEMPLATE_ITEM, result);
  },
  updateSysReportTemplateItem: async ({ commit }, params) => {
    const result = await API.updateSysReportTemplateItem(params);
    commit(types.FETCH_SYSTEM_REPORT_TEMPLATE_ITEM, result);
  }
};

// mutations
export const mutations = {
  [types.FETCH_SYSTEM_REPORT_TEMPLATE_LIST]: (state, result) => {
    const { systemReportTemplate } = state;
    const { list, recordCount, pageIndex, pageSize } = result;
    state.systemReportTemplate = { ...systemReportTemplate, systemReportTemplateList: list, recordCount, pageIndex, pageSize };
  },
  [types.FETCH_SYSTEM_REPORT_TYPE_LIST]: (state, result) => {
    state.systemReportTemplate.systemReportTypeList = result.data;
  },
  [types.FETCH_SYSTEM_REPORT_ATTRIBUTE_LIST]: (state, result) => {
    state.systemReportTemplate.systemReportAttributeList = result.list;
  },
  [types.FETCH_SYSTEM_REPORT_TEMPLATE_DATASOURCE]: (state, result) => {
    state.systemReportTemplate.systemReportTemplateDataSource = result.list;
  },
  [types.FETCH_SYSTEM_REPORT_TEMPLATE_ITEM]: (state, result) => {
    state.systemReportTemplate.systemReportTemplateItem = result.sysDetailResponse;
  }
};
