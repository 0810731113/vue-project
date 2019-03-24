import {SHOPKIND, LOCAL_KEY_PHPSESSID, LOCAL_KEY_ACCOUNT_INFO} from 'constant/constants';
import store from 'store';
import {switchReportToken} from 'api/shop';
import local from 'utils/localstorageUtil';

export const getEnvUrl = (service = '') => {
  //console.log(process.env.BASE_URL + service)
  return process.env.VUE_APP_BASE_URL_REQ + service;
};

export const getReportAPIUrl = () => {
  return process.env.VUE_APP_REPORT_API_URL;
};

export const getReportUrl = () => {
  return process.env.VUE_APP_REPORT_URL;
};

export const getReportUrlPre = () => {
  return process.env.VUE_APP_REPORT_URL_PRE;
};
// 商控后台接口url
export const getBMAPIUrl = () => {
  return process.env.VUE_APP_BM_RESTFUL_API;
};
export const getToken = () => {
 /* if (sessionStorage.getItem('isIframe') === 'true') {
    return getCookies('admintoken');
  }*/
  const token = local.getInstance().getItem(LOCAL_KEY_PHPSESSID)|| getCookies('PHPSESSID');
  if (!token && process.env.NODE_ENV !== "development") {
    location.href = process.env.VUE_APP_BM_HOST + 'bmanage/account/login';
  }
  return token;
};

export const onLogOut = () => {
  local.getInstance().removeItem(LOCAL_KEY_ACCOUNT_INFO);
  location.href = process.env.VUE_APP_BM_HOST + 'passport/logout.html';
};
export const tokenUnEffect = ()=>{
  if(process.env.NODE_ENV !== "development"){
    local.getInstance().removeItem(LOCAL_KEY_PHPSESSID);
    location.href = process.env.VUE_APP_BM_HOST + 'bmanage/account/login';
  }
}

export const linkToReport = async () => {
  const result = await switchReportToken({
    isReport: true,
    token: getToken(),
    noShowError: true
  });

  const {token, shopKind, isStg, account} = result;
  if (!token || !shopKind) {
    return false;
  }
  // isStg 1灰度店
  if (+isStg === 0) {
    const params = {
      username: account.userId,
      scompanyname: account.shopName,
      password: account.pwd
    };
    this.$jsonp(`${getReportUrlPre()}Account/CheckLogin`, params).then(data => {
      window.parent.location.href = (`${getReportUrlPre()}SubShop/Daily/ShiftBalance`);
    });
  } else {
    window.open(`${getReportUrl()}myd_report?token=${encodeURIComponent(token)}&shopKind=${shopKind}`);
  }

  return true;
};

export const getCookies = (cookiename) => {
  const value = document.cookie.match(new RegExp('(^| )' + cookiename + '=([^;]*)(;|$)'));
  return value != null ? value[2] : null;
};

export const getQueryString = (name) => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  const value = window.location.search.substr(1).match(reg);
  if (value != null) {
    return unescape(value[2]);
  }
  return null;
};

export const isManageShop = ()=>{
  const {manageShopGUID , shopGUID} = store.state.sysetymenu;
  return  manageShopGUID == shopGUID
}

export const isShop = () => {
  const {shopKind} = store.state.sysetymenu;
  return SHOPKIND.SHOP === shopKind;
};

/* 是否为连锁店 */
export const isChain = () => {
  const {patternType, shopKind} = store.state.sysetymenu;
  return +patternType === 1 && SHOPKIND.SHOP === shopKind;
};

/**
 * 是否是集团模式
 * @returns {boolean}
 */
export const isGroupStore = ()=>{
  const { patternType } = store.state.sysetymenu;
  return patternType === 1
}

export const errorHandler = (error, vm) => {
  if (error.toString().includes('Uncaught SyntaxError: Unexpected token <')) {
    window.location.reload();
  }
};
