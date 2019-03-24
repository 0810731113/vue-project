import * as API from 'api/dishLibrary';
import * as types from './mutationTypes';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

// initial state
export const state = {
  shopDishDataUpload: {
    dataList: [],
    // pageIndex: DEFAULT_PAGE,
    // pageSize: DEFAULT_PAGES,
    // recordCount: 0,
  }
};

// actions
export const actions = {
  fetchShopDishDataUploadList: async ({ commit }, params) => {
    const result = await API.fetchShopDishDataList(params);
    console.log(result)
    commit(types.FETCH_SHOP_DISH_DATA_UPLOAD_LIST, result);
  },
};

// mutations
export const mutations = {
  [types.FETCH_SHOP_DISH_DATA_UPLOAD_LIST]: (state, result) => {
    const { shopDishDataUpload } = state;
    const { shopList} = result;
    state.shopDishDataUpload = { ...shopDishDataUpload, dataList: shopList };
  }
};
