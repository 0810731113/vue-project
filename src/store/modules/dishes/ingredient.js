import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  deleteManageIngredientGroup,
  deleteMenuIngredient,
  fetchAllIngredientList,
  fetchIngredientDetail,
  fetchIngredientGroupList,
  getIngredientGroupDetail,
  getIngredientGroups,
  moveIngredientGroup,
  saveIngredientGroup,
  saveMenuIngredient
} from 'api/dishes';

import { isShop } from 'utils/configUtil';

// initial state
export const state = {
  ingredient: {
    ingredientList: [],
    ingredientDetail: {},
    ingredGroupsList: [],
    groupDetail: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0
  }
};

// actions
export const actions = {
  fetchAllIngredientList: async ({ commit }, params) => {
    const result = await fetchAllIngredientList(params);
    commit(types.FETCH_ALL_INGRED_LIST, result);
  },
  moveIngredientGroup: async ({ commit }, params) => {
    await moveIngredientGroup(params);
  },
  deleteMenuIngredient: async ({ commit }, params) => {
    await deleteMenuIngredient(params);
    commit(types.DELETE_MENU_INGREDIENT, params);
  },
  saveIngredientGroup: async ({ commit }, params) => {
    await saveIngredientGroup(params);
  },
  saveMenuIngredient: async ({ commit }, params) => {
    await saveMenuIngredient(params);
  },
  fetchIngredientDetail: async ({ commit }, params) => {
    const detail = await fetchIngredientDetail(params);
    commit(types.FETCH_INGREDIENT_DETAIL, detail);
  },
  getIngredientGroups: async ({ commit }, params) => {
    params = isShop() ? '' : params;
    const lists = await getIngredientGroups(params);
    commit(types.GET_INGREDIENT_GROUPS, lists);
  },
  fetchIngredientGroupList: async ({ commit }, params) => {
    const result = await fetchIngredientGroupList(params);
    commit(types.FETCH_INGREDIENT_GROUP_LIST, result);
  },
  deleteManageIngredientGroup: async ({ commit }, params) => {
    await deleteManageIngredientGroup(params);
    commit(types.DELETE_MANAGE_INGREDIENT_GROUP, params);
  },
  getIngredientGroupDetail: async ({ commit }, params) => {
    const detail = await getIngredientGroupDetail(params);
    commit(types.GET_INGREDIENT_GROUP_DETAIL, detail);
  }
};

// mutations
export const mutations = {
  [types.FETCH_ALL_INGRED_LIST]: (state, result) => {
    const { ingredient } = state;
    const { rows, dtoList, pageIndex, recordCount } = result;
    state.ingredient = { ...ingredient, ingredientList: rows || dtoList, pageIndex, recordCount };
  },
  [types.DELETE_MENU_INGREDIENT]: (state, params) => {
    const newList = state.ingredient.ingredientList.filter(item => !params.menuIngredients.includes(item.itemCd));
    state.ingredient.ingredientList = newList;
    state.ingredient.recordCount = newList.length;
  },
  [types.FETCH_INGREDIENT_DETAIL]: (state, detail) => {
    state.ingredient.ingredientDetail = detail.data || detail.info;
  },
  [types.GET_INGREDIENT_GROUPS]: (state, lists) => {
    state.ingredient.ingredGroupsList = lists.data || lists.menuClsDtos;
  },
  [types.FETCH_INGREDIENT_GROUP_LIST]: (state, result) => {
    const { ingredient } = state;
    const { dtoList, pageIndex, recordCount } = result;
    state.ingredient = { ...ingredient, ingredGroupsList: dtoList, pageIndex, recordCount };
  },
  [types.DELETE_MANAGE_INGREDIENT_GROUP]: (state, params) => {
    const newList = state.ingredient.ingredGroupsList.filter(item => !params.menuClsId.includes(item.menuClsId));
    state.ingredient.ingredGroupsList = newList;
    state.ingredient.recordCount = newList.length;
  },
  [types.GET_INGREDIENT_GROUP_DETAIL]: (state, detail) => {
    state.ingredient.groupDetail = detail.menuIngredGroupViewDto;
  }
};
