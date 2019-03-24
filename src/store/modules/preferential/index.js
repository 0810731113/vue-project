import * as BARGAINFULL from './bargainFull';
import * as BARGAINSALE from './bargainSale';
import * as BUYGIFT from './buyGift';
import * as DISCOUNT_SCHEME from './discountScheme';
import * as VIPPRICE from './vipPrice';

export default {
  state: {
    ...VIPPRICE.state,
    ...BUYGIFT.state,
    ...BARGAINFULL.state,
    ...BARGAINSALE.state,
    ...DISCOUNT_SCHEME.state
  },
  actions: {
    ...VIPPRICE.actions,
    ...BUYGIFT.actions,
    ...BARGAINFULL.actions,
    ...BARGAINSALE.actions,
    ...DISCOUNT_SCHEME.actions
  },
  mutations: {
    ...VIPPRICE.mutations,
    ...BUYGIFT.mutations,
    ...BARGAINFULL.mutations,
    ...BARGAINSALE.mutations,
    ...DISCOUNT_SCHEME.mutations
  }
};
