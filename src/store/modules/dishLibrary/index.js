import * as COOK_BOOK from './cookBook';
import * as SHOP_UPDATE from './shopUpdate';
import * as UPDATE_LOG from './updateLog';
import * as SHOP_DISH_DATA_UPLOAD from './shopDishDataUpload';

export default {
  state: {
    ...COOK_BOOK.state,
    ...SHOP_UPDATE.state,
    ...UPDATE_LOG.state,
    ...SHOP_DISH_DATA_UPLOAD.state,
  },
  actions: {
    ...COOK_BOOK.actions,
    ...SHOP_UPDATE.actions,
    ...UPDATE_LOG.actions,
    ...SHOP_DISH_DATA_UPLOAD.actions,
  },
  mutations: {
    ...COOK_BOOK.mutations,
    ...SHOP_UPDATE.mutations,
    ...UPDATE_LOG.mutations,
    ...SHOP_DISH_DATA_UPLOAD.mutations,
  }
};
