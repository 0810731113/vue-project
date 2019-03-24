import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 公告通知
export const fetchSystemNoticesList = async (params = {}) => {
  return await rest.post(API.API_FETCH_SYSTEM_NOTE_LIST, { ...params, service: SERVICE.SHOP });
};

export const getSystemNoticesDetail = async (id) => {
  return await rest.post(API.API_GET_SYSTEM_NOTE_DETAIL, { id, service: SERVICE.SHOP });
};

export const deleteSystemNotices = async (id) => {
  return await rest.post(API.API_DELETE_SYSTEM_NOTE, { id, service: SERVICE.SHOP });
};

export const saveSystemNotices = async (params = {}) => {
  return await rest.post(API.API_SAVE_SYSTEM_NOTE, { ...params, service: SERVICE.SHOP });
};

