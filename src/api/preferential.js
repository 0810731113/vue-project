import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';
import { isShop } from 'utils/configUtil';

// 会员价管理
export const getVIPLevels = async (params) => {
  const url = isShop() ? API.API_DISHES_GETVIPLEVELS : API.API_COMP_DISHES_GETVIPLEVELS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};
export const getVipList = async (params) => {
  return await rest.post(API.API_DISHES_GETVIPLIST, { ...params, service: SERVICE.DISH });
};
export const getVipItemDetail = async (params) => {
  return await rest.post(API.API_GET_VIP_ITEM, { ...params, service: SERVICE.DISH });
};
export const updateOneVIPBargain = async (params) => {
  return await rest.post(API.API_DISHES_UPDATEVIPPRICE, { ...params, service: SERVICE.DISH });
};
export const bashSetVIPBargains = async (params) => {
  return await rest.post(API.API_DISHES_BASHSETVIPBARGAINS, { ...params, service: SERVICE.DISH });
};
export const getCardList = async (params) => {
  return await rest.post(API.API_GET_CARD_LIST, { ...params, service: SERVICE.DISH });
};
export const getLevelByCard = async (params) => {
  return await rest.post(API.API_GET_LEVEL_BY_CARD, { ...params, service: SERVICE.DISH });
};
export const getAllCardsLevel = async (params) => {
  return await rest.post(API.API_GET_ALL_CARDS_LEVEL, { ...params, service: SERVICE.DISH });
};
export const getCompanyAllCardsLevel = async (params) => {
  return await rest.post(API.API_GET_COMPANY_ALL_CARDS_LEVEL, { ...params, service: SERVICE.DISH });
};

// 菜品买减
export const fetchBuyGiftList = async (params) => {
  const url = isShop() ? API.API_FETCH_BUY_GIFT_LIST : API.API_COMP_FETCH_BUY_GIFT_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const deleteBuyGift = async (params) => {
  const url = isShop() ? API.API_DELETE_BUY_GIFT : API.API_COMP_DELETE_BUY_GIFT;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const saveBuyGift = async (params) => {
  const url = isShop() ? API.API_SAVE_BUY_GIFT : API.API_COMP_SAVE_BUY_GIFT;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const updateBuyGift = async (params) => {
  const url = isShop() ? API.API_UPDATE_BUY_GIFT : API.API_COMP_UPDATE_BUY_GIFT;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const fetchBuyGiftDetail = async (params) => {
  const url = isShop() ? API.API_FETCH_BUY_GIFT_DETAIL : API.API_COMP_FETCH_BUY_GIFT_DETAIL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const fetchBargainMenus = async (params) => {
  const url = isShop() ? API.API_FETCH_BARGAIN_MENUS : API.API_COMP_FETCH_BARGAIN_MENUS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const fetchMenuTrees = async (params) => {
  return await rest.post(API.API_GET_MENU_CLASS_LIST, { ...params, service: SERVICE.DISH });
};

// 金额满减
export const fetchBargainFullList = async (params) => {
  const url = isShop() ? API.API_FETCH_BARGAIN_FULL_LIST : API.API_COMP_FETCH_BARGAIN_FULL_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const insertBargainFull = async (params) => {
  const url = isShop() ? API.API_INSERT_BARGAIN_FULL : API.API_COMP_INSERT_BARGAIN_FULL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const updateBargainFull = async (params) => {
  const url = isShop() ? API.API_UPDATE_BARGAIN_FULL : API.API_COMP_UPDATE_BARGAIN_FULL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const fetchBargainFullDetail = async (params) => {
  const url = isShop() ? API.API_FETCH_BARGAIN_FULL_DETAIL : API.API_COMP_FETCH_BARGAIN_FULL_DETAIL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const deleteBargainFull = async (params) => {
  const url = isShop() ? API.API_DELETE_BARGAIN_FULL : API.API_COMP_DELETE_BARGAIN_FULL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const getCutPaymentsList = async () => {
  const url = isShop() ? API.API_GET_CUT_PAYMENTS_LIST : API.API_COMP_GET_CUT_PAYMENTS_LIST;
  return await rest.post(url, { service: SERVICE.DISH });
};
export const getBargainMaxId = async () => {
  const url = isShop() ? API.API_GET_BARGAIN_MAX_ID : API.API_COMP_GET_BARGAIN_MAX_ID;
  return await rest.post(url, { service: SERVICE.DISH });
};
export const fetchBargainFullLinkedMenus = async (params) => {
  const url = isShop() ? API.API_FETCH_BARGAIN_FULL_LINKED_MENUS : API.API_COMP_FETCH_BARGAIN_FULL_LINKED_MENUS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const updateBargainFullLinkedMenus = async (params) => {
  const url = isShop() ? API.API_UPDATE_BARGAIN_FULL_LINKED_MENUS : API.API_COMP_UPDATE_BARGAIN_FULL_LINKED_MENUS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

// 折扣方案
export const fetchDiscountSchemeList = async (params) => {
  const url = isShop() ? API.API_DISCOUNT_SCHEME_LIST : API.API_COMP_DISCOUNT_SCHEME_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const fetchAllowedUserList = async (params) => {
  const url = isShop() ? API.API_ALLOWED_USER_LIST : API.API_COMP_ALLOWED_USER_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const fetchDiscountSchemeDetail = async (params) => {
  const url = isShop() ? API.API_GET_DISCOUNT_DETAIL : API.API_COMP_GET_DISCOUNT_DETAIL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const fetchMaxDiscountId = async (params) => {
  const url = isShop() ? API.API_GET_MAX_DISCOUNT_ID : API.API_COMP_GET_MAX_DISCOUNT_ID;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const saveDiscountSchemeItem = async (params) => {
  const url = isShop() ? API.API_SAVE_DISCOUNT_SCHEME_ITEM : API.API_COMP_SAVE_DISCOUNT_SCHEME_ITEM;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const updateDiscountSchemeItem = async (params) => {
  const url = isShop() ? API.API_UPDATE_DISCOUNT_SCHEME_ITEM : API.API_COMP_UPDATE_DISCOUNT_SCHEME_ITEM;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const updateDiscountStatus = async (params) => {
  const url = isShop() ? API.API_UPDATE_DISCOUNT_STATUS : API.API_COMP_UPDATE_DISCOUNT_STATUS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const copyDiscountScheme = async (params) => {
  const url = isShop() ? API.API_COPY_DISCOUNT_SCHEME : API.API_COMP_COPY_DISCOUNT_SCHEME;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const fetchDiscountSchemeCopyList = async (params) => {
  const url = isShop() ? API.API_FETCH_DISCOUT_SCHEME_COPY_LIST : API.API_COMP_FETCH_DISCOUT_SCHEME_COPY_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const fetchDiscountMenuClsList = async (params) => {
  const url = isShop() ? API.API_FETCH_DISCOUNT_MENU_CLS_LIST : API.API_COMP_FETCH_DISCOUNT_MENU_CLS_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const fetchDiscountLinkedMenus = async (params) => {
  const url = isShop() ? API.API_FETCH_DISCOUNT_LINKED_MENUS : API.API_COMP_FETCH_DISCOUNT_LINKED_MENUS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const saveDiscountLinkedMenus = async (params) => {
  const url = isShop() ? API.API_SAVE_DISCOUNT_LINKED_MENUS : API.API_COMP_SAVE_DISCOUNT_LINKED_MENUS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const saveDiscountLinkedMenuCls = async (params) => {
  const url = isShop() ? API.API_SAVE_DISCOUNT_LINKED_MENUS_CLS : API.API_COMP_SAVE_DISCOUNT_LINKED_MENUS_CLS;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

// 菜品特价
export const fetchBargainSaleList = async (params) => {
  const url = isShop() ? API.API_FETCH_BARGAIN_SALE_LIST : API.API_COMP_FETCH_BARGAIN_SALE_LIST;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const fetchBargainSaleDetail = async (params) => {
  const url = isShop() ? API.API_FETCH_BARGAIN_SALE_DETAIL : API.API_COMP_FETCH_BARGAIN_SALE_DETAIL;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const deleteBargainSale = async (params) => {
  const url = isShop() ? API.API_DELETE_BARGAIN_SALE : API.API_COMP_DELETE_BARGAIN_SALE;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const insertBargainSale = async (params) => {
  const url = isShop() ? API.API_INSERT_BARGAIN_SALE : API.API_COMP_INSERT_BARGAIN_SALE;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
export const updateBargainSale = async (params) => {
  const url = isShop() ? API.API_UPDATE_BARGAIN_SALE : API.API_COMP_UPDATE_BARGAIN_SALE;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};
