import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 第三方对接
export const fetchFeedbackInfoList = async (params) => {
  return await rest.post(API.API_FETCH_FEEDBACK_INFO_LIST, { ...params, service: SERVICE.SHOP });
};

export const fetchFeedbackInfoItem = async (params) => {
  return await rest.post(API.API_FETCH_FEEDBACK_INFO_ITEM, { ...params, service: SERVICE.SHOP });
};
