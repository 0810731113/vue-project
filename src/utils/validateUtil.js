import {
  ERROR_FILE_URL,
  ERROR_INVALID_DISH_NAME,
  ERROR_INVALID_GENERAL_NAME,
  ERROR_INVALID_ID,
  ERROR_INVALID_IP_ADDRESS,
  ERROR_INVALID_MOBILE_PHONE,
  ERROR_INVALID_NAME,
  ERROR_INVALID_NUMBER,
  ERROR_INVALID_PHONE_NUMBER,
  ERROR_INVALID_PRICE,
  ERROR_INVALID_REPORT_ID,
  ERROR_INVALID_REPORT_NAME,
  ERROR_INVALID_SHOP_NAME,
  ERROR_INVALID_PRINTER_NUMBER,
  ERROR_INVALID_INTEGER_GREATER_THAN_ZERO
} from 'constant/errorMessage';
import {
  REGEX_CODE,
  REGEX_DISH_NAME,
  REGEX_FILE_URL,
  REGEX_GENERAL_NAME,
  REGEX_IP_ADDRESS,
  REGEX_MOBILE_PHONE,
  REGEX_NAME,
  REGEX_NUMBER,
  REGEX_PHONE_NUMBER,
  REGEX_PRICE,
  REGEX_REPORT_ID,
  REGEX_REPORT_NAME,
  REGEX_SHOP_NAME,
  REGEX_IP_AND_MAC_ADDRESS,
  REGEX_PRINTER_NUMBER,
  REGEX_HEX,
  REGEX_INTEGER_GREATER_THAN_ZERO
} from 'constant/regex';

export const validateShopName = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_SHOP_NAME.test(value)) {
    callback(new Error(ERROR_INVALID_SHOP_NAME));
  } else {
    callback();
  }
};

export const validateDishName = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_DISH_NAME.test(value)) {
    callback(new Error(ERROR_INVALID_DISH_NAME));
  } else {
    callback();
  }
};
// 允许中文，字母， 数字的名称
export const validateName = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_NAME.test(value)) {
    callback(new Error(ERROR_INVALID_NAME));
  } else {
    callback();
  }
};

// 允许中文，数字，字母的名称
export const validateGeneralName = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_GENERAL_NAME.test(value)) {
    callback(new Error(ERROR_INVALID_GENERAL_NAME));
  } else {
    callback();
  }
};

export const validateId = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_CODE.test(value)) {
    callback(new Error(ERROR_INVALID_ID));
  } else {
    callback();
  }
};

export const validatePhone = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_PHONE_NUMBER.test(value)) {
    callback(new Error(ERROR_INVALID_PHONE_NUMBER));
  } else {
    callback();
  }
};

export const validateMobile = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_MOBILE_PHONE.test(value)) {
    callback(new Error(ERROR_INVALID_MOBILE_PHONE));
  } else {
    callback();
  }
};

export const validateNumber = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_NUMBER.test(value)) {
    callback(new Error(ERROR_INVALID_NUMBER));
  } else {
    callback();
  }
};

//验证输入大于零的整数
export const validateNumberGreaterThanZero = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_INTEGER_GREATER_THAN_ZERO.test(value)) {
    callback(new Error(ERROR_INVALID_INTEGER_GREATER_THAN_ZERO));
  } else {
    callback();
  }
};

export const validatePrinterNumber = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_PRINTER_NUMBER.test(value)) {
    callback(new Error(ERROR_INVALID_PRINTER_NUMBER));
  } else {
    callback();
  }
};

export const validateIp = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_IP_ADDRESS.test(value)) {
    callback(new Error(ERROR_INVALID_IP_ADDRESS));
  } else {
    callback();
  }
};

export const validateIpAndMac = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_IP_AND_MAC_ADDRESS.test(value)) {
    callback(new Error(ERROR_INVALID_IP_ADDRESS));
  } else {
    callback();
  }
};

export const validatePrice = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_PRICE.test(value)) {
    callback(new Error(ERROR_INVALID_PRICE));
  } else {
    callback();
  }
};

export const validateReportId = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_REPORT_ID.test(value)) {
    callback(new Error(ERROR_INVALID_REPORT_ID));
  } else {
    callback();
  }
};

export const validateReportName = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_REPORT_NAME.test(value)) {
    callback(new Error(ERROR_INVALID_REPORT_NAME));
  } else {
    callback();
  }
};

export const validateFileUrl = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (!REGEX_FILE_URL.test(value)) {
    callback(new Error(ERROR_FILE_URL));
  } else {
    callback();
  }
};

export const validate433Printer = (rule, value, callback) => {
  if (!value || value === '') callback();

  if (value.length !== 8 || !REGEX_HEX.test(value)) {
    callback(new Error('请输入8位16进制字符'));
  } else {
    const sum = parseInt(value.substr(0, 2), 16) + parseInt(value.substr(2, 2), 16) + parseInt(value.substr(4, 2), 16);
    if (value.substr(-2).toLowerCase() !== sum.toString(16).substr(-2).toLowerCase()) {
      callback(new Error('请输入符合规则的标识'));
    } else {
      callback();
    }
  }
};
