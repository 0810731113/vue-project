import * as types from 'store/mutationTypes';
import { ACCOUNT_INFO } from 'constant/constants';
import localStorage from 'utils/localstorageUtil';

import { login } from 'api/user';

// initial state
const state = {
  username: '',
  companyname: '',
  errorMsg: ''
};

// actios
const actions = {
  async login ({ commit }, user) {
    const result = await login(user);
    const { state, data } = result;
    if (state !== 200) {
      commit(types.LOGIN_FAIL, { msg: '用户名密码错误' });
      return;
    }
    localStorage.getInstance().setItem(ACCOUNT_INFO, { token });
    commit(types.LOGIN_SUCCESS, { data });
  },
  clearError ({ commit }) {
    commit(types.CLEAR_LOGIN_ERROR);
  }
};

// mutations
const mutations = {
  [types.LOGIN_SUCCESS] (state, { data }) {
    for (let key in state) {
      state[key] = data[key] ? data[key] : '';
    }
  },
  [types.LOGIN_FAIL] (state, { msg }) {
    state.errorMsg = msg;
  },
  [types.CLEAR_LOGIN_ERROR] (state) {
    state.errorMsg = '';
  }
};

export default {
  state,
  actions,
  mutations
};
