import * as CASHIER from './cashier';
import * as CREDITACCOUNT from './creditAccount';
import * as DELIVERER from './deliverer';
import * as ORDERSOURCE from './orderSource';
import * as PAYMENT from './payment';
import * as PAYMENTTYPE from './paymentType';
import * as REVENUE from './revenue';
import * as REVENUEGROUP from './revenueGroup';
import * as SALES from './sales';
import * as SHIFT from './shift';
import * as TAKEOUT from './takeout';

export default {
  state: {
    ...CASHIER.state,
    ...CREDITACCOUNT.state,
    ...DELIVERER.state,
    ...ORDERSOURCE.state,
    ...PAYMENT.state,
    ...PAYMENTTYPE.state,
    ...REVENUE.state,
    ...REVENUEGROUP.state,
    ...SALES.state,
    ...SHIFT.state,
    ...TAKEOUT.state
  },
  actions: {
    ...CASHIER.actions,
    ...CREDITACCOUNT.actions,
    ...DELIVERER.actions,
    ...ORDERSOURCE.actions,
    ...PAYMENT.actions,
    ...PAYMENTTYPE.actions,
    ...REVENUE.actions,
    ...REVENUEGROUP.actions,
    ...SALES.actions,
    ...SHIFT.actions,
    ...TAKEOUT.actions
  },
  mutations: {
    ...CASHIER.mutations,
    ...CREDITACCOUNT.mutations,
    ...DELIVERER.mutations,
    ...ORDERSOURCE.mutations,
    ...PAYMENT.mutations,
    ...PAYMENTTYPE.mutations,
    ...REVENUE.mutations,
    ...REVENUEGROUP.mutations,
    ...SALES.mutations,
    ...SHIFT.mutations,
    ...TAKEOUT.mutations
  }
};
