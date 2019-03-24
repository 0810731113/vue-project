import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 系统小票模板
export const fetchSystemReportTemplateList = async (params) => {
  return await rest.post(API.API_FETCH_SYSTEM_REPORT_TEMPLATE_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchSystemReportTypeList = async (params) => {
  return await rest.post(API.API_FETCH_SYSTEM_REPORT_TYPE_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchSysReportAttributeList = async (params) => {
  return await rest.post(API.API_FETCH_SYSTEM_REPORT_ATTRIBUTE_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchSysReportTemplateDataSources = async (params) => {
  return await rest.post(API.API_FETCH_SYSTEM_REPORT_TEMPLATE_DATASOURCE, { service: SERVICE.SHOP, ...params });
};

export const saveSysReportTemplateItem = async (params) => {
  return await rest.post(API.API_SAVE_SYSTEM_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updateSysReportTemplateStatus = async (params) => {
  return await rest.post(API.API_UPDATE_SYSTEM_REPORT_TEMPLATE_STATUS, { service: SERVICE.SHOP, ...params });
};

export const fetchSysReportTemplateItem = async (params) => {
  return await rest.post(API.API_FETCH_SYSTEM_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updateSysReportTemplateItem = async (params) => {
  return await rest.post(API.API_UPDATE_SYSTEM_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

// 打印机列表
export const fetchSystemPrinterList = async (params) => {
  return await rest.post(API.API_SYSTEM_PRINTER_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchSystemPrinterType = async (params) => {
  return await rest.post(API.API_SYSTEM_PRINTER_TYPE, { service: SERVICE.SHOP, ...params });
};

export const saveSystemPrinterType = async (params) => {
  return await rest.post(API.API_SAVE_SYSTEM_PRINTER_TYPE, { service: SERVICE.SHOP, ...params });
};

export const updateSystemPrinterType = async (params) => {
  return await rest.post(API.API_UPDATE_SYSTEM_PRINTER_TYPE, { service: SERVICE.SHOP, ...params });
};

export const uploadPrinterTypeImage = async (params) => {
  return await rest.post(API.API_UPLOAD_SYSTEM_PRINTER_IMAGE, { service: SERVICE.SHOP, ...params });
};

// 打印机地址
export const fetchPrinterBuyAddress = async (params) => {
  return await rest.post(API.API_FETCH_PRINTER_BUY_ADDRESS, { service: SERVICE.SHOP, ...params });
};

export const savePrinterBuyAddress = async (params) => {
  return await rest.post(API.API_ADD_PRINTER_BUY_ADDRESS, { service: SERVICE.SHOP, ...params });
};

export const updatePrinterBuyAddress = async (params) => {
  return await rest.post(API.API_UPDATE_PRINTER_BUY_ADDRESS, { service: SERVICE.SHOP, ...params });
};
