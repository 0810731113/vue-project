import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';
import { isShop } from 'utils/configUtil';

// 退菜理由
export const fetchAllBackReason = async (params = {}) => {
  return await rest.post(API.API_BACK_REASON_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchAllBackReasonWithoutPage = async (params = {}) => {
  return await rest.post(API.API_BACK_REASON_LIST_WITHOUT_PAGE, { ...params, service: SERVICE.BASE });
};

export const updateSortBackReasonList = async (params = {}) => {
  return await rest.post(API.API_UPDATE_SORT_BACK_REASON_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchBackReasonDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_BACK_REASON_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateBackReason = async (params) => {
  return await rest.post(API.API_UPDATE_BACK_REASON, { service: SERVICE.BASE, ...params });
};

export const saveBackReason = async (params) => {
  return await rest.post(API.API_SAVE_BACK_REASON, { service: SERVICE.BASE, ...params });
};

export const deleteBackReason = async (id) => {
  return await rest.post(API.API_DELETE_BACK_REASON, { service: SERVICE.BASE, id });
};

// 赠菜理由
export const fetchAllGiftReason = async (params = {}) => {
  return await rest.post(API.API_GIFT_REASON_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchGiftReasonDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_GIFT_REASON_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateGiftReason = async (params) => {
  return await rest.post(API.API_UPDATE_GIFT_REASON, { service: SERVICE.BASE, ...params });
};

export const saveGiftReason = async (params) => {
  return await rest.post(API.API_SAVE_GIFT_REASON, { service: SERVICE.BASE, ...params });
};

export const deleteGiftReason = async (id) => {
  return await rest.post(API.API_DELETE_GIFT_REASON, { service: SERVICE.BASE, id });
};

// 打折理由
export const fetchAllDiscountReason = async (params = {}) => {
  return await rest.post(API.API_DISCOUNT_REASON_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchDiscountReasonDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_DISCOUNT_REASON_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateDiscountReason = async (params) => {
  return await rest.post(API.API_UPDATE_DISCOUNT_REASON, { service: SERVICE.BASE, ...params });
};

export const saveDiscountReason = async (params) => {
  return await rest.post(API.API_SAVE_DISCOUNT_REASON, { service: SERVICE.BASE, ...params });
};

export const deleteDiscountReason = async (id) => {
  return await rest.post(API.API_DELETE_DISCOUNT_REASON, { service: SERVICE.BASE, id });
};

// 反结账理由
export const fetchAllRechecReason = async (params = {}) => {
  return await rest.post(API.API_RECHEC_REASON_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchRechecReasonDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_RECHEC_REASON_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateRechecReason = async (params) => {
  return await rest.post(API.API_UPDATE_RECHEC_REASON, { service: SERVICE.BASE, ...params });
};

export const saveRechecReason = async (params) => {
  return await rest.post(API.API_SAVE_RECHEC_REASON, { service: SERVICE.BASE, ...params });
};

export const deleteRechecReason = async (id) => {
  return await rest.post(API.API_DELETE_RECHEC_REASON, { service: SERVICE.BASE, id });
};

// 外送备注
export const fetchAllDeliveryNote = async (params = {}) => {
  return await rest.post(API.API_DELIVERY_NOTE_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchDeliveryNoteDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_DELIVERY_NOTE_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateDeliveryNote = async (params) => {
  return await rest.post(API.API_UPDATE_DELIVERY_NOTE, { service: SERVICE.BASE, ...params });
};

export const saveDeliveryNote = async (params) => {
  return await rest.post(API.API_SAVE_DELIVERY_NOTE, { service: SERVICE.BASE, ...params });
};

export const deleteDeliveryNote = async (id) => {
  return await rest.post(API.API_DELETE_DELIVERY_NOTE, { service: SERVICE.BASE, id });
};

// 账单备注
export const fetchAllBillNote = async (params = {}) => {
  return await rest.post(API.API_BILL_NOTE_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchBillNoteDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_BILL_NOTE_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateBillNote = async (params) => {
  return await rest.post(API.API_UPDATE_BILL_NOTE, { service: SERVICE.BASE, ...params });
};

export const saveBillNote = async (params) => {
  return await rest.post(API.API_SAVE_BILL_NOTE, { service: SERVICE.BASE, ...params });
};

export const deleteBillNote = async (id) => {
  return await rest.post(API.API_DELETE_BILL_NOTE, { service: SERVICE.BASE, id });
};

// 规格
export const fetchAllOrderUint = async (params = {}) => {
  return await rest.post(API.API_ORDER_UINT_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchAllOrderUintList = async (params = {}) => {
  const url = isShop() ? API.API_ORDER_UINT_LIST_NO_PAGE : API.API_COMPANY_ORDER_UINT_LIST_NO_PAGE;
  return await rest.post(url, { ...params, service: SERVICE.BASE });
};

export const fetchOrderUintDetail = async (id) => {
  const result = await rest.post(API.API_FETCH_ORDER_UINT_DETAIL, { service: SERVICE.BASE, id });
  return result.list[0];
};

export const updateOrderUint = async (params) => {
  const url = isShop() ? API.API_UPDATE_ORDER_UINT : API.API_COMPANY_UPDATE_ORDER_UINT;
  return await rest.post(url, { service: SERVICE.BASE, ...params });
};

export const saveOrderUint = async (params) => {
  const url = isShop() ? API.API_SAVE_ORDER_UINT : API.API_COMPANY_SAVE_ORDER_UINT;
  return await rest.post(url, { service: SERVICE.BASE, ...params });
};

export const deleteOrderUint = async (params) => {
  if(!params.unitName){
    params.unitName = ''
  }
  const url = isShop() ? API.API_DELETE_ORDER_UINT : API.API_COMPANY_DELETE_ORDER_UINT;
  return await rest.post(url, { service: SERVICE.DISH, ...params});
};
