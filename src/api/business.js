import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import { isShop } from 'utils/configUtil';
import rest from 'utils/restUtil';

// 营业餐段
export const fetchAllShift = async (params = {}) => {
  const url = isShop() ? API.API_MSECTION_LIST : API.API_FETCH_MANAGE_MSECTION_LIST;
  const result = await rest.post(url, { ...params, service: SERVICE.BASE });
  return result;
};

export const saveShift = async (params) => {
  return await rest.post(API.API_SAVE_MSECTION, { service: SERVICE.BASE, ...params });
};

export const updateShift = async (params) => {
  return await rest.post(API.API_UPDATE_MSECTION, { service: SERVICE.BASE, ...params });
};

export const deleteShift = async (msectionId) => {
  return await rest.post(API.API_DELETE_MSECTION, { service: SERVICE.BASE, msectionId });
};

export const getShiftLastId = async () => {
  const result = await rest.post(API.API_GET_MSECTION_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchShiftDetail = async (msectionId) => {
  const result = await rest.post(API.API_FETCH_MSECTION_DETAIL, { service: SERVICE.BASE, msectionId });
  return result.item;
};

// 收银班别
export const fetchAllCashier = async (params = {}) => {
  return await rest.post(API.API_CASHIER_LIST, { ...params, service: SERVICE.BASE });
};

export const saveCashier = async (params) => {
  return await rest.post(API.API_SAVE_CASHIER, { service: SERVICE.BASE, ...params });
};

export const updateCashier = async (params) => {
  return await rest.post(API.API_UPDATE_CASHIER, { service: SERVICE.BASE, ...params });
};

export const deleteCashier = async (shiftId) => {
  return await rest.post(API.API_DELETE_CASHIER, { service: SERVICE.BASE, shiftId });
};

export const getCashierLastId = async () => {
  const result = await rest.post(API.API_GET_CASHIER_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchCashierDetail = async (shiftId) => {
  const result = await rest.post(API.API_FETCH_CASHIER_DETAIL, { service: SERVICE.BASE, shiftId });
  return result.item;
};

export const updateCashierStatus = async (params) => {
  return await rest.post(API.API_UPDATE_SHIFT_STATUS, { service: SERVICE.BASE, ...params });
};

// 销售分类
export const fetchAllSales = async (params) => {
  return await rest.post(API.API_SALES_LIST, { ...params, service: SERVICE.BASE });
};

export const saveSales = async (params) => {
  return await rest.post(API.API_SAVE_SALES, { service: SERVICE.BASE, ...params });
};

export const updateSales = async (params) => {
  return await rest.post(API.API_UPDATE_SALES, { service: SERVICE.BASE, ...params });
};

export const deleteSales = async (expClsId) => {
  return await rest.post(API.API_DELETE_SALES, { service: SERVICE.BASE, expClsId });
};

export const getSalesLastId = async () => {
  const result = await rest.post(API.API_GET_SALES_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchSalesDetail = async (expClsId) => {
  const result = await rest.post(API.API_FETCH_SALES_DETAIL, { service: SERVICE.BASE, expClsId });
  return result.item;
};

// 收入分类
export const fetchAllRevenue = async (params) => {
  return await rest.post(API.API_REVENUE_LIST, { ...params, service: SERVICE.BASE });
};

export const saveRevenue = async (params) => {
  return await rest.post(API.API_SAVE_REVENUE, { service: SERVICE.BASE, ...params });
};

export const updateRevenue = async (params) => {
  return await rest.post(API.API_UPDATE_REVENUE, { service: SERVICE.BASE, ...params });
};

export const deleteRevenue = async (revenueTypeId) => {
  return await rest.post(API.API_DELETE_REVENUE, { service: SERVICE.BASE, revenueTypeId });
};

export const getRevenueLastId = async () => {
  const result = await rest.post(API.API_GET_REVENUE_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchRevenueDetail = async (revenueTypeId) => {
  const result = await rest.post(API.API_FETCH_REVENUE_DETAIL, { service: SERVICE.BASE, revenueTypeId });
  return result.item;
};

export const getRevenueGroupList = async () => {
  const url = isShop() ? API.API_GET_REVENUE_GROUP_LIST : API.API_COMPANY_GET_REVENUE_GROUP_LIST;
  const result = await rest.post(url, { service: SERVICE.BASE });
  return result.list;
};

// 收入分类分组
export const fetchRevenueGroupList = async (params) => {
  const url = isShop() ? API.API_FETCH_REVENUE_GROUP_LIST : API.API_COMPANY_FETCH_REVENUE_GROUP_LIST;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const insertRevenueGroup = async (params) => {
  const url = isShop() ? API.API_INSERT_REVENUE_GROUP : API.API_COMPANY_INSERT_REVENUE_GROUP;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const getRevenueGroupDetail = async (revenueGroupId) => {
  const url = isShop() ? API.API_GET_REVENUE_GROUP_DETAIL : API.API_COMPANY_GET_REVENUE_GROUP_DETAIL;
  const result = await rest.post(url, { service: SERVICE.BASE, revenueGroupId });
  return result.item;
};

export const updateRevenueGroup = async (params) => {
  const url = isShop() ? API.API_UPDATE_REVENUE_GROUP : API.API_COMPANY_UPDATE_REVENUE_GROUP;
  return await rest.post(url, { service: SERVICE.BASE, ...params });
};

export const deleteRevenueGroup = async (revenueGroupId) => {
  const url = isShop() ? API.API_DELETE_REVENUE_GROUP : API.API_COMPANY_DELETE_REVENUE_GROUP;
  return await rest.post(url, { service: SERVICE.BASE, revenueGroupId });
};

// 付款方式
export const fetchAllPayment = async (params) => {
  const url = isShop() ? API.API_PAYMENT_LIST : API.API_COMP_PAYMENT_LIST;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const fetchSortPayment = async () => {
  const url = isShop() ? API.API_SORT_PAYMENT_LIST : API.API_COMP_SORT_PAYMENT_LIST;
  return await rest.post(url, { service: SERVICE.BASE });
};

export const updateSortPayment = async (params) => {
  const url = isShop() ? API.API_UPDATE_PAYMENT_SORT : API.API_COMP_UPDATE_PAYMENT_SORT;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const savePayment = async (params) => {
  let url = '';
  if (isShop()) {
    url = params.couponID ? API.API_SAVE_MWCOUPON : API.API_SAVE_PAYMENT;
  } else {
    url = params.couponID ? API.API_COMP_SAVE_MWCOUPON : API.API_COMP_SAVE_PAYMENT;
  }
  return await rest.post(url, { service: SERVICE.BASE, ...params });
};

export const updatePayment = async (params) => {
  const url = isShop() ? API.API_UPDATE_PAYMENT : API.API_COMP_UPDATE_PAYMENT;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const updateColorOrPremium = async (params) => {
  const url = isShop() ? API.API_UPDATE_COLOR_OR_PREMIUM : API.API_COMP_UPDATE_COLOR_OR_PREMIUM;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const updatePaymentByBatch = async (params) => {
  const url = isShop() ? API.API_BATCH_UPDATE_PAYMENT : API.API_COMP_BATCH_UPDATE_PAYMENT;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const deletePayment = async (paymentId) => {
  const url = isShop() ? API.API_DELETE_PAYMENT : API.API_COMP_DELETE_PAYMENT;
  return await rest.post(url, { paymentId, service: SERVICE.BASE });
};

export const deletePaymentByIds = async (paymentIds) => {
  const url = isShop() ? API.API_DELETE_PAYMENT_BYIDS : API.API_COMP_DELETE_PAYMENT_BYIDS;
  return await rest.post(url, { paymentIds, service: SERVICE.BASE });
};

export const getPaymentLastId = async () => {
  const url = isShop() ? API.API_GET_PAYMENT_LASTID : API.API_COMP_GET_PAYMENT_LASTID;
  const result = await rest.post(url, { service: SERVICE.BASE });
  return result.data;
};

export const fetchPaymentDetail = async (paymentId) => {
  const url = isShop() ? API.API_FETCH_PAYMENT_DETAIL : API.API_COMP_FETCH_PAYMENT_DETAIL;
  const result = await rest.post(url, { service: SERVICE.BASE, paymentId });
  return result.item;
};

export const fetchMWCoupons = async (params) => {
  const url = isShop() ? API.API_COUPON_LIST : API.API_COMP_COUPON_LIST;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const fetchAllPaymentTypes = async (params) => {
  const url = isShop() ? API.API_ALL_PAYMENT_TYPE_LIST : API.API_COMP_ALL_PAYMENT_TYPE_LIST;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const fetchPaymentTypesByPage = async (params) => {
  const url = isShop() ? API.API_PAYMENT_TYPE_LIST : API.API_COMP_PAYMENT_TYPE_LIST;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const savePaymentType = async (params) => {
  const url = isShop() ? API.API_SAVE_PAYMENT_TYPE : API.API_COMP_SAVE_PAYMENT_TYPE;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const updatePaymentType = async (params) => {
  const url = isShop() ? API.API_UPDATE_PAYMENT_TYPE : API.API_COMP_UPDATE_PAYMENT_TYPE;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const deletePaymentType = async (paymentTypeId) => {
  const url = isShop() ? API.API_DELETE_PAYMENT_TYPE : API.API_COMP_DELETE_PAYMENT_TYPE;
  return await rest.post(url, { service: SERVICE.BASE, paymentTypeId });
};

export const getPaymentTypeLastId = async () => {
  const url = isShop() ? API.API_GET_PAYMENT_TYPE_LASTID : API.API_COMP_GET_PAYMENT_TYPE_LASTID;
  const result = await rest.post(url, { service: SERVICE.BASE });
  return result.data;
};

export const fetchPaymentTypeDetail = async (paymentTypeId) => {
  const url = isShop() ? API.API_FETCH_PAYMENT_TYPE_DETAIL : API.API_COMP_FETCH_PAYMENT_TYPE_DETAIL;
  const result = await rest.post(url, { service: SERVICE.BASE, paymentTypeId });
  return result.item;
};

export const updatePaymentShortCut = async (params) => {
  const url = isShop() ? API.API_UPDATE_SHORT_CUT : API.API_COMP_UPDATE_SHORT_CUT;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const fetchShortCutKeys = async () => {
  const url = isShop() ? API.API_FETCH_SHORT_CUT_KEYS : API.API_COMP_FETCH_SHORT_CUT_KEYS;
  return await rest.post(url, { service: SERVICE.BASE, noShowError: true });
};

// 挂账对象
export const fetchAllCreditAccount = async (params) => {
  return await rest.post(API.API_CREDIT_ACCOUNT_LIST, { ...params, service: SERVICE.BASE });
};

export const saveCreditAccount = async (params) => {
  return await rest.post(API.API_SAVE_CREDIT_ACCOUNT, { service: SERVICE.BASE, ...params });
};

export const updateCreditAccount = async (params) => {
  return await rest.post(API.API_UPDATE_CREDIT_ACCOUNT, { service: SERVICE.BASE, ...params });
};

export const deleteCreditAccount = async (creditAccountId) => {
  return await rest.post(API.API_DELETE_CREDIT_ACCOUNT, { service: SERVICE.BASE, creditAccountId });
};

export const getCreditAccountLastId = async () => {
  const result = await rest.post(API.API_GET_CREDIT_ACCOUNT_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchCreditAccountDetail = async (creditAccountId) => {
  const result = await rest.post(API.API_FETCH_CREDIT_ACCOUNT_DETAIL, { service: SERVICE.BASE, creditAccountId });
  return result.item;
};

// 送餐者
export const fetchAllDeliverer = async (params) => {
  return await rest.post(API.API_DELIVERER_LIST, { ...params, service: SERVICE.BASE });
};

export const saveDeliverer = async (params) => {
  return await rest.post(API.API_SAVE_DELIVERER, { service: SERVICE.BASE, ...params });
};

export const updateDeliverer = async (params) => {
  return await rest.post(API.API_UPDATE_DELIVERER, { service: SERVICE.BASE, ...params });
};

export const deleteDeliverer = async (delivererId) => {
  return await rest.post(API.API_DELETE_DELIVERER, { service: SERVICE.BASE, delivererId });
};

export const getDelivererLastId = async () => {
  const result = await rest.post(API.API_GET_DELIVERER_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchDelivererDetail = async (delivererId) => {
  const result = await rest.post(API.API_FETCH_DELIVERER_DETAIL, { service: SERVICE.BASE, delivererId });
  return result.item;
};

// 订单来源
export const fetchAllOrderSource = async (params) => {
  return await rest.post(API.API_ORDER_SOURCE_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchSortOrderSource = async () => {
  return await rest.post(API.API_SORT_ORDER_SOURCE, { service: SERVICE.BASE });
};

export const updateOrderSourceSort = async (params) => {
  return await rest.post(API.API_UPDATE_SORT_ORDER_SOURCE, { ...params, service: SERVICE.BASE });
};

export const saveOrderSource = async (params) => {
  return await rest.post(API.API_SAVE_ORDER_SOURCE, { service: SERVICE.BASE, ...params });
};

export const updateOrderSource = async (params) => {
  return await rest.post(API.API_UPDATE_ORDER_SOURCE, { service: SERVICE.BASE, ...params });
};

export const deleteOrderSource = async (billSourceId) => {
  return await rest.post(API.API_DELETE_ORDER_SOURCE, { service: SERVICE.BASE, billSourceId });
};

export const getOrderSourceLastId = async () => {
  const result = await rest.post(API.API_GET_ORDER_SOURCE_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchOrderSourceDetail = async (billSourceId) => {
  const result = await rest.post(API.API_FETCH_ORDER_SOURCE_DETAIL, { service: SERVICE.BASE, billSourceId });
  return result.item;
};

// 外卖设置
export const fetchTakeoutDetail = async (params) => {
  return await rest.post(API.API_FETCH_TAKEOUT_DETAIL, { ...params, service: SERVICE.BASE });
};

export const updateTakeout = async (params) => {
  return await rest.post(API.API_UPDATE_TAKEOUT, { ...params, service: SERVICE.BASE });
};
