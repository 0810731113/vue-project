import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 门店列表
export const fetchManageShopList = async (params) => {
  return await rest.post(API.API_FETCH_MANAGE_SHOP_LIST, { ...params, service: SERVICE.SHOP });
};

export const getShopGroupTypes = async () => {
  return await rest.post(API.API_GET_SHOP_GROUP_TYPES, { service: SERVICE.SHOP });
};

export const fetchManageShopDetail = async (params) => {
  return await rest.post(API.API_FETCH_MANAGE_SHOP_DETAIL, { ...params, service: SERVICE.SHOP });
};

export const updateManageShopInfo = async (params) => {
  return await rest.post(API.API_UPDATE_MANAGE_SHOP_INFO, { ...params, service: SERVICE.SHOP });
};

export const saveManageShopInfo = async (params) => {
  return await rest.post(API.API_SAVE_MANAGE_SHOP_INFO, { ...params, service: SERVICE.SHOP });
};

export const updateManageShopStatus = async (params) => {
  return await rest.post(API.API_UPDATE_MANAGE_SHOP_STATUS, { ...params, service: SERVICE.SHOP });
};

export const getUpdateShopMessage = async (params) => {
  return await rest.post(API.API_GET_UPDATE_SHOP_MESSAGE, { ...params, service: SERVICE.SHOP });
};

export const updateManageShopMessage = async (params) => {
  return await rest.post(API.API_UPDATE_MANAGE_SHOP_MESSAGE, { ...params, service: SERVICE.SHOP });
};

export const fetchShopTreeDataSource = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_TREE_DATA_SOURCE, { ...params, service: SERVICE.SHOP });
};

export const createShopTreeNode = async (params) => {
  return await rest.post(API.API_CREATE_SHOP_TREE_NODE, { ...params, service: SERVICE.SHOP });
};

export const deleteShopTreeNode = async (params) => {
  return await rest.post(API.API_DELETE_SHOP_TREE_NODE, { ...params, service: SERVICE.SHOP });
};

export const moveShopTreeNode = async (params) => {
  return await rest.post(API.API_MOVE_SHOP_TREE_NODE, { ...params, service: SERVICE.SHOP });
};

export const moveShopTreeItem = async (params) => {
  return await rest.post(API.API_MOVE_SHOP_TREE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const updateShopTreeNode = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_TREE_NODE, { ...params, service: SERVICE.SHOP });
};

export const getShopListByNode = async (params) => {
  return await rest.post(API.API_GET_SHOP_LIST_BY_NODE, { ...params, service: SERVICE.SHOP });
};

export const moveShopNodeUp = async (params) => {
  return await rest.post(API.API_MOVE_SHOP_NODE_UP, { ...params, service: SERVICE.SHOP });
};

export const moveShopNodeDown = async (params) => {
  return await rest.post(API.API_MOVE_SHOP_NODE_DOWN, { ...params, service: SERVICE.SHOP });
};

export const moveShopItemUp = async (params) => {
  return await rest.post(API.API_MOVE_SHOP_ITEM_UP, { ...params, service: SERVICE.SHOP });
};

export const moveShopItemDown = async (params) => {
  return await rest.post(API.API_MOVE_SHOP_ITEM_DOWN, { ...params, service: SERVICE.SHOP });
};

// 连锁标准化列表
export const fetchChainsSettings = async (params) => {
  return await rest.post(API.API_FETCH_CHAINS_SETTING, { ...params, service: SERVICE.SHOP });
};

export const saveChainsSettings = async (params) => {
  return await rest.post(API.API_SAVE_CHAINS_SETTING, { ...params, service: SERVICE.SHOP });
};

// ERP 系统对接
export const fetchERPSystemIntegrationList = async (params) => {
  return await rest.post(API.API_FETCH_ERP_SYSTEM_INTEGRATION_LIST, { ...params, service: SERVICE.SHOP });
};

export const batchUploadShopData = async (params) => {
  return await rest.post(API.API_BATCH_UPLOAD_SHOP_DATA, { ...params, service: SERVICE.SHOP });
};

export const batchChangeUploadWay = async (params) => {
  return await rest.post(API.API_BATCH_CHANGE_UPLAOD_WAY, { ...params, service: SERVICE.SHOP });
};

// 门店分组
export const getShopGroupList = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_GROUP_LIST, { ...params, service: SERVICE.SHOP });
};
export const getShopGroupDetail = async (params) => {
  return await rest.post(API.API_GET_SHOP_GROUP_DETAIL, { ...params, service: SERVICE.SHOP });
};
export const updateManageShopGroup = async (params) => {
  return await rest.post(API.API_UPDATE_MANAGE_SHOP_GROUP, { ...params, service: SERVICE.SHOP });
};
export const saveManageShopGroup = async (params) => {
  return await rest.post(API.API_SAVE_MANAGE_SHOP_GROUP, { ...params, service: SERVICE.SHOP });
};
export const getAllShopList = async () => {
  return await rest.post(API.API_GET_ALL_SHOP_LIST, { service: SERVICE.SHOP });
};
export const updateShopGroupStatus = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_GROUP_STATUS, { ...params, service: SERVICE.SHOP });
};
