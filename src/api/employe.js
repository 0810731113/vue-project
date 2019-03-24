import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 操作日志
export const fetchUserLogList = async (params) => {
  return await rest.post(API.API_FETCH_USER_LOG_LIST, { ...params, service: SERVICE.BASE });
};

export const fetchUserOperationList = async () => {
  return await rest.post(API.API_USER_OPERATION_LIST, { service: SERVICE.BASE });
};

// 指纹权限配置
export const fetchFingerConfigList = async (params) => {
  return await rest.post(API.API_FETCH_FINGER_CONFIG_LIST, { ...params, service: SERVICE.SHOP });
};

export const saveFingerConfig = async (params) => {
  return await rest.post(API.API_SAVE_FINGER_CONFIG, { ...params, service: SERVICE.SHOP });
};

export const getManagersFingerList = async (params) => {
  return await rest.post(API.API_GET_SUPER_USER_LIST, { ...params, service: SERVICE.SHOP });
};

export const getShopSuperFingerList = async (params) => {
  return await rest.post(API.API_GET_SHOP_SUPER_USER_LIST, { ...params, service: SERVICE.SHOP });
};

// 部门
export const fetchShopDeptList = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_DEPT_LIST, { ...params, service: SERVICE.BASE });
};

export const getShopDeptDetail = async (params) => {
  return await rest.post(API.API_GET_SHOP_DEPT_DETAIL, { ...params, service: SERVICE.BASE });
};

export const updateShopDeptInfo = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_DEPT_INFO, { ...params, service: SERVICE.BASE });
};

export const deleteShopDept = async (params) => {
  return await rest.post(API.API_DELETE_SHOP_DEPT, { ...params, service: SERVICE.BASE });
};

// 角色权限
export const fetchShopRoleList = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_ROLE_LIST, { ...params, service: SERVICE.BASE });
};

export const updateShopRoleStatus = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_ROLE_STATUS, { ...params, service: SERVICE.BASE });
};

export const getShopRoleDetail = async (params) => {
  return await rest.post(API.API_GET_SHOP_ROLE_DETAIL, { ...params, service: SERVICE.BASE });
};

export const updateShopRoleInfo = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_ROLE_INFO, { ...params, service: SERVICE.BASE });
};

export const getShopRoleInfo = async (params) => {
  return await rest.post(API.API_GET_SHOP_ROLE_INFO, { ...params, service: SERVICE.BASE });
};

// 用户
export const fetchShopUserList = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_USER_LIST, { ...params, service: SERVICE.BASE });
};

export const getShopUserDetail = async (params) => {
  return await rest.post(API.API_GET_SHOP_USER_DETAIL, { ...params, service: SERVICE.BASE });
};

export const updateShopUserInfo = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_USER_INFO, { ...params, service: SERVICE.BASE });
};

export const deleteShopUser = async (params) => {
  return await rest.post(API.API_DELETE_SHOP_USER, { ...params, service: SERVICE.BASE });
};

export const updateUserPrintStatus = async (params) => {
  return await rest.post(API.API_UPDATE_USER_PRINT_STATUS, { ...params, service: SERVICE.BASE });
};

export const fetchAllDiscountPlan = async () => {
  return await rest.post(API.API_FETCH_ALL_DISCOUNT_PLAN, { service: SERVICE.BASE });
};
