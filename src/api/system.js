/**
 * Created by liuyu on 2017/9/5.
 */
import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import rest from 'utils/restUtil';

export const fetchMenu = async () => {
  return await rest.post(API.API_FETCH_MENU, { service: SERVICE.SHOP });
};

export const fetchUserRight = async () => {
  return await rest.post(API.API_GET_AUTH, { service: SERVICE.BASE });
};

export const fetchUserInfo = async () => {
  return await rest.post(API.API_FETCH_USER_INFO, { service: SERVICE.SHOP });
};

export const fetchProvinces = async () => {
  return await rest.post(API.API_FETCH_PROVINCE_LIST, { service: SERVICE.SHOP });
};

export const fetchCitys = async (params) => {
  const data = await rest.post(API.API_FETCH_CITY_LIST, { service: SERVICE.SHOP, ...params });
  return { ...data, ...params };
};

export const fetchDistrict = async (params) => {
  const data = await rest.post(API.API_FETCH_DISTRICT_LIST, { service: SERVICE.SHOP, ...params });
  return { ...data, ...params };
};

export const updateShopData = async (params) => {
  return await rest.post(API.API_UPDATE_SHOP_DATA, { service: SERVICE.BASE, ...params });
};
