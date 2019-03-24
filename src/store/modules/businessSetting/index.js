import * as BACKREASON from './backReason';
import * as BILLNOTE from './billNote';
import * as DELIVERYNOTE from './deliveryNote';
import * as DISCOUNTREASON from './discountReason';
import * as GIFTREASON from './giftReason';
import * as ORDERUINT from './orderUint';
import * as RECHECREASON from './rechecReason';

export default {
  state: {
    ...BACKREASON.state,
    ...GIFTREASON.state,
    ...DISCOUNTREASON.state,
    ...RECHECREASON.state,
    ...DELIVERYNOTE.state,
    ...BILLNOTE.state,
    ...ORDERUINT.state
  },
  actions: {
    ...BACKREASON.actions,
    ...GIFTREASON.actions,
    ...DISCOUNTREASON.actions,
    ...RECHECREASON.actions,
    ...DELIVERYNOTE.actions,
    ...BILLNOTE.actions,
    ...ORDERUINT.actions
  },
  mutations: {
    ...BACKREASON.mutations,
    ...GIFTREASON.mutations,
    ...DISCOUNTREASON.mutations,
    ...RECHECREASON.mutations,
    ...DELIVERYNOTE.mutations,
    ...BILLNOTE.mutations,
    ...ORDERUINT.mutations
  }
};
