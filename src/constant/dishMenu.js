export const MENU_OPTIONS = [{
  key: 'fiIsEditPrice',
  isMenu: true,
  tips: '时价菜'
}, {
  key: 'fiIsDiscount',
  isMenu: true,
  tips: '可折扣'
}, {
  key: 'fiIsServiceFee',
  isMenu: true,
  tips: '收服务费'
}, {
  key: 'fiIsOut',
  isMenu: true,
  tips: '下架'
}, {
  key: 'fiIsEditQty',
  isMenu: true,
  tips: '称重确认'
}, {
  key: 'fiIsSpecialty',
  isMenu: true,
  tips: '招牌菜'
}, {
  key: 'fiIsGift',
  isMenu: true,
  tips: '可赠送'
}, {
  key: 'fiIsHot',
  isMenu: true,
  tips: '热门菜'
}, {
  key: 'fiIsNew',
  isMenu: true,
  tips: '新品'
}, {
  key: 'fiIsCuisine',
  isMenu: true,
  tips: '必选做法'
}, {
  key: 'fiIsWeChatOrder',
  isMenu: true,
  tips: '手机点菜'
}, {
  key: 'fiIsSet',
  isMenu: true,
  tips: '只属套餐'
}, {
  key: 'fiIsEveryone',
  isMenu: true,
  tips: '每人一份'
}, {
  key: 'fiIsTakeAway',
  isMenu: true,
  tips: '可外卖'
}, {
  key: 'fiIsBonus',
  isMenu: true,
  tips: '可提成'
}, {
  key: 'fiIsTemporaryMenu',
  isMenu: true,
  tips: '临时菜'
},
//   {
//   key: 'fiIsPrePoint',
//   tips: '可预点',
//   isMenu: true
// },
  {
    key: 'isDiscount', tips: '可折扣'
  }, {
    key: 'isServiceFee', tips: '收服务费'
  }, {
    key: 'isOut', tips: '下架'
  }, {
    key: 'isGift', tips: '可赠送'
  }, {
    key: 'isWeChatOrder', tips: '微信点菜'
  }, {
    key: 'isTakeAway', tips: '可外卖'
  }, {
    key: 'isHot', tips: '热门菜'
  }, {
    key: 'isSpecialty', tips: '招牌菜'
  }, {
    key: 'isNew', tips: '新品'
  }
]

export const MENU_OPTIONS_BY_CLASS = [{
  name: '费用计算',
  items: [{
    key: 'isDiscount',
    tips: '可折扣',
    isSelect: true
  }, {
    key: 'isGift',
    tips: '可赠送',
    isSelect: true
  }, {
    key: 'isBonus',
    tips: '可提成'
  }, {
    key: 'isServiceFee',
    tips: '收服务费'
  },
    {
      key: 'isPrePoint',
      tips: '口碑可预点',
      isSelect: true
    }
  ]
}, {
  name: '特殊菜品',
  items: [{
    key: 'isEditQty',
    tips: '称重菜'
  }, {
    key: 'isEditPrice',
    tips: '时价菜'
  }, {
    key: 'isCuisine',
    tips: '必选做法'
  }, {
    key: 'isEveryone',
    tips: '每人一份'
  },
    {
      key: 'isTakeAway',
      tips: '可外卖'
    },
    {
      key: 'isTemporaryMenu',
      tips: '临时菜'
    }]
}, {
  name: '虚拟分类',
  items: [{
    key: 'isNew',
    tips: '新品'
  }, {
    key: 'isSpecialty',
    tips: '招牌菜'
  }, {
    key: 'isHot',
    tips: '热门菜'
  }]
}, {
  name: '点菜显示',
  items: [
    {
      key: 'isWeChatOrder',
      tips: '手机点菜',
      isSelect: true
    },
    {
      key: 'isSet',
      tips: '只属套餐'
    }, {
      key: 'isOut',
      tips: '下架'
    }]
}]

//秒点服务单选项
export const MIAODIAN_SERVICE_SINGLE_SELECT = [
  {
    key: 0,
    tips: '通用'
  },
  {
    key: 1,
    tips: '秒点'
  },
  {
    key: 2,
    tips: '外卖'
  },
  {
    key: 4,
    tips: '快餐'
  }
]

export const SETMEAL_SETTING = [{
  text: '套餐出售/下架',
  value: 'fiIsOut',
  items: [{
    text: '出售',
    value: '0'
  }, {
    text: '下架',
    value: '1'
  }]
}, {
  text: '套餐可打折',
  value: 'fiIsDiscount',
  items: [{
    text: '可打折',
    value: '1'
  }, {
    text: '不可打折',
    value: '0'
  }]
}, {
  text: '套餐可赠送',
  value: 'fiIsGift',
  items: [{
    text: '可赠送',
    value: '1'
  }, {
    text: '不可赠送',
    value: '0'
  }]
}, {
  text: '套餐收服务费',
  value: 'fiIsServiceFee',
  items: [{
    text: '收服务费',
    value: '1'
  }, {
    text: '不收服务费',
    value: '0'
  }]
}, {
  text: '手机点菜',
  value: 'fiIsWeChatOrder',
  items: [{
    text: '可手机点菜',
    value: '1'
  }, {
    text: '不可手机点菜',
    value: '0'
  }]
},
  {
    text: '秒点服务',
    value: 'fiSaleType',
    items: [
      {
        text: '通用',
        value: 0
      },
      {
        text: '秒点',
        value: 1
      },
      {
        text: '外卖',
        value: 2
      },
      {
        text: '快餐',
        value: 4
      },
    ]
  }
]
