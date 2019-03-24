import * as API from 'constant/API';

import { SERVICE } from 'constant/service';
import { SUCCESS } from 'constant/statusCode';
import { isShop } from 'utils/configUtil';
import rest from 'utils/restUtil';

// 菜品要求
export const fetchAllExplain = async (params) => {
  const url = isShop() ? API.API_EXPLAIN_LIST : API.API_COMPANY_EXPLAIN_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getExplainNewId = async () => {
  const url = isShop() ? API.API_GET_EXPLAIN_LASTID : API.API_COMPANY_GET_EXPLAIN_LASTID;
  const result = await rest.post(url, { service: SERVICE.DISH, operate: 'add' });
  return isShop() ? result.data : result.info.askGpId;
};

export const fetchExplainDetail = async (params) => {
  const url = isShop() ? API.API_FETCH_EXPLAIN_DETAIL : API.API_COMPANY_FETCH_EXPLAIN_DETAIL;
  const result = await rest.post(url, { ...params, service: SERVICE.DISH });
  return result.data || result.info;
};

export const deleteExplain = async (params) => {
  const url = isShop() ? API.API_DELETE_EXPLAIN : API.API_COMPANY_DELETE_EXPLAIN;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveExplain = async (params) => {
  const url = isShop() ? API.API_SAVE_EXPLAIN : API.API_COMPANY_SAVE_EXPLAIN;
  const result = await rest.post(url, { ...params, service: SERVICE.DISH });
  return { ...params, success: result.errNo === SUCCESS };
};

export const updateExplain = async (params) => {
  const url = isShop() ? API.API_UPDATE_EXPLAIN : API.API_COMPANY_UPDATE_EXPLAIN;
  await rest.post(url, { ...params, service: SERVICE.DISH });
  return params;
};

export const fetchExplainContentList = async (params) => {
  const url = isShop() ? API.API_EXPLAIN_CONTENT_LIST : API.API_COMPANY_EXPLAIN_CONTENT_LIST;
  const result = await rest.post(url, { ...params, service: SERVICE.DISH });
  return result.datas || result.askEntityDtos;
};

export const saveExplainContent = async (params) => {
  const url = isShop() ? API.API_SAVE_EXPLAIN_CONTENT : API.API_COMPANY_SAVE_EXPLAIN_CONTENT;
  const result = await rest.post(url, { ...params, service: SERVICE.DISH });
  return { ...params, id: result.data };
};

export const updateExplainContent = async (params) => {
  const url = isShop() ? API.API_UPDATE_EXPLAIN_CONTENT : API.API_COMPANY_UPDATE_EXPLAIN_CONTENT;
  await rest.post(url, { ...params, service: SERVICE.DISH });
  return params;
};

export const deleteExplainContent = async (params) => {
  const url = isShop() ? API.API_DELETE_EXPLAIN_CONTENT : API.API_COMPANY_DELETE_EXPLAIN_CONTENT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchAllMenuItems = async (params) => {
  const url = isShop() ? API.API_GET_ALL_MENU : API.API_COMPANY_GET_ALL_MENU;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchLinkedMenuItems = async (params) => {
  const url = isShop() ? API.API_GET_LINKED_MENU : API.API_COMPANY_GET_LINKED_MENU;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveExplainMenu = async (params) => {
  const url = isShop() ? API.API_SAVE_EXPLAIN_MENU : API.API_COMPANY_SAVE_EXPLAIN_MENU;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveExplainMenuCls = async (params) => {
  return await rest.post(API.API_SAVE_EXPLAIN_MENUCLS, { ...params, service: SERVICE.DISH });
};

export const fetchExplainMenuCls = async (params) => {
  return await rest.post(API.API_FETCH_EXPLAIN_MENUCLS, { ...params, service: SERVICE.DISH });
};

// 菜品分类
export const fetchAllClassify = async (params) => {
  const url = isShop() ? API.API_CLASSIFY_LIST : API.API_COMPANY_CLASSIFY_LIST;
  return await rest.post(url, { ...params, showSystemData: false, service: SERVICE.DISH });
};

export const fetchAllClassifyWithSystem = async (params) => {
  return await rest.post(API.API_CLASSIFY_LIST, { showSystemData: true, service: SERVICE.DISH });
};

export const deleteClassify = async (menuClsId) => {
  const url = isShop() ? API.API_DELETE_CLASSIFY_BY_ID : API.API_COMPANY_DELETE_CLASSIFY_BY_ID;
  return await rest.post(url, { service: SERVICE.DISH, menuClsId });
};

export const saveClassify = async (params) => {
  const url = isShop() ? API.API_SAVE_CLASSIFY : API.API_COMPANY_SAVE_CLASSIFY;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateClassify = async (params) => {
  const url = isShop() ? API.API_UPDATE_CLASSIFY : API.API_COMPANY_UPDATE_CLASSIFY;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getClassifyNewId = async () => {
  const url = isShop() ? API.API_GET_CLASSIFY_LASTID : API.API_COMPANY_GET_CLASSIFY_LASTID;
  const result = await rest.post(url, { service: SERVICE.DISH });
  return result.data;
};

export const fetchClassifyDetail = async (menuClsId) => {
  const result = await rest.post(API.API_FETCH_CLASSIFT_DETAIL, { service: SERVICE.DISH, menuClsId });
  return result.data;
};

export const fetchAllExpcls = async () => {
  const url = isShop() ? API.API_EXPCLS_LIST : API.API_COMPANY_EXPCLS_LIST;
  return await rest.post(url, { service: SERVICE.DISH });
};

export const fetchUploadImg = async (params) => {
  return await rest.post(API.API_GET_MENU_PICTURE_LIST, { ...params, service: SERVICE.DISH });
};

export const saveExpcls = async (params) => {
  const url = isShop() ? API.API_SAVE_EXPCLS : API.API_COMPANY_SAVE_EXPCLS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchAllRevenueType = async () => {
  const url = isShop() ? API.API_REVENUE_TYPE_LIST : API.API_COMPANY_REVENUE_TYPE_LIST;
  return await rest.post(url, { service: SERVICE.DISH });
};

export const saveRevenueType = async (params) => {
  const url = isShop() ? API.API_SAVE_REVENUE_TYPE : API.API_COMPANY_SAVE_REVENUE_TYPE;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateClassifySort = async (params) => {
  const url = isShop() ? API.API_UPDATE_CLASSIFY_SORT : API.API_COMPANY_UPDATE_CLASSIFY_SORT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

// 菜品
export const fetchAllMenu = async (params) => {
  const url = isShop() ? API.API_DISH_MENU_LIST : API.API_COMPANY_DISH_MENU_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateMenuSettingByIds = async (params) => {
  const url = isShop() ? API.API_BATCH_UPDATE_MENU : API.API_COMPANY_BATCH_UPDATE_MENU;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const deleteMenuByIds = async (params) => {
  const url = isShop() ? API.API_DELETE_MENU_BY_IDS : API.API_COMPANY_DELETE_MENU_BY_IDS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchMenuSettingList = async (params) => {
  const url = isShop() ? API.API_FETCH_MENU_SETTING_LIST : API.API_COMPANY_FETCH_MENU_SETTING_LIST;
  return await rest.post(url, { ...params,service: SERVICE.DISH });
};

export const fetchSortMenuList = async (params) => {
  const url = isShop() ? API.API_SORT_MENU_LIST : API.API_COMPANY_SORT_MENU_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateMenuSortList = async (params) => {
  const url = isShop() ? API.API_UPDATE_MENU_SORT : API.API_COMPANY_UPDATE_MENU_SORT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchMenuClassList = async (params) => {
  const url = isShop() ? API.API_GET_MENU_CLASS_LIST : API.API_COMPANY_GET_MENU_CLASS_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const exportMenuList = async () => {
  const url = isShop() ? API.API_EXPROT_MENU_LIST : API.API_COMPANY_EXPROT_MENU_LIST;
  return await rest.get(url, { service: SERVICE.DISH });
};

export const saveMenuItem = async (params) => {
  const url = isShop() ? API.API_SAVE_MENU_ITEM : API.API_COMPANY_SAVE_MENU_ITEM;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateMenuItem = async (params) => {
  const url = isShop() ? API.API_UPDATE_MENU_ITEM : API.API_COMPANY_UPDATE_MENU_ITEM;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getMenuHelpCode = async (params) => {
  const url = isShop() ? API.API_GET_MENU_HELP_CODE : API.API_COMPANY_GET_MENU_HELP_CODE;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchMenuDetail = async (params = {}) => {
  const url = isShop() ? API.API_GET_MENU_DETAIL : API.API_COMPANY_GET_MENU_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchMenuPrintList = async () => {
  const url = isShop() ? API.API_GET_MENU_PRINT_LIST : API.API_COMPANY_GET_MENU_PRINT_LIST;
  return await rest.post(url, { service: SERVICE.DISH });
};

export const uploadMenuToCloud = async (params) => {
  const url = isShop() ? API.API_MENU_UPLOAD_TO_CLOUD : API.API_COMPANY_MENU_UPLOAD_TO_CLOUD;
  return await rest.post(url, { service: SERVICE.DISH, ...params });
};

export const getMenuUploadResult = async () => {
  const url = isShop() ? API.API_GET_MENU_UPLOAD_RESULT : API.API_COMPANY_GET_MENU_UPLOAD_RESULT;
  return await rest.post(url, { service: SERVICE.DISH });
};

export const batchMoveMenus = async (params = {}) => {
  const url = isShop() ? API.API_BATCH_MOVE_MENU : API.API_COMPANY_BATCH_MOVE_MENU;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getSetMealDetail = async (params = {}) => {
  const url = isShop() ? API.API_GET_SET_MEAL_DETAIL : API.API_COMPANY_GET_SET_MEAL_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateSetMeal = async (params = {}) => {
  const url = isShop() ? API.API_UPDATE_SET_MEAL : API.API_COMPANY_UPDATE_SET_MEAL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveSetMeal = async (params = {}) => {
  const url = isShop() ? API.API_SAVE_SET_MEAL : API.API_COMPANY_SAVE_SET_MEAL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const deleteMenuUnit = async (params = {}) => {
  const url = isShop() ? API.API_DELETE_MENU_UNIT : API.API_COMPANY_DELETE_MENU_UNIT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

// 菜品打印部门
export const fetchAllMenuPrint = async (params) => {
  const url = isShop() ? API.API_MENU_PRINT_LIST : API.API_COMPANY_MENU_PRINT_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchPrintPlanList = async (params) => {
  const url = isShop() ? API.API_FETCH_PRINT_PLAN_LIST : API.API_COMPANY_FETCH_PRINT_PLAN_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const batchUpdatePrintDept = async (params) => {
  const url = isShop() ? API.API_BATCH_UPDATE_PRINT : API.API_COMPANY_BATCH_UPDATE_PRINT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateMenuPrint = async (params) => {
  const url = isShop() ? API.API_UPDATE_MENU_PRINT : API.API_COMPANY_UPDATE_MENU_PRINT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getAllPrintDept = async (params) => {
  const url = isShop() ? API.API_PRINT_DEPT_LIST : API.API_COMPANY_PRINT_DEPT_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getPrintNameList = async () => {
  const url = isShop() ? API.API_GET_PRINT_NAME_LIST : API.API_COMPANY_GET_PRINT_NAME_LIST;
  return await rest.post(url, { service: SERVICE.DISH });
};

export const getPrintPlanDetail = async (params) => {
  const url = isShop() ? API.API_PRINT_PLAN_DETAIL : API.API_COMPANY_PRINT_PLAN_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getInitPrintPlanDetail = async (params) => {
  const url = isShop() ? API.API_INIT_PRINT_PLAN_DETAIL : API.API_COMPANY_INIT_PRINT_PLAN_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getSetMealPrintDetail = async (params) => {
  const url = isShop() ? API.API_GET_SET_MEAL_PRINT_DETAIL : API.API_COMPANY_GET_SET_MEAL_PRINT_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const isPrintPlanExist = async (params) => {
  const url = isShop() ? API.API_IS_PRINT_PLAN_EXIST : API.API_COMPANY_IS_PRINT_PLAN_EXIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveMenuPrintPlan = async (params) => {
  const url = isShop() ? API.API_SAVE_PRINT_PLAN : API.API_COMPANY_SAVE_PRINT_PLAN;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const editMenuPrintPlan = async (params) => {
  const url = isShop() ? API.API_EDIT_PRINT_PLAN : API.API_COMPANY_EDIT_PRINT_PLAN;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const deletePrintPlan = async (params) => {
  const url = isShop() ? API.API_DELETE_PRINT_PLAN : API.API_COMPANY_DELETE_PRINT_PLAN;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const updateSetMealMenuPrint = async (params) => {
  const url = isShop() ? API.API_UPDATE_SET_MEAL_PRINT : API.API_COMPANY_UPDATE_SET_MEAL_PRINT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getListPrintPlanDetail = async (params) => {
  const url = isShop() ? API.API_LIST_MENU_PRINT_DETAIL : API.API_COMPANY_LIST_MENU_PRINT_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

// 套餐
export const fetchAllSetMeal = async (params) => {
  const url = isShop() ? API.API_FETCH_SET_MEALS : API.API_COMPANY_FETCH_SET_MEALS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetMealTrees = async (params) => {
  const url = isShop() ? API.API_FETCH_SET_MEALS_TREES : API.API_COMPANY_FETCH_SET_MEALS_TREES;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const deleteSetMeals = async (params) => {
  const url = isShop() ? API.API_DELETE_SET_MEALS : API.API_COMPANY_DELETE_SET_MEALS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const batchSetMealSetting = async (params) => {
  const url = isShop() ? API.API_SET_MEAL_SETTINGS : API.API_COMPANY_SET_MEAL_SETTINGS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const batchMoveSetMeal = async (params) => {
  const url = isShop() ? API.API_BATCH_MOVE_SET_MEAL : API.API_COMPANY_BATCH_MOVE_SET_MEAL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetSideDtlTree = async (params) => {
  const url = isShop() ? API.API_SET_SIDE_DTL_TREE : API.API_COMPANY_SET_SIDE_DTL_TREE;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetSideDtlList = async (params) => {
  const url = isShop() ? API.API_SET_SIDE_DTL_LIST : API.API_COMPANY_SET_SIDE_DTL_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const deleteSetSideDtl = async (params) => {
  const url = isShop() ? API.API_DELETE_SET_SIDE_DTL : API.API_COMPANY_DELETE_SET_SIDE_DTL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const addSetSideDtl = async (params) => {
  const url = isShop() ? API.API_ADD_SET_SIDE_DTL : API.API_COMPANY_ADD_SET_SIDE_DTL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetSideDtlDetail = async (params) => {
  const url = isShop() ? API.API_SET_SIDE_DTL_DETAIL : API.API_COMPANY_SET_SIDE_DTL_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchGarnishList = async (params) => {
  const url = isShop() ? API.API_FETCH_GARNISH_LIST : API.API_COMPANY_FETCH_GARNISH_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSelectedGarnishList = async (params) => {
  const url = isShop() ? API.API_FETCH_SELECTED_GARNISH_LIST : API.API_COMPANY_FETCH_SELECTED_GARNISH_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetMealBillSplitDetail = async (params) => {
  const url = isShop() ? API.API_FETCH_BILL_SPLIT_DETAIL : API.API_COMPANY_FETCH_BILL_SPLIT_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveSetMealBillSplitDetail = async (params) => {
  const url = isShop() ? API.API_SAVE_BILL_SPLIT_DETAIL : API.API_COMPANY_SAVE_BILL_SPLIT_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetMealPrinterList = async (params) => {
  const url = isShop() ? API.API_FETCH_SET_MEAL_PRINTER_LIST : API.API_COMPANY_FETCH_SET_MEAL_PRINTER_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchSetMealMenuClsList = async (params) => {
  const url = isShop() ? API.API_FETCH_SET_MEAL_MENUCLS_LIST : API.API_COMPANY_FETCH_SET_MEAL_MENUCLS_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveGarnishMenus = async (params) => {
  const url = isShop() ? API.API_SAVE_GARNISH_MENUS : API.API_COMPANY_SAVE_GARNISH_MENUS;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchCopySetSideItem = async (params) => {
  const url = isShop() ? API.API_FETCH_COPY_SET_SIDE_ITEM : API.API_COMPANY_FETCH_COPY_SET_SIDE_ITEM;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

// 菜品配料
export const fetchAllIngredientList = async (params) => {
  const url = isShop() ? API.API_FETCH_INGREDIENT_LIST : API.API_FETCH_MANAGE_INGREDIENT_LIST;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const moveIngredientGroup = async (params) => {
  const url = isShop() ? API.API_MOVE_MENU_INGREDIENT : API.API_MOVE_MANAGE_INGREDIENT_GROUP;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const deleteMenuIngredient = async (params) => {
  const url = isShop() ? API.API_DEL_INGREDIENT : API.API_DELETE_MANAGE_MENU_INGREDIENT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveIngredientGroup = async (params) => {
  const url = isShop() ? API.API_SAVE_INGREDIENT_GROUP : API.API_SAVE_MANAGE_INGREDIENT_GROUP;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const saveMenuIngredient = async (params) => {
  const url = isShop() ? API.API_SAVE_MENU_INGREDIENT : API.API_SAVE_MANAGE_MENU_INGREDIENT;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchIngredientDetail = async (params) => {
  const url = isShop() ? API.API_FETCH_INGREDIENT_DETAIL : API.API_FETCH_MANAGE_INGREDIENT_DETAIL;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const getIngredientGroups = async (params) => {
  const url = isShop() ? API.API_GET_INGREDIENT_GROUPS : API.API_GET_MANAGE_INGREDIENT_GROUP;
  return await rest.post(url, { ...params, service: SERVICE.DISH });
};

export const fetchIngredientGroupList = async (params) => {
  return await rest.post(API.API_FETCH_INGREDIENT_GROUP_LIST, { ...params, service: SERVICE.DISH });
};

export const deleteManageIngredientGroup = async (params) => {
  return await rest.post(API.API_DELETE_MANAGE_INGREDIENT_GROUP, { ...params, service: SERVICE.DISH });
};

export const getIngredientGroupDetail = async (params) => {
  return await rest.post(API.API_GET_INGREDIENT_GROUP_DETAIL, { ...params, service: SERVICE.DISH });
};

// 出售方案
export const fetchSellPlanList = async (params) => {
  return await rest.post(API.API_FETCH_SELL_PLAN_LIST, { ...params, service: SERVICE.DISH });
};

export const saveMenuSellPlan = async (params) => {
  return await rest.post(API.API_SAVE_SELL_PLAN, { ...params, service: SERVICE.DISH });
};

export const deleteMenuSellPlan = async (params) => {
  return await rest.post(API.API_DELETE_SELL_PLAN, { ...params, service: SERVICE.DISH });
};

export const getAllMarea = async () => {
  return await rest.post(API.API_GET_ALL_MAREA, { service: SERVICE.DISH });
};

export const getAllMSection = async () => {
  const url = isShop() ? API.API_GET_ALL_MSECTION : API.API_COMPANY_GET_ALL_MSECTION;
  return await rest.post(url, { service: SERVICE.DISH });
};

export const getSellPlanDetail = async (params) => {
  return await rest.post(API.API_GET_PLAN_DETAIL, { ...params, service: SERVICE.DISH });
};

export const getAllSellDay = async () => {
  return await rest.post(API.API_GET_SELL_DAY, { service: SERVICE.DISH });
};

//提成菜
export const getAllExtractSettingList = async (params) => {   //获取所有提成菜设置列表
  return await rest.post(API.API_GET_EXTRACT_SETTING_LIST, {...params, service: SERVICE.DISH });
};

export const getMarkExtractDishList = async (params) => {   //获取提成方案下面关联的提成菜
  return await rest.post('bonusMenu/getBonusMenuById', {...params, service: SERVICE.DISH });
};

export const getAllDishList = async (params) => {   //获取所有提成菜列表
  //return await rest.post('menuItem/getMenuItemAll', {...params, service: SERVICE.DISH });
  return await rest.post('bonusMenu/getBonusMenuItem', {...params, service: SERVICE.DISH });
};

export const newOrUpdateExtractSetting = async (params) => {   //保存或更新提成菜设置
  return await rest.post('bonusMenu/saveOrUpdateBonusMenus', {...params, service: SERVICE.DISH });
};

export const getConnectSalesList = async (params) => {   //获取提成菜销售人员列表
  return await rest.post('bonusMenu/getSalesUserList', {...params, service: SERVICE.DISH });
};

export const saveConnectSalesRelative = async (params) => {   //保存关联提成菜销售人员
  return await rest.post('bonusMenu/saveSalesUser', {...params, service: SERVICE.DISH });
};

export const disableOrDeleteExtractProgramme = async (params) => {   //删除或禁用提成方案
  return await rest.post('bonusMenu/updateBonusStatus', {...params, service: SERVICE.DISH });
};

export const batchUpdateDishPropertirs = async (params) => {   //批量跟新菜品属性
  return await rest.post('menu/batchUpdateMenuItemProp', {...params, service: SERVICE.DISH });
};
export const batchUpdateDishIncomeSaleBelong = async (params) => {   //批量跟新菜品销售收入归属
  return await rest.post('menu/batchUpdateMenuItemExpClsAndRevenue', {...params, service: SERVICE.DISH });
};

export const fetchSecondpointList = async (params) => {   //获取秒点菜品表格列表
  return await rest.post('secondPointAskGp/getMenuAskGpList', {...params, service: SERVICE.DISH });
};

export const fetchDishRequireGroup = async (params) => {   //获取秒点菜品要求列表分组
  return await rest.post('secondPointAskGp/getAskGpList', {...params, service: SERVICE.DISH });
};

export const fetchDishRequireBatchDetail = async (params) => {   //获取秒点菜品要求明细(批量的)
  return await rest.post('secondPointAskGp/getAskInfo', {...params, service: SERVICE.DISH });
};

export const fetchDishRequireSingleDetail = async (params) => {   //获取秒点菜品要求明细单个的详情
  return await rest.post('secondPointAskGp/getMenuAskGpInfo', {...params, service: SERVICE.DISH });
};

export const saveSingleDishRequire = async (params) => {   //保存单条要求
  return await rest.post('secondPointAskGp/updMenuAskGpInfo', {...params, service: SERVICE.DISH });
};

export const saveBatchDishRequire = async (params) => {   //批量保存要求
  return await rest.post('secondPointAskGp/updBatchMenuAskGpInfo', {...params, service: SERVICE.DISH });
};

export const saveBatchSyncUploadDishRequest = async (params) => {   //批量异步上传菜品请求
  return await rest.post('menu/upload/to/cloud/newApi', {...params, service: SERVICE.DISH });
};

export const getDishRequireSortList = async (params) => {   //获取菜品要求排序列表
  return await rest.post('askGp/queryAskGpForSort', {...params, service: SERVICE.DISH });
};

export const saveDishRequireSortList = async (params) => {   //保存菜品要求排序列表
  return await rest.post('askGp/updateAskGpToSort', {...params, service: SERVICE.DISH });
};

export const queryPackageSortList = async (params) => {   //获取套餐要求排序列表
  return await rest.post('dishes/qryItemSetSideForSort', {...params, service: SERVICE.DISH });
};

export const savePackageSortList = async (params) => {   //保存菜品要求排序列表
  return await rest.post('dishes/updateItemSetSideForSort', {...params, service: SERVICE.DISH });
};
