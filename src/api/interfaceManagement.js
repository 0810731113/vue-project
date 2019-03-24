import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 第三方对接
export const fetchThirdPartyInterfaceList = async (params) => {
  return await rest.post(API.API_FETCH_THIRD_PARTY_INTERFACE_LIST, { ...params, service: SERVICE.SHOP });
};

export const fetchInterfaceTypeListWithoutPagination = async (params) => {
  return await rest.post(API.API_FETCH_THIRD_PARTY_INTERFACE_LIST_WITHOUT_PAGINATION, { ...params, service: SERVICE.SHOP });
};

export const fetchThirdPartyInterfaceItem = async (params) => {
  return await rest.post(API.API_FETCH_THIRD_PARTY_INTERFACE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const deleteThirdPartyInterfaceItem = async (params) => {
  return await rest.post(API.API_DELETE_THIRD_PARTY_INTERFACE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const saveThirdPartyInterfaceItem = async (params) => {
  return await rest.post(API.API_SAVE_THIRD_PARTY_INTERFACE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const updateThirdPartyInterfaceItem = async (params) => {
  return await rest.post(API.API_UPDATE_THIRD_PARTY_INTERFACE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const fetchShopDataSource = async (params) => {
  return await rest.post(API.API_FETCH_SHOP_DATASOURCE, { ...params, service: SERVICE.SHOP });
};

// 接口类型管理
export const fetchInterfaceTypeList = async (params) => {
  return await rest.post(API.API_FETCH_INTERFACE_TYPE_LIST, { ...params, service: SERVICE.SHOP });
};

export const deleteInterfaceTypeItem = async (params) => {
  return await rest.post(API.API_DELETE_INTERFACE_TYPE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const fetchInterfaceTypeItem = async (params) => {
  return await rest.post(API.API_FETCH_INTERFACE_TYPE_ITEM, { ...params, service: SERVICE.SHOP });
};

export const updateInterfaceTypeItem = async (params) => {
  return await rest.post(API.API_UPDATE_INTERFACE_TYPE_ITEM, { ...params, service: SERVICE.SHOP });
};

