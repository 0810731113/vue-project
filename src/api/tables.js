import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// type
export const fetchAllTableTypes = async (params) => {
  return await rest.post(API.API_TABLE_TYPE, { service: SERVICE.BASE, ...params });
};

export const fetchPrinterListForTable = async (params) => {
  return await rest.post(API.API_DINING_AREA_PRINTER_LIST, { service: SERVICE.BASE, ...params });
};

export const saveTableType = async (params) => {
  return await rest.post(API.API_SAVE_TABLE_TYPE, { service: SERVICE.BASE, ...params });
};

export const updateTableStatus = async (params) => {
  return await rest.post(API.API_UPDATE_TABLE_STATUS, { service: SERVICE.BASE, ...params });
};

export const editTableType = async (params) => {
  return await rest.post(API.API_EDIT_TABLE_TYPE, { service: SERVICE.BASE, ...params });
};

export const fetchTableTypeItem = async (params) => {
  return await rest.post(API.API_TABLE_TAPE_ITEM, { service: SERVICE.BASE, ...params });
};

// dining area
export const fetchAllDiningArea = async (params) => {
  return await rest.post(API.API_DINING_AREA_LIST, { service: SERVICE.BASE, ...params });
};

export const fetchDiningAreaSortList = async (params) => {
  return await rest.post(API.API_DINING_AREA_SORT_LIST, { service: SERVICE.BASE, ...params });
};

export const updateDiningAreaSortList = async (params) => {
  return await rest.post(API.API_UPDATE_DINING_AREA_SORT_LIST, { service: SERVICE.BASE, ...params });
};

export const fetchDiningAreaItem = async (params) => {
  return await rest.post(API.API_DINING_AREA_ITEM, { service: SERVICE.BASE, ...params });
};

export const saveDiningArea = async (params) => {
  return await rest.post(API.API_SAVE_DINING_AREA, { service: SERVICE.BASE, ...params });
};

export const updateDiningAreaStatus = async (params) => {
  return await rest.post(API.API_UPDATE_DINING_AREA_STATUS, { service: SERVICE.BASE, ...params });
};

export const editDiningArea = async (params) => {
  return await rest.post(API.API_EDIT_DINING_AREA, { service: SERVICE.BASE, ...params });
};

// table management
export const fetchTableManagementList = async (params) => {
  return await rest.post(API.API_MANAGEMENT_LIST, { service: SERVICE.BASE, ...params });
};

export const fetchTableManagementSortList = async (params) => {
  return await rest.post(API.API_MANAGEMENT_SORT_LIST, { service: SERVICE.BASE, ...params });
};

export const updateManagementSortList = async (params) => {
  return await rest.post(API.API_UPDATE_MANAGEMENT_SORT_ORDER, { service: SERVICE.BASE, ...params });
};

export const getTableTypelist = async (params) => {
  return await rest.post(API.API_GET_TABLE_TYPE_LIST, { service: SERVICE.BASE, ...params });
};

export const getTableArealist = async (params) => {
  return await rest.post(API.API_GET_TABLE_AREA_LIST, { service: SERVICE.BASE, ...params });
};

export const fetchManagementItem = async (params) => {
  return await rest.post(API.API_FETCH_MANAGEMENT_ITEM, { service: SERVICE.BASE, ...params });
};

export const saveTableManagementItem = async (params) => {
  return await rest.post(API.API_SAVE_TABLE_MANAGEMENT_ITEM, { service: SERVICE.BASE, ...params });
};

export const updateTableManagementItem = async (params) => {
  return await rest.post(API.API_UPDATE_TABLE_MANAGEMENT_ITEM, { service: SERVICE.BASE, ...params });
};

export const updateTableManagementStatus = async (params) => {
  return await rest.post(API.API_UPDATE_TABLE_MANAGEMENT_STATUS, { service: SERVICE.BASE, ...params });
};

export const saveBatchTableManagement = async (params) => {
  return await rest.post(API.API_SAVE_BATCH_TABLE_MANAGEMENT, { service: SERVICE.BASE, ...params });
};

export const updateBatchTableManagement = async (params) => {
  return await rest.post(API.API_UPDATE_BATCH_TABLE_MANAGEMENT, { service: SERVICE.BASE, ...params });
};

export const deleteBatchTableManagement = async (params) => {
  return await rest.post(API.API_DELETE_BATCH_TABLE_MANAGEMENT, { service: SERVICE.BASE, ...params });
};

// table color
export const fetchAllTableColorList = async () => {
  return await rest.post(API.API_TABLE_COLOR_LIST, { service: SERVICE.BASE });
};

export const saveTableColorList = async (params) => {
  return await rest.post(API.API_SAVE_TABLE_COLOR_LIST, { service: SERVICE.BASE, ...params });
};
