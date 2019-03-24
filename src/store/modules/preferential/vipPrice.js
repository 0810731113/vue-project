import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  bashSetVIPBargains,
  getVIPLevels,
  getVipList,
  updateOneVIPBargain,
  getVipItemDetail,
  getCardList,
  getLevelByCard
} from 'api/preferential';

// initial state
export const state = {
  viplevellist: [],
  viplist: {
    vipColumns: [],
    list: [],
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  },
  vipItem: [],
  blackVipItem:[],  //新增黑卡权益
  cardList:[],
  cardLevel:[]
};

// actions
export const actions = {
  getVIPLevels: async ({ commit }, params) => {
    const result = await getVIPLevels(params);
    commit(types.API_DISHES_GETVIPLEVELS, result);
  },
  getVipList: async ({ commit }, params) => {
    const result = await getVipList(params);
    commit(types.API_DISHES_GETVIPLIST, result);
  },
  getVipItemDetail: async ({ commit }, params) => {
    const result = await getVipItemDetail(params);
    commit(types.API_GET_VIP_ITEM, result);
  },
  getCardList: async ({ commit }, params) => {
    const result = await getCardList(params);
    commit(types.API_GET_CARD_LIST, result);
  },
  getLevelByCard: async ({ commit }, params) => {
    const result = await getLevelByCard(params);
    commit(types.API_GET_LEVEL_BY_CARD, result);
  },
  updateOneVIPBargain: async ({ commit }, params) => {
    await updateOneVIPBargain(params);
  },
  bashSetVIPBargains: async ({ commit }, params) => {
    await bashSetVIPBargains(params);
  }
};

// mutations
export const mutations = {
  [types.API_DISHES_GETVIPLEVELS]: (state, result) => {
    const { list = [] } = result;
    list.map(item => { item.price = null; });
    state.viplevellist = list;
  },
  [types.API_DISHES_GETVIPLIST]: (state, result) => {
    const { vipColumns, list, recordCount, pageIndex, pageSize } = result;
    state.viplist = { ...state.viplist, list, vipColumns, recordCount, pageIndex, pageSize };
  },
  [types.API_GET_VIP_ITEM]: (state, result) => {
    const { list,cplist } = result;
    state.vipItem = list || [];
    state.blackVipItem = cplist || [];
  },
  [types.API_GET_CARD_LIST]: (state, result) => {
    const { vipCardType } = result;
    state.cardList = vipCardType || [];
  },
  [types.API_GET_LEVEL_BY_CARD]: (state, result) => {
    const { list } = result;
    state.cardLevel = list || [];
  }
};
