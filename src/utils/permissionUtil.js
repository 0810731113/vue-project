import {
  ADD_SUFFIX,
  DELETE_SUFFIX,
  EDIT_SUFFIX,
  EXPORT_SUFFIX,
  IMPORT_SUFFIX,
  MAINTAIN_SUFFIX,
  UPLOAD_SUFFIX,
  VIEW_SUFFIX
} from 'constant/constants';

import store from 'store';

// 折扣方案新增
export const checkMaintainRight = (vm = {}) => {
  const { name, isIndex } = vm.$route.meta;
  if (isIndex) return true;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + MAINTAIN_SUFFIX)) >= 0;
};

export const checkViewRight = (name) => {
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + VIEW_SUFFIX)) >= 0;
};

// 添加菜品和编辑
export const checkAddRight = (vm = {}) => {
  const { name } = vm.$route.meta;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + ADD_SUFFIX)) >= 0;
};

// 删除和批量删除菜品
export const checkDeleteRight = (vm = {}) => {
  const { name, isIndex } = vm.$route.meta;
  if (isIndex) return true;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + DELETE_SUFFIX)) >= 0;
};

export const checkImportRight = (vm = {}) => {
  const { name } = vm.$route.meta;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + IMPORT_SUFFIX)) >= 0;
};

export const checkExportRight = (vm = {}) => {
  const { name } = vm.$route.meta;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + EXPORT_SUFFIX)) >= 0;
};

export const checkUploadRight = (vm = {}) => {
  const { name } = vm.$route.meta;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + UPLOAD_SUFFIX)) >= 0;
};

// 折扣方案复制、编辑、状态改变
export const checkEditRight = (vm = {}) => {
  const { name } = vm.$route.meta;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item => item === (name + EDIT_SUFFIX)) >= 0;
};

export const checkUserRight = (vm = {}) => {
  const { name } = vm.$route.meta;
  const { userRights } = store.state.sysetymenu;
  return userRights.findIndex(item =>
    item === (name + MAINTAIN_SUFFIX) || item === (name + ADD_SUFFIX) ||
    item === (name + DELETE_SUFFIX) || item === (name + IMPORT_SUFFIX) ||
    item === (name + EXPORT_SUFFIX) || item === (name + UPLOAD_SUFFIX) ||
    item === (name + EDIT_SUFFIX)
  ) >= 0;
};
