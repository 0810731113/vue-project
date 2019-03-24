import * as DEPARTMENT from './department';
import * as FINGERPRINTCONFIG from './FingerPrintConfig';
import * as SHOPROLE from './shopRole';
import * as SHOPUSER from './shopUser';
import * as USERLOG from './userLog';

export default {
  state: {
    ...USERLOG.state,
    ...FINGERPRINTCONFIG.state,
    ...DEPARTMENT.state,
    ...SHOPUSER.state,
    ...SHOPROLE.state
  },
  actions: {
    ...USERLOG.actions,
    ...FINGERPRINTCONFIG.actions,
    ...DEPARTMENT.actions,
    ...SHOPUSER.actions,
    ...SHOPROLE.actions
  },
  mutations: {
    ...USERLOG.mutations,
    ...FINGERPRINTCONFIG.mutations,
    ...DEPARTMENT.mutations,
    ...SHOPUSER.mutations,
    ...SHOPROLE.mutations
  }
};
