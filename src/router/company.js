const Main = file => require(['company/Main/Main'], file);
const Layout = file => require(['views/Layout/Layout'], file);
const companyAnnouncement = (file) => () => import('company/Announcement/' + file + '.vue');
const systemSetting = (file) => () => import('company/SystemSetting/' + file + '.vue');
const reconciliation = (file) => () => import('company/Reconciliation/' + file + '.vue');
const cateringCompany = (file) => () => import('company/CateringCompany/' + file + '.vue');
const shopManagement = (file) => () => import('company/ShopManagement/' + file + '.vue');
const companyBusiness = (file) => () => import('company/CompanyBusiness/' + file + '.vue');
const dishes = (file) => () => import('company/DishLibrary/' + file + '.vue');
const shopDishes = (file) => () => import('shop/Dishes/' + file + '.vue');
const business = (file) => () => import('shop/Business/' + file + '.vue');
const discountSetting = (file) => () => import('shop/PreferentialSetting/' + file + '.vue');
const setting = (file) => () => import('shop/Setting/' + file + '.vue');
const common = (file) => () => import('views/common/' + file + '.vue');
const baseRoot = '/myd'
export default [
  {
    path: baseRoot+'/',
    name: '',
    component: Layout,
    redirect: baseRoot+'/shopmanagement/systemintegration',
    children: [
      { path: 'shopinfo', meta: { isIndex: true }, name: '', component: Main }
    ]
  }, {
    path: baseRoot+'/cateringcompany',
    name: '餐饮公司',
    component: Layout,
    children: [
      { path: 'companyinfo', meta: { name: 'CompanyInfo', isMain: true }, name: '公司信息', component: cateringCompany('CompanyInfo/CompanyInfoMain') }
    ]
  }, {
    path: baseRoot+'/business',
    name: '营业设定',
    component: Layout,
    children: [
      { path: 'sales', meta: { name: 'ExpClsMain', isMain: true }, name: '销售分类', component: companyBusiness('CompanySales/CompanySalesMain') },
      { path: 'sales/add', meta: { path: '/business/sales', name: 'ExpClsMain' }, name: '销售分类 > 新增销售分类', component: companyBusiness('CompanySales/CompanySales') },
      { path: 'sales/edit/:id', meta: { path: '/business/sales', name: 'ExpClsMain' }, name: '销售分类 > 修改销售分类', component: companyBusiness('CompanySales/CompanySales') },
      { path: 'revenue', meta: { name: 'RevenueTypeMain', isMain: true }, name: '收入分类', component: companyBusiness('CompanyRevenue/CompanyRevenueMain') },
      { path: 'revenue/add', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 新增收入分类', component: companyBusiness('CompanyRevenue/CompanyRevenue') },
      { path: 'revenue/edit/:id', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 修改收入分类', component: companyBusiness('CompanyRevenue/CompanyRevenue') },
      { path: 'revenue/group', meta: { path: '/business/revenue', name: 'RevenueTypeMain', isMain: true }, name: '收入分类 > 分类归属管理', component: common('RevenueGroupMain') },
      { path: 'revenue/addgroup', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 新增分类分组', component: common('RevenueGroup') },
      { path: 'revenue/editgroup/:id', meta: { path: '/business/revenue', name: 'RevenueTypeMain' }, name: '收入分类 > 编辑分类分组', component: common('RevenueGroup') },
      { path: 'payment', meta: { name: 'PaymentsMain', isMain: true }, name: '付款方式', component: business('Payment/PaymentMain') },
      { path: 'payment/add', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款方式 > 新增付款方式', component: business('Payment/Payment') },
      { path: 'payment/edit/:id', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款方式 > 修改付款方式', component: business('Payment/Payment') },
      { path: 'payment/type', meta: { path: '/business/payment', name: 'PaymentsMain', isMain: true }, name: '付款类型', component: business('Payment/PaymentTypeMain') },
      { path: 'payment/addtype', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款类型 > 新增付款类型', component: business('Payment/PaymentType') },
      { path: 'payment/edittype/:id', meta: { path: '/business/payment', name: 'PaymentsMain' }, name: '付款类型 > 修改付款类型', component: business('Payment/PaymentType') }
    ]
  }, {
    path: baseRoot+'/shopmanagement',
    name: '门店管理',
    component: Layout,
    children: [
      { path: 'shoplist', meta: { name: 'ShopListMain', isMain: true }, name: '门店列表', component: shopManagement('ShopList/ShopListMain') },
      { path: 'shoplist/add', meta: { path: '/shopmanagement/shoplist', name: 'ShopListMain' }, name: '门店列表 > 新增门店列表', component: shopManagement('ShopList/ShopList') },
      { path: 'shoplist/edit/:shopId', meta: { path: '/shopmanagement/shoplist', name: 'ShopListMain' }, name: '门店列表 > 修改门店列表', component: shopManagement('ShopList/ShopList') },
      { path: 'shopgroup', meta: { name: 'ShopGroupManaMain', isMain: true }, name: '门店分组', component: shopManagement('ShopGroup/ShopGroupMain') },
      { path: 'shopgroup/add', meta: { path: '/shopmanagement/shopgroup', name: 'ShopGroupManaMain' }, name: '门店分组 > 新增门店分组', component: shopManagement('ShopGroup/ShopGroup') },
      { path: 'shopgroup/edit/:shopGroupId', meta: { path: '/shopmanagement/shopgroup', name: 'ShopGroupManaMain' }, name: '门店分组 > 修改门店分组', component: shopManagement('ShopGroup/ShopGroup') },
      { path: 'systemintegration', meta: { name: 'ErpSyetemSetting', isMain: true }, name: 'ERP系统对接', component: shopManagement('ERPSystemIntegration/ERPSystemIntegration') },
      { path: 'chainsetting', meta: { name: 'NotMaintainMain', isMain: true }, name: '连锁标准化设置', component: shopManagement('ChainsSetting/ChainsSetting') }
    ]
  }, {
    path: baseRoot+'/dishes',
    name: '菜品库',
    component: Layout,
    redirect: baseRoot+'/dishes/explain',
    children: [
      { path: 'explain', meta: { name: 'AskManaMain', isMain: true }, name: '菜品要求', component: dishes('Explain/ExplainMain') },
      { path: 'explain/add', meta: { path: '/dishes/explain', name: 'AskManaMain' }, name: '菜品要求 > 新增要求分组', component: dishes('Explain/Explain') },
      { path: 'explain/edit/:id', meta: { path: '/dishes/explain', name: 'AskManaMain' }, name: '菜品要求 > 编辑要求分组', component: dishes('Explain/Explain') },
      { path: 'classify', meta: { name: 'MenuCls', isMain: true, isIndex: true }, name: '菜品分类', component: dishes('Classify/ClassifyMain') },
      { path: 'classify/add', meta: { path: '/dishes/classify', name: 'MenuCls', isMain: true, isIndex: true }, name: '菜品分类 > 新增菜品分类', component: dishes('Classify/Classify') },
      { path: 'classify/edit/:id', meta: { path: '/dishes/classify', name: 'MenuCls', isMain: true, isIndex: true }, name: '菜品分类 > 编辑菜品分类', component: dishes('Classify/Classify') },
      { path: 'menu', meta: { name: 'FootMain', isMain: true }, name: '菜品', component: dishes('Menu/MenuMain') },
      { path: 'menu/add', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '添加菜品', component: dishes('Menu/Menu') },
      { path: 'menu/edit/:id', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '编辑菜品', component: dishes('Menu/Menu') },
      { path: 'menu/import', meta: { path: '/dishes/menu', name: 'FootMain' }, name: '菜品导入', component: common('ImportMenu') },
      { path: 'sort', meta: { name: 'BatchUpdateSort', isMain: true }, name: '菜品显示顺序', component: dishes('MenuSort/MenuSort') },
      { path: 'ingredient', meta: { name: 'MenuIngredient', isMain: true }, name: '菜品配料', component: dishes('Ingredient/IngredientMain') },
      { path: 'ingredient/add', meta: { path: '/dishes/ingredient', name: 'MenuIngredient' }, name: '菜品配料 > 新增菜品配料', component: dishes('Ingredient/Ingredient') },
      { path: 'ingredient/edit/:itemCd', meta: { path: '/dishes/ingredient', name: 'MenuIngredient' }, name: '菜品配料 > 编辑菜品配料', component: dishes('Ingredient/Ingredient') },
      { path: 'ingredient/group', meta: { path: '/dishes/ingredient', name: 'MenuIngredient' }, name: '菜品配料分组', component: dishes('Ingredient/GroupManagement') },
      { path: 'setmeal', meta: { name: 'SetSideContent', isMain: true }, name: '套餐', component: dishes('SetMeal/SetMealPanel') },
      { path: 'setmeal/classify/add', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, name: '套餐 > 新增套餐分类', component: dishes('SetMeal/SetMealCls') },
      { path: 'setmeal/classify/edit/:id', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, name: '套餐 > 编辑套餐分类', component: dishes('SetMeal/SetMealCls') },
      { path: 'setmeal/add/:fsMenuClsId', name: '套餐 > 新增套餐', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, component: common('SetMeal') },
      { path: 'setmeal/edit/:id', name: '套餐 > 编辑套餐', meta: { path: '/dishes/setmeal', name: 'SetSideContent' }, component: common('SetMeal') },
      { path: 'menuPrint', meta: { name: 'MenuPrintDepartMain', isMain: true }, name: '菜品打印部门', component: shopDishes('MenuPrint/MenuPrintMain') },
      { path: 'menuPrint/edit', name: '菜品打印部门 > 编辑菜品打印部门', meta: { path: '/dishes/menuPrint', name: 'MenuPrintDepartMain' }, component: shopDishes('MenuPrint/MenuPrint') },
      { path: 'menuPrint/menuPrintControl', name: '菜品打印部门 > 多部门打印管理', meta: { path: '/dishes/menuPrint', name: 'MenuPrintDepartMain', isIndex: true }, component: shopDishes('MenuPrint/MenuPrintControl') }
    ]
  }, {
    path: baseRoot+'/setting',
    name: '系统设置',
    component: Layout,
    children: [
      { path: 'seniormanagement', meta: { isIndex: true }, name: '高层消费名单管理', component: systemSetting('SeniorManagement/SeniorManagementMain') },
      { path: 'foodout', name: '打印部门', meta: { name: 'DeptFoodOutSet', isMain: true }, component: setting('FoodOutDept/FoodOutDeptMain') },
      { path: 'foodout/add', name: '打印部门 > 新增打印部门', meta: { path: '/setting/foodout', name: 'DeptFoodOutSet', isIndex: true }, component: setting('FoodOutDept/FoodOutDept') },
      { path: 'foodout/edit/:id', name: '打印部门 > 修改打印部门', meta: { path: '/setting/foodout', name: 'DeptFoodOutSet', isIndex: true }, component: setting('FoodOutDept/FoodOutDept') }
    ]
  }, {
    path: baseRoot+'/companyManagement',
    name: '集团管理',
    component: Layout,
    children: [
      { path: 'cookbook', meta: { name: 'CookBookMain', isMain: true }, name: '菜单', component: dishes('CookBook/CookBookMain') },
      { path: 'shopDishDataUpload', meta: { name: 'ShopDishDataUpload', isIndex: true }, name: '门店菜品数据上传', component: dishes('ShopDishDataUpload/ShopDishDataUpload') },
      { path: 'shopupdate', meta: { name: 'UpdateShopInfo', isMain: true }, name: '门店更新管理', component: dishes('ShopUpdate/ShopUpdate') },
      { path: 'updatelog', meta: { name: 'UpdateShopLog', isMain: true }, name: '菜单更新日志', component: dishes('UpdateLog/UpdateLog') }
    ]
  }, {
    path: baseRoot+'/preferential',
    name: '优惠设置',
    component: Layout,
    redirect: baseRoot+'/preferential/discountscheme',
    children: [
      { path: 'buygift', meta: { name: 'BuygiftItemMain', isMain: true }, name: '菜品买减', component: discountSetting('BuyGift/BuyGiftMain') },
      { path: 'buygift/add', meta: { path: '/preferential/buygift', name: 'BuygiftItemMain' }, name: '菜品买减 > 新增菜品买减', component: discountSetting('BuyGift/BuyGift') },
      { path: 'buygift/edit/:bargainId', meta: { path: '/preferential/buygift', name: 'BuygiftItemMain' }, name: '菜品买减 > 编辑菜品买减', component: discountSetting('BuyGift/BuyGift') },
      { path: 'bargainFull', meta: { name: 'CutMoneyMain', isMain: true }, name: '金额满减', component: discountSetting('BargainFull/BargainFullMain') },
      { path: 'bargainFull/add', meta: { path: '/preferential/bargainFull', name: 'CutMoneyMain' }, name: '金额满减 > 新增金额满减', component: discountSetting('BargainFull/BargainFull') },
      { path: 'bargainFull/edit/:bargainId', meta: { path: '/preferential/bargainFull', name: 'CutMoneyMain' }, name: '金额满减 > 编辑金额满减', component: discountSetting('BargainFull/BargainFull') },
      { path: 'bargainSale', meta: { name: 'BargainItemMain', isMain: true }, name: '菜品特价', component: discountSetting('BargainSales/BargainSaleMain') },
      { path: 'bargainSale/add', meta: { path: '/preferential/bargainSale', name: 'BargainItemMain' }, name: '菜品特价 > 新增菜品特价', component: discountSetting('BargainSales/BargainSale') },
      { path: 'bargainSale/edit/:bargainId', meta: { path: '/preferential/bargainSale', name: 'BargainItemMain' }, name: '菜品特价 > 编辑菜品特价', component: discountSetting('BargainSales/BargainSale') },
      { path: 'discountscheme', meta: { name: 'DiscountMain', isMain: true }, name: '折扣方案', component: discountSetting('DiscountScheme/DiscountSchemeMain') },
      { path: 'discountscheme/add', meta: { path: '/preferential/discountscheme', name: 'DiscountMain' }, name: '折扣方案 > 新增折扣方案', component: discountSetting('DiscountScheme/DiscountScheme') },
      { path: 'discountscheme/edit/:discountId', meta: { path: '/preferential/discountscheme', name: 'DiscountMain' }, name: '折扣方案 > 修改折扣方案', component: discountSetting('DiscountScheme/DiscountScheme') }
    ]
  }, {
    path: baseRoot+'/reconciliation',
    name: '调账管理',
    component: Layout,
    children: [
      { path: 'detail', meta: { isMain: true, name: 'AdjustAccountMain' }, name: '账单调账', component: reconciliation('Reconciliation/ReconciliationMain') },
      { path: 'log', meta: { isMain: true, name: 'AdjustDetailMain' }, name: '调账明细', component: reconciliation('ReconciliationLog/ReconciliationLogMain') }
    ]
  }, {
    path: baseRoot+'/announcement',
    name: '',
    component: Layout,
    children: [
      { path: 'notices', meta: { name: 'NoteList', isMain: true }, name: '公告通知', component: companyAnnouncement('CompanyNotices/CompanyNoticesMain') },
      { path: 'notices/add', meta: { name: 'NoteList', path: '/announcement/notices' }, name: '公告通知 > 新增公告通知', component: companyAnnouncement('CompanyNotices/CompanyNotices') },
      { path: 'notices/edit/:id', meta: { name: 'NoteList', path: '/announcement/notices' }, name: '公告通知 > 编辑公告通知', component: companyAnnouncement('CompanyNotices/CompanyNotices') }
    ]
  },
  { path: baseRoot+'/*', redirect: '/error/404', hidden: true }
];
