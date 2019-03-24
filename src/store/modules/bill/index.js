import * as CHARGE from './chargepage';
import * as BILL_UPLOAD_LOG from './billUploadLog';

export default {
  state: {
    ...CHARGE.state,
    ...BILL_UPLOAD_LOG.state
  },
  actions: {
    ...CHARGE.actions,
    ...BILL_UPLOAD_LOG.actions
  },
  mutations: {
    ...CHARGE.mutations,
    ...BILL_UPLOAD_LOG.mutations
  }
};
