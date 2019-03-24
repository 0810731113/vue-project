import * as THIRD_PARTY_INTERFACE from './thirdPartyInterface';
import * as INTERFACE_TYPE from './interfaceType';

export default {
  state: {
    ...THIRD_PARTY_INTERFACE.state,
    ...INTERFACE_TYPE.state
  },
  actions: {
    ...THIRD_PARTY_INTERFACE.actions,
    ...INTERFACE_TYPE.actions
  },
  mutations: {
    ...THIRD_PARTY_INTERFACE.mutations,
    ...INTERFACE_TYPE.mutations
  }
};
