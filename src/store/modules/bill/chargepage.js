import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchBillDetail,
  fetchBillList,
  fetchBillListBatch,
  fetchBillListUpload,
  fetchBillListUploadBatch,
  fetchChargeCancel,
  fetchChargeDoneList,
  fetchChargeList,
  fetchChargeObj,
  fetchOrderNo,
  fetchUpdateChargeBill,
  fetchNewBillList,
  fetchNewBillApiTypeList,

} from 'api/bill';

import { handleError } from '../../common';

// initial state
export const state = {
  charge: {
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    list: []
  },
  chargeobj: [],
  orderobj: {
    chargeBill: {},
    collectPayment: []
  },
  chargebilldone: {
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    list: []
  },
  chargebilldetail: {
    chargedDetailPopModelDto: {},
    sellEntityDtos: []
  },
  billist: {
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    dtoList: []
  },
  billistupload: {
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    dtoList: []
  },
  billManagerList:{ //分账单列表
    billList:[],
    getBillApiType:[],//／／获取账单协议类型
    // pageIndex: DEFAULT_PAGE,
    // pageSize: DEFAULT_PAGES,
    // recordCount: 0,
  },
};

// actions
export const actions = {
  fetchChargeObj: async ({ commit }) => {
    const result = await fetchChargeObj();
    commit(types.FETCH_CHARGEOBJ_LIST, result);
  },
  fetchNewBillList: async ({ commit }) => { //获取自由定义账单列表
    const result = await fetchNewBillList();
    console.log(result)
    commit(types.API_FETCH_NEW_BILL_LIST, result);
  },
  fetchNewBillApiTypeList: async ({ commit }) => { //获取自由定义账单协议列表
    const result = await fetchNewBillApiTypeList();
    //console.log(result)
    commit(types.API_FETCH_NEW_BILL_PROTOCOL_LIST, result);
  },
  fetchChargeList: async ({ commit }, params) => {
    const result = await fetchChargeList(params);
    commit(types.FETCH_CHARGE_LIST, result);
  },
  fetchOrderNo: async ({ commit }, params) => {
    const result = await fetchOrderNo(params);
    commit(types.API_FETCH_ORDERNO, result);
  },
  fetchUpdateChargeBill: async ({ commit }, params) => {
    const result = await fetchUpdateChargeBill(params);
    handleError(commit, types.API_FETCH_CHARGEBILL_UPDATE, params, result.err);
  },
  fetchChargeDoneList: async ({ commit }, params) => {
    const result = await fetchChargeDoneList(params);
    commit(types.API_FETCH_CHARGEBILLDONE_LIST, result);
  },
  fetchChargeCancel: async ({ commit }, params) => {
    await fetchChargeCancel(params);
  },
  fetchBillDetail: async ({ commit }, params) => {
    const result = await fetchBillDetail(params);
    commit(types.API_FETCH_BILLDETAIL, result);
  },
  fetchBillList: async ({ commit }, params) => {
    const result = await fetchBillList(params);
    commit(types.API_FETCH_BILLLIST, result);
  },
  fetchBillListBatch: async ({ commit }, params) => {
    await fetchBillListBatch(params);
  },
  fetchBillListUpload: async ({ commit }, params) => {
    const result = await fetchBillListUpload(params);
    commit(types.API_FETCH_BILLLISTUPLOAD, result);
  },
  fetchBillListUploadBatch: async ({ commit }, params) => {
    await fetchBillListUploadBatch(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_CHARGEOBJ_LIST]: (state, result) => {
    state.chargeobj = result.creditAccountDtos || [];
  },
  [types.FETCH_CHARGE_LIST]: (state, result) => {
    const { dtoList, recordCount, pageIndex, pageSize } = result;
    state.charge = { list: dtoList, recordCount, pageIndex, pageSize };
  },
  [types.API_FETCH_ORDERNO]: (state, result) => {
    const { chargeBill, collectPayment } = result;
    state.orderobj = { ...state.orderobj, chargeBill, collectPayment };
  },
  [types.API_FETCH_CHARGEBILLDONE_LIST]: (state, result) => {
    const { dtoList, recordCount, pageIndex, pageSize } = result;
    state.chargebilldone = { list: dtoList, recordCount, pageIndex, pageSize };
  },
  [types.API_FETCH_BILLDETAIL]: (state, result) => {
    const { chargedDetailPopModelDto, sellEntityDtos } = result;
    state.chargebilldetail = { chargedDetailPopModelDto, sellEntityDtos };
  },
  [types.API_FETCH_BILLLIST]: (state, result) => {
    const { dtoList, recordCount, pageIndex, pageSize } = result;
    state.billist = { dtoList, recordCount, pageIndex, pageSize };
  },
  [types.API_FETCH_BILLLISTUPLOAD]: (state, result) => {
    const { list, recordCount, pageIndex, pageSize } = result;
    state.billistupload = { dtoList:list, recordCount, pageSize, pageIndex };
  },
  [types.API_FETCH_NEW_BILL_LIST]: (state, result) => {
    const { billList } = result;
    state.billManagerList = { billList};
  },
  [types.API_FETCH_NEW_BILL_PROTOCOL_LIST]: (state, result) => {
    const { getBillApiType } = result;
    console.log(getBillApiType)
    state.billManagerList = { ...state.billManagerList ,getBillApiType};
  }
};
