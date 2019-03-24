import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 调账
export const fetchReconciliationShopList = async (params) => {
  return await rest.post(API.API_FETCH_RECONCILIATION_SHOP_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchReconciliationUserList = async (params) => {
  return await rest.post(API.API_FETCH_RECONCILIATION_USER_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchReconciliationDetailList = async (params) => {
  return await rest.post(API.API_FETCH_RECONCILIATION_DETAIL_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchReconciliationDetailItem = async (params) => {
  return await rest.post(API.API_FETCH_RECONCILIATION_DETAIL_ITEM, { service: SERVICE.SHOP, ...params });
};

export const fetchReconciliationPaymentList = async (params) => {
  return await rest.post(API.API_FETCH_RECONCILIATION_PAYMENTLIST, { service: SERVICE.SHOP, ...params });
};

export const fetchReconciliationLogList = async (params) => {
  return await rest.post(API.API_FETCH_RECONCILIATION_LOG_LIST, { service: SERVICE.SHOP, ...params });
};

export const saveReconciliationDetail = async (params) => {
  return await rest.post(API.API_SAVE_RECONCILIATION_DETAIL, { service: SERVICE.SHOP, ...params });
};

export const updateReconciliationMsg = async (params) => {
  return await rest.post(API.API_UPDATE_RECONCILIATION_MSG, { service: SERVICE.SHOP, ...params });
};
