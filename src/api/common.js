import rest from 'utils/restUtil';
import * as API from 'constant/API';
import { SERVICE } from 'constant/service';
import { isShop } from 'utils/configUtil';

// 菜单
export const fetchCompanyMenuClassify = async (params) => {
  return await rest.post(API.API_COMPANY_FETCH_MENU_CLASSIFY_LIST, { ...params, service: SERVICE.DISH });
};

// 关联菜品左边分类的（tree）数据来源
// params fiMenuClsKind 默认 1
// 1 (菜品)
// 2 (套餐)
// 3 (菜品和套餐)
// 4 (配料)
// 5 (菜品和配料)
// 6（全部）
export const fetchMenuClassifyList = async (params) => {
  const url = isShop() ? API.API_FETCH_MENU_CLASSIFY_LIST : API.API_COMPANY_FETCH_MENU_CLASSIFY_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

// 关联菜品根据分类获取菜品
export const fetchMenuList = async (params) => {
  return await rest.post(API.API_FETCH_MENU_LIST, { ...params, service: SERVICE.DISH });
};
