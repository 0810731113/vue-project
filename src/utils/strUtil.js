import * as Config from 'utils/configUtil';
import moment from 'moment';

import { OK } from 'constant/statusCode';

export const getUid = (a = '') => {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, getUid);
};

export const getActionUrl = (route, isDisable = false) => {
  if (isDisable) return;
  return `${Config.getEnvUrl() + route}?token=${encodeURIComponent(Config.getToken())}`;
};

// 获取列表状态的文字提示
export const getStatusText = (params = {}, expirationEnable = false) => {
  if (expirationEnable === true) {
    if (+params.isEffectiveDate === 1 && moment(params.endDate).isBefore(new Date()) || moment(params.endDate).isBefore(new Date()) || moment(params.endTime).isBefore(new Date())) {
      return '超期';
    }
  }
  return +params.status === OK ? '正常' : '禁用';
};

export const formatEmptyText = (row, column, cellValue) => {
  return cellValue || '-';
};
