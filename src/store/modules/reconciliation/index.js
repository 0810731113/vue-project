import * as DETAIL from './reconciliationDetail';
import * as LOG from './reconciliationLog';

export default {
  state: {
    ...DETAIL.state,
    ...LOG.state
  },
  actions: {
    ...DETAIL.actions,
    ...LOG.actions
  },
  mutations: {
    ...DETAIL.mutations,
    ...LOG.mutations
  }
};
