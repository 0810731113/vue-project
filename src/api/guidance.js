import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

// 开店向导步骤
export const fetchAllGuidance = async () => {
  return await rest.post(API.API_GUIDANCE_LIST, { service: SERVICE.SHOP });
};

export const updateStepOfGuidance = async (params) => {
  return await rest.post(API.API_UPDATE_GUIDANCE_STEP, { ...params, service: SERVICE.SHOP });
};
