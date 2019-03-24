import {
  API_ADD_FEEDBACK_INFO,
  API_DELETE_SHOP_INFO_IMAGE,
  API_HOME,
  API_SHOP,
  API_UNBIND_SHOP,
  API_UPDATE_SHOP,
  API_SWITCH_REPORT_TOKEN,
  API_CHECK_PRE_REPORT_LOGIN
} from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

export const fetchBaseInfo = async () => {
  const params = { service: SERVICE.SHOP };
  return await rest.post(API_HOME, params);
};

export const fetchShopInfo = async () => {
  return await rest.post(API_SHOP, { service: SERVICE.BASE });
};

export const updateShopInfo = async (params) => {
  return await rest.post(API_UPDATE_SHOP, { service: SERVICE.BASE, ...params });
};

export const unbindShop = async (params) => {
  return await rest.post(API_UNBIND_SHOP, { service: SERVICE.BASE, ...params });
};

export const deleteShopInfoImage = async (params) => {
  return await rest.post(API_DELETE_SHOP_INFO_IMAGE, { service: SERVICE.BASE, ...params });
};

// 反馈意见
export const addFeedbackInfo = async (params) => {
  return await rest.post(API_ADD_FEEDBACK_INFO, { ...params, service: SERVICE.SHOP });
};

// 反馈意见
export const switchReportToken = async (params) => {
  return await rest.post(API_SWITCH_REPORT_TOKEN, { ...params });
};
// 登录老版报表系统
export const checkReportLogin = async (params) => {
  return await rest.post(API_CHECK_PRE_REPORT_LOGIN, { ...params });
};
