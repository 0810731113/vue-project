import Main from 'shop/Main/Main';
import Layout from 'views/Layout/Layout';
import UpdateInstruction from 'shop/Service/UpdateInstruction';

// 按需加载
// const service = file => import('shop/Service/' + file + '.vue');
const shopInfo = file => require(['shop/ShopInfo/ShopInfo'], file);
const employe = (file) => () => import('shop/Employe/' + file + '.vue');
const guidance = (file) => () => import('shop/Guidance/' + file + '.vue');
const business = (file) => () => import('shop/Business/' + file + '.vue');
const dishes = (file) => () => import('shop/Dishes/' + file + '.vue');
const tables = (file) => () => import('shop/Tables/' + file + '.vue');
const businessSetting = (file) => () => import('shop/BusinessSetting/' + file + '.vue');
const setting = (file) => () => import('shop/Setting/' + file + '.vue');
const bill = (file) => () => import('shop/Bill/' + file + '.vue');
const discountSetting = (file) => () => import('shop/PreferentialSetting/' + file + '.vue');
const common = (file) => () => import('views/common/' + file + '.vue');
const baseRoot = '/myd'

export default [
  {
    path: baseRoot+'/',
    name: '',
    component: Layout,
    redirect: baseRoot+'/guidance',
    children: [
      { path: 'shopinfo', meta: { name: 'MDInfo', isMain: true }, name: '门店管理 > 门店信息', component: shopInfo },
      { path: 'guidance', meta: { isIndex: true }, name: '门店管理 > 开店向导', component: guidance('Guidance') },
      { path: 'guidance/BasicSettings', meta: { path: '/guidance', isIndex: true }, name: '门店管理 > 开店向导 > 基础设置', component: guidance('BasicSettings') },
      { path: 'guidance/AdvanceSettings', meta: { path: '/guidance', isIndex: true }, name: '门店管理 > 开店向导 > 高级设置', component: guidance('AdvanceSettings') }
    ]
  },
  {
    path: baseRoot+'/service',
    name: '系统服务',
    component: Layout,
    // redirect: '/service/releases',
    children: [
      { path: 'releases', meta: { isIndex: true }, name: '更新说明', component: UpdateInstruction }
    ]
  }, {
    path: baseRoot+'/business',
    name: '营业设定',
    component: Layout,
    redirect: baseRoot+'/business/shift',
    children: [
      { path: 'shift', meta: { name: 'MSectionMain', isMain: true }, name: '营业餐段', component: business('Shift/ShiftMain') },
      { path: 'shift/add', meta: { path: '/business/shift', name: 'MSectionMain' }, name: '营业餐段 > 新增营业餐段', component: business('Shift/Shift') },
      { path: 'shift/edit/:id', meta: { path: '/business/shift', name: 'MSectionMain' }, name: '营业餐段 > 修改营业餐段', component: business('Shift/Shift') },
      { path: 'cashier', name: '收银班别', meta: { name: 'ShiftMain', isMain: true }, component: business('Cashier/CashierMain') },
      { path: 'cashier/add', meta: { path: '/business/cashier', name: 'ShiftMain' }, name: '收银班别 > 新增收银班别', component: business('Cashier/Cashier') },
      { path: 'cashier/edit/:id', meta: { path: '/business/cashier', name: 'ShiftMain' }, name: '收银班别 > 修改收银班别', component: business('Cashier/Cashier') },
      { path: 'sales', meta: { name: 'ExpClsMain', isMain: true }, name: '销售分类', component: business('Sales/ShopSalesMain') },
      { path: 'sales/add', meta: { path: '/business/sales', name: 'ExpClsMain' }, name: '销售分类 > 新增销售分类', component: business('Sales/ShopSales') },
      { path: 'sales/edit/:id', meta: { path: '/business/sales', name: 'ExpClsMain' }, name: '销售分类 > 修改销售分类', component: business('Sales/ShopSales') },
      { path: 'revenue', meta: { name: 'RevenueTypeMain', isMain: true }, name: '收入分类', component: business('Revenue/ShopRevenueMain') },
      { path: 'revenue/add', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 新增收入分类', component: business('Revenue/ShopRevenue') },
      { path: 'revenue/edit/:id', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 修改收入分类', component: business('Revenue/ShopRevenue') },
      { path: 'revenue/group', meta: { path: '/business/revenue', name: 'RevenueTypeMain', isMain: true }, name: '收入分类 > 分类归属管理', component: common('RevenueGroupMain') },
      { path: 'revenue/addgroup', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 新增分类分组', component: common('RevenueGroup') },
      { path: 'revenue/editgroup/:id', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 编辑分类分组', component: common('RevenueGroup') },
      { path: 'creditaccount', meta: { name: 'CreditAccountMain', isMain: true }, name: '挂账对象', component: business('CreditAccount/CreditAccountMain') },
      { path: 'creditaccount/add', meta: { path: '/business/creditaccount', name: 'CreditAccountMain' }, name: '挂账对象 > 新增挂账对象', component: business('CreditAccount/CreditAccount') },
      { path: 'creditaccount/edit/:id', meta: { path: '/business/creditaccount', name: 'CreditAccountMain' }, name: '挂账对象 > 修改挂账对象', component: business('CreditAccount/CreditAccount') },
      { path: 'deliverer', meta: { name: 'DelivererMain', isMain: true }, name: '送餐者', component: business('Deliverer/DelivererMain') },
      { path: 'deliverer/add', meta: { path: '/business/deliverer', name: 'DelivererMain' }, name: '送餐者 > 新增送餐者', component: business('Deliverer/Deliverer') },
      { path: 'deliverer/edit/:id', meta: { path: '/business/deliverer', name: 'DelivererMain' }, name: '送餐者 > 修改送餐者', component: business('Deliverer/Deliverer') },
      { path: 'ordersource', meta: { name: 'BillSourceMain', isMain: true }, name: '订单来源', component: business('OrderSource/OrderSourceMain') },
      { path: 'ordersource/add', meta: { path: '/business/ordersource', name: 'BillSourceMain' }, name: '订单来源 > 新增订单来源', component: business('OrderSource/OrderSource') },
      { path: 'ordersource/edit/:id', meta: { path: '/business/ordersource', name: 'BillSourceMain' }, name: '订单来源 > 修改订单来源', component: business('OrderSource/OrderSource') },
      { path: 'payment', meta: { name: 'PaymentsMain', isMain: true }, name: '付款方式', component: business('Payment/PaymentMain') },
      { path: 'payment/add', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款方式 > 新增付款方式', component: business('Payment/Payment') },
      { path: 'payment/edit/:id', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款方式 > 修改付款方式', component: business('Payment/Payment') },
      { path: 'payment/type', meta: { path: '/business/payment', name: 'PaymentsMain', isMain: true }, name: '付款类型', component: business('Payment/PaymentTypeMain') },
      { path: 'payment/addtype', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款类型 > 新增付款类型', component: business('Payment/PaymentType') },
      { path: 'payment/edittype/:id', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款类型 > 修改付款类型', component: business('Payment/PaymentType') },
      { path: 'takeout', meta: { isIndex: true }, name: '外卖设置', component: business('Takeout/Takeout') }
    ]
  }, {
    path: baseRoot+'/dishes',
    name: '菜品管理',
    component: Layout,
    redirect: baseRoot+'/dishes/explain',
    children: [
      { path: 'explain', meta: { name: 'AskManaMain', isMain: true }, name: '菜品要求', component: dishes('Explain/ExplainMain') },
      { path: 'explain/add', meta: { path: '/dishes/explain', name: 'AskManaMain' }, name: '菜品要求 > 新增要求分组', component: dishes('Explain/Explain') },
      { path: 'explain/edit/:id', meta: { path: '/dishes/explain', name: 'AskManaMain' }, name: '菜品要求 > 编辑要求分组', component: dishes('Explain/Explain') },
      { path: 'classify', meta: { name: 'MenuCls', isMain: true }, name: '菜品分类', component: dishes('Classify/ClassifyMain') },
      { path: 'classify/add', meta: { path: '/dishes/classify', name: 'MenuCls' }, name: '菜品分类 > 新增菜品分类', component: dishes('Classify/Classify') },
      { path: 'classify/edit/:id', meta: { path: '/dishes/classify', name: 'MenuCls' }, name: '菜品分类 > 编辑菜品分类', component: dishes('Classify/Classify') },
      { path: 'menu', meta: { name: 'FootMain', isMain: true }, name: '菜品', component: dishes('Menu/MenuMain') },
      { path: 'menu/add', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '添加菜品', component: dishes('Menu/Menu') },
      { path: 'menu/edit/:id', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '编辑菜品', component: dishes('Menu/Menu') },
      { path: 'menu/import', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '菜品导入', component: common('ImportMenu') },
      { path: 'menu/upload', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '菜品批量上传', component: dishes('Menu/UploadMenu') },
      { path: 'secondpoint', meta: { name: 'SecondPointMain', isIndex:true}, name: '秒点设置', component: dishes('SecondOrderRequirement/SecondOrderMain') },
      { path: 'setmeal', meta: { name: 'SetSideContent', isMain: true  }, name: '套餐', component: dishes('SetMeal/SetMealPanel') },
      { path: 'setmeal/classify/add', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, name: '套餐 > 新增套餐分类', component: dishes('SetMeal/SetMealCls') },
      { path: 'setmeal/classify/edit/:id', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, name: '套餐 > 编辑套餐分类', component: dishes('SetMeal/SetMealCls') },
      { path: 'setmeal/add/:fsMenuClsId', name: '套餐 > 新增套餐', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, component: common('SetMeal') },
      { path: 'setmeal/edit/:id', name: '套餐 > 编辑套餐', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, component: common('SetMeal') },
      { path: 'ingredient', meta: { name: 'MenuIngredient', isMain: true }, name: '菜品配料', component: dishes('Ingredient/IngredientMain') },
      { path: 'ingredient/add', name: '菜品配料 > 新增菜品配料', meta: { path: '/dishes/ingredient', name: 'MenuIngredient' }, component: dishes('Ingredient/Ingredient') },
      { path: 'ingredient/edit/:itemCd', name: '菜品配料 > 编辑菜品配料', meta: { path: '/dishes/ingredient', name: 'MenuIngredient' }, component: dishes('Ingredient/Ingredient') },
      { path: 'menuPrint', meta: { name: 'MenuPrintDepartMain', isMain: true }, name: '菜品打印部门', component: dishes('MenuPrint/MenuPrintMain') },
      { path: 'menuPrint/edit', name: '菜品打印部门 > 编辑菜品打印部门', meta: { path: '/dishes/menuPrint', name: 'MenuPrintDepartMain' }, component: dishes('MenuPrint/MenuPrint') },
      { path: 'menuPrint/menuPrintControl', name: '菜品打印部门 > 多部门打印管理', meta: { path: '/dishes/menuPrint', name: 'MenuPrintDepartMain' }, component: dishes('MenuPrint/MenuPrintControl') },
      { path: 'sellPlan', meta: { name: 'MenuSellProgram', isMain: true }, name: '出售方案', component: dishes('SellPlan/SellPlanMain') },
      { path: 'sellPlan/add', meta: { path: '/dishes/sellPlan', name: 'MenuSellProgram' }, name: '出售方案 > 新增出售方案', component: dishes('SellPlan/SellPlan') },
      { path: 'sellPlan/edit/:guid', meta: { path: '/dishes/sellPlan', name: 'MenuSellProgram' }, name: '出售方案 > 编辑出售方案', component: dishes('SellPlan/SellPlan') },
      { path: 'extractSetting', meta: { path: '/dishes/ExtractSetting',name: 'ExtractSetting',isIndex:true }, name: '提成菜设置', component: dishes('ExtractSetting/ExtractSetting') }
      ]
  }, {
    path: baseRoot+'/tables',
    name: '桌位管理',
    component: Layout,
    redirect: baseRoot+'/tables/type',
    children: [
      { path: 'type', meta: { name: 'MTableClsMain', isMain: true }, name: '餐桌类型', component: tables('TableType/TableTypeMain') },
      { path: 'type/add', meta: { path: '/tables/type', name: 'MTableClsMain' }, name: '餐桌类型 > 新增餐桌类型', component: tables('TableType/TableType') },
      { path: 'type/edit/:id', meta: { path: '/tables/type', name: 'MTableClsMain' }, name: '餐桌类型 > 编辑餐桌类型', component: tables('TableType/TableType') },
      { path: 'area', name: '餐桌区域', meta: { name: 'MTableMain', isMain: true }, component: tables('DiningArea/DiningAreaMain') },
      { path: 'area/add', name: '餐桌区域 > 新增餐桌区域', meta: { path: '/tables/area', name: 'MTableMain' }, component: tables('DiningArea/DiningArea') },
      { path: 'area/edit/:id', name: '餐桌区域 > 编辑餐桌区域', meta: { path: '/tables/area', name: 'MTableMain' }, component: tables('DiningArea/DiningArea') },
      { path: 'states', meta: { name: 'MTableSteMain', isMain: true }, name: '餐桌状态颜色', component: tables('TableStates/TableStates') },
      { path: 'management', name: '餐桌管理', meta: { name: 'TableManage', isMain: true }, component: tables('TableManagement/TableManagementMain') },
      { path: 'management/add', name: '餐桌管理 > 新增餐桌 ', meta: { path: '/tables/management', name: 'TableManage' }, component: tables('TableManagement/TableManagement') },
      { path: 'management/edit/:id', name: '餐桌管理 > 编辑餐桌 ', meta: { path: '/tables/management', name: 'TableManage' }, component: tables('TableManagement/TableManagement') },
      { path: 'management/addbatch', name: '餐桌管理 > 批量添加 ', meta: { path: '/tables/management', name: 'TableManage' }, component: tables('TableManagement/AddBatchTableManagement') }
    ]
  }, {
    path: baseRoot+'/setting',
    name: '设置',
    component: Layout,
    redirect: baseRoot+'/setting/systemoptions',
    children: [
      { path: 'systemoptions', name: '系统选项', meta: { name: 'ParamSetting', isMain: true }, component: setting('SystemOptions/SystemOptionsMain') },
      { path: 'printer', name: '打印机', meta: { name: 'PrinterMain', isMain: true }, component: setting('Printer/PrinterMain') },
      { path: 'printer/add', name: '打印机 > 新增打印机', meta: { path: '/setting/printer', name: 'PrinterMain' }, component: setting('Printer/Printer') },
      { path: 'printer/edit/:id', name: '打印机 > 修改打印机', meta: { path: '/setting/printer', name: 'PrinterMain' }, component: setting('Printer/Printer') },
      { path: 'foodout', name: '打印部门', meta: { name: 'DeptFoodOutSet', isMain: true }, component: setting('FoodOutDept/FoodOutDeptMain') },
      { path: 'foodout/add', name: '打印部门 > 新增打印部门', meta: { path: '/setting/foodout', name: 'DeptFoodOutSet' }, component: setting('FoodOutDept/FoodOutDept') },
      { path: 'foodout/edit/:id', name: '打印部门 > 修改打印部门', meta: { path: '/setting/foodout', name: 'DeptFoodOutSet' }, component: setting('FoodOutDept/FoodOutDept') },
      { path: 'foodpass', name: '传菜点', meta: { name: 'DeptFoodControlSet', isMain: true }, component: setting('FoodPassDept/FoodPassDeptMain') },
      { path: 'foodpass/add', name: '传菜点 > 新增传菜点', meta: { path: '/setting/foodpass', name: 'DeptFoodControlSet' }, component: setting('FoodPassDept/FoodPassDept') },
      { path: 'foodpass/edit/:id', name: '传菜点 > 修改传菜点', meta: { path: '/setting/foodpass', name: 'DeptFoodControlSet' }, component: setting('FoodPassDept/FoodPassDept') },
      { path: 'host', name: '站点', meta: { name: 'HostSet', isMain: true }, component: setting('Host/HostMain') },
      { path: 'host/add', name: '站点 > 新增站点', meta: { path: '/setting/host', name: 'HostSet' }, component: setting('Host/Host') },
      { path: 'host/edit/:id', name: '站点 > 修改站点', meta: { path: '/setting/host', name: 'HostSet' }, component: setting('Host/Host') },
      { path: 'report', meta: { name: 'ReportTempletMain', isMain: true }, name: '小票格式配置', component: setting('Report/ReportMain') },
      { path: 'report/edit/:reportId/template/add', meta: { path: '/setting/report', name: 'ReportTempletMain' }, name: '小票格式配置 > 小票模板设置 > 新增小票模板', component: setting('Report/ReportTemplate') },
      { path: 'report/edit/:reportId/template/systemtemplate', meta: { path: '/setting/report', name: 'ReportTempletMain' }, name: '小票格式配置 > 小票模板设置 > 系统模板选择', component: setting('Report/SystemTemplateRepository') },
      { path: 'report/edit/:reportId/template/:reportTempletId', meta: { path: '/setting/report', name: 'ReportTempletMain' }, name: '小票格式配置 > 小票模板设置', component: setting('Report/ReportTemplateMain') },
      { path: 'report/edit/:reportId/template/edit/:reportTempletId', meta: { path: '/setting/report', name: 'ReportTempletMain' }, name: '小票格式配置 > 小票模板设置 > 小票模板修改', component: setting('Report/ReportTemplate') },
      { path: 'takeout', meta: { name: 'TakeOutFoodMain', isMain: true }, name: '菜品映射', component: setting('TakeoutMapping/TakeoutMappingMain') },
      { path: 'takeout/editBatch', meta: { path: '/setting/takeout', name: 'TakeOutFoodMain' }, name: '菜品映射 > 批量编辑', component: setting('TakeoutMapping/TakeoutMapping') },
      { path: 'service', name: '服务费设置', meta: { name: '', isIndex: true }, component: setting('ServiceCharge/ServiceCharge') }
    ]
  }, {
    path: baseRoot+'/businesssetting',
    name: '营业设置',
    component: Layout,
    redirect: baseRoot+'/businesssetting/backreason',
    children: [
      { path: 'backreason', meta: { name: 'WordhouseBackMain', isMain: true }, name: '退菜理由', component: businessSetting('BackReason/BackReasonMain') },
      { path: 'backreason/add', meta: { path: '/businesssetting/backreason', name: 'WordhouseBackMain' }, name: '退菜理由 > 新增退菜理由', component: businessSetting('BackReason/BackReason') },
      { path: 'backreason/edit/:id', meta: { path: '/businesssetting/backreason', name: 'WordhouseBackMain' }, name: '退菜理由 > 编辑退菜理由', component: businessSetting('BackReason/BackReason') },
      { path: 'giftreason', meta: { name: 'WordhouseGiftMain', isMain: true }, name: '赠菜理由', component: businessSetting('GiftReason/GiftReasonMain') },
      { path: 'giftreason/add', meta: { path: '/businesssetting/giftreason', name: 'WordhouseGiftMain' }, name: '赠菜理由 > 新增赠菜理由', component: businessSetting('GiftReason/GiftReason') },
      { path: 'giftreason/edit/:id', meta: { path: '/businesssetting/giftreason', name: 'WordhouseGiftMain' }, name: '赠菜理由 > 编辑赠菜理由', component: businessSetting('GiftReason/GiftReason') },
      { path: 'discountreason', meta: { name: 'WordhouseDiscountMain', isMain: true }, name: '打折理由', component: businessSetting('DiscountReason/DiscountReasonMain') },
      { path: 'discountreason/add', meta: { path: '/businesssetting/discountreason', name: 'WordhouseDiscountMain' }, name: '打折理由 > 新增打折理由', component: businessSetting('DiscountReason/DiscountReason') },
      { path: 'discountreason/edit/:id', meta: { path: '/businesssetting/discountreason', name: 'WordhouseDiscountMain' }, name: '打折理由 > 编辑打折理由', component: businessSetting('DiscountReason/DiscountReason') },
      { path: 'rechecreason', meta: { name: 'WordhouseRecheckMain', isMain: true }, name: '反结账理由', component: businessSetting('RechecReason/RechecReasonMain') },
      { path: 'rechecreason/add', meta: { path: '/businesssetting/rechecreason', name: 'WordhouseRecheckMain' }, name: '反结账理由 > 新增反结账理由', component: businessSetting('RechecReason/RechecReason') },
      { path: 'rechecreason/edit/:id', meta: { path: '/businesssetting/rechecreason', name: 'WordhouseRecheckMain' }, name: '反结账理由 > 编辑反结账理由', component: businessSetting('RechecReason/RechecReason') },
      { path: 'deliverynote', meta: { name: 'WordhouseDeliveryMain', isMain: true }, name: '外送备注', component: businessSetting('DeliveryNote/DeliveryNoteMain') },
      { path: 'deliverynote/add', meta: { path: '/businesssetting/deliverynote', name: 'WordhouseDeliveryMain' }, name: '外送备注 > 新增外送备注', component: businessSetting('DeliveryNote/DeliveryNote') },
      { path: 'deliverynote/edit/:id', meta: { path: '/businesssetting/deliverynote', name: 'WordhouseDeliveryMain' }, name: '外送备注 > 编辑外送备注', component: businessSetting('DeliveryNote/DeliveryNote') },
      { path: 'billnote', meta: { name: 'WordhouseBillMain', isMain: true }, name: '账单备注', component: businessSetting('BillNote/BillNoteMain') },
      { path: 'billnote/add', meta: { path: '/businesssetting/billnote', name: 'WordhouseBillMain' }, name: '账单备注 > 新增账单备注', component: businessSetting('BillNote/BillNote') },
      { path: 'billnote/edit/:id', meta: { path: '/businesssetting/billnote', name: 'WordhouseBillMain' }, name: '账单备注 > 编辑账单备注', component: businessSetting('BillNote/BillNote') },
      { path: 'orderuint', meta: { name: 'WordhouseOrderUintMain', isMain: true }, name: '菜品单位', component: businessSetting('OrderUint/OrderUintMain') },
      { path: 'orderuint/add', meta: { path: '/businesssetting/orderuint', name: 'WordhouseOrderUintMain' }, name: '菜品单位 > 新增菜品单位', component: businessSetting('OrderUint/OrderUint') },
      { path: 'orderuint/edit/:id', meta: { path: '/businesssetting/orderuint', name: 'WordhouseOrderUintMain' }, name: '菜品单位 > 编辑菜品单位', component: businessSetting('OrderUint/OrderUint') }
    ]
  }, {
    path: baseRoot+'/employe',
    name: '员工管理',
    component: Layout,
    redirect: baseRoot+'/employe/department',
    children: [
      { path: 'department', meta: { name: 'DeptGenericMain', isMain: true }, name: '部门', component: employe('Department/DepartmentMain') },
      { path: 'department/add', meta: { path: '/employe/department', name: 'DeptGenericMain' }, name: '部门 > 新增一般部门', component: employe('Department/Department') },
      { path: 'department/edit/:id', meta: { path: '/employe/department', name: 'DeptGenericMain' }, name: '部门 > 编辑一般部门', component: employe('Department/Department') },
      { path: 'shoprole', meta: { name: 'RoleMain', isMain: true }, name: '角色权限', component: employe('ShopRole/ShopRoleMain') },
      { path: 'shoprole/add', meta: { path: '/employe/shoprole', name: 'RoleMain' }, name: '角色权限 > 新增角色权限', component: employe('ShopRole/ShopRole') },
      { path: 'shoprole/edit/:id', meta: { path: '/employe/shoprole', name: 'RoleMain' }, name: '角色权限 > 编辑角色权限', component: employe('ShopRole/ShopRole') },
      { path: 'shopuser', meta: { name: 'UserMain', isMain: true }, name: '用户', component: employe('ShopUser/ShopUserMain') },
      { path: 'shopuser/add', meta: { path: '/employe/shopuser', name: 'UserMain' }, name: '用户 > 新增用户', component: employe('ShopUser/ShopUser') },
      { path: 'shopuser/edit/:id', meta: { path: '/employe/shopuser', name: 'UserMain' }, name: '用户 > 编辑用户', component: employe('ShopUser/ShopUser') },
      { path: 'log', meta: { name: 'UserLogMain', isMain: true }, name: '操作日志', component: employe('UserLog/UserLogMain') },
      { path: 'fingerprintconfig', meta: { name: 'FingerPrintMain', isIndex: true }, name: '指纹配置', component: employe('FingerPrintConfig/FingerPrintConfigMain') }
    ]
  }, {
    path: baseRoot+'/bill',
    name: '账单处理',
    component: Layout,
    redirect: baseRoot+'/bill/chargebill',
    children: [
      { path: 'chargebill', meta: { name: 'ChargeBill', isMain: true }, name: '挂账处理', component: bill('ChargeBill/ChargeBill') },
      { path: 'chargebilldone', meta: { path: '/bill/chargebill', name: 'ChargeBill' }, name: '挂账处理 > 已收账', component: bill('ChargeBill/ChargeBillDone') },
      { path: 'hidebill', meta: { isIndex: true }, name: '账单隐藏', component: bill('HideBill/HideBill') },
      { path: 'uploadbill', meta: { name: 'BillUploadMain', isMain:true}, name: '账单上传', component: bill('UploadBill/UploadBillManager') },
      { path: 'uploadbill/:id', meta: { name: 'BillUploadMain', isMain:true}, name: '账单上传', component: bill('UploadBill/UploadBill') },
      { path: 'uploadbillManager', meta: { name: 'BillUploadManager', isIndex:true }, name: '账单上传管理', component: bill('UploadBill/UploadBillManager') },
      { path: 'uploadlog', meta: { name: 'BillUploadMain', isMain: true }, name: '账单上传记录', component: bill('BillUploadLog/BillUploadLog') }
    ]
  }, {
    path: baseRoot+'/preferential',
    name: '优惠设置',
    component: Layout,
    redirect: baseRoot+'/preferential/vipprice',
    children: [
      { path: 'buygift', meta: { name: 'BuygiftItemMain', isMain: true }, name: '菜品买减', component: discountSetting('BuyGift/BuyGiftMain') },
      { path: 'buygift/add', meta: { path: '/preferential/buygift', name: 'BuygiftItemMain' }, name: '菜品买减 > 新增菜品买减', component: discountSetting('BuyGift/BuyGift') },
      { path: 'buygift/edit/:bargainId', meta: { path: '/preferential/buygift', name: 'BuygiftItemMain' }, name: '菜品买减 > 编辑菜品买减', component: discountSetting('BuyGift/BuyGift') },
      { path: 'bargainFull', meta: { name: 'CutMoneyMain', isMain: true }, name: '金额满减', component: discountSetting('BargainFull/BargainFullMain') },
      { path: 'bargainFull/add', meta: { path: '/preferential/bargainFull', name: 'CutMoneyMain' }, name: '金额满减 > 新增金额满减', component: discountSetting('BargainFull/BargainFull') },
      { path: 'bargainFull/edit/:bargainId', meta: { path: '/preferential/bargainFull', name: 'CutMoneyMain' }, name: '金额满减 > 编辑金额满减', component: discountSetting('BargainFull/BargainFull') },
      { path: 'vipprice', meta: { name: 'MenuVipPriceManage', isMain: true }, name: '会员价管理', component: discountSetting('VipPriceManager/VipPriceManagerMain') },
      { path: 'bargainSale', meta: { name: 'BargainItemMain', isMain: true }, name: '菜品特价', component: discountSetting('BargainSales/BargainSaleMain') },
      { path: 'bargainSale/add', meta: { path: '/preferential/bargainSale', name: 'BargainItemMain' }, name: '菜品特价 > 新增菜品特价', component: discountSetting('BargainSales/BargainSale') },
      { path: 'bargainSale/edit/:bargainId', meta: { path: '/preferential/bargainSale', name: 'BargainItemMain' }, name: '菜品特价 > 编辑菜品特价', component: discountSetting('BargainSales/BargainSale') },
      { path: 'discountscheme', meta: { name: 'DiscountMain', isMain: true }, name: '折扣方案', component: discountSetting('DiscountScheme/DiscountSchemeMain') },
      { path: 'discountscheme/add', meta: { path: '/preferential/discountscheme', name: 'DiscountMain' }, name: '折扣方案 > 新增折扣方案', component: discountSetting('DiscountScheme/DiscountScheme') },
      { path: 'discountscheme/edit/:discountId', meta: { path: '/preferential/discountscheme', name: 'DiscountMain' }, name: '折扣方案 > 修改折扣方案', component: discountSetting('DiscountScheme/DiscountScheme') }
    ]
  },
  { path: baseRoot+'/*', redirect: '/error/404', hidden: true }
];
