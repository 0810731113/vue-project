import * as types from 'store/mutationTypes';

// initial state
const state = {
  loading: false,
  loadingText: '',
  showToast: true,
  errorStatus: false,
  errorMsg: ''
};

// actions
const actions = {

};

// mutations
const mutations = {
  [types.LOADING]: (state, params) => {
    state.loading = params.loading;
    state.loadingText = params.text;
  },
  [types.SHOW_ERROR]: (state, params) => {
    state.showToast = params.showToast;
    state.errorStatus = params.status;
    state.errorMsg = params.msg;
  }
};

export default {
  state,
  actions,
  mutations
};
