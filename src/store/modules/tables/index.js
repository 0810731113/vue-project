import * as TABLETYPE from './tableType';
import * as TABLESTATES from './tableStates';
import * as DININGAREA from './diningarea';
import * as MANAGEMENT from './management';

export default {
  state: {
    ...TABLETYPE.state,
    ...TABLESTATES.state,
    ...DININGAREA.state,
    ...MANAGEMENT.state
  },
  actions: {
    ...TABLETYPE.actions,
    ...TABLESTATES.actions,
    ...DININGAREA.actions,
    ...MANAGEMENT.actions
  },
  mutations: {
    ...TABLETYPE.mutations,
    ...TABLESTATES.mutations,
    ...DININGAREA.mutations,
    ...MANAGEMENT.mutations
  }
};
