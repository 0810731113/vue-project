import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// function detection
export const fetchCompanyList = async (params) => {
  return await rest.post(API.API_COMPANY_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchShopGroupList = async (params) => {
  return await rest.post(API.API_SHOP_GROUP_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchShopList = async (params) => {
  return await rest.post(API.API_SHOP_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchShopDetectionToken = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_DETECTION_TOKEN, { service: SERVICE.SHOP, ...params });
};

export const fetchShopDetectionResult = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_DETECTION_RESULT, { service: SERVICE.SHOP, ...params });
};

export const fetchShopCentral = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_CENTRAL_DATA, { service: SERVICE.SHOP, ...params });
};

// 灰度发布
export const fetchGatedLaunchList = async (params) => {
  return await rest.post(API.FETCH_GATED_LAUNCH_LIST, { service: SERVICE.SHOP, ...params });
};

export const saveGatedLaunch = async (params) => {
  return await rest.post(API.SAVE_GATED_LAUNCH, { service: SERVICE.SHOP, ...params });
};

export const deleteGatedLaunch = async (params) => {
  return await rest.post(API.DELETE_GATED_LAUNCH, { service: SERVICE.SHOP, ...params });
};

// 终端管理 概况
export const fetchTerminalSummary = async (params) => {
  return await rest.post(API.API_FETCH_TERMINAL_SUMMARY, { service: SERVICE.SHOP, ...params });
};

export const fetchVersionList = async (params) => {
  return await rest.post(API.API_FETCH_VERSION_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchTerminalList = async (params) => {
  return await rest.post(API.API_FETCH_TERMINAL_LIST, { service: SERVICE.SHOP, ...params });
};

// 版本升级
export const fetchUpgradeList = async (params) => {
  return await rest.post(API.API_FETCH_UPGRADE_LIST, { service: SERVICE.SHOP, ...params });
};
export const fetchUpgradeDetail = async (params) => {
  return await rest.post(API.API_FETCH_UPGRADE_DETAIL, { service: SERVICE.SHOP, ...params });
};
export const saveUpgrade = async (params) => {
  return await rest.post(API.API_SAVE_UPGRADE, { service: SERVICE.SHOP, ...params });
};
export const deleteUpgrade = async (params) => {
  return await rest.post(API.API_DELETE_UPGRADE, { service: SERVICE.SHOP, ...params });
};
export const pushUpgradeVersion = async (params) => {
  return await rest.post(API.API_PUSH_UPGRADE_VERSION, { service: SERVICE.SHOP, ...params });
};

// 版本发布
export const fetchPublishList = async (params) => {
  return await rest.post(API.API_FETCH_PUBLISH_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchPublishDetail = async (params) => {
  return await rest.post(API.API_FETCH_PUBLISH_DETAIL, { service: SERVICE.SHOP, ...params });
};

export const savePublish = async (params) => {
  return await rest.post(API.API_UPDATE_PUBLISH, { service: SERVICE.SHOP, ...params });
};

export const deletePublish = async (params) => {
  return await rest.post(API.API_DELETE_PUBLISH, { service: SERVICE.SHOP, ...params });
};

// 软件类型
export const fetchSoftwareList = async (params) => {
  return await rest.post(API.API_FETCH_SOFTWARE_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchSoftwareDetail = async (params) => {
  return await rest.post(API.API_FETCH_SOFTWARE_DETAIL, { service: SERVICE.SHOP, ...params });
};

export const saveSoftware = async (params) => {
  return await rest.post(API.API_UPDATE_SOFTWARE, { service: SERVICE.SHOP, ...params });
};

export const deleteSoftware = async (params) => {
  return await rest.post(API.API_DELETE_SOFTWARE, { service: SERVICE.SHOP, ...params });
};
