import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';
// 销售分类
export const fetchAllCompanySales = async (params) => {
  return await rest.post(API.API_COMPANY_SALES_LIST, { ...params, service: SERVICE.BASE });
};

export const saveCompanySales = async (params) => {
  return await rest.post(API.API_COMPANY_SAVE_SALES, { service: SERVICE.BASE, ...params });
};

export const updateCompanySales = async (params) => {
  return await rest.post(API.API_COMPANY_UPDATE_SALES, { service: SERVICE.BASE, ...params });
};

export const deleteCompanySales = async (expClsId) => {
  return await rest.post(API.API_COMPANY_DELETE_SALES, { service: SERVICE.BASE, expClsId });
};

export const getCompanySalesLastId = async () => {
  const result = await rest.post(API.API_COMPANY_GET_SALES_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchCompanySalesDetail = async (expClsId) => {
  const result = await rest.post(API.API_COMPANY_FETCH_SALES_DETAIL, { service: SERVICE.BASE, expClsId });
  return result.item;
};

// 收入分类
export const fetchAllCompanyRevenue = async (params) => {
  return await rest.post(API.API_COMPANY_REVENUE_LIST, { ...params, service: SERVICE.BASE });
};

export const saveCompanyRevenue = async (params) => {
  return await rest.post(API.API_COMPANY_SAVE_REVENUE, { service: SERVICE.BASE, ...params });
};

export const updateCompanyRevenue = async (params) => {
  return await rest.post(API.API_COMPANY_UPDATE_REVENUE, { service: SERVICE.BASE, ...params });
};

export const deleteCompanyRevenue = async (revenueTypeId) => {
  return await rest.post(API.API_COMPANY_DELETE_REVENUE, { service: SERVICE.BASE, revenueTypeId });
};

export const getCompanyRevenueLastId = async () => {
  const result = await rest.post(API.API_COMPANY_GET_REVENUE_LASTID, { service: SERVICE.BASE });
  return result.data;
};

export const fetchCompanyRevenueDetail = async (revenueTypeId) => {
  const result = await rest.post(API.API_COMPANY_FETCH_REVENUE_DETAIL, { service: SERVICE.BASE, revenueTypeId });
  return result.item;
};
