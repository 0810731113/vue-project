export const USAGE = {
  menuClsCount: {
    name: '菜品分类',
    tips: '已添加菜品分类数量',
    route: '/myd/dishes/classify',
    iframe: {
      parent: '#menu',
      children: '#menuCls'
    },
    count: 0
  },
  menuCount: {
    name: '菜品管理',
    tips: '已添加菜品数量',
    route: '/myd/dishes/menu',
    iframe: {
      parent: '#menu',
      children: '#menuAll'
    },
    count: 0
  },
  setSideCount: {
    name: '套餐管理',
    tips: '已添加套餐数量',
    route: '/myd/dishes/setmeal',
    iframe: {
      parent: '#menu',
      children: '#menuSide'
    },
    count: 0
  },
  discountCount: {
    name: '优惠设置',
    tips: '已创建折扣方案数量',
    route: '/myd/preferential/discountscheme',
    iframe: {
      parent: '#discount',
      children: '#discountManage'
    },
    count: 0
  },
  paymentCount: {
    name: '付款方式',
    tips: '已添加付款方式数量',
    route: '/myd/business/payment',
    iframe: {
      parent: '#business',
      children: '#businessPayment'
    },
    count: 0
  }
};

export const TRADE_TYPE = [
  { name: '中式快餐', value: '1' },
  { name: '中式正餐', value: '2' },
  { name: '中式轻正餐', value: '3' }
];

export const UPGRADE_TYPE = [
  { value: 0, name: '手动升级' },
  { value: 1, name: '自动升级' },
  { value: 2, name: '营业结束后升级' }
];

export const PUBLISH_CHANNEL = [
  { value: 1, name: '正式发布' },
  { value: 2, name: '测试发布' }
];

export const TRADEID = {
  FAST: 1,
  DINNER: 2
};

export const TABLE_SETTING = [
  { name: '餐桌类型', id: '1' },
  { name: '餐桌区域', id: '2' }
];

export const SERVICE_TYPE = [{
  value: '1',
  label: '不收服务费'
}, {
  value: '2',
  label: '整单消费比例(折前)'
}, {
  value: '3',
  label: '整单消费比例(折后)'
}, {
  value: '4',
  label: '菜品(已勾选服务费)'
}, {
  value: '5',
  label: '固定金额'
}];

export const SERVICE_CHARGE = [{
  value: '1',
  label: '不收服务费'
}, {
  value: '2',
  label: '按菜品(收取服务费)'
}, {
  value: '3',
  label: '按餐桌区域'
}];

export const PARAMVALUE = {
  NOCHARGE: '1',
  DISHES: '2',
  TABLEAREA: '3'
};

export const AREA_PARAM = {
  NOCHARGE: '1',
  BEFOREDISCOUNT: '2',
  AFTERDISCOUNT: '3',
  DISHES: '4',
  FIXEDSUM: '5'
};

export const MENUCLS_KIND = [
  { label: 1, name: '菜品' },
  { label: 2, name: '套餐' },
  { label: 4, name: '配料' }
];

export const ITEMKIND = {
  DISH: 1,        // 菜品
  SETMEAL: 2,     // 套餐
  INGREDIENT: 3   // 配料
};

export const ITEMTYPE = {
  SINGLE: 1,        // 菜品 or 套餐
  ALL: 0            // 菜品 and 套餐
};

export const SHOPKIND = {
  // 0系统商 1代理商 3 公司 7 门店 9 模板
  SYSTEM: 0,
  AGENTS: 1,
  COMPANY: 3,
  SHOP: 7
};

export const SHOPKIND_NAME = [
  { value: 0, name: '系统商' },
  { value: 3, name: '代理商' },
  { value: 7, name: '门店' }
];

export const BARGAIN = {
  BARGAINSALE: 1,
  BUYGIFT: 2,
  BARGAINFULL: 18003
};

export const PAYMENT_SALE_ID = '90002';

export const SERIAL_PORT = 2;
export const PARALLEL_PORT = 3;
export const USB_FOR_SERIAL_PORT = 8;
export const PRINTER_CLOUD = 9;
export const PRINTER_433 = 10;

export const PRINTER_PORT_TYPE = [
  { id: 1, name: '网口' },
  { id: SERIAL_PORT, name: '串口' },
  { id: PARALLEL_PORT, name: '并口' },
  { id: 4, name: 'USB口' },
  { id: 5, name: 'KDS' },
  { id: 6, name: '驱动' },
  { id: 7, name: '蓝牙打印机' },
  { id: USB_FOR_SERIAL_PORT, name: 'USB打印机(串口转接)' },
  { id: PRINTER_CLOUD, name: '云打印机' },
  { id: PRINTER_433, name: '美易连打印机' }
];

export const MENU_PRINT_TYPE = [
  { id: 0, name: '无后厨打印' },
  { id: 1, name: '单个制作部门' },
  { id: 2, name: '多个制作部门' }
];

export const COM1 = 'com1';
export const COM2 = 'com2';
export const COM3 = 'com3';
export const COM4 = 'com4';

export const SERIAL_PORT_TYPE = [
  { id: 'COM1', name: 'COM1' },
  { id: 'COM2', name: 'COM2' },
  { id: 'COM3', name: 'COM3' },
  { id: 'COM4', name: 'COM4' },
  { id: 'COM5', name: 'COM5' },
  { id: 'COM6', name: 'COM6' },
  { id: 'COM7', name: 'COM7' },
  { id: 'COM8', name: 'COM8' },
  { id: 'ttyS0', name: 'ttyS0' },
  { id: 'ttyS1', name: 'ttyS1' },
  { id: 'ttyS2', name: 'ttyS2' },
  { id: 'ttyS3', name: 'ttyS3' },
  { id: 'ttyS4', name: 'ttyS4' },
  { id: 'ttyS5', name: 'ttyS5' },
  { id: 'ttyS6', name: 'ttyS6' },
  { id: 'ttyS7', name: 'ttyS7' },
  { id: 'ttyS8', name: 'ttyS8' },
  { id: 'ttyS9', name: 'ttyS9' }
];

export const PARALLEL_PORT_TYPE = [
  { id: 'LPT1', name: 'LPT1' },
  { id: 'LPT2', name: 'LPT2' },
  { id: 'LPT3', name: 'LPT3' },
  { id: 'LPT4', name: 'LPT4' }
];

export const PRINTER_PAPER_SIZE = [
  { id: 1, name: '58mm' },
  { id: 2, name: '80mm' },
  { id: 3, name: '76mm' }
];

export const PRINTER_TYPE = [
  { id: 0, name: '热敏打印机' },
  { id: 1, name: '针式打印机' },
  { id: 2, name: '标签打印机' }
];

export const PRINTER_CODE = [
  { id: 0, name: '简体中文' },
  { id: 1, name: '繁体中文' }
];

export const ITEM_CUT_TYPE = [
  { id: 1, name: '一菜一切' },
  { id: 2, name: '总单' },
  { id: 3, name: '总单和一菜一切' },
  { id: 4, name: '一切一份' }
];

export const LANGUAGE = [
  { id: 1, name: '简体中文' },
  { id: 2, name: '繁体中文' }
];

export const MENU_UNIT = ['份', '只', '个', '杯', '扎', '听'];
export const MENU_UNIT_OF_QUALITY = ['斤', '两', '克', '千克'];

export const STEP_DETAIL = [
  { title: '门店信息设置', description: '* 设置门店的基本信息：电话、地址、联系方式等' },
  { title: '餐段/班别设置', description: '* 设置门店的营业餐段和员工的工作班别' },
  { title: '打印设置', description: '* 设置门店的打印设备' },
  { title: '桌位设置', description: '* 设置门店的桌位信息' },
  { title: '菜品设置', description: '* 设置门店的菜品' }
];

export const STEP_ONE = 0;
export const STEP_TWO = 1;
export const STEP_THREE = 2;
export const STEP_FOUR = 3;
export const STEP_FIVE = 4;
export const STEP_COUNT = 5;
export const STEP_NAMES = ['shopInfo', 'shiftInfo', 'printInfo', 'tableInfo', 'dishInfo'];

export const MAX_PAGE_SIZE = 50;

export const STEP_ADVANCE_SETTING = [{
  title: '套餐设置',
  src: 'icon_menu',
  description: '除菜品出售方案外，美味后台还支持套餐的出售方案。如有个性化需求，可点击“立即设置”跳转至“菜品管理-套餐”进行设置。'
}, {
  title: '优惠设置',
  src: 'icon_bargain',
  description: '美味后台为餐厅提供各类优惠方案功能设置，以提升营业额。如有个性化需求，可点击“立即设置”跳转至“菜单-优惠设置”进行设置。'
}, {
  title: '员工管理',
  src: 'icon_staff',
  description: '美味后台可以为门店员工设置不同的角色和权限，方便员工管理及绩效考核。如有个性化需求，可点击“立即设置”跳转至“菜单—员工管理”进行设置。'
}, {
  title: '付款方式设置',
  src: 'icon_payment',
  description: '美味后台已为门店用户设置了默认的付款方式，基本可以满足营业需求。如有个性化需求，可点击“立即设置”跳转至“营业设定-付款方式”进行设置。'
}];

export const IFRAME_ROUTE = [{
  name: '套餐设置',
  parent: '#menu',
  children: '#menuSide',
  route: '/myd/dishes/setmeal'
}, {
  name: '优惠设置',
  parent: '#discount',
  children: '#discountManage',
  route: '/myd/preferential/discountscheme'
}, {
  name: '员工管理',
  parent: '#userManage',
  children: '#dept'
}, {
  name: '付款方式设置',
  parent: '#business',
  children: '#businessPayment',
  route: '/myd/business/payment'
}];

export const INPUT_MAX_LENGTH = 80;
export const SORT = 999;

export const LINE_ATTRIBUTE = [{
  id: 0, name: '单行'
}, {
  id: 1, name: '集合'
}];

export const LINE_HEIGHT = [{
  id: 0, name: '默认'
}, {
  id: 1, name: '走纸（15)'
}, {
  id: 2, name: '走纸（30)'
}, {
  id: 3, name: '走纸（45)'
}, {
  id: 4, name: '走纸（60)'
}];

export const DIGITAL_PRECISION = [{
  id: '0', name: '0位'
}, {
  id: '1', name: '1位'
}, {
  id: '2', name: '2位'
}, {
  id: '3', name: '3位'
}];

export const EXTRACT_DISH_MODE_SELECT = [       //  提成菜设置模式选择列表
  {id: '0', name: '关闭'},
  {id: '1', name: '按销售金额'},
]

export const MENU_PRINT_RADIO = {
  noDept: -1,
  singleDept: 0,
  multiDepts: 1
};

export const ELE_ME = 'ELEME';
export const MEI_TUAN = 'MEITUAN';

export const TAKE_OUT_PLATFORMS = [{
  id: ELE_ME, name: '饿了么'
}, {
  id: MEI_TUAN, name: '美团'
}];

export const FIRST_LEVEL = 1;
export const SECOND_LEVEL = 2;
export const THIRD_LEVEL = 3;
export const DEFAULT_MENU = '菜品';

export const ON_TEXT = '启用';
export const OFF_TEXT = '禁用';

export const TABLE_STATE_COLOR = ['#AFCC7B', '#FF6F36', '#FF0000', '#7CAFCB', '#AAAAAA', '#FECB00', '#6565CB'];
export const TABLE_STATE_SELECT_ENDABLE = ['2', '4', '8'];
export const SYSTEM_KEY = 1;
export const CUSTOM_KEY = 2;
export const TABLE_TYPE = '1';
export const TABLE_AREA = '2';

export const FULL_COUPON = 1;
export const CASH_COUPON = 2;
export const DISCOUNT_COUPON = 3;

export const HIDE_EXTERNAL_SETTING = '隐藏外界设备设置';
export const SHOW_EXTERNAL_SETTING = '显示外界设备设置';

export const HOST_POPUP_REF = 'HOST_POPUP_REF';
export const PRINTER_POPUP_REF = 'PRINTER_POPUP_REF';
export const FOOD_OUT_DEPT_POPUP_REF = 'FOOD_OUT_DEPT_POPUP_REF';
export const BUSINESS_SHIFT_POPUP_REF = 'BUSINESS_SHIFT_POPUP_REF';
export const BUSINESS_CASHIER_POPUP_REF = 'BUSINESS_CASHIER_POPUP_REF';
export const SAVE_PRINT_SCHEME_POPUP_REF = 'SAVE_PRINT_SCHEME_POPUP_REF';

export const TABLE_TYPE_POPUP_REF = 'TABLE_TYPE_POPUP_REF';
export const DINING_AREA_POPUP_REF = 'DINING_AREA_POPUP_REF';
export const TABLE_MANAGEMENT_POPUP_REF = 'TABLE_MANAGEMENT_POPUP_REF';
export const ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF = 'ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF';

export const GUIDANCE_MENU_TEMP_DOWNLOAD_LINK = '/myd/static/files/foodItem.xlsx';
export const MENU_TEMP_DOWNLOAD_LINK = '/myd/static/files/menuItem.xlsx';
export const SENIOR_MANAGEMENT_TEMP_DOWNLOAD_LINK = '/myd/static/files/superUserInfo.xlsx';

export const LEFT = 0;
export const MIDDLE = 1;
export const RIGHT = 2;

export const YES = 1;
export const NO = 0;

export const NORMAL = 0;
export const LARGE = 1;

export const VISIBLE = 0;
export const HIDDEN = 1;

export const BLACK = 0;
export const RED = 1;

export const TYPE_ROW_SINGLE = 0;
export const TYPE_ROW_MULTI = 1;
export const TYPE_LINE = 2;

export const INTERVAL_MINUTE = '1';
export const INTERVAL_DAY = '2';

export const PREVIOUS_DAY = '1';
export const WEEK = '7';
export const MONTH = '30';

export const ON = '1';
export const OFF = '0';

export const ADD = 'add';
export const EDIT = 'edit';

export const PART_DISH_DISCOUNT = 0;
export const BILL_REDUCE = 1;
export const BILL_DISCOUNT = 2;

export const DISCOUNT_SCHEME = [{
  id: PART_DISH_DISCOUNT, name: '部分菜品打折'
}, {
  id: BILL_REDUCE, name: '整单立减'
}, {
  id: BILL_DISCOUNT, name: '整单打折'
}];
export const VIP_USE_ARR = [{
  id: 0, name: '否'
}, {
  id: 1, name: '是'
}]
export const VIP_CLASSIFY = [{
  id: -1, name: '不限制'
}, {
  id: 1, name: '粉丝会员以上'
}, {
  id: 2, name: '普通会员以上'
}, {
  id: 3, name: '黄金会员以上'
}, {
  id: 4, name: '铂金会员以上'
}, {
  id: 5, name: '钻石会员以上'
}];

export const EFFECTIVE_TIME = [{
  id: 0, name: '无限制'
}, {
  id: 1, name: '固定时间'
}];

export const VIP_USE = '1';
export const NO_LIMIT = '0';

export const AUTO_UPLOAD_ENUM = [{
  id: null, name: '全部'
}, {
  id: 0, name: '手动'
}, {
  id: 1, name: '自动'
}];

export const AUTO_UPLOAD = 1;
export const MANUAL_UPLOAD = 0;

export const UPAIYUN_BASE_URL = 'http://nowimg.b0.upaiyun.com/';
export const GUIDANCE_VIDEO_LINK = 'http://nowimg.b0.upaiyun.com/winpos/report/course.mp4';

export const DECIMAL_ROUND = [
  {
    id: 0, name: '不处理'
  }, {
    id: 1, name: '抹去分'
  }, {
    id: 2, name: '抹去分和角'
  }];

export const NO_FRACTION = 2;
export const ONE_DECIMAL_FRACTION = 1;
export const TWO_DECIMAL_FRACTION = 0;

export const UPDATE_LOG_TYPE = [
  {
    id: null, name: '所有'
  }, {
    id: 1, name: '菜单'
  }, {
    id: 2, name: '付款方式'
  }, {
    id: 3, name: '折扣方案'
  }, {
    id: 4, name: '菜品特价'
  }, {
    id: 5, name: '菜品买减'
  }, {
    id: 6, name: '金额买减'
  }
];

export const UPDATE_LOG_STATUS = [
  {
    id: null, name: '所有'
  }, {
    id: 1, name: '等待'
  }, {
    id: 2, name: '成功'
  }, {
    id: 3, name: '失败'
  }, {
    id: 4, name: '取消'
  }, {
    id: 5, name: '正在执行'
  }];

export const UPDATE_TIME_TYPE = [
  {
    id: null, name: '所有'
  }, {
    id: 1, name: '立即更新'
  },
  {
    id: 2, name: '定时更新'
  }
];

export const TO_BE_UPDATED = 1;
export const FAIL_TO_IMPORT_SENIOR_MANAGEMENT = '请下载正确的导入模板后，重新导入';
export const SERVICE = {
  '1': '秒点',
  '2': '美易点Android',
  '3': '美易点Winpos'
};

export const CLIENT = {
  WINDOWS: 1,
  ANDROID: 2
};

export const SYS_REPORT_TEMPLATE_SIZE = [
  { id: 58, name: '58mm' },
  { id: 76, name: '76mm' },
  { id: 80, name: '80mm' }
];

export const SINGLE_LINE = 0;
export const DATA_SOURCE_LIST = 1;
export const PROJECT_NAME_LIST = 0;

export const VIEW_SUFFIX = '_vBrow';
export const ADD_SUFFIX = '_vAdd';
export const EDIT_SUFFIX = '_vEdit';
export const MAINTAIN_SUFFIX = '_vMaintain';
export const DELETE_SUFFIX = '_bnDelete';
export const IMPORT_SUFFIX = '_bnImport';
export const EXPORT_SUFFIX = '_bnExport';
export const UPLOAD_SUFFIX = '_bnUpload';
export const GROUP_STORE = '1';

export const ACCESS_MODE = [
  { id: 0, name: 'http' },
  { id: 1, name: 'https' },
  { id: 2, name: 'ftp' },
  { id: 3, name: 'ftps' }
];

export const INTERFACE_CLASSIFY = [
  { id: '1', name: '商城' },
  { id: '2', name: 'ERP系统' }
];

export const ASCENDING = 'A';
export const DESCENDING = 'D';

export const FEEDBACK_INFO_TYPE = [
  { id: 0, name: '请选择' },
  { id: 1, name: '菜品管理' },
  { id: 2, name: '店铺报表' },
  { id: 3, name: '营销活动' },
  { id: 4, name: '会员管理' },
  { id: 5, name: '基础设置' },
  { id: 6, name: '其它' }
];
export const MAX_FILE_SIZE = 350;

export const RELATIONTYPE = {
  ALL: 1,
  NOTALL: 2
};

export const BILL_UPLOAD_LOG_STATUS = [
  {
    id: '-1', name: '全部'
  }, {
    id: '0', name: '未上传'
  }, {
    id: '1', name: '上传成功'
  }, {
    id: '2', name: '上传失败'
  }, {
    id: '3', name: '上传中'
  }];
//修改后
export const BILL_UPLOAD_LOG_STATUS_LOG = [
  {
    id: '0', name: '未上传'
  }, {
    id: '1', name: '上传成功'
  }, {
    id: '2', name: '上传失败'
  }];


export const NOTICES_TYPE = [
  { id: 1, name: '公司' },
  { id: 2, name: '系统商' }
];

export const ORIGIN = 0;
export const CURRENT = 1;

export const PAY_STATUS = {
  0: '原始支付',
  1: '当前支付'
};

export const BILL_SPLIT_MODE = [
  {
    id: 0, name: '按菜品金额'
  }, {
    id: 1, name: '按分账金额'
  }, {
    id: 2, name: '按分账比例'
  }];

export const SET_MEAL_OPTIONS = [
  { key: 'isDiscount', name: '可折扣' },
  { key: 'isServiceFee', name: '收服务费' },
  { key: 'isOut', name: '下架' },
  { key: 'isGift', name: '可赠送' },
  { key: 'isWeChatOrder', name: '微信点菜' },
  { key: 'isTakeAway', name: '可外卖' },
  { key: 'isHot', name: '热门菜' },
  { key: 'isSpecialty', name: '招牌菜' },
  { key: 'isNew', name: '新品' },
  { key: 'isBonus', name : '可提成'},
  { key: 'isPrePoint', name : '口碑可预点'},
];

// 网口 打印机型号
export const PRINTER_MODEL_WANGKOU = [
  { id: 0, name: '无' },
  { id: 1001, name: '爱普生TMU220B' },
  { id: 1002, name: '爱普生T60-903&爱普生T60-901' },
  { id: 2001, name: '佳博L80250Ⅱ' },
  { id: 2002, name: '佳博GP3150TIN' },
  { id: 2003, name: '佳博L80250(美味定制)' },
  { id: 3001, name: '思普瑞特SP-POS88VM(网+U+串)' },
  { id: 3002, name: '思普瑞特SP-POS88VBT(U+蓝牙)&思普瑞特SP-POS88V(U+串)' },
  { id: 4001, name: '爱印T801M' }
];

// 云打印机 打印机型号
export const PRINTER_MODEL_CLOUD = [
  { id: 0, name: '无' },
  { id: 10001, name: '外卖管家云打印(屏幕)' },
  { id: 10002, name: '外卖管家云打印' },
  { id: 20001, name: '爱印IP-T581UG2(58) ' },
  { id: 20002, name: '爱印IP-T801G2(80) ' },
  { id: 30001, name: '思普瑞特SP-POS586U3G' }
];

export const PRINTER_MODEL_DEFAULT = [
  { id: 0, name: '无' }
];

export const ACCOUNT_INFO = 'ACCOUNT_INFO';

// 系统商打印机列表
export const SYSTEM_PRINTER_TYPE_LIST = [
  { id: 1, name: '云打印机' },
  { id: 2, name: '蓝牙打印机' },
  { id: 3, name: '网口打印机' }
];

// LOCAL: PHPSESSID
export const LOCAL_KEY_PHPSESSID = 'MW_BM_PHPSESSID';
// SESSION: account info
export const LOCAL_KEY_ACCOUNT_INFO = 'MW_BM_SHOPINFO';
