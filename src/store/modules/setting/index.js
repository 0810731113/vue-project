import * as FOODOUT from './foodOut';
import * as FOODPASS from './foodPass';
import * as HOST from './host';
import * as PRINTER from './printer';
import * as REPORT from './report';
import * as SERVICECHARGE from './serviceCharge';
import * as SYSTEMOPTIONS from './systemOptions';
import * as TAKEOUTMAPPING from './takeoutMapping';

export default {
  state: {
    ...REPORT.state,
    ...PRINTER.state,
    ...FOODOUT.state,
    ...FOODPASS.state,
    ...HOST.state,
    ...SYSTEMOPTIONS.state,
    ...TAKEOUTMAPPING.state,
    ...SERVICECHARGE.state
  },
  actions: {
    ...REPORT.actions,
    ...PRINTER.actions,
    ...FOODOUT.actions,
    ...FOODPASS.actions,
    ...HOST.actions,
    ...SYSTEMOPTIONS.actions,
    ...TAKEOUTMAPPING.actions,
    ...SERVICECHARGE.actions
  },
  mutations: {
    ...REPORT.mutations,
    ...PRINTER.mutations,
    ...FOODOUT.mutations,
    ...FOODPASS.mutations,
    ...HOST.mutations,
    ...SYSTEMOPTIONS.mutations,
    ...TAKEOUTMAPPING.mutations,
    ...SERVICECHARGE.mutations
  }
};
