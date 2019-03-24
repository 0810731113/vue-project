import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import {
  fetchManageShopDetail,
  fetchManageShopList,
  getShopGroupTypes,
  getUpdateShopMessage,
  saveManageShopInfo,
  updateManageShopInfo,
  updateManageShopMessage,
  updateManageShopStatus,
  fetchShopTreeDataSource,
  createShopTreeNode,
  deleteShopTreeNode,
  updateShopTreeNode,
  getShopListByNode,
  moveShopTreeNode,
  moveShopNodeUp,
  moveShopNodeDown,
  moveShopItemUp,
  moveShopItemDown,
  moveShopTreeItem
} from 'api/shopManagement';

// initial state
export const state = {
  shopList: {
    manageShopList: [], // 分页列表
    shopGroupList: [],
    shopDetail: {},
    shopMessage: {},
    pageIndex: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGES,
    recordCount: 0,
    lastId: '',
    treeDataSource: [],
    newNodeId: null
  }
};

// actions
export const actions = {
  fetchManageShopList: async ({ commit }, params = {}) => {
    const result = await fetchManageShopList(params);
    commit(types.FETCH_MANAGE_SHOP_LIST, result);
  },
  getShopGroupTypes: async ({ commit }) => {
    const result = await getShopGroupTypes();
    commit(types.GET_SHOP_GROUP_TYPES, result);
  },
  fetchManageShopDetail: async ({ commit }, operateShopGUID) => {
    const detail = await fetchManageShopDetail(operateShopGUID);
    commit(types.FETCH_MANAGE_SHOP_DETAIL, detail);
  },
  updateManageShopInfo: async ({ commit }, params) => {
    await updateManageShopInfo(params);
  },
  saveManageShopInfo: async ({ commit }, params) => {
    await saveManageShopInfo(params);
  },
  updateManageShopStatus: async ({ commit }, params) => {
    await updateManageShopStatus(params);
  },
  getUpdateShopMessage: async ({ commit }, params = {}) => {
    const result = await getUpdateShopMessage(params);
    commit(types.GET_UPDATE_SHOP_MESSAGE, result);
  },
  updateManageShopMessage: async ({ commit }, params) => {
    await updateManageShopMessage(params);
  },
  fetchShopTreeDataSource: async ({ commit }, params = {}) => {
    const result = await fetchShopTreeDataSource(params);
    console.log(result)
    commit(types.FETCH_SHOP_TREE, result);
  },
  createShopTreeNode: async ({ commit }, params = {}) => {
    const result = await createShopTreeNode(params);
    commit(types.ADD_SHOP_TREE_GROUP_NODE, result);
  },
  deleteShopTreeNode: async ({ commit }, params = {}) => {
    await deleteShopTreeNode(params);
  },
  moveShopTreeNode: async ({ commit }, params = {}) => {
    await moveShopTreeNode(params);
  },
  moveShopTreeItem: async ({ commit }, params = {}) => {
    await moveShopTreeItem(params);
  },
  updateShopTreeNode: async ({ commit }, params = {}) => {
    await updateShopTreeNode(params);
  },
  getShopListByNode: async ({ commit }, params = {}) => {
    const result = await getShopListByNode(params);
    commit(types.FETCH_MANAGE_SHOP_LIST, result);
  },
  moveShopNodeUp: async ({ commit }, params = {}) => {
    await moveShopNodeUp(params);
  },
  moveShopNodeDown: async ({ commit }, params = {}) => {
    await moveShopNodeDown(params);
  },
  moveShopItemUp: async ({ commit }, params = {}) => {
    await moveShopItemUp(params);
  },
  moveShopItemDown: async ({ commit }, params = {}) => {
    await moveShopItemDown(params);
  }
};

// mutations
export const mutations = {
  [types.FETCH_MANAGE_SHOP_LIST]: (state, result) => {
    const { shopList } = state;
    const { manageShopList, pageIndex, recordCount } = result;
    state.shopList = { ...shopList, manageShopList, pageIndex, recordCount };
  },
  [types.GET_SHOP_GROUP_TYPES]: (state, result) => {
    state.shopList.shopGroupList = result.data;
  },
  [types.FETCH_MANAGE_SHOP_DETAIL]: (state, detail) => {
    state.shopList.shopDetail = detail.dto || {};
  },
  [types.GET_UPDATE_SHOP_MESSAGE]: (state, result) => {
    const { oldShopMessage, newShopMessage } = result;
    state.shopList.shopMessage = { oldShopMessage, newShopMessage };
  },
  [types.FETCH_SHOP_TREE]: (state, result) => {
    const { treeList } = result;
    var data = treeList
    if (data) {
      //const { nodeId, nodeName, nodeType } = data || {};
      //state.shopList.treeDataSource = [{ ...data, itemType: nodeType, itemName: nodeName, itemId: nodeId }];
      state.shopList.treeDataSource = data || [];
    } else {
      state.shopList.treeDataSource = [];
    }
  },
  [types.ADD_SHOP_TREE_GROUP_NODE]: (state, result) => {
    state.shopList.newNodeId = result.data;
  }
};
