import * as API from 'api/bill';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchBillUploadedRecordList,
  fetchBillStatisticsTypeList,
  fetchBillStatisticsIncome,
} from 'api/bill';

// initial state
export const state = {
  billUploadLog: {
    billUploadLogList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    billTotal: 0.00,
    realTotal: 0.00,
    billStatisticsTypeList:[],  //统计方式列表
  }
};

// actions
export const actions = {
  fetchBillUploadLogList: async ({ commit }, params) => {
    //const result = await API.fetchBillUploadLogList(params);
    const result = await fetchBillUploadedRecordList(params);
    commit(types.API_FETCH_BILL_UPLOAD_LOG_LIST, result);
  },
  fetchBillStatisticsTypeList: async ({ commit }, params) => {
    const result = await fetchBillStatisticsTypeList(params);
    commit(types.API_FETCH_BILL_STATISTICS_TYPE_LIST, result);
  },
  fetchBillStatisticsIncome: async ({ commit }, params) => {
    const result = await fetchBillStatisticsIncome(params);
    commit(types.API_FETCH_BILL_STATISTICS_INCOME, result);
  }
};

// mutations
export const mutations = {
  [types.API_FETCH_BILL_UPLOAD_LOG_LIST]: (state, result) => {
    const { billUploadLog } = state;
    const { recordCount, pageIndex, pageSize,list } = result;
    console.log(result)
    state.billUploadLog = {
      ...billUploadLog,
      billUploadLogList: list,
      // billTotal: saleAmtTotal || 0.00,
      // realTotal: realAmtTotal || 0.00,
      recordCount,
      pageIndex,
      pageSize
    };
  },
  [types.API_FETCH_BILL_STATISTICS_TYPE_LIST]: (state, result) => {
    const { billUploadLog } = state;
    const { billAccountType  } = result;
    //console.log(result)
    state.billUploadLog = {
      ...billUploadLog,
      billStatisticsTypeList: billAccountType,
    };
  },
  [types.API_FETCH_BILL_STATISTICS_INCOME]: (state, result) => {
    const { billUploadLog } = state;
    var { countBillAmount  } = result;
    countBillAmount = countBillAmount || {originalAmtSum: '0.00',realAmtSum:'0.00'}

    state.billUploadLog = {
      ...billUploadLog,
      billTotal: countBillAmount.originalAmtSum || 0.00,
      realTotal: countBillAmount.realAmtSum || 0.00,
    };
  }
};
