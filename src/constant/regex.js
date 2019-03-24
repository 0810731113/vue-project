export const REGEX_SHOP_NAME = /^[\w\s*'(_)\u2018|\u2019\u4e00-\u9fa5]+$/;

export const REGEX_NAME = /^[_a-zA-Z0-9\u2018|\u2019\u4e00-\u9fa5]+$/;

export const REGEX_DISH_NAME = /^[#.[\](-_)* $\w\u0391-\uFFE5]+$/;

export const REGEX_CODE = /^[a-zA-Z0-9]+$/;

export const REGEX_IP_ADDRESS = /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])$/;

export const REGEX_IP_AND_MAC_ADDRESS = /^([0-9a-zA-Z]{2})(:[0-9a-zA-Z]{2}){3}|((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]|[*])$/;

export const REGEX_PHONE_NUMBER = /^(\(\d{3,4}\)|\d{3,4}-|\s)?[0-9]{7,9}$/;

export const REGEX_MOBILE_PHONE = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

export const REGEX_NUMBER = /^[0-9]*$/;

export const REGEX_PRICE = /^([0-9]\d{0,6}(\.\d{1,2}){0,1}?|0\.(([1-9][0-9]{0,1})|0([1-9])))$/;

export const REGEX_SEARCH_PRICE = /^(0|([1-9]\d{0,9}(\.\d{1,2})?))$/;

export const REGEX_REPORT_NAME = /^[a-zA-Z0-9_\-\u2018|\u2019\u4e00-\u9fa5]+$/;

export const REGEX_REPORT_ID = /^[a-zA-Z0-9_]+$/;

export const REGEX_GENERAL_NAME = /^[a-zA-Z0-9\u2018|\u2019\u4e00-\u9fa5]+$/;

export const REGEX_FILE_URL = /(([a-zA-Z0-9._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[a-zA-Z0-9&%_./-~-]*)?/;

export const REGEX_PRINTER_NUMBER = /^[0]|[3][2-9]|[4-5][0-9]|[6][0-2]$/;

export const REGEX_UNIT_NAME = /^[_a-zA-Z\u2018|\u2019\u4e00-\u9fa5]+$/;

export const REGEX_HEX = /^[a-fA-F0-9]+$/;

//by libo
export const REGEX_EXTRACT_PERCENT = /^(\d|[1-9]\d)(\.\d{1,2})?$/  //处理提成菜输入百分比

export const REGEX_EXTRACT_PRICE = /^(\d|[1-9]\d+)(\.\d{1,2})?$/   //处理提成菜输入金额

export const REGEX_INTEGER_GREATER_THAN_ZERO = /^[1-9]\d*$/   //处理输入大于零的整数
