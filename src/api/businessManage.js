import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

export const fetchValueAddedList = async (params = {}) => {
  return await rest.post(API.API_FETCH_VALUE_ADDED_LIST, { ...params, service: SERVICE.SHOP });
};

export const fetchValueAddedDetail = async (params = {}) => {
  return await rest.post(API.API_FETCH_VALUE_ADDED_DETAIL, { ...params, service: SERVICE.SHOP });
};

export const saveValueAdded = async (params = {}) => {
  return await rest.post(API.API_SAVE_VALUE_ADDED, { ...params, service: SERVICE.SHOP });
};
