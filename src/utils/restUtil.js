import * as Config from './configUtil';

import {EMPTY, REQUEST_TIME_OUT, SUCCESS, UNAUTHORIZED} from 'constant/statusCode';

import axios from 'axios';
import {getUid} from './strUtil';
import store from 'store';
import local from 'utils/localstorageUtil';
import {LOCAL_KEY_PHPSESSID} from 'constant/constants';

axios.interceptors.request.use((config) => {
  const {service, noShowError} = config.data || config;
  const params = {token: Config.getToken()};
  config.noShowError = !noShowError;
  if (config.data) {
    config.data.requestId = getUid();
    delete config.data.service;
    delete config.data.noShowError;
  }
  if (config.data.isPreReport) {
    delete config.data.isPreReport;
    return {
      ...config,
      url: `${Config.getReportUrlPre()}${config.url}`
    };
  }
  if (config.data.isReport) {
    delete config.data.isReport;
    return {
      ...config,
      url: `${Config.getReportAPIUrl()}${config.url}`
    };
  }
  // 走商控restful
  if (config.data.isBM) {
    delete config.data.isBM;
    return {
      ...config,
      data: {...config.data, 'access-token': Config.getToken()},
      url: `${Config.getBMAPIUrl()}${config.url}`
    };
  }
  return {
    ...config,
    params,
    url: `${Config.getEnvUrl(service)}/${config.url}`
  };
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  const data = response.data.data || response.data;
  const data1 = response.data;
  const {sysErrCode} = data1 || {};
  let timeOut = 1500;
  if (sysErrCode === UNAUTHORIZED) {
    showErrorModal('登录信息失效，请重新登录');
    setTimeout(Config.tokenUnEffect, timeOut);
  } else if (sysErrCode === '403') {
    handleError(data.err, response.config);
    setTimeout(() => location.href = process.env.VUE_APP_BM_HOST + 'bmanage/index', timeOut)
  } else if (data.err) {
    handleError(data.err, response.config);
  } else if (response.data.errNo !== 0) {
    if (response.data.errNo === 401) {
      showErrorModal('登录信息失效，请重新登录');
      setTimeout(Config.tokenUnEffect, timeOut);
    } else {
      handleError({errNo: '' + response.data.errNo, errMsg: response.data.errMsg}, response.config);
    }
    return;
  }
  return data;
}, (error) => {
  showErrorModal('网络链接断开，请检查网络！');
  return Promise.reject(error);
});

const handleError = (error = {}, config = {}) => {
  const {errNo, errMsg, errException} = error;
  const {noShowError} = config;
  if (SUCCESS !== errNo && EMPTY !== errNo) {
    let error = errException ? `${errMsg}: ${errException}` : errMsg;
    if (REQUEST_TIME_OUT === errNo) {
      error = '网络链接异常，请检查网络！'; // 过滤掉部署时错误
    }
    showErrorModal(error, noShowError);
  }
};


const showErrorModal = (errMsg, noShowError = true) => {
  store.commit('SHOW_ERROR', {status: true, msg: errMsg, showToast: noShowError});

  setTimeout(function () {
    store.commit('SHOW_ERROR', {status: false, msg: '', showToast: false});
  }, 3000);
};

export default axios;
