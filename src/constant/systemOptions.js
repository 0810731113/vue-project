// 总体参数
export const TAKE_OUT_PRINTER_PRINT_BILL = '346';

// 开台参数
export const BUSINESS_DATE = '001';
export const RECEIPT_UPLOAD = '002';
export const CLIENT_DATA = '011';
export const TAKE_OUT_PRINTER = '022';
export const TAKE_OUT_CUSTOMER_PRINTER = '349';
export const SALE_RULES = '023';
export const CLOSE_TIME = '024';
export const IF_AUTO_CLOSE = '355';
export const SELF_CLOUD = '322';
export const BILL_OPTIMIZE_SERVICE = '325';
export const KDS_SERVICE = '359'; //kds服务
export const TAKEOUT_KDS_SWITCH = '362'; //外卖菜品是否进KDS (1:开，0:关')

// 点菜参数
export const BILL_PAYMENT = '110';
export const TOTAL_PRICE_PRECISION = '111';
export const BILL_ROUND = '112';
export const COUNT_PRECISION = '113';
export const UNIT_PRICE_PRECISION = '114';
export const SUB_TOTAL_PRICE_PRECISION = '115';
export const SERVICE_CHARGE = '118';
export const ACTION_AFTER_ORDER = '119';
export const SOLD_OUT_ORDER = '120';
export const PRINT_AFTER_OPEN = '128';
export const PRINT_AFTER_ORDER = '129';
export const ORDER_IN_ADVANCE = '134';
export const COMBINE_SIMILARITY = '144';
export const SUPPORT_RESERVE = '344';
export const MINUTES_BEFORE_TAKEAWAY = '345';
export const WEIGHT_DISH_CHANGE_AMOUNT = '350';
export const DISH_MAPPING_AUTOMATICAL = '352';
export const EXTRACT_DISH_MODE = '358'  //提成菜

// 收银参数
export const CLEAR_TABLE_AFTER_PAYING = '126';
export const OPEN_CASHIER_BOX = '201';
export const HAND_OVER_OR_ACCOUNT = '202';
export const CLOSE_POPUP_AUTOMATICALLY = '203';
export const SALE_COUPON = '211';
export const PRESENT_COUPON = '214';
export const PAY_AUTOMATICALLY = '215';
export const PRINTER_BILL_AUTOMATICALLY = '326';
export const GROUP_PURCHASE = '330';
export const MEAL_BOX_COST = '337';
export const SENDER_COST = '338';
export const RETREAT_REASON_REQUIRED = '341';
export const GIFT_REASON_REQUIRED = '342';
export const RECHECK_REASON_REQUIRED = '343';
export const SUB_RECHANGE = '210';
export const FIXED_FACE_VALUE = '361';  //固定面值

// 打印参数
export const WARNING_REPORT_SITE = '301';
export const PRINT_AFTER_RETREAT = '130';
export const PRINTER_TIME_OUT = '304';
export const BEE_WHEN_PRINT = '305';
export const AD_MESSAGE_1 = '310';
export const COMBINE_WHEN_PRINT_BILL = '313';
export const PRINT_CUSTOMER_SURVEY = '314';
export const CHANGE_PRINTER_BACK_UP = '315';
export const PRINT_REPORT_AFTER_CLOSING = '316';
export const MEI_XIAO_ER_BILL_PRINT = '317';
export const MIAO_FU_BILL_PRINT = '320';
export const PAY_BILL_CUT_AUTOMATICALLY = '321';
export const WAY_OF_BILL_PRINT = '323';
export const REPORT_INCLUDE_SET = '324';
export const BATCH_RETREAT_PRINT = '327';
export const LANGUAGE_PRINT = '328';
export const MEMBERS_PRINT = '329';
export const TAKEOUT_SALE_REPORT = '331';
export const PRINT_QR_CODE = '332';
export const QR_CODE_TEXT = '333';
export const TAKEOUT_PRINT = '334';
export const PRINT_MENU_CASH = '335';
export const ASSOCIATION_MEMBERS = '336';
export const ADVANCE_MONEY = '339';
export const PRINT_MEMBER_BALANCE = '347';
export const PLATFORM_PRINT_AUTOMATICALLY = '348';
export const BILL_WITH_RETREAT_INFO = '351';
export const FAST_FOOD_PRINT_PASS_FOOD_BILL = '353';
export const IF_PRINT_SAVE = '356';
export const IF_PRINT_TAKEOUT = '357';
export const IF_PRINT_NETRECIPTS = '354';  //是否打印实收


export const SYSTEM_OPTIONS = ['总体参数', '开台参数', '点菜参数', '收银参数', '打印参数'];
export const SYSTEM_KEYS = {
  // 0:总体参数 1:点餐参数 2:收银参数 3:打印参数
  ALL: 0,
  ORDER: 1,
  CASHIER: 2,
  PRINT: 3
};

export const TAKEOUT_PRINT_NUMBER = ['1', '2', '3', '4'];
