import * as API from 'api/systemSetting';

// actions
export const actions = {
  updateSeniorManagementStatus: async ({ commit }, params) => {
    await API.updateSeniorManagementStatus(params);
  },
  deleteSeniorManagementItem: async ({ commit }, params) => {
    await API.deleteSeniorManagementItem(params);
  }
};
