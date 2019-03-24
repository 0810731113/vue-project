import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';
import { isShop } from 'utils/configUtil';

// food out
export const fetchFoodOutDeptList = async (params) => {
  const url = isShop() ? API.API_FOOD_OUT_DEPT_LIST : API.API_COMP_FOOD_OUT_DEPT_LIST;
  return await rest.post(url, { service: SERVICE.SHOP, ...params });
};

export const fetchFoodOutDeptItem = async (params) => {
  const url = isShop() ? API.API_FETCH_FOOD_OUT_DEPT_ITEM : API.API_COMP_FETCH_FOOD_OUT_DEPT_ITEM;
  return await rest.post(url, { service: SERVICE.SHOP, ...params });
};

export const updateFoodOutDeptItem = async (params) => {
  const url = isShop() ? API.API_UPDATE_FOOD_OUT_DEPT_ITEM : API.API_COMP_UPDATE_FOOD_OUT_DEPT_ITEM;
  return await rest.post(url, { service: SERVICE.SHOP, ...params });
};

export const deleteFoodOutDeptItem = async (params) => {
  const url = isShop() ? API.API_DELETE_FOOD_OUT_DEPT_ITEM : API.API_COMP_DELETE_FOOD_OUT_DEPT_ITEM;
  return await rest.post(url, { service: SERVICE.SHOP, ...params });
};

export const updateFoodOutDeptStatus = async (params) => {
  const url = isShop() ? API.API_UPDATE_FOOD_OUT_DEPT_STATUS : API.API_COMP_UPDATE_FOOD_OUT_DEPT_STATUS;
  return await rest.post(url, { service: SERVICE.SHOP, ...params });
};

// food pass
export const fetchFoodPassDeptList = async (params) => {
  return await rest.post(API.API_FOOD_PASS_DEPT_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchFoodPassDeptItem = async (params) => {
  return await rest.post(API.API_FETCH_FOOD_PASS_DEPT_ITEM, { service: SERVICE.SHOP, ...params });
};

export const deleteFoodOPassDeptItem = async (params) => {
  return await rest.post(API.API_DELETE_FOOD_PASS_DEPT_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updateFoodPassDeptItem = async (params) => {
  return await rest.post(API.API_UPDATE_FOOD_PASS_DEPT_ITEM, { service: SERVICE.SHOP, ...params });
};

// host
export const fetchHostList = async (params) => {
  return await rest.post(API.API_HOST_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchHostItem = async (params) => {
  return await rest.post(API.API_FETCH__HOST_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updateHostItem = async (params) => {
  return await rest.post(API.API_UPDATE__HOST_ITEM, { service: SERVICE.SHOP, ...params });
};

export const deleteHostItem = async (params) => {
  return await rest.post(API.API_DELETE__HOST_ITEM, { service: SERVICE.SHOP, ...params });
};

// printer
export const fetchPrinterList = async (params) => {
  return await rest.post(API.API_PRINTER_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchPrinterItem = async (params) => {
  return await rest.post(API.API_FETCH_PRINTER_ITEM, { service: SERVICE.SHOP, ...params });
};

export const savePrinterItem = async (params) => {
  return await rest.post(API.API_SAVE_PRINTER_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updatePrinterItem = async (params) => {
  return await rest.post(API.API_UPDATE_PRINTER_ITEM, { service: SERVICE.SHOP, ...params });
};

export const deletePrinterItem = async (params) => {
  return await rest.post(API.API_DELETE_PRINTER_ITEM, { service: SERVICE.SHOP, ...params });
};

export const bindCloudPrinter = async (params) => {
  return await rest.post(API.API_BIND_CLOUD_PRINTER, { service: SERVICE.SHOP, ...params });
};

export const unbindCloudPrinter = async (params) => {
  return await rest.post(API.API_UNBIND_CLOUD_PRINTER, { service: SERVICE.SHOP, ...params });
};

// report
export const fetchReportList = async (params) => {
  return await rest.post(API.API_REPORT_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchReportTemplateList = async (params) => {
  return await rest.post(API.API_REPORT_TEMPLATE_LIST, { service: SERVICE.SHOP, ...params });
};

export const updateReportTemplate = async (params) => {
  return await rest.post(API.API_UPDATE_REPORT_TEMPLATE, { service: SERVICE.SHOP, ...params });
};

export const fetchReportTemplateItem = async (params) => {
  return await rest.post(API.API_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updateReportTemplateItem = async (params) => {
  return await rest.post(API.API_UPDATE_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

export const deleteReportTemplateItem = async (params) => {
  return await rest.post(API.API_DELETE_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

export const updateReportStatus = async (params) => {
  return await rest.post(API.API_UPDATE_REPORT_STATUS, { service: SERVICE.SHOP, ...params });
};

export const saveReportTemplateItem = async (params) => {
  return await rest.post(API.API_SAVE_REPORT_TEMPLATE_ITEM, { service: SERVICE.SHOP, ...params });
};

export const fetchSystemTemplateList = async (params) => {
  return await rest.post(API.API_SYSTEM_TEMPLATE_LIST, { service: SERVICE.SHOP, ...params });
};

export const checkAddOrEditSystemTemplate = async (params) => {
  return await rest.post(API.API_CHECK_ADD_OR_EDIT_SYSTEMPLATE, { service: SERVICE.SHOP, ...params });
};

export const saveSystemTemplateItem = async (params) => {
  return await rest.post(API.API_SAVE_SYSTEM_TEMPLATE, { service: SERVICE.SHOP, ...params });
};

// system options
export const fetchParameterList = async (params) => {
  return await rest.post(API.API_PARAMS_LIST, { service: SERVICE.SHOP, ...params });
};

export const changeBusinessData = async (params) => {
  return await rest.post(API.API_CHANGE_BUSINESS_DATA, { service: SERVICE.SHOP, ...params });
};

export const updateParameterList = async (params) => {
  return await rest.post(API.API_UPDATE_PARAMTER_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchOpenParameterList = async (params) => {
  return await rest.post(API.API_OPEN_PARAMETER_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchAreaListForOpenParams = async (params) => {
  return await rest.post(API.API_AREA_LIST_FOR_OPEN, { service: SERVICE.SHOP, ...params });
};

export const fetchMenuListForOpenParams = async (params) => {
  return await rest.post(API.API_MENU_LIST_FOR_OPEN, { service: SERVICE.SHOP, ...params });
};

export const saveOpenParameterItem = async (params) => {
  return await rest.post(API.API_SAVE_OPEN_PARAMETER_ITEM, { service: SERVICE.SHOP, ...params });
};

export const deleteOpenParameterItem = async (params) => {
  return await rest.post(API.API_DELETE_OPEN_PARAMETER_ITEM, { service: SERVICE.SHOP, ...params });
};

export const fetchPaymentMethodList = async (params) => {
  return await rest.post(API.API_FETCH_PAYMENT_FOR_SYSTEM_OPTIONS, { service: SERVICE.SHOP, ...params });
};

export const fetchHostListForSystemOptions = async (params) => {
  return await rest.post(API.API_FETCH_HOST_LIST_FOR_SYSTEM_OPTIONS, { service: SERVICE.SHOP, ...params });
};

export const fetchPrinterListForSystemOptions = async (params) => {
  return await rest.post(API.API_FETCH_PRINTER_LIST_FOR_SYSTEM_OPTIONS, { service: SERVICE.SHOP, ...params });
};

export const checkResetSettingEnable = async (params) => {
  return await rest.post(API.API_CHECK_RESET_SETTING_ENABLE, { service: SERVICE.SHOP, ...params });
};

export const checkBillOptimizeServiceVisible = async (params) => {
  return await rest.post(API.API_CHECK_BILL_SERVICE_ENABLE, { service: SERVICE.SHOP, ...params });
};

// takeout mapping
export const fetchTakeoutMappingList = async (params) => {
  return await rest.post(API.API_TAKEOUT_MAPPING_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchNoPageTakeoutList = async (params) => {
  return await rest.post(API.API_FETCH_NO_TAKEOUT_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchVendorList = async (params) => {
  return await rest.post(API.API_VENDOR_DATA, { service: SERVICE.SHOP, ...params });
};

export const fetchDishList = async (params) => {
  return await rest.post(API.API_DISH_LIST, { service: SERVICE.SHOP, ...params });
};

export const saveVendorList = async (params) => {
  return await rest.post(API.API_SAVE_DISH_LIST, { service: SERVICE.SHOP, ...params });
};

export const fetchTakeoutLink = async (params) => {
  return await rest.post(API.API_FETCH_TAKEOUT_LINK, { service: SERVICE.SHOP, ...params });
};

// 服务费设置
export const fetchServiceItems = async (params) => {
  return await rest.post(API.API_FETCH_SERVICE_ITEMS, { service: SERVICE.SHOP, ...params });
};

export const fetchServiceAreaList = async (params) => {
  return await rest.post(API.API_FETCH_SERVICE_AREA_LIST, { service: SERVICE.SHOP, ...params });
};

export const saveServiceCharge = async (params) => {
  return await rest.post(API.API_SAVE_SERVICE_CHARGE, { service: SERVICE.SHOP, ...params });
};

export const updateAreaService = async (params) => {
  return await rest.post(API.API_UPDATE_AREA_SERVICE, { service: SERVICE.SHOP, ...params });
};

