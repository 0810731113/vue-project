import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 公司信息
export const fetchManageCompanyDetail = async () => {
  return await rest.post(API.API_FETCH_MANAGE_COMPANY_DETAIL, { service: SERVICE.SHOP });
};

export const saveManageCompanyInfo = async (params) => {
  return await rest.post(API.API_SAVE_MANAGE_COMPANY_INFO, { ...params, service: SERVICE.SHOP });
};

export const fetchCompanyDetail = async () => {
  return await rest.post(API.API_FETCH_COMPANY_DETAIL, { service: SERVICE.SHOP });
};
