import * as API from 'api/reconciliation';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  reconciliationLog: {
    logList: [],
    // headerMap: new Map(),
    headerMap: {},
    headerList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchReconciliationLogList: async ({ commit }, params) => {
    console.log(params)
    const result = await API.fetchReconciliationLogList(params);
    console.log(result)
    commit(types.FETCH_RECONCILIATION_LOG_LIST, result);
  },
  refreshReconciliationLogList: async ({ commit }) => {
    commit(types.REFRESH_RECONCILIATION_LOG_LIST);
  }
};

// mutations
export const mutations = {
  [types.FETCH_RECONCILIATION_LOG_LIST]: (state, result) => {
    const { list, recordCount, pageIndex, pageSize } = result;
    let logList = [];
    var headerMap = {}
    var headerKey = []
    if (list) {
      list.map(item => {
        if (item.paymentList) {
          item.paymentList.map(payment => {
            item[payment.paymentId] = payment.money;
            //state.reconciliationLog.headerMap.set(payment.paymentId, payment.paymentName);
            headerMap[payment.paymentId + ''] = payment.paymentName
            //headerKey.push(payment.paymentId)
          });
        }
        logList.push(item);
      });
    }
    headerMap[0] && delete headerMap[0]
    for(var i in headerMap){
      headerKey.push(i)
    }

    // console.log(headerMap)
    // console.log(headerKey)
    //state.reconciliationLog.headerMap.delete(0);
    //state.reconciliationLog = { ...state.reconciliationLog, logList, headerList: [...state.reconciliationLog.headerMap.keys()], recordCount, pageIndex, pageSize };
    state.reconciliationLog = { ...state.reconciliationLog, logList, headerList: headerKey, headerMap,recordCount, pageIndex, pageSize };
  },
  [types.REFRESH_RECONCILIATION_LOG_LIST]: (state) => {
    state.reconciliationLog.logList = [];
  }
};
