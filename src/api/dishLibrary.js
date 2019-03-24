import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 菜单
export const fetchCookBookList = async (params) => {
  return await rest.post(API.API_COOK_BOOK_LIST, { ...params, service: SERVICE.DISH });
};

export const fetchCookBookItem = async (params) => {
  return await rest.post(API.API_COOK_BOOK_ITEM, { ...params, service: SERVICE.DISH });
};

export const saveCookBookItem = async (params) => {
  return await rest.post(API.API_SAVE_COOK_BOOK_ITEM, { ...params, service: SERVICE.DISH });
};

export const deleteCookBookItem = async (params) => {
  return await rest.post(API.API_DELETE_COOK_BOOK_ITEM, { ...params, service: SERVICE.DISH });
};

export const copyCookBookItem = async (params) => {
  return await rest.post(API.API_COPY_COOK_BOOK_ITEM, { ...params, service: SERVICE.DISH });
};

export const fetchCompanyMenuList = async (params) => {
  return await rest.post(API.API_FETCH_COMPANY_MENU_LIST, { ...params, service: SERVICE.DISH });
};

export const fetchCompanyLinkedMenuList = async (params) => {
  return await rest.post(API.API_FETCH_COMPANY_LINKED_MENU_LIST, { ...params, service: SERVICE.DISH });
};

export const fetchCompanyDetails = async (params) => {
  return await rest.post(API.API_FETCH_COMPANY_DETAILS, { ...params, service: SERVICE.SHOP });
};

// 门店更新管理
export const fetchShopUpdateList = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_UPDATE_LIST, { ...params, service: SERVICE.DISH });
};

export const fetchShopUpdateFormData = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_UPDATE_SEARCH_FORM_DATA, { ...params, service: SERVICE.DISH });
};

export const fetchCookBookManagementList = async (params) => {
  return await rest.post(API.API_COOK_BOOK_MANAGEMENT_LIST, { ...params, service: SERVICE.DISH });
};

export const batchUpdateCookBook = async (params) => {
  return await rest.post(API.API_BATCH_UPDATE_COOK_BOOK, { ...params, service: SERVICE.DISH });
};

export const updateShopCookBook = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_COOK_BOOK, { ...params, service: SERVICE.DISH });
};

export const fetchCompanyDishMenuList = async (params) => {
  return await rest.post(API.API_FETCH_COMPANY_DISH_MENU_LIST, { ...params, service: SERVICE.DISH });
};

export const fetchAddMenuAuthority = async (params) => {
  return await rest.post(API.API_FETCH_ADD_MENU_AUTHORITY, { ...params, service: SERVICE.DISH });
};

export const updateAddMenuAuthority = async (params) => {
  return await rest.post(API.API_UPDATE_ADD_MENU_AUTHORITY, { ...params, service: SERVICE.DISH });
};

export const fetchContentTypes = async (params) => {
  return await rest.post(API.API_FETCH_CONTENT_TYPES, { ...params, service: SERVICE.DISH });
};

export const sendCompanyData = async (params) => {
  return await rest.post(API.API_SEND_COMPANY_DATA, { ...params, service: SERVICE.DISH });
};

export const sendImmediateCompanyData = async (params) => {
  return await rest.post(API.API_IMMEDIATE_COMPANY_DATA, { ...params, service: SERVICE.DISH });
}

export const fetchHistoryShop = async (params) => {
  return await rest.post(API.API_FETCH_HISTORY_SHOP, { ...params, service: SERVICE.DISH });
};

// 更新日志
export const fetchUpdateLogList = async (params) => {
  return await rest.post(API.API_FETCH_UPDATE_LOG_LIST, { ...params, service: SERVICE.DISH });
};

export const cancelTimedUpdate = async (params) => {
  return await rest.post(API.API_CANCEL_TIMED_UPDATE, { ...params, service: SERVICE.DISH });
};

export const fetchUpdateLogDetail = async (params) => {
  return await rest.post(API.API_FETCH_UPDATE_LOG_DETAIL, { ...params, service: SERVICE.DISH });
};
//集团管理菜品菜单状态开关
export const switchDishMenuStatus = async (params) => {
  return await rest.post('company/cookbook/update/status', { ...params, service: SERVICE.DISH });
};

//获取门店菜品数据上传列表
export const fetchShopDishDataList = async (params) => {
  return await rest.post('company/push/data/shop/list', { ...params, service: SERVICE.SHOP });
};

//同步数据到设备端
export const synchronousDataToDevice = async (params) => {
  return await rest.post('company/push/data/to/myd', { ...params, service: SERVICE.BASE });
};

//上传菜品到网络订单
export const uploadDishToNetOrder = async (params) => {
  return await rest.post('company/push/data/to/netOrder', { ...params, service: SERVICE.DISH });
};
//最近上传历史记录
export const resentlyUploadRecord = async (params) => {
  return await rest.post('company/push/data/to/netOrder/result', { ...params, service: SERVICE.DISH });
};
