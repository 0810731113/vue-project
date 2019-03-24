import * as API from 'api/setting';
import * as PARAMS from 'constant/systemOptions';
import * as types from './mutationTypes';

import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

import { SUCCESS } from 'constant/statusCode';

// initial state
export const state = {
  systemOptions: {
    parameterList: {
      [PARAMS.CLIENT_DATA]: {},
      [PARAMS.BUSINESS_DATE]: {},
      [PARAMS.RECEIPT_UPLOAD]: {},
      [PARAMS.CLOSE_TIME]: {},
      [PARAMS.IF_AUTO_CLOSE]: {},
      [PARAMS.SALE_RULES]: {},
      [PARAMS.SELF_CLOUD]: {},
      [PARAMS.TAKE_OUT_PRINTER]: {},
      [PARAMS.TAKE_OUT_CUSTOMER_PRINTER]: {},
      [PARAMS.BILL_OPTIMIZE_SERVICE]: {},
      [PARAMS.TAKE_OUT_PRINTER_PRINT_BILL]: {},
      [PARAMS.KDS_SERVICE]: {},
      [PARAMS.TAKEOUT_KDS_SWITCH]: {},  //外卖菜品是否进KDS (1:开，0:关')
      // order
      [PARAMS.BILL_PAYMENT]: {},
      [PARAMS.TOTAL_PRICE_PRECISION]: {},
      [PARAMS.BILL_ROUND]: {},
      [PARAMS.COUNT_PRECISION]: {},
      [PARAMS.UNIT_PRICE_PRECISION]: {},
      [PARAMS.SUB_TOTAL_PRICE_PRECISION]: {},
      [PARAMS.SERVICE_CHARGE]: {},
      [PARAMS.ACTION_AFTER_ORDER]: {},
      [PARAMS.SOLD_OUT_ORDER]: {},
      [PARAMS.PRINT_AFTER_OPEN]: {},
      [PARAMS.PRINT_AFTER_ORDER]: {},
      [PARAMS.COMBINE_SIMILARITY]: {},
      [PARAMS.ORDER_IN_ADVANCE]: {},
      [PARAMS.SUPPORT_RESERVE]: {},
      [PARAMS.WEIGHT_DISH_CHANGE_AMOUNT]: {},
      [PARAMS.DISH_MAPPING_AUTOMATICAL]: {},
      [PARAMS.MINUTES_BEFORE_TAKEAWAY]: {},
      [PARAMS.EXTRACT_DISH_MODE]: {},
      // cashier
      [PARAMS.CLEAR_TABLE_AFTER_PAYING]: {},
      [PARAMS.OPEN_CASHIER_BOX]: {},
      [PARAMS.HAND_OVER_OR_ACCOUNT]: {},
      [PARAMS.CLOSE_POPUP_AUTOMATICALLY]: {},
      [PARAMS.SALE_COUPON]: {},
      [PARAMS.PRESENT_COUPON]: {},
      [PARAMS.PAY_AUTOMATICALLY]: {},
      [PARAMS.PRINTER_BILL_AUTOMATICALLY]: {},
      [PARAMS.GROUP_PURCHASE]: {},
      [PARAMS.TAKEOUT_SALE_REPORT]: {},
      [PARAMS.SENDER_COST]: {},
      [PARAMS.MEAL_BOX_COST]: {},
      [PARAMS.ASSOCIATION_MEMBERS]: {},
      [PARAMS.ADVANCE_MONEY]: {},
      [PARAMS.RETREAT_REASON_REQUIRED]: {},
      [PARAMS.GIFT_REASON_REQUIRED]: {},
      [PARAMS.RECHECK_REASON_REQUIRED]: {},
      [PARAMS.SUB_RECHANGE]: {},
      [PARAMS.FIXED_FACE_VALUE]: {},
      // printer
      [PARAMS.WARNING_REPORT_SITE]: {},
      [PARAMS.PRINT_AFTER_RETREAT]: {},
      [PARAMS.PRINTER_TIME_OUT]: {},
      [PARAMS.BEE_WHEN_PRINT]: {},
      [PARAMS.AD_MESSAGE_1]: {},
      [PARAMS.COMBINE_WHEN_PRINT_BILL]: {},
      [PARAMS.PRINT_CUSTOMER_SURVEY]: {},
      [PARAMS.CHANGE_PRINTER_BACK_UP]: {},
      [PARAMS.PRINT_REPORT_AFTER_CLOSING]: {},
      [PARAMS.MEI_XIAO_ER_BILL_PRINT]: {},
      [PARAMS.MIAO_FU_BILL_PRINT]: {},
      [PARAMS.PAY_BILL_CUT_AUTOMATICALLY]: {},
      [PARAMS.WAY_OF_BILL_PRINT]: {},
      [PARAMS.REPORT_INCLUDE_SET]: {},
      [PARAMS.BATCH_RETREAT_PRINT]: {},
      [PARAMS.LANGUAGE_PRINT]: {},
      [PARAMS.MEMBERS_PRINT]: {},
      [PARAMS.PRINT_QR_CODE]: {},
      [PARAMS.QR_CODE_TEXT]: {},
      [PARAMS.TAKEOUT_PRINT]: {},
      [PARAMS.PRINT_MENU_CASH]: {},
      [PARAMS.PRINT_MEMBER_BALANCE]: {},
      [PARAMS.PLATFORM_PRINT_AUTOMATICALLY]: {},
      [PARAMS.BILL_WITH_RETREAT_INFO]: {},
      [PARAMS.FAST_FOOD_PRINT_PASS_FOOD_BILL]: {},
      [PARAMS.IF_PRINT_SAVE]: {},
      [PARAMS.IF_PRINT_TAKEOUT]: {},
      [PARAMS.IF_PRINT_NETRECIPTS]: {},

    },
    pageSize: DEFAULT_PAGES,
    pageIndex: DEFAULT_PAGE,
    openParameterList: [],
    areaList: [],
    menuList: [],
    paymentMethodListForChange: [],
    paymentMethodListForCoupon: [],
    hostListForSystemOptions: [],
    printerListForSystemOptions: [],
    resetSettingEnable: '',
    billServiceVisible: ''
  }
};

// actions
export const actions = {
  fetchParameterList: async ({ commit }, params) => {
    const result = await API.fetchParameterList(params);
    commit(types.FETCH_PARAMS_LIST, result);
  },
  updateParameter: async ({ commit }, params) => {
    commit(types.UPDATE_PARAMETER, params);
  },
  updateParameters: async ({ commit }, params) => {
    commit(types.UPDATE_PARAMETERS, params);
  },
  changeBusinessData: async ({ commit }, params) => {
    await API.changeBusinessData(params);
  },
  updateParameterList: async ({ state }) => {
    const { parameterList } = state.systemOptions;
    let paramVoList = [];
    for (let key in parameterList) {
      paramVoList.push(parameterList[key]);
    }
    await API.updateParameterList({ paramVoList });
  },
  fetchOpenParameterList: async ({ commit }, params) => {
    const result = await API.fetchOpenParameterList(params);
    commit(types.FETCH_OPEN_PARAMETER_LIST, result);
  },
  fetchAreaListForOpenParams: async ({ commit }, params) => {
    const result = await API.fetchAreaListForOpenParams(params);
    commit(types.FETCH_AREA_LIST_FOR_OPEN, result);
  },
  fetchMenuListForOpenParams: async ({ commit }, params) => {
    const result = await API.fetchMenuListForOpenParams(params);
    commit(types.FETCH_MENU_LIST_FOR_OPEN, result);
  },
  saveOpenParameterItem: async ({ dispatch, state }, params) => {
    const result = await API.saveOpenParameterItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  deleteOpenParameterItem: async ({ dispatch, state }, params) => {
    const result = await API.deleteOpenParameterItem(params);
    await fetchAfterSaveSuccess(dispatch, state, result);
  },
  fetchPaymentForChange: async ({ commit }, params) => {
    const result = await API.fetchPaymentMethodList(params);
    commit(types.FETCH_PAYMENT_FOR_CHANGE, result);
  },
  fetchPaymentForCoupon: async ({ commit }, params) => {
    const result = await API.fetchPaymentMethodList(params);
    commit(types.FETCH_PAYMENT_FOR_COUPON, result);
  },
  fetchHostListForSystemOptions: async ({ commit }, params) => {
    const result = await API.fetchHostListForSystemOptions(params);
    commit(types.FETCH_HOST_LIST_FOR_SYSTEM_OPTIONS, result);
  },
  fetchPrinterListForSystemOptions: async ({ commit }, params) => {
    const result = await API.fetchPrinterListForSystemOptions(params);

    commit(types.FETCH_PRINTER_LIST_FOR_SYSTEM_OPTIONS, result);
  },
  checkResetSettingEnable: async ({ commit }, params) => {
    const result = await API.checkResetSettingEnable(params);
    commit(types.CHECK_RESET_SETTING_ENABLE, result);
  },
  checkBillOptimizeServiceVisible: async ({ commit }, params) => {
    const result = await API.checkBillOptimizeServiceVisible(params);
    commit(types.CHECK_BILL_SERVICE_ENABLE, result);
  }
};

async function fetchAfterSaveSuccess (dispatch, state, result) {
  if (result.err.errNo === SUCCESS) {
    let { pageSize, pageIndex } = state.systemOptions;
    await dispatch('fetchOpenParameterList', { pageSize, pageIndex });
  }
}

// mutations
export const mutations = {
  [types.FETCH_PARAMS_LIST]: (state, result) => {
    const { lst } = result;
    const { systemOptions } = state;
    const { parameterList } = systemOptions;
    lst.map(item => {
      if(item.paramId == '022' && item.paramValue == '-1'){
        item.paramValue = ''
        parameterList[item.paramId] = item;
      }else{
        parameterList[item.paramId] = item;
      }

    });
    state.systemOptions = { ...systemOptions, parameterList };
  },
  [types.UPDATE_PARAMETER]: (state, params) => {
    const { parameterList } = state.systemOptions;
    parameterList[params.type][params.parameterName] = params.value;
    state.systemOptions = { ...state.systemOptions, parameterList };
  },
  [types.UPDATE_PARAMETERS]: (state, params) => {
    const { parameterList } = state.systemOptions;
    params.params.map(item => {
      parameterList[item.type][item.parameterName] = item.value;
    });
    state.systemOptions = { ...state.systemOptions, parameterList };
  },
  [types.FETCH_OPEN_PARAMETER_LIST]: (state, result) => {
    const { systemOptions } = state;
    const { pageSize, pageIndex, recordCount } = result;
    state.systemOptions = { ...systemOptions, pageSize, pageIndex, recordCount, openParameterList: result.openparamPageList };
  },
  [types.FETCH_AREA_LIST_FOR_OPEN]: (state, result) => {
    state.systemOptions.areaList = result.tableMareaDLLList;
  },
  [types.FETCH_MENU_LIST_FOR_OPEN]: (state, result) => {
    state.systemOptions.menuList = result.menulist;
  },
  [types.FETCH_PAYMENT_FOR_CHANGE]: (state, result) => {
    state.systemOptions.paymentMethodListForChange = result.paymentMethodList;
  },
  [types.FETCH_PAYMENT_FOR_COUPON]: (state, result) => {
    state.systemOptions.paymentMethodListForCoupon = result.paymentMethodList;
  },
  [types.FETCH_HOST_LIST_FOR_SYSTEM_OPTIONS]: (state, result) => {
    state.systemOptions.hostListForSystemOptions = result.paramHostlist;
  },
  [types.FETCH_PRINTER_LIST_FOR_SYSTEM_OPTIONS]: (state, result) => {
    state.systemOptions.printerListForSystemOptions = result.takeoutPrinterList;
  },
  [types.CHECK_RESET_SETTING_ENABLE]: (state, result) => {
    state.systemOptions.resetSettingEnable = result.shopService;
  },
  [types.CHECK_BILL_SERVICE_ENABLE]: (state, result) => {
    state.systemOptions.billServiceVisible = result.shopService;
  }
};
