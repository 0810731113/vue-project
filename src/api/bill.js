import {
  API_FETCH_BILLDETAIL,
  API_FETCH_BILLLIST,
  API_FETCH_BILLLISTBATCH,
  API_FETCH_BILLLISTUPLOAD,
  API_FETCH_BILLLISTUPLOADBATCH,
  API_FETCH_CHARGEBILLDONE_LIST,
  API_FETCH_CHARGEBILL_UPDATE,
  API_FETCH_CHARGECANCEL,
  API_FETCH_CHARGEOBJ_LIST,
  API_FETCH_CHARGE_LIST,
  API_FETCH_ORDERNO,
  API_FETCH_BILL_UPLOAD_LOG_LIST
} from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

export const fetchChargeObj = async () => {
  return await rest.post(API_FETCH_CHARGEOBJ_LIST, { service: SERVICE.SHOP });
};
export const fetchNewBillList = async () => {
  return await rest.post('bill/getBill/list', { service: SERVICE.SHOP });
};
export const fetchNewBillApiTypeList = async (params) => {
  return await rest.post('bill/getBill/apiType', { ...params,service: SERVICE.SHOP });
};

export const fetchNewBillDetail= async (params) => {  //获取账单详情
  return await rest.post('bill/upload/getBillDetail', { ...params,service: SERVICE.SHOP });
};

export const updateNewBillDetail= async (params) => {  //设置修改账单详情
  return await rest.post('bill/getBill/set', { ...params,service: SERVICE.SHOP });
};

export const fetchChargeList = async (params) => {
  return await rest.post(API_FETCH_CHARGE_LIST, { ...params, service: SERVICE.SHOP });
};
export const fetchOrderNo = async(params) => {
  return await rest.post(API_FETCH_ORDERNO, { ...params, service: SERVICE.SHOP });
};
export const fetchUpdateChargeBill = async(params) => {
  return await rest.post(API_FETCH_CHARGEBILL_UPDATE, { ...params, service: SERVICE.SHOP });
};
export const fetchChargeDoneList = async(params) => {
  return await rest.post(API_FETCH_CHARGEBILLDONE_LIST, { ...params, service: SERVICE.SHOP });
};
export const fetchChargeCancel = async(params) => {
  return await rest.post(API_FETCH_CHARGECANCEL, { ...params, service: SERVICE.SHOP });
};
export const fetchBillDetail = async(params) => {
  return await rest.post(API_FETCH_BILLDETAIL, { ...params, service: SERVICE.SHOP });
};
export const fetchBillList = async(params) => {
  return await rest.post(API_FETCH_BILLLIST, { ...params, service: SERVICE.SHOP });
};
export const fetchBillListBatch = async(params) => {
  return await rest.post(API_FETCH_BILLLISTBATCH, { ...params, service: SERVICE.SHOP });
};
export const fetchBillListUpload = async(params) => {
  return await rest.post(API_FETCH_BILLLISTUPLOAD, { ...params, service: SERVICE.SHOP });
};
export const fetchBillListUploadBatch = async(params) => {
  return await rest.post(API_FETCH_BILLLISTUPLOADBATCH, { ...params, service: SERVICE.SHOP });
};

// 账单上传记录
export const fetchBillUploadLogList = async(params) => {
  return await rest.post(API_FETCH_BILL_UPLOAD_LOG_LIST, { ...params, service: SERVICE.SHOP });
};

export const fetchBillStatisticsTypeList = async(params) => {
  return await rest.post('bill/upload/accountType', { ...params, service: SERVICE.SHOP });
};

export const fetchBillStatisticsIncome = async(params) => { //获取账单统计金额实收金额
  return await rest.post('bill/upload/countBillAmount/new', { ...params, service: SERVICE.SHOP });
};

export const fetchBillUploadedRecordList = async(params) => { //获取账单已上传记录
  return await rest.post('bill/upload/log/list/new', { ...params, service: SERVICE.SHOP });
};
