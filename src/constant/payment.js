export const PAYMENT_SETTING = [{
  name: '付款类型',
  value: 'fsPaymentTypeId',
  item: []
}, {
  name: '是否开票',
  value: 'fiIsCalcInvoice',
  item: [
    { value: 1, name: '开票' },
    { value: 0, name: '不开票' }
  ]
}, {
  name: '是否计入实收',
  value: 'fiIsCalcPaid',
  item: [
    { value: 1, name: '实收' },
    { value: 0, name: '非实收' }
  ]
}, {
  name: '是否隐藏',
  value: 'fiIsPremium',
  item: [
    { value: 0, name: '显示项' },
    { value: 1, name: '隐藏项' }
  ]
}, {
  name: '状态',
  value: 'fiStatus',
  item: [
    { value: 1, name: '启用' },
    { value: 9, name: '禁用' }
  ]
}];

export const SHORTCUT_KEYS = [
  { shortcutKey: 'F6', paymentId: '' },
  { shortcutKey: 'F7', paymentId: '' },
  { shortcutKey: 'F8', paymentId: '' },
  { shortcutKey: 'F9', paymentId: '' },
  { shortcutKey: 'F10', paymentId: '' },
  { shortcutKey: 'F11', paymentId: '' }
];

export const COUPONS = [
  { value: 1, name: '满减券' },
  { value: 2, name: '代金券' },
  { value: 3, name: '折扣券' }
];

export const COUPON_TYPES = {
  1: '31', // 满减券
  2: '32', // 代金券
  3: '30'  // 折扣券
};

export const MW_COUPONS = [30, 31, 32];

// 系统内置类型, 70: 销售代金券, 72: 赠送代金券, 125: 团购券 //固定面值代金券
export const COUPON_CODES = [70, 72, 125,213];

export const GROUP_PURCHASE = 125;
