/* eslint-disable quotes */
export const API_LOGIN = 'Account/CheckLogin';
export const API_GET_AUTH = 'get/getUserRight';

// SHOP
export const API_HOME = 'home/index';
export const API_SHOP = 'shop/queryShopInfo';
export const API_UPDATE_SHOP = 'shop/updateShopInfo';
export const API_UPLOAD_LOGO = 'shop/upload/shoplogo';
export const API_DELETE_SHOP_INFO_IMAGE = 'shop/delete/shoplogo';
export const API_FETCH_MENU = 'common/getCrmleftMenu';
export const API_FETCH_USER_INFO = 'common/shopinfo';
export const API_UNBIND_SHOP = 'shop/unbundling';
export const API_UPDATE_SHOP_DATA = 'home/updateData';

// 省市区列表
export const API_FETCH_PROVINCE_LIST = 'common/provinceInfo';
export const API_FETCH_CITY_LIST = 'common/cityInfo';
export const API_FETCH_DISTRICT_LIST = 'common/districtInfo';

// Guidance
export const API_GUIDANCE_LIST = 'wizard/qryList';
export const API_UPDATE_GUIDANCE_STEP = 'wizard/insert';

// Business
export const API_MSECTION_LIST = 'msection/queryMSectionList';
export const API_DELETE_MSECTION = 'msection/deleteMSection';
export const API_UPDATE_MSECTION = 'msection/updateMSection';
export const API_SAVE_MSECTION = 'msection/insertMSection';
export const API_GET_MSECTION_LASTID = 'msection/queryMSectionMaxId';
export const API_FETCH_MSECTION_DETAIL = 'msection/selectMSection';

export const API_CASHIER_LIST = 'shift/queryShiftList';
export const API_DELETE_CASHIER = 'shift/deleteShift';
export const API_UPDATE_CASHIER = 'shift/updateShift';
export const API_SAVE_CASHIER = 'shift/insertShift';
export const API_GET_CASHIER_LASTID = 'shift/queryShiftMaxId';
export const API_FETCH_CASHIER_DETAIL = 'shift/selectShift';
export const API_UPDATE_SHIFT_STATUS = 'shift/updateShiftStatus';

export const API_SALES_LIST = 'expcls/queryExpClsList';
export const API_DELETE_SALES = 'expcls/deleteExpCls';
export const API_UPDATE_SALES = 'expcls/updateExpCls';
export const API_SAVE_SALES = 'expcls/insertExpCls';
export const API_GET_SALES_LASTID = 'expcls/queryExpClsMaxId';
export const API_FETCH_SALES_DETAIL = 'expcls/selectExpCls';

export const API_REVENUE_LIST = 'revenuetype/queryRevenueTypeList';
export const API_DELETE_REVENUE = 'revenuetype/deleteRevenueType';
export const API_UPDATE_REVENUE = 'revenuetype/updateRevenueType';
export const API_SAVE_REVENUE = 'revenuetype/insertRevenueType';
export const API_GET_REVENUE_LASTID = 'revenuetype/queryRevenueTypeMaxId';
export const API_FETCH_REVENUE_DETAIL = 'revenuetype/selectRevenueType';
export const API_GET_REVENUE_GROUP_LIST = 'revenuetype/queryRevenueGroupNoPageList';
export const API_COMPANY_GET_REVENUE_GROUP_LIST = 'manageRevenuetype/queryRevenueGroupNoPageList';

export const API_FETCH_REVENUE_GROUP_LIST = 'revenueGroup/queryRevenueGroupList';
export const API_COMPANY_FETCH_REVENUE_GROUP_LIST = 'manageRevenueGroup/queryRevenueGroupList';
export const API_INSERT_REVENUE_GROUP = 'revenueGroup/insertRevenueGroup';
export const API_COMPANY_INSERT_REVENUE_GROUP = 'manageRevenueGroup/insertRevenueGroup';
export const API_GET_REVENUE_GROUP_DETAIL = 'revenueGroup/selectRevenueGroup';
export const API_COMPANY_GET_REVENUE_GROUP_DETAIL = 'manageRevenueGroup/selectRevenueGroup';
export const API_UPDATE_REVENUE_GROUP = 'revenueGroup/updateRevenueGroup';
export const API_COMPANY_UPDATE_REVENUE_GROUP = 'manageRevenueGroup/updRevenueGroup';
export const API_DELETE_REVENUE_GROUP = 'revenueGroup/deleteRevenueGroup';
export const API_COMPANY_DELETE_REVENUE_GROUP = 'manageRevenueGroup/delRevenueGroup';

export const API_CREDIT_ACCOUNT_LIST = 'creditaccount/queryCreditAccountList';
export const API_DELETE_CREDIT_ACCOUNT = 'creditaccount/deleteCreditAccount';
export const API_UPDATE_CREDIT_ACCOUNT = 'creditaccount/updateCreditAccount';
export const API_SAVE_CREDIT_ACCOUNT = 'creditaccount/insertCreditAccount';
export const API_GET_CREDIT_ACCOUNT_LASTID = 'creditaccount/queryCreditAccountMaxId';
export const API_FETCH_CREDIT_ACCOUNT_DETAIL = 'creditaccount/selectCreditAccount';

export const API_DELIVERER_LIST = 'deliverer/queryDelivererPageList';
export const API_DELETE_DELIVERER = 'deliverer/deleteDeliverer';
export const API_UPDATE_DELIVERER = 'deliverer/updateDeliverer';
export const API_SAVE_DELIVERER = 'deliverer/insertDeliverer';
export const API_GET_DELIVERER_LASTID = 'deliverer/queryDelivererMaxId';
export const API_FETCH_DELIVERER_DETAIL = 'deliverer/selectDeliverer';

export const API_ORDER_SOURCE_LIST = 'billsource/queryBillSourcePageList';
export const API_SORT_ORDER_SOURCE = 'billsource/queryBillSourceList';
export const API_UPDATE_SORT_ORDER_SOURCE = 'billsource/updateBillSourceSort';
export const API_DELETE_ORDER_SOURCE = 'billsource/deleteBillSource';
export const API_UPDATE_ORDER_SOURCE = 'billsource/updateBillSource';
export const API_SAVE_ORDER_SOURCE = 'billsource/insertBillSource';
export const API_GET_ORDER_SOURCE_LASTID = 'billsource/queryBillSourceMaxId';
export const API_FETCH_ORDER_SOURCE_DETAIL = 'billsource/selectBillSource';

/* ---------------门店：付款方式---------------- */
export const API_PAYMENT_LIST = 'payment/queryPaymentPageList';
export const API_SORT_PAYMENT_LIST = 'payment/queryPaymentListByShopGUID';
export const API_UPDATE_PAYMENT_SORT = 'payment/updatePaymentListSort';
export const API_DELETE_PAYMENT = 'payment/deletePayment';
export const API_DELETE_PAYMENT_BYIDS = 'payment/batchDeletePaymentList';
export const API_UPDATE_PAYMENT = 'payment/updatePayment';
export const API_BATCH_UPDATE_PAYMENT = 'payment/batchEditPaymentList';
export const API_SAVE_PAYMENT = 'payment/insertPayment';
export const API_SAVE_MWCOUPON = 'payment/addMwCoupons';
export const API_GET_PAYMENT_LASTID = 'payment/queryPaymentMaxId';
export const API_FETCH_PAYMENT_DETAIL = 'payment/selectPayment';
export const API_COUPON_LIST = 'payment/selectMwCouponsInfo';
export const API_UPDATE_SHORT_CUT = 'payment/updatePaymentShortCutKey';
export const API_FETCH_SHORT_CUT_KEYS = 'payment/getPaymentShortCutKey';
export const API_UPDATE_COLOR_OR_PREMIUM = 'payment/setColorOrIsPremium';

export const API_PAYMENT_TYPE_LIST = 'paymenttype/queryPaymentTypePageList';
export const API_ALL_PAYMENT_TYPE_LIST = 'paymenttype/queryPaymentTypeList';
export const API_DELETE_PAYMENT_TYPE = 'paymenttype/deletePaymentType';
export const API_UPDATE_PAYMENT_TYPE = 'paymenttype/updatePaymentType';
export const API_SAVE_PAYMENT_TYPE = 'paymenttype/insertPaymentType';
export const API_GET_PAYMENT_TYPE_LASTID = 'paymenttype/queryPaymentTypeMaxId';
export const API_FETCH_PAYMENT_TYPE_DETAIL = 'paymenttype/selectPaymentType';
/* ---------------门店：付款方式---------------- */

/* ---------------集团：付款方式---------------- */
export const API_COMP_PAYMENT_LIST = 'companyPayment/queryPaymentPageList';
export const API_COMP_SORT_PAYMENT_LIST = 'companyPayment/queryPaymentListByShopGUID';
export const API_COMP_UPDATE_PAYMENT_SORT = 'companyPayment/updatePaymentListSort';
export const API_COMP_DELETE_PAYMENT = 'companyPayment/deletePayment';
export const API_COMP_DELETE_PAYMENT_BYIDS = 'companyPayment/batchDeletePaymentList';
export const API_COMP_UPDATE_PAYMENT = 'companyPayment/updatePayment';
export const API_COMP_BATCH_UPDATE_PAYMENT = 'companyPayment/batchEditPaymentList';
export const API_COMP_SAVE_PAYMENT = 'companyPayment/insertPayment';
export const API_COMP_SAVE_MWCOUPON = 'companyPayment/addMwCoupons';
export const API_COMP_GET_PAYMENT_LASTID = 'companyPayment/queryPaymentMaxId';
export const API_COMP_FETCH_PAYMENT_DETAIL = 'companyPayment/selectPayment';
export const API_COMP_COUPON_LIST = 'companyPayment/selectMwCouponsInfo';
export const API_COMP_UPDATE_SHORT_CUT = 'companyPayment/updatePaymentShortCutKey';
export const API_COMP_FETCH_SHORT_CUT_KEYS = 'companyPayment/getPaymentShortCutKey';
export const API_COMP_UPDATE_COLOR_OR_PREMIUM = 'companyPayment/setColorOrIsPremium';

export const API_COMP_PAYMENT_TYPE_LIST = 'companyPaymenttype/queryPaymentTypePageList';
export const API_COMP_ALL_PAYMENT_TYPE_LIST = 'companyPaymenttype/queryPaymentTypeList';
export const API_COMP_DELETE_PAYMENT_TYPE = 'companyPaymenttype/deletePaymentType';
export const API_COMP_UPDATE_PAYMENT_TYPE = 'companyPaymenttype/updatePaymentType';
export const API_COMP_SAVE_PAYMENT_TYPE = 'companyPaymenttype/insertPaymentType';
export const API_COMP_GET_PAYMENT_TYPE_LASTID = 'companyPaymenttype/queryPaymentTypeMaxId';
export const API_COMP_FETCH_PAYMENT_TYPE_DETAIL = 'companyPaymenttype/selectPaymentType';
/* ---------------门店：付款方式---------------- */

export const API_FETCH_TAKEOUT_DETAIL = 'weChatConfig/selectWeChatConfigDetail';
export const API_UPDATE_TAKEOUT = 'weChatConfig/weChatConfigEdit';

// Table
export const API_TABLE_TYPE = 'mtableCls/qryMTableClsPageList';
export const API_TABLE_TAPE_ITEM = 'mtableCls/getMTableClsItem';
export const API_SAVE_TABLE_TYPE = 'mtableCls/addMTableClsItem';
export const API_UPDATE_TABLE_STATUS = 'mtableCls/updMTableClsStatus';
export const API_EDIT_TABLE_TYPE = 'mtableCls/editMTableClsItem';

export const API_DINING_AREA_LIST = 'tableArea/qryTableAreaPageList';
export const API_DINING_AREA_SORT_LIST = 'tableArea/getTableAreaSortOrder';
export const API_DINING_AREA_ITEM = 'tableArea/getTableAreaItem';
export const API_DINING_AREA_PRINTER_LIST = 'tableArea/getTableAreaPrinterList';
export const API_SAVE_DINING_AREA = 'tableArea/addTableAreaItem';
export const API_UPDATE_DINING_AREA_SORT_LIST = 'tableArea/updTableAreaSortOrder';
export const API_UPDATE_DINING_AREA_STATUS = 'tableArea/updTableAreaStatues';
export const API_EDIT_DINING_AREA = 'tableArea/editTableAreaItem';

export const API_MANAGEMENT_LIST = 'tableManager/getTableManagerPageList';
export const API_MANAGEMENT_SORT_LIST = 'tableManager/getTableMareaSortOrderList';
export const API_FETCH_MANAGEMENT_ITEM = 'tableManager/getTableManagerItem';
export const API_GET_TABLE_TYPE_LIST = 'tableManager/getMTableClsList';
export const API_GET_TABLE_AREA_LIST = 'tableManager/getTableMareaList';
export const API_SAVE_TABLE_MANAGEMENT_ITEM = 'tableManager/addTableManagerItem';
export const API_UPDATE_TABLE_MANAGEMENT_ITEM = 'tableManager/editTableManagerItem';
export const API_UPDATE_TABLE_MANAGEMENT_STATUS = 'tableManager/updTableManagerStatus';
export const API_SAVE_BATCH_TABLE_MANAGEMENT = 'tableManager/addBatchTableManagerItem';
export const API_UPDATE_BATCH_TABLE_MANAGEMENT = 'tableManager/updBatchTableManagerItem';
export const API_DELETE_BATCH_TABLE_MANAGEMENT = 'tableManager/updBatchTableManagerStatus';
export const API_UPDATE_MANAGEMENT_SORT_ORDER = 'tableManager/updBatchTableSortOrder';

export const API_TABLE_COLOR_LIST = 'tableColor/getTableColorList';
export const API_SAVE_TABLE_COLOR_LIST = 'tableColor/saveTableColorList';

// dishes
export const API_EXPLAIN_LIST = 'askGp/getAskGps';
export const API_GET_EXPLAIN_LASTID = 'askGp/getNewId';
export const API_FETCH_EXPLAIN_DETAIL = 'askGp/getAskGp';
export const API_SAVE_EXPLAIN = 'askGp/addAskGp';
export const API_UPDATE_EXPLAIN = 'askGp/updateAskGp';
export const API_DELETE_EXPLAIN = 'askGp/delAskGps';
export const API_EXPLAIN_CONTENT_LIST = 'askGp/getAsks';
export const API_SAVE_EXPLAIN_CONTENT = 'askGp/addAsk';
export const API_UPDATE_EXPLAIN_CONTENT = 'askGp/updateAsk';
export const API_DELETE_EXPLAIN_CONTENT = 'askGp/delAskByid';
export const API_GET_ALL_MENU = 'menuItem/getMenuItemAll';
export const API_GET_LINKED_MENU = 'askGp/getMenuItemAskGp';
export const API_SAVE_EXPLAIN_MENU = 'askGp/addMenuItemAskGp';
export const API_SAVE_EXPLAIN_MENUCLS = 'askGp/addAskGpMenuClsItem';
export const API_FETCH_EXPLAIN_MENUCLS = 'askGp/getAskGpMenuClsList';

export const API_CLASSIFY_LIST = 'menuCls/qryFoodCategory';
export const API_UPDATE_CLASSIFY = 'menuCls/updateMenuCls';
export const API_DELETE_CLASSIFY_BY_ID = 'menuCls/delMenuCls';
export const API_FETCH_CLASSIFT_DETAIL = 'menuCls/getMenuClassify';
export const API_SAVE_CLASSIFY = 'menuCls/insertMenuCls';
export const API_GET_CLASSIFY_LASTID = 'menuCls/qryMenuClsMaxId';
export const API_EXPCLS_LIST = 'menuClsRel/getDDLExpclsList';
export const API_SAVE_EXPCLS = 'menuClsRel/saveExpcls';
export const API_REVENUE_TYPE_LIST = 'menuClsRel/getDDLRevenuetypeList';
export const API_UPDATE_CLASSIFY_SORT = 'menuCls/menuClsSort';
export const API_SAVE_REVENUE_TYPE = 'menuClsRel/saveRevenuetype';

export const API_COMPANY_UPDATE_CLASSIFY = 'company/MenuCls/updateMenuCls';
export const API_COMPANY_DELETE_CLASSIFY_BY_ID = 'company/MenuCls/delMenuCls';
export const API_COMPANY_SAVE_CLASSIFY = 'company/MenuCls/insertMenuCls';
export const API_COMPANY_GET_CLASSIFY_LASTID = 'company/MenuCls/qryMenuClsMaxId';
export const API_COMPANY_EXPCLS_LIST = 'company/menuClsRel/getDDLExpclsList';
export const API_COMPANY_SAVE_EXPCLS = 'company/menuClsRel/saveExpcls';
export const API_COMPANY_REVENUE_TYPE_LIST = 'company/menuClsRel/getDDLRevenuetypeList';
export const API_COMPANY_SAVE_REVENUE_TYPE = 'company/menuClsRel/saveRevenuetype';
export const API_COMPANY_UPDATE_CLASSIFY_SORT = 'company/MenuCls/menuClsSort';

export const API_DISH_MENU_LIST = 'menu/brow';
export const API_BATCH_UPDATE_MENU = 'menu/set/batch/menu';
export const API_DELETE_MENU_BY_IDS = 'menu/check/logic/del';
export const API_FETCH_MENU_SETTING_LIST = 'menu/get/batch/set/items';
export const API_SORT_MENU_LIST = 'menu/get/menu/item/sort/list';
export const API_UPDATE_MENU_SORT = 'menu/save/update/menu/sort';
export const API_GET_MENU_CLASS_LIST = 'menuCls/get/menu/cls/list';
export const API_EXPROT_MENU_LIST = 'menu/export';
export const API_UPLOAD_MENUS = 'menu/excel/import/foot/item/save';
export const API_UPLOAD_PICTURES = 'menu/batch/upload';
export const API_SAVE_MENU_ITEM = 'menu/save/add/menuitem';
export const API_UPDATE_MENU_ITEM = 'menu/save/edit/menuitem';
export const API_GET_MENU_DETAIL = 'menu/get/menuitem';
export const API_GET_MENU_PRINT_LIST = 'menu/get/print';
export const API_MENU_UPLOAD_TO_CLOUD = 'menu/upload/to/cloud/api';
export const API_GET_MENU_UPLOAD_RESULT = 'menu/getUploadMesg';
export const API_GET_MENU_HELP_CODE = 'menu/get/help/code';
export const API_BATCH_MOVE_MENU = 'menu/move';
export const API_UPLOAD_MENU_IMG = 'menu/upload/menu/img';
export const API_DELETE_MENU_UNIT = 'menu/isDelMenuUint';
export const API_GET_MENU_PICTURE_LIST = 'menu/getMenuPictureList';

export const API_COMPANY_FETCH_MENU_SETTING_LIST = 'company/menu/get/batch/set/items';
export const API_COMPANY_DELETE_MENU_BY_IDS = 'company/menu/check/logic/del';
export const API_COMPANY_SORT_MENU_LIST = 'company/menu/get/menu/item/sort/list';
export const API_COMPANY_BATCH_UPDATE_MENU = 'company/menu/set/batch/menu';
export const API_COMPANY_UPDATE_MENU_SORT = 'company/menu/save/update/menu/sort';
export const API_COMPANY_GET_MENU_CLASS_LIST = 'company/MenuCls/get/menu/cls/list';
export const API_COMPANY_EXPROT_MENU_LIST = 'company/menu/export';
export const API_COMPANY_GET_MENU_HELP_CODE = 'company/menu/get/help/code';
export const API_COMPANY_GET_MENU_UPLOAD_RESULT = 'company/menu/getUploadMesg';
export const API_COMPANY_GET_MENU_DETAIL = 'company/menu/get/menuitem';
export const API_COMPANY_GET_MENU_PRINT_LIST = 'menu/get/print';
export const API_COMPANY_MENU_UPLOAD_TO_CLOUD = 'company/menu/upload/to/cloud/api';
export const API_COMPANY_DELETE_MENU_UNIT = 'company/menu/isDelMenuUint';
export const API_COMPANY_BATCH_MOVE_MENU = 'company/menu/move';

// 套餐
export const API_FETCH_SET_MEALS = 'dishes/foot/item/list';
export const API_FETCH_SET_MEALS_TREES = 'dishes/set/side/dtl/tree';
export const API_DELETE_SET_MEALS = 'dishes/set/side/item/bulk/delete';
export const API_BATCH_MOVE_SET_MEAL = 'dishes/set/side/menu/update';
export const API_GET_SET_MEAL_DETAIL = 'dishes/set/side/item/edit';
export const API_SET_MEAL_SETTINGS = 'dishes/set/side/batch/menu';
export const API_UPDATE_SET_MEAL = 'dishes/saveEditSetSideItem';
export const API_SET_SIDE_DTL_TREE = 'dishes/set/side/dtl/tree';
export const API_SAVE_SET_MEAL = 'dishes/saveAddSetSideItem';
export const API_SET_SIDE_DTL_LIST = 'dishes/get/side/dtl/list';
export const API_ADD_SET_SIDE_DTL = 'dishes/save/set/side/dtl';
export const API_SET_SIDE_DTL_DETAIL = 'dishes/set/side/dtl/edit';
export const API_DELETE_SET_SIDE_DTL = 'dishes/set/side/dtl/delete';
export const API_FETCH_GARNISH_LIST = 'dishes/get/set/side/dtl/data';
export const API_SAVE_GARNISH_MENUS = 'dishes/set/side/dtl/save';
export const API_FETCH_BILL_SPLIT_DETAIL = 'dishes/getLedgerSett';
export const API_FETCH_MANAGE_MSECTION_LIST = 'manageMSection/queryMSectionList';
export const API_FETCH_SELECTED_GARNISH_LIST = 'dishes/get/set/side/dtl/all';
export const API_SAVE_BILL_SPLIT_DETAIL = 'dishes/saveLedgerSett';
export const API_FETCH_SET_MEAL_PRINTER_LIST = 'dishes/getSideMenuPrint';
export const API_FETCH_SET_MEAL_MENUCLS_LIST = 'dishes/getSideItemTree';
export const API_FETCH_COPY_SET_SIDE_ITEM = 'dishes/saveCopySetSideItem';

// 套餐 集团
export const API_COMPANY_FETCH_SET_MEALS_TREES = '/company/MenuCls/get/menu/cls/list';
export const API_COMPANY_FETCH_SET_MEALS = 'company/dishes/foot/item/list';
export const API_COMPANY_DELETE_SET_MEALS = 'company/dishes/set/side/item/bulk/delete';
export const API_COMPANY_SET_MEAL_SETTINGS = 'company/dishes/set/side/batch/menu';
export const API_COMPANY_BATCH_MOVE_SET_MEAL = 'company/dishes/set/side/menu/update';
export const API_COMPANY_GET_SET_MEAL_DETAIL = 'company/dishes/set/side/item/edit';
export const API_COMPANY_UPDATE_SET_MEAL = 'company/dishes/saveEditSetSideItem';
export const API_COMPANY_SAVE_SET_MEAL = 'company/dishes/saveAddSetSideItem';
export const API_COMPANY_SET_SIDE_DTL_TREE = 'company/dishes/set/side/dtl/tree';
export const API_COMPANY_SET_SIDE_DTL_LIST = 'company/dishes/get/side/dtl/list';
export const API_COMPANY_DELETE_SET_SIDE_DTL = 'company/dishes/set/side/dtl/delete';
export const API_COMPANY_ADD_SET_SIDE_DTL = 'company/dishes/save/set/side/dtl';
export const API_COMPANY_SET_SIDE_DTL_DETAIL = 'company/dishes/set/side/dtl/edit';
export const API_COMPANY_FETCH_GARNISH_LIST = 'company/dishes/get/set/side/dtl/data';
export const API_COMPANY_FETCH_SELECTED_GARNISH_LIST = 'company/dishes/get/set/side/dtl/all';
export const API_COMPANY_SAVE_GARNISH_MENUS = 'company/dishes/set/side/dtl/save';
export const API_COMPANY_FETCH_BILL_SPLIT_DETAIL = 'company/dishes/getLedgerSett';
export const API_COMPANY_SAVE_BILL_SPLIT_DETAIL = 'company/dishes/saveLedgerSett';
export const API_COMPANY_FETCH_SET_MEAL_PRINTER_LIST = 'company/dishes/getSideMenuPrint';
export const API_COMPANY_FETCH_SET_MEAL_MENUCLS_LIST = 'company/dishes/getSideItemTree';
export const API_COMPANY_FETCH_COPY_SET_SIDE_ITEM = 'company/dishes/saveCopySetSideItem';

// 菜品打印部门
export const API_MENU_PRINT_LIST = 'menuPrint/getMenuPrintDept';
export const API_UPDATE_MENU_PRINT = 'menuPrint/updateMenuPrint';
export const API_PRINT_DEPT_LIST = 'menuPrint/getDepts';
export const API_BATCH_UPDATE_PRINT = 'menuPrint/updateMenuPrintDept';
export const API_IS_PRINT_PLAN_EXIST = 'menuPrint/isMenuPrintPlanExist';
export const API_SAVE_PRINT_PLAN = 'menuPrint/saveMenuPrintPlan';
export const API_EDIT_PRINT_PLAN = 'menuPrint/editMenuPrintPlan';
export const API_DELETE_PRINT_PLAN = 'menuPrint/deleteMenuPrintPlan';
export const API_FETCH_PRINT_PLAN_LIST = 'menuPrint/getMenuPrintPlan';
export const API_GET_PRINT_NAME_LIST = 'menuPrint/getMenuPrintPlanSelect';
export const API_PRINT_PLAN_DETAIL = 'menuPrint/getMenuPrintPlanDetail';
export const API_INIT_PRINT_PLAN_DETAIL = 'menuPrint/getMenuItemMulPrintPlan';
export const API_UPDATE_SET_MEAL_PRINT = 'menuPrint/updateMenuPrintSetDtl';
export const API_GET_SET_MEAL_PRINT_DETAIL = 'menuPrint/getMenuPrintSetDtlPlanDetail';
export const API_LIST_MENU_PRINT_DETAIL = 'menuPrint/listMenuPrintPlanDetail';

// 菜品打印部门 集团
export const API_COMPANY_MENU_PRINT_LIST = 'company/menuPrint/getMenuPrintDept';
export const API_COMPANY_UPDATE_MENU_PRINT = 'company/menuPrint/updateMenuPrint';
export const API_COMPANY_PRINT_DEPT_LIST = 'company/menuPrint/getDepts';
export const API_COMPANY_BATCH_UPDATE_PRINT = 'company/menuPrint/updateMenuPrintDept';
export const API_COMPANY_IS_PRINT_PLAN_EXIST = 'company/menuPrint/isMenuPrintPlanExist';
export const API_COMPANY_SAVE_PRINT_PLAN = 'company/menuPrint/saveMenuPrintPlan';
export const API_COMPANY_EDIT_PRINT_PLAN = 'company/menuPrint/editMenuPrintPlan';
export const API_COMPANY_DELETE_PRINT_PLAN = 'company/menuPrint/deleteMenuPrintPlan';
export const API_COMPANY_FETCH_PRINT_PLAN_LIST = 'company/menuPrint/getMenuPrintPlan';
export const API_COMPANY_GET_PRINT_NAME_LIST = 'company/menuPrint/getMenuPrintPlanSelect';
export const API_COMPANY_PRINT_PLAN_DETAIL = 'company/menuPrint/getMenuPrintPlanDetail';
export const API_COMPANY_INIT_PRINT_PLAN_DETAIL = 'company/menuPrint/getMenuItemMulPrintPlan';
export const API_COMPANY_UPDATE_SET_MEAL_PRINT = 'company/menuPrint/updateMenuPrintSetDtl';
export const API_COMPANY_GET_SET_MEAL_PRINT_DETAIL = 'company/menuPrint/getMenuPrintSetDtlPlanDetail';
export const API_COMPANY_LIST_MENU_PRINT_DETAIL = 'company/menuPrint/listMenuPrintPlanDetail';

export const API_FETCH_INGREDIENT_LIST = 'menuIngredient/getMenuIngredientList';
export const API_MOVE_MENU_INGREDIENT = 'menuIngredient/moveMenuIngredient';
export const API_DEL_INGREDIENT = 'menuIngredient/delMenuIngredient';
export const API_SAVE_INGREDIENT_GROUP = 'menuIngredient/saveMenuIngredGroup';
export const API_SAVE_MENU_INGREDIENT = 'menuIngredient/saveMenuIngredient';
export const API_FETCH_INGREDIENT_DETAIL = 'menuIngredient/getMenuIngredient';
export const API_GET_INGREDIENT_GROUPS = 'menuIngredient/getMenuIngredGroups';

export const API_FETCH_SELL_PLAN_LIST = 'shopSellPlan/getMenuSellProgram';
export const API_SAVE_SELL_PLAN = 'shopSellPlan/saveMenuSellPlan';
export const API_DELETE_SELL_PLAN = 'shopSellPlan/delMenuSellPlan';
export const API_GET_ALL_MAREA = 'shopSellPlan/getAllMArea';
export const API_GET_ALL_MSECTION = 'shopSellPlan/getAllMSection';
export const API_GET_PLAN_DETAIL = 'shopSellPlan/getShopSellPlan';
export const API_GET_SELL_DAY = 'shopSellPlan/getAllSellDay';

export const API_COMPANY_GET_ALL_MSECTION = 'companyShopSellPlan/getAllMSection';

// 门店：菜品特价
export const API_FETCH_BARGAIN_SALE_LIST = 'bargainSale/qryBargainList';
export const API_FETCH_BARGAIN_SALE_DETAIL = 'bargainSale/qryBargainSaleDetail';
export const API_DELETE_BARGAIN_SALE = 'bargainSale/delBargainSale';
export const API_INSERT_BARGAIN_SALE = 'bargainSale/insertBargainSale';
export const API_UPDATE_BARGAIN_SALE = 'bargainSale/updateBargainSale';

// 集团：菜品特价
export const API_COMP_FETCH_BARGAIN_SALE_LIST = 'companyBargainSale/qryBargainList';
export const API_COMP_FETCH_BARGAIN_SALE_DETAIL = 'companyBargainSale/qryBargainSaleDetail';
export const API_COMP_DELETE_BARGAIN_SALE = 'companyBargainSale/delBargainSale';
export const API_COMP_INSERT_BARGAIN_SALE = 'companyBargainSale/insertBargainSale';
export const API_COMP_UPDATE_BARGAIN_SALE = 'companyBargainSale/updateBargainSale';

// setting
export const API_HOST_LIST = 'host/qryHostPageList';
export const API_FETCH__HOST_ITEM = 'host/qryHost';
export const API_UPDATE__HOST_ITEM = 'host/updateHost';
export const API_DELETE__HOST_ITEM = 'host/deleteHost';
export const API_UPLOAD_HOST_IMG = 'host/uploadFile';

export const API_PRINTER_LIST = 'kitPrinter/qryPrinterPageList';
export const API_FETCH_PRINTER_ITEM = 'kitPrinter/qryPrinter';
export const API_SAVE_PRINTER_ITEM = 'kitPrinter/insertPrinter';
export const API_UPDATE_PRINTER_ITEM = 'kitPrinter/updatePrinter';
export const API_DELETE_PRINTER_ITEM = 'kitPrinter/deletePrinter';

export const API_BIND_CLOUD_PRINTER = 'kitPrinter/bindYunPrinter';
export const API_UNBIND_CLOUD_PRINTER = 'kitPrinter/unbindYunPrinter';

/* 门店：打印部门 start */
export const API_FOOD_OUT_DEPT_LIST = 'foodOut/qryDeptPageList';
export const API_FETCH_FOOD_OUT_DEPT_ITEM = 'foodOut/qryDept';
export const API_UPDATE_FOOD_OUT_DEPT_ITEM = 'foodOut/updateDept';
export const API_DELETE_FOOD_OUT_DEPT_ITEM = 'foodOut/deleteDept';
export const API_UPDATE_FOOD_OUT_DEPT_STATUS = 'foodOut/enableDept';
/* 门店：打印部门 end */

export const API_FOOD_PASS_DEPT_LIST = 'foodPass/qryDeptPageList';
export const API_FETCH_FOOD_PASS_DEPT_ITEM = 'foodPass/qryFoodPass';
export const API_DELETE_FOOD_PASS_DEPT_ITEM = 'foodOut/deleteDept';
export const API_UPDATE_FOOD_PASS_DEPT_ITEM = 'foodPass/updateFoodPass';

/* 集团：打印部门 start */
export const API_COMP_FOOD_OUT_DEPT_LIST = 'company/foodOut/qryDeptPageList';
export const API_COMP_FETCH_FOOD_OUT_DEPT_ITEM = 'company/foodOut/qryDept';
export const API_COMP_UPDATE_FOOD_OUT_DEPT_ITEM = 'company/foodOut/updateDept';
export const API_COMP_DELETE_FOOD_OUT_DEPT_ITEM = 'company/foodOut/deleteDept';
export const API_COMP_UPDATE_FOOD_OUT_DEPT_STATUS = 'company/foodOut/enableDept';
/* 集团：打印部门 end */

export const API_REPORT_LIST = 'report/getReportList';
export const API_REPORT_TEMPLATE_LIST = 'report/getReportTempletList';
export const API_UPDATE_REPORT_TEMPLATE = 'report/changeReportTemplet';
export const API_REPORT_TEMPLATE_ATTRIBUTE_LIST = 'report/listReportTempletProps';
export const API_REPORT_TEMPLATE_DATA_SOURCE = 'report/listReportTempletDataSources';
export const API_REPORT_TEMPLATE_ITEM = 'report/detailReportTemplet';
export const API_UPDATE_REPORT_TEMPLATE_ITEM = 'report/editReportTemplet';
export const API_DELETE_REPORT_TEMPLATE_ITEM = 'report/delReportTempletStatus';
export const API_UPDATE_REPORT_STATUS = 'report/updateReportStatus';
export const API_SAVE_REPORT_TEMPLATE_ITEM = 'report/insertReportTemplet';
export const API_SYSTEM_TEMPLATE_LIST = 'report/getSysReportTempletList';
export const API_CHECK_ADD_OR_EDIT_SYSTEMPLATE = 'report/isAddOrEditSysTemplet';
export const API_SAVE_SYSTEM_TEMPLATE = 'report/selectSysReportTemplet';

export const API_PARAMS_LIST = 'parameter/qryList';
export const API_CHANGE_BUSINESS_DATA = 'parameter/busdata';
export const API_UPDATE_PARAMTER_LIST = 'parameter/update';
export const API_OPEN_PARAMETER_LIST = 'openparam/getOpenparamPageList';
export const API_AREA_LIST_FOR_OPEN = 'openparam/getTableMareaList';
export const API_MENU_LIST_FOR_OPEN = 'openparam/getOpenPrarmMenuList';
export const API_SAVE_OPEN_PARAMETER_ITEM = 'openparam/addOpenparaItem';
export const API_DELETE_OPEN_PARAMETER_ITEM = 'openparam/updOpenparaItem';
export const API_FETCH_PAYMENT_FOR_SYSTEM_OPTIONS = 'parameter/getPaymentMethod';
export const API_FETCH_HOST_LIST_FOR_SYSTEM_OPTIONS = 'parameter/getHostlist';
export const API_FETCH_PRINTER_LIST_FOR_SYSTEM_OPTIONS = 'parameter/getTakeoutPrinter';
export const API_CHECK_RESET_SETTING_ENABLE = 'parameter/disabledJob';
export const API_CHECK_BILL_SERVICE_ENABLE = 'parameter/shopService';

export const API_TAKEOUT_MAPPING_LIST = 'thirdMap/getThdMapList';
export const API_VENDOR_DATA = 'thirdMap/getThdUpdateData';
export const API_DISH_LIST = 'thirdMap/getThdBargainList';
export const API_SAVE_DISH_LIST = 'thirdMap/saveThdMenu';
export const API_FETCH_TAKEOUT_LINK = 'thirdMap/getMeituanUrl';
export const API_FETCH_NO_TAKEOUT_LIST = 'thirdMap/getNoPageThdMapList';

export const API_FETCH_SERVICE_ITEMS = 'parameter/getParamItem';
export const API_FETCH_SERVICE_AREA_LIST = 'parameter/getParamMareaList';
export const API_SAVE_SERVICE_CHARGE = 'parameter/addServiceCharge';
export const API_UPDATE_AREA_SERVICE = 'parameter/updMareaService';

// business setting
export const API_BACK_REASON_LIST = 'backReason/qryPageList';
export const API_BACK_REASON_LIST_WITHOUT_PAGE = 'backReason/qryNoPageList';
export const API_UPDATE_SORT_BACK_REASON_LIST = 'backReason/updateSortOrder';
export const API_FETCH_BACK_REASON_DETAIL = 'backReason/qryEntity';
export const API_UPDATE_BACK_REASON = 'backReason/update';
export const API_SAVE_BACK_REASON = 'backReason/insert';
export const API_DELETE_BACK_REASON = 'backReason/delete';

export const API_GIFT_REASON_LIST = 'giftReason/qryPageList';
export const API_FETCH_GIFT_REASON_DETAIL = 'giftReason/qryEntity';
export const API_UPDATE_GIFT_REASON = 'giftReason/update';
export const API_SAVE_GIFT_REASON = 'giftReason/insert';
export const API_DELETE_GIFT_REASON = 'giftReason/delete';

export const API_DISCOUNT_REASON_LIST = 'discountReason/qryPageList';
export const API_FETCH_DISCOUNT_REASON_DETAIL = 'discountReason/qryEntity';
export const API_UPDATE_DISCOUNT_REASON = 'discountReason/update';
export const API_SAVE_DISCOUNT_REASON = 'discountReason/insert';
export const API_DELETE_DISCOUNT_REASON = 'discountReason/delete';

export const API_RECHEC_REASON_LIST = 'rechecReason/qryPageList';
export const API_FETCH_RECHEC_REASON_DETAIL = 'rechecReason/qryEntity';
export const API_UPDATE_RECHEC_REASON = 'rechecReason/update';
export const API_SAVE_RECHEC_REASON = 'rechecReason/insert';
export const API_DELETE_RECHEC_REASON = 'rechecReason/delete';

export const API_DELIVERY_NOTE_LIST = 'deliveryNote/qryPageList';
export const API_FETCH_DELIVERY_NOTE_DETAIL = 'deliveryNote/qryEntity';
export const API_UPDATE_DELIVERY_NOTE = 'deliveryNote/update';
export const API_SAVE_DELIVERY_NOTE = 'deliveryNote/insert';
export const API_DELETE_DELIVERY_NOTE = 'deliveryNote/delete';

export const API_BILL_NOTE_LIST = 'billNote/qryPageList';
export const API_FETCH_BILL_NOTE_DETAIL = 'billNote/qryEntity';
export const API_UPDATE_BILL_NOTE = 'billNote/update';
export const API_SAVE_BILL_NOTE = 'billNote/insert';
export const API_DELETE_BILL_NOTE = 'billNote/delete';

export const API_ORDER_UINT_LIST = 'orderUint/qryPageList';
export const API_ORDER_UINT_LIST_NO_PAGE = 'orderUint/qryList';
export const API_COMPANY_ORDER_UINT_LIST_NO_PAGE = 'company/orderUint/qryList';
export const API_FETCH_ORDER_UINT_DETAIL = 'orderUint/qryEntity';
export const API_UPDATE_ORDER_UINT = 'orderUint/update';
export const API_COMPANY_UPDATE_ORDER_UINT = 'company/orderUint/update';
export const API_SAVE_ORDER_UINT = 'orderUint/insert';
export const API_COMPANY_SAVE_ORDER_UINT = 'company/orderUint/insert';
export const API_DELETE_ORDER_UINT = 'menu/deleteMenuUint';
export const API_COMPANY_DELETE_ORDER_UINT = 'company/menu/deleteMenuUint';

// 员工管理
export const API_FETCH_USER_LOG_LIST = 'userLog/getUserLogList';
export const API_USER_OPERATION_LIST = 'userLog/getOperateUserList';

// 部门
export const API_FETCH_SHOP_DEPT_LIST = 'shopDept/getShopDeptList';
export const API_GET_SHOP_DEPT_DETAIL = 'shopDept/getShopDeptInfo';
export const API_UPDATE_SHOP_DEPT_INFO = 'shopDept/updShopDeptInfo';
export const API_DELETE_SHOP_DEPT = 'shopDept/updShopDeptStatus';

// 角色权限
export const API_FETCH_SHOP_ROLE_LIST = 'shopRole/getShopUserList';
export const API_UPDATE_SHOP_ROLE_STATUS = 'shopRole/updRoleStatus';
export const API_GET_SHOP_ROLE_DETAIL = 'shopRole/getShopRoleInfo';
export const API_UPDATE_SHOP_ROLE_INFO = 'shopRole/saveShopRoleInfo';
export const API_GET_SHOP_ROLE_INFO = 'shopRole/getShopRoleInfo';

// 用户
export const API_FETCH_SHOP_USER_LIST = 'shopUser/getShopUserList';
export const API_GET_SHOP_USER_DETAIL = 'shopUser/getShopUserInfo';
export const API_DELETE_SHOP_USER = 'shopUser/updShopUserStatus';
export const API_UPDATE_SHOP_USER_INFO = 'shopUser/saveShopUserInfo';
export const API_UPDATE_USER_PRINT_STATUS = 'shopUser/updUserPrintStatus';
export const API_FETCH_ALL_DISCOUNT_PLAN = 'shopUser/getUserDiscountList';

// 指纹权限设置
export const API_FETCH_FINGER_CONFIG_LIST = 'fingerPrint/showFingerConfigItems';
export const API_SAVE_FINGER_CONFIG = 'fingerPrint/saveFingerConfig';
export const API_GET_SUPER_USER_LIST = 'superuser/getSuperUserPageList';
export const API_GET_SHOP_SUPER_USER_LIST = 'shopsuperuser/getShopSuperUserPageList';

// 挂账对象
export const API_FETCH_CHARGEOBJ_LIST = 'bill/charge/bill/main';
export const API_FETCH_CHARGE_LIST = 'bill/get/debit/bill/info';
export const API_FETCH_ORDERNO = 'bill/charge/bill';
export const API_FETCH_CHARGEBILL_UPDATE = 'bill/charge/bill/batch';
export const API_FETCH_CHARGEBILLDONE_LIST = 'bill/get/charged/bill/info';
export const API_FETCH_CHARGECANCEL = 'bill/uncharge/bill/batch';
export const API_FETCH_BILLDETAIL = 'bill/show/charge/detail';
export const API_FETCH_BILLLIST = 'bill/get/bill/info';
export const API_FETCH_BILLLISTBATCH = 'bill/update/bill/batch';
//export const API_FETCH_BILLLISTUPLOAD = 'bill/get/bill/up/load/list';
export const API_FETCH_BILLLISTUPLOAD = 'bill/upload/list/new';
export const API_FETCH_BILLLISTUPLOADBATCH = 'bill/upload/info/new';

// 账单处理
// 账单上传记录
export const API_FETCH_BILL_UPLOAD_LOG_LIST = 'bill/getBillUploadLog';

// 门店：折扣方案
export const API_DISCOUNT_SCHEME_LIST = 'discount/qryDiscountPlans';
export const API_ALLOWED_USER_LIST = 'discount/getAllowedUser';
export const API_GET_DISCOUNT_DETAIL = 'discount/qryDiscountDetail';
export const API_GET_MAX_DISCOUNT_ID = 'discount/getMaxDiscountId';
export const API_SAVE_DISCOUNT_SCHEME_ITEM = 'discount/insertDiscount';
export const API_UPDATE_DISCOUNT_SCHEME_ITEM = 'discount/updateDiscount';
export const API_UPDATE_DISCOUNT_STATUS = 'discount/updDiscountStatus';
export const API_COPY_DISCOUNT_SCHEME = 'discount/copyDiscount';
export const API_FETCH_DISCOUT_SCHEME_COPY_LIST = 'discount/getPlanCopySelect';
export const API_FETCH_DISCOUNT_MENU_CLS_LIST = 'discount/getDiscountMenuClsList';
export const API_FETCH_DISCOUNT_LINKED_MENUS = 'discount/getDiscountMenuItem';
export const API_SAVE_DISCOUNT_LINKED_MENUS = 'discount/saveDiscountMenuItem';
export const API_SAVE_DISCOUNT_LINKED_MENUS_CLS = 'discount/saveDiscountMenuClsList';

// 集团：折扣方案
export const API_COMP_DISCOUNT_SCHEME_LIST = 'companyDiscount/qryDiscountPlans';
export const API_COMP_ALLOWED_USER_LIST = 'companyDiscount/getAllowedUser';
export const API_COMP_GET_DISCOUNT_DETAIL = 'companyDiscount/qryDiscountDetail';
export const API_COMP_GET_MAX_DISCOUNT_ID = 'companyDiscount/getMaxDiscountId';
export const API_COMP_SAVE_DISCOUNT_SCHEME_ITEM = 'companyDiscount/insertDiscount';
export const API_COMP_UPDATE_DISCOUNT_SCHEME_ITEM = 'companyDiscount/updateDiscount';
export const API_COMP_UPDATE_DISCOUNT_STATUS = 'companyDiscount/updDiscountStatus';
export const API_COMP_COPY_DISCOUNT_SCHEME = 'companyDiscount/copyDiscount';
export const API_COMP_FETCH_DISCOUT_SCHEME_COPY_LIST = 'companyDiscount/getPlanCopySelect';
export const API_COMP_FETCH_DISCOUNT_MENU_CLS_LIST = 'companyDiscount/getDiscountMenuClsList';
export const API_COMP_FETCH_DISCOUNT_LINKED_MENUS = 'companyDiscount/getDiscountMenuItem';
export const API_COMP_SAVE_DISCOUNT_LINKED_MENUS = 'companyDiscount/saveDiscountMenuItem';
export const API_COMP_SAVE_DISCOUNT_LINKED_MENUS_CLS = 'companyDiscount/saveDiscountMenuClsList';

// 系统商
// 门店检测
export const API_COMPANY_LIST = 'shopCheck/getCompanyShopList';
export const API_SHOP_GROUP_LIST = 'shopCheck/getShopGroupList';
export const API_SHOP_LIST = 'shopCheck/getShopList';
export const API_FETCH_SHOP_DETECTION_TOKEN = 'shopCheck/getShopDataList';
export const API_FETCH_SHOP_DETECTION_RESULT = 'shopCheck/getShopData';
export const API_FETCH_SHOP_CENTRAL_DATA = 'shopCheck/getNeutralData';

// 灰度发布管理
export const FETCH_GATED_LAUNCH_LIST = 'gray/getGrayList';
export const SAVE_GATED_LAUNCH = 'gray/addGrayShop';
export const DELETE_GATED_LAUNCH = 'gray/deleteShopGray';

// 工具
// 系统模板
export const API_FETCH_SYSTEM_REPORT_TEMPLATE_LIST = 'sysReport/getSysReportList';
export const API_FETCH_SYSTEM_REPORT_TYPE_LIST = 'sysReport/getReportIdSelect';
export const API_FETCH_SYSTEM_REPORT_ATTRIBUTE_LIST = 'sysReport/listReportTempletProps';
export const API_FETCH_SYSTEM_REPORT_TEMPLATE_DATASOURCE = 'sysReport/listReportTempletDataSources';
export const API_SAVE_SYSTEM_REPORT_TEMPLATE_ITEM = 'sysReport/insertSysReportTemplet';
export const API_UPDATE_SYSTEM_REPORT_TEMPLATE_STATUS = 'sysReport/updateSysReportStatus';
export const API_FETCH_SYSTEM_REPORT_TEMPLATE_ITEM = 'sysReport/getSysReportDetail';
export const API_UPDATE_SYSTEM_REPORT_TEMPLATE_ITEM = 'sysReport/editSysReportTemplet';
export const API_UPLOAD_SYS_REPORT_TEMPLATE = 'sysReport/upload/report/img';

// 打印机列表
export const API_SYSTEM_PRINTER_LIST = 'printerType/qryPrinterTypePageList';
export const API_SYSTEM_PRINTER_TYPE = 'printerType/qryPrinterType';
export const API_SAVE_SYSTEM_PRINTER_TYPE = 'printerType/insertPrinterType';
export const API_UPDATE_SYSTEM_PRINTER_TYPE = 'printerType/updatePrinterType';
export const API_UPLOAD_SYSTEM_PRINTER_IMAGE = 'printerType/uploadPrinterImage';

// 打印机购买地址
export const API_FETCH_PRINTER_BUY_ADDRESS = 'printerUrl/qryPrinterUrl';
export const API_ADD_PRINTER_BUY_ADDRESS = 'printerUrl/insertPrinterUrl';
export const API_UPDATE_PRINTER_BUY_ADDRESS = 'printerUrl/updatePrinterUrl';

// 反馈信息管理
// 反馈信息
export const API_FETCH_FEEDBACK_INFO_LIST = 'feedback/getFeedbackList';
export const API_FETCH_FEEDBACK_INFO_ITEM = 'feedback/getFeedbackInfo';

// 公告通知
export const API_FETCH_SYSTEM_NOTE_LIST = 'NoteSystem/noteList';
export const API_GET_SYSTEM_NOTE_DETAIL = 'NoteSystem/getNoteById';
export const API_SAVE_SYSTEM_NOTE = 'NoteSystem/noteEdit';
export const API_DELETE_SYSTEM_NOTE = 'NoteSystem/delNoteById';

// 对接管理
// 第三方对接
export const API_FETCH_THIRD_PARTY_INTERFACE_LIST = 'InterfaceManage/getInterfaceManageList';
export const API_FETCH_THIRD_PARTY_INTERFACE_LIST_WITHOUT_PAGINATION = 'InterfaceManage/getInterfaceTypeList';
export const API_FETCH_THIRD_PARTY_INTERFACE_ITEM = 'InterfaceManage/getInterfaceManageInfo';
export const API_DELETE_THIRD_PARTY_INTERFACE_ITEM = 'InterfaceManage/updStatus';
export const API_SAVE_THIRD_PARTY_INTERFACE_ITEM = 'InterfaceManage/addInterfaceManage';
export const API_UPDATE_THIRD_PARTY_INTERFACE_ITEM = 'InterfaceManage/updInterfaceManage';
export const API_FETCH_SHOP_DATASOURCE = 'InterfaceManage/getShopItemNamelist';

// 接口类型管理
export const API_FETCH_INTERFACE_TYPE_LIST = 'InterfaceManageType/getInterfaceManageTypeList';
export const API_DELETE_INTERFACE_TYPE_ITEM = 'InterfaceManageType/updStatus';
export const API_FETCH_INTERFACE_TYPE_ITEM = 'InterfaceManageType/addInterfaceTypeItem';
export const API_UPDATE_INTERFACE_TYPE_ITEM = 'InterfaceManageType/updInterfaceTypeItem';

// 总店
// 高层试吃
export const API_UPDATE_SENIOR_MANAGEMENT_STATUS = 'superuser/updSuperUserPrintStatus';
export const API_DELETE_SENIOR_MANAGEMENT_ITEM = 'superuser/updSuperUserStatus';
export const API_SENIOR_MANAGEMENT_FILE_UPLOAD = 'superuser/superUserimport';

// 会员价管理
export const API_DISHES_GETVIPLEVELS = 'VIPPrice/getVIPLevels';
export const API_DISHES_GETVIPLIST = 'VIPPrice/getVipList';
export const API_GET_VIP_ITEM = 'VIPPrice/getOneVIPBargain';
export const API_DISHES_UPDATEVIPPRICE = 'VIPPrice/updateOneVIPBargain';
export const API_DISHES_BASHSETVIPBARGAINS = 'VIPPrice/bashSetVIPBargains';
export const API_GET_CARD_LIST = 'VIPPrice/getVIPCardTypeSelected';
export const API_GET_LEVEL_BY_CARD = 'VIPPrice/getVIPSelectedByBindType';
export const API_GET_ALL_CARDS_LEVEL = 'VIPPrice/getVIPCardAndLevel';
export const API_GET_COMPANY_ALL_CARDS_LEVEL = 'companyDiscount/getVIPCardAndLevel';

export const API_COMP_DISHES_GETVIPLEVELS = 'companyDiscount/getVIPLevels';

// 门店：金额满减
export const API_FETCH_BARGAIN_FULL_LIST = 'bargainFull/qryBargainFullList';
export const API_INSERT_BARGAIN_FULL = 'bargainFull/insertBargainFull';
export const API_UPDATE_BARGAIN_FULL = 'bargainFull/updateBargainFull';
export const API_FETCH_BARGAIN_FULL_DETAIL = 'bargainFull/qryBargainFullDetail';
export const API_DELETE_BARGAIN_FULL = 'bargainFull/delBargainFull';
export const API_GET_CUT_PAYMENTS_LIST = 'bargainFull/getBargainCutPayments';
export const API_GET_BARGAIN_MAX_ID = 'bargainFull/getMaxBargainId';
export const API_FETCH_BARGAIN_FULL_LINKED_MENUS = 'bargainFull/getBargainFullItems';
export const API_UPDATE_BARGAIN_FULL_LINKED_MENUS = 'bargainFull/addBargainFullItems';

// 集团：金额满减
export const API_COMP_FETCH_BARGAIN_FULL_LIST = 'companyBargainFull/qryBargainFullList';
export const API_COMP_INSERT_BARGAIN_FULL = 'companyBargainFull/insertBargainFull';
export const API_COMP_UPDATE_BARGAIN_FULL = 'companyBargainFull/updateBargainFull';
export const API_COMP_FETCH_BARGAIN_FULL_DETAIL = 'companyBargainFull/qryBargainFullDetail';
export const API_COMP_DELETE_BARGAIN_FULL = 'companyBargainFull/delBargainFull';
export const API_COMP_GET_CUT_PAYMENTS_LIST = 'companyBargainFull/getBargainCutPayments';
export const API_COMP_GET_BARGAIN_MAX_ID = 'companyBargainFull/getMaxBargainId';
export const API_COMP_FETCH_BARGAIN_FULL_LINKED_MENUS = 'companyBargainFull/getBargainFullItems';
export const API_COMP_UPDATE_BARGAIN_FULL_LINKED_MENUS = 'companyBargainFull/addBargainFullItems';

// 门店：菜品买减
export const API_FETCH_BUY_GIFT_LIST = 'bargainSale/qryBargainList';
export const API_DELETE_BUY_GIFT = 'bargainBuy/delBargainBuy';
export const API_FETCH_BARGAIN_MENUS = 'bargainSale/getBargainItems';
export const API_SAVE_BUY_GIFT = 'bargainBuy/insertBargainBuy';
export const API_FETCH_BUY_GIFT_DETAIL = 'bargainBuy/qryBargainBuyDetail';
export const API_UPDATE_BUY_GIFT = 'bargainBuy/updateBargainBuy';

// 集团：菜品买减
export const API_COMP_FETCH_BUY_GIFT_LIST = 'companyBargainBuy/qryBargainList';
export const API_COMP_DELETE_BUY_GIFT = 'companyBargainBuy/delBargainBuy';
export const API_COMP_FETCH_BARGAIN_MENUS = 'companyBargainSale/getBargainItems';
export const API_COMP_SAVE_BUY_GIFT = 'companyBargainBuy/insertBargainBuy';
export const API_COMP_FETCH_BUY_GIFT_DETAIL = 'companyBargainBuy/qryBargainBuyDetail';
export const API_COMP_UPDATE_BUY_GIFT = 'companyBargainBuy/updateBargainBuy';

// 总店
// 总店首页详情
export const API_FETCH_COMPANY_DETAIL = 'manageHome/getManageIndexData';

// 增值服务
export const API_FETCH_VALUE_ADDED_LIST = 'shopService/shopServiceList';
export const API_FETCH_VALUE_ADDED_DETAIL = 'shopService/getShopServiceDetail';
export const API_SAVE_VALUE_ADDED = 'shopService/saveShopService';
export const API_EXPORT_VALUE_ADDED = 'shopService/export';

// 终端管理
export const API_FETCH_TERMINAL_SUMMARY = 'shopTerminal/summary';
export const API_FETCH_VERSION_LIST = 'shopTerminal/versionList';
export const API_FETCH_TERMINAL_LIST = 'shopTerminal/terminalList';

// 版本发布管理
// 版本升级
export const API_FETCH_UPGRADE_LIST = 'versionUpgrade/versionUpgradeList';
export const API_FETCH_UPGRADE_DETAIL = 'versionUpgrade/versionUpgradeDetail';
export const API_SAVE_UPGRADE = 'versionUpgrade/insertVersionUpgradeItem';
export const API_DELETE_UPGRADE = 'versionUpgrade/deleteVersionUpgrade';
export const API_PUSH_UPGRADE_VERSION = 'versionUpgrade/pushVersionUpgrade';

// 版本发布
export const API_FETCH_PUBLISH_LIST = 'versionPublish/versionPublishList';
export const API_FETCH_PUBLISH_DETAIL = 'versionPublish/versionPublishDetail';
export const API_UPDATE_PUBLISH = 'versionPublish/updateVersionPublishItem';
export const API_DELETE_PUBLISH = 'versionPublish/deleteVersionPublishItem';

// 软件类型
export const API_FETCH_SOFTWARE_LIST = 'softwareType/softwareTypeList';
export const API_FETCH_SOFTWARE_DETAIL = 'softwareType/getSoftwareTypeDetail';
export const API_UPDATE_SOFTWARE = 'softwareType/updateSoftwareType';
export const API_DELETE_SOFTWARE = 'softwareType/deleteSoftwareType';

// 餐饮公司
// 公司信息
export const API_FETCH_MANAGE_COMPANY_DETAIL = 'manageHome/getManageCompanyDetail';
export const API_SAVE_MANAGE_COMPANY_INFO = 'manageHome/saveManageCompanyInfo';

// 门店管理 门店列表
export const API_FETCH_MANAGE_SHOP_LIST = 'manageShop/getManageShopList';
export const API_GET_SHOP_GROUP_TYPES = 'manageShop/getShopGroupTypes';
export const API_FETCH_MANAGE_SHOP_DETAIL = 'manageShop/getManageShopDetail';
export const API_UPDATE_MANAGE_SHOP_INFO = 'manageShop/editManageShop';
export const API_SAVE_MANAGE_SHOP_INFO = 'manageShop/insertManageShop';
export const API_UPDATE_MANAGE_SHOP_STATUS = 'manageShop/updateManageShopStatus';
export const API_GET_UPDATE_SHOP_MESSAGE = 'manageShop/getUpdateManageShopMessage';
export const API_UPDATE_MANAGE_SHOP_MESSAGE = 'manageShop/updateManageShopMessage';
//export const API_FETCH_SHOP_TREE_DATA_SOURCE = 'companyShopTree/getAllNodes'; //集团管理店铺列表
export const API_FETCH_SHOP_TREE_DATA_SOURCE = 'companyShopTree/getCompanyNodes'; //集团管理店铺列表
export const API_CREATE_SHOP_TREE_NODE = 'companyShopTree/createNodes';
export const API_DELETE_SHOP_TREE_NODE = 'companyShopTree/delNode';
export const API_MOVE_SHOP_TREE_NODE = 'companyShopTree/moveNode';
export const API_MOVE_SHOP_TREE_ITEM = 'companyShopTree/bindData';
export const API_UPDATE_SHOP_TREE_NODE = 'companyShopTree/updateNode';
export const API_GET_SHOP_LIST_BY_NODE = 'companyShopTree/getShopListByNode';
export const API_MOVE_SHOP_NODE_UP = 'companyShopTree/nodeUp';
export const API_MOVE_SHOP_NODE_DOWN = 'companyShopTree/nodeDown';
export const API_MOVE_SHOP_ITEM_UP = 'companyShopTree/bindDataUp';
export const API_MOVE_SHOP_ITEM_DOWN = 'companyShopTree/bindDataDown';
export const API_SEND_COMPANY_DATA = 'company/datasend/send';
export const API_IMMEDIATE_COMPANY_DATA = 'company/datasend/immediatelySend';

// 连锁标准化列表
export const API_FETCH_CHAINS_SETTING = 'standardizationsetting/getTableInfoList';
export const API_SAVE_CHAINS_SETTING = 'standardizationsetting/saveTableInfo';

// ERP 系统对接
export const API_FETCH_ERP_SYSTEM_INTEGRATION_LIST = 'erpSystem/getErpSystemSettingList';
export const API_BATCH_UPLOAD_SHOP_DATA = 'erpSystem/uploadErpSystem';
export const API_BATCH_CHANGE_UPLAOD_WAY = 'erpSystem/updErpSystemSetting';

// 营业设定
// 销售分类
export const API_COMPANY_SALES_LIST = 'manageExpcls/queryExpClsList';
export const API_COMPANY_DELETE_SALES = 'manageExpcls/deleteExpCls';
export const API_COMPANY_UPDATE_SALES = 'manageExpcls/updateExpCls';
export const API_COMPANY_SAVE_SALES = 'manageExpcls/insertExpCls';
export const API_COMPANY_GET_SALES_LASTID = 'manageExpcls/queryExpClsMaxId';
export const API_COMPANY_FETCH_SALES_DETAIL = 'manageExpcls/selectExpCls';

// 收入分类
export const API_COMPANY_REVENUE_LIST = 'manageRevenuetype/queryRevenueTypeList';
export const API_COMPANY_DELETE_REVENUE = 'manageRevenuetype/deleteRevenueType';
export const API_COMPANY_UPDATE_REVENUE = 'manageRevenuetype/updateRevenueType';
export const API_COMPANY_SAVE_REVENUE = 'manageRevenuetype/insertRevenueType';
export const API_COMPANY_GET_REVENUE_LASTID = 'manageRevenuetype/queryRevenueTypeMaxId';
export const API_COMPANY_FETCH_REVENUE_DETAIL = 'manageRevenuetype/selectRevenueType';

// 菜品库
// 菜品要求
export const API_COMPANY_EXPLAIN_LIST = 'companyAskGp/getAskGps';
export const API_COMPANY_GET_EXPLAIN_LASTID = 'company/dishes/tb/askgp/edit';
export const API_COMPANY_SAVE_EXPLAIN = 'companyAskGp/addAskGp';
export const API_COMPANY_DELETE_EXPLAIN = 'companyAskGp/delAskGps';
export const API_COMPANY_FETCH_EXPLAIN_DETAIL = '/companyAskGp/getAskGp';
export const API_COMPANY_UPDATE_EXPLAIN = 'companyAskGp/updateAskGp';
export const API_COMPANY_EXPLAIN_CONTENT_LIST = 'companyAskGp/getAsks';
export const API_COMPANY_SAVE_EXPLAIN_CONTENT = 'companyAskGp/addAsk';
export const API_COMPANY_UPDATE_EXPLAIN_CONTENT = 'companyAskGp/updateAsk';
export const API_COMPANY_DELETE_EXPLAIN_CONTENT = 'companyAskGp/delAskByid';
export const API_COMPANY_GET_ALL_MENU = 'menuItem/getMenuItemAll';
export const API_COMPANY_GET_LINKED_MENU = 'companyAskGp/getMenuItemAskGp';
export const API_COMPANY_SAVE_EXPLAIN_MENU = 'company/dishes/add/menuitem/askgp';

// 菜单
export const API_COOK_BOOK_LIST = 'company/cookbook/get/cookbook/list';
export const API_COOK_BOOK_ITEM = 'company/cookbook/edit';
export const API_SAVE_COOK_BOOK_ITEM = 'company/cookbook/save/cookbook/item';
export const API_DELETE_COOK_BOOK_ITEM = 'company/cookbook/del/cookbook/item';
export const API_COPY_COOK_BOOK_ITEM = 'company/cookbook/copy/cookook/item';
export const API_FETCH_COMPANY_MENU_LIST = 'company/cookbook/get/menuitem/data';
export const API_FETCH_COMPANY_LINKED_MENU_LIST = 'company/cookbook/get/menuitem';
export const API_FETCH_COMPANY_DETAILS = 'companyShopTree/getAllNodes';

// 门店更新管理
export const API_FETCH_SHOP_UPDATE_LIST = 'company/dishes/get/shop/cook/info';
export const API_FETCH_SHOP_UPDATE_SEARCH_FORM_DATA = 'company/dishes/update/shop/info';
export const API_BATCH_UPDATE_COOK_BOOK = 'company/dishes/update/shop/dishes/batch';
export const API_UPDATE_SHOP_COOK_BOOK = 'company/dishes/update/shop/cook/book';
export const API_FETCH_COMPANY_DISH_MENU_LIST = 'company/cookbook/getMenuItemPage';
export const API_FETCH_ADD_MENU_AUTHORITY = 'company/dishes/role/shop';
export const API_UPDATE_ADD_MENU_AUTHORITY = 'company/dishes/save/role/shop';
export const API_COOK_BOOK_MANAGEMENT_LIST = 'company/dishes/update/shop/manage';
export const API_FETCH_CONTENT_TYPES = 'company/datasend/getBusinessContent';
export const API_FETCH_HISTORY_SHOP = 'company/datasend/getHistoryShop';

// 更新日志
export const API_FETCH_UPDATE_LOG_LIST = 'company/datasend/getShopDataSendList';
export const API_CANCEL_TIMED_UPDATE = 'company/datasend/cancel';
export const API_FETCH_UPDATE_LOG_DETAIL = 'company/datasend/getSnapShot';

// 调账管理
export const API_FETCH_RECONCILIATION_SHOP_LIST = 'adjustAccount/getShopInfoListByConpanyGUID';
export const API_FETCH_RECONCILIATION_DETAIL_LIST = 'adjustAccount/queryAdjustAccountPageList';
export const API_FETCH_RECONCILIATION_DETAIL_ITEM = 'adjustAccount/getAdjustAccountDetail';
export const API_FETCH_RECONCILIATION_USER_LIST = 'adjustAccount/getShopUserList';
export const API_FETCH_RECONCILIATION_PAYMENTLIST = 'adjustAccount/getPaymentList';
export const API_FETCH_RECONCILIATION_LOG_LIST = 'adjustAccount/getBillAdjustList';
export const API_SAVE_RECONCILIATION_DETAIL = 'adjustAccount/saveBillAdjust';
export const API_UPDATE_RECONCILIATION_MSG = 'adjustAccount/sendBillUpdateMsg';

// common
export const API_FETCH_MENU_CLASSIFY_LIST = 'menuCls/get/menu/cls/list';
export const API_COMPANY_FETCH_MENU_CLASSIFY_LIST = 'company/MenuCls/get/menu/cls/list';
export const API_FETCH_MENU_LIST = 'menuItem/getMenuItemAll';

// 门店分组
export const API_FETCH_SHOP_GROUP_LIST = 'manageShopGroup/getManageShopGroupList';
export const API_GET_SHOP_GROUP_DETAIL = 'manageShopGroup/getManageShopGroupDetail';
export const API_UPDATE_MANAGE_SHOP_GROUP = 'manageShopGroup/updateManageShopGroup';
export const API_SAVE_MANAGE_SHOP_GROUP = 'manageShopGroup/insertManageShopGroup';
export const API_GET_ALL_SHOP_LIST = 'manageShopGroup/getAllSelectedShopList';
export const API_UPDATE_SHOP_GROUP_STATUS = 'manageShopGroup/updateManageShopStatusGroup';

// 菜品分类
export const API_COMPANY_CLASSIFY_LIST = 'company/MenuCls/qryFoodCategory';

// 菜品
export const API_COMPANY_DISH_MENU_LIST = 'company/menu/brow';
export const API_COMPANY_SAVE_MENU_ITEM = 'company/menu/save/add/menuitem';
export const API_COMPANY_UPDATE_MENU_ITEM = 'company/menu/save/edit/menuitem';

// 菜品配料
export const API_FETCH_MANAGE_INGREDIENT_LIST = 'cmenuIngredient/getMenuIngredientList';
export const API_GET_MANAGE_INGREDIENT_GROUP = 'cmenuIngredient/getMenuIngredGroups';
export const API_FETCH_MANAGE_INGREDIENT_DETAIL = 'cmenuIngredient/getMenuIngredient';
export const API_SAVE_MANAGE_MENU_INGREDIENT = 'cmenuIngredient/saveMenuIngredient';
export const API_SAVE_MANAGE_INGREDIENT_GROUP = 'cmenuIngredient/saveMenuIngredGroup';
export const API_DELETE_MANAGE_MENU_INGREDIENT = 'cmenuIngredient/delMenuIngredient';
export const API_MOVE_MANAGE_INGREDIENT_GROUP = 'cmenuIngredient/moveMenuIngredient';
export const API_FETCH_INGREDIENT_GROUP_LIST = 'base/manageRevenueGroup/queryRevenueGroupList';
export const API_DELETE_MANAGE_INGREDIENT_GROUP = 'base/manageRevenueGroup/delRevenueGroup';
export const API_GET_INGREDIENT_GROUP_DETAIL = 'base/manageRevenueGroup/selectRevenueGroup';

// 反馈意见
export const API_ADD_FEEDBACK_INFO = 'shopfeedback/addFeedbackInfo';

// 公告通知
export const API_FETCH_NOTICES_LIST = 'note/noteList';
export const API_GET_NOTICES_DETAIL = 'note/getNoteById';
export const API_DELETE_NOTICES_BY_ID = 'note/delNoteById';
export const API_INSERT_NOTICES_ENTITY = 'note/noteEdit';

// 报表交换token
export const API_SWITCH_REPORT_TOKEN = 'report/user/switchToken';
export const API_CHECK_PRE_REPORT_LOGIN = 'Account/CheckLogin';

//提成菜设置
export const API_GET_EXTRACT_SETTING_LIST = 'bonusMenu/getbonusMenuList'; //获取提成菜列表

