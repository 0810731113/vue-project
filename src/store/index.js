import Vue from 'vue';
import Vuex from 'vuex';
import bill from './modules/bill';
import business from './modules/business';
import businessManage from './modules/businessManage';
import businessSetting from './modules/businessSetting';
import cateringCompany from './modules/cateringCompany';
import common from './common';
import companyAnnouncement from './modules/companyAnnouncement';
import companyBusiness from './modules/companyBusiness';
import dishLibrary from './modules/dishLibrary';
import dishes from './modules/dishes';
import employe from './modules/employe';
import error from './error';
import feedbackInfoManagement from './modules/feedbackInfoManagement';
import guidance from './guidance';
import interfaceManagement from './modules/interfaceManagement';
import preferential from './modules/preferential';
import reconciliation from './modules/reconciliation';
import release from './modules/release';
import setting from './modules/setting';
import shop from './shop';
import shopManagement from './modules/shopManagement';
import sysetymenu from './system';
import systemAnnouncement from './modules/systemAnnouncement';
import systemSetting from './modules/systemSetting';
import tables from './modules/tables';
import tool from './modules/tool';
import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    systemAnnouncement,
    companyAnnouncement,
    bill,
    business,
    businessManage,
    businessSetting,
    common,
    cateringCompany,
    companyBusiness,
    shopManagement,
    dishes,
    dishLibrary,
    employe,
    error,
    feedbackInfoManagement,
    guidance,
    interfaceManagement,
    preferential,
    reconciliation,
    release,
    setting,
    shop,
    sysetymenu,
    systemSetting,
    tables,
    tool,
    user
  },
  strict: process.env.NODE_ENV !== 'production'
});
