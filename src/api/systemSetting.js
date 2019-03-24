import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// senior management
export const updateSeniorManagementStatus = async (params) => {
  return await rest.post(API.API_UPDATE_SENIOR_MANAGEMENT_STATUS, { service: SERVICE.SHOP, ...params });
};

export const deleteSeniorManagementItem = async (params) => {
  return await rest.post(API.API_DELETE_SENIOR_MANAGEMENT_ITEM, { service: SERVICE.SHOP, ...params });
};

