import * as API from 'api/setting';
import * as EmployeAPI from 'api/employe'
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  host: {
    hostList: [],
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    recordCount: 0,
    hostItem: '',
    cashBox: {},
    customerDisplay: '',
    electronicScale: '',
    doubleViewSet: '',
    print: '',
    hostClsList: [],
    hostPrintDeparts:[],  //关联打印部门
  }
};

// actions
export const actions = {
  fetchHostList: async ({ commit }, params) => {
    const result = await API.fetchHostList(params);
    commit(types.FETCH_HOST_LIST, result);
  },
  fetchHostItem: async ({ commit }, params) => {
    var p1 = API.fetchHostItem(params);
    var p2 = EmployeAPI.fetchShopDeptList({isPage: 0,deptCls:2});
    var result = await Promise.all([p1,p2]);
    console.log(result)
    var dirtyDeparts = result[0].hostPrintDeparts || []
    var originDeparts = result[1].shopDeptPageDtos || []
    var dirtyObj = dirtyDeparts.reduce((prev,next) => {
      prev[next.deptId] = next
      return prev
    },{})
    console.log(dirtyObj)

    var originDeparts = originDeparts.map((item,index) => {
      if(dirtyObj.hasOwnProperty(item.deptId)){
        item.isRelation = dirtyObj[item.deptId].isRelation
        item.isEdit = dirtyObj[item.deptId].isEdit
      }else{
        if(!item.hasOwnProperty("isRelation")){
          item.isRelation = 0
        }
        if(!item.hasOwnProperty("isEdit")){
          item.isEdit = 1
        }
      }
      return item
    })

    console.log(originDeparts)
    result[0].hostPrintDeparts = originDeparts

    commit(types.FETCH_HOST_ITEM, result[0]);
  },
  updateHostItem: async ({ dispatch, state }, params) => {
    const result = await API.updateHostItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deleteHostItem: async ({ dispatch, state }, params) => {
    const result = await API.deleteHostItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    const { pageSize, pageIndex } = state.host;
    await dispatch('fetchHostList', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_HOST_LIST]: (state, result) => {
    const { host } = state;
    const { hostList, pageSize, pageIndex, recordCount } = result;
    state.host = { ...host, hostList, pageSize, pageIndex, recordCount };
  },
  [types.FETCH_HOST_ITEM]: (state, result) => {
    const { host } = state;
    const { cashBox, customerDisplay, dzc, doubleViewSet, printCount, printerList, hostClsList,hostPrintDeparts } = result;
    state.host = { ...host, hostItem: result.host, cashBox, customerDisplay, printerList, electronicScale: dzc, doubleViewSet, print: printCount, hostClsList,hostPrintDeparts };
  }
};
