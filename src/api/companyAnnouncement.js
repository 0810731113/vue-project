import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 公告通知
export const fetchNoticesList = async (params = {}) => {
  return await rest.post(API.API_FETCH_NOTICES_LIST, { ...params, service: SERVICE.DISH });
};

export const getNoticesDetail = async (id) => {
  return await rest.post(API.API_GET_NOTICES_DETAIL, { id, service: SERVICE.DISH });
};

export const deleteNoticesById = async (id) => {
  return await rest.post(API.API_DELETE_NOTICES_BY_ID, { id, service: SERVICE.DISH });
};

export const insertNoticesEntity = async (params = {}) => {
  return await rest.post(API.API_INSERT_NOTICES_ENTITY, { ...params, service: SERVICE.DISH });
};
