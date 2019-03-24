import rest from 'utils/restUtil';

const BM_CONFIG = { isBM: true };
// 品牌
export const fetchBrandList = params => {
  return rest.post('account.shop.getBrandList', { ...params, ...BM_CONFIG });
};

// 门店
export const fetchAllShopList = params => {
  return rest.post('account.shop.swithShopList', { ...params, ...BM_CONFIG });
};

// 切换门店
export const doChangeShop = params => {
  return rest.post('shopAccount.changeShop', { ...params, ...BM_CONFIG });
};

// 获取门店信息及菜单
export const getShopInfo = params => {
  return rest.post('mwcenter.shopAccount.getMenuList', { ...params, ...BM_CONFIG });
};
