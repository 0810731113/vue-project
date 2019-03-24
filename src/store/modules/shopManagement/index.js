import * as ERP_SYSTEM_INTEGRATION from './erpSystemIntegration';
import * as SHOPGROUP from './shopGroup';
import * as SHOPLIST from './shopList';
import * as CHAINSSETTING from './ChainsSetting';

export default {
  state: {
    ...SHOPLIST.state,
    ...SHOPGROUP.state,
    ...ERP_SYSTEM_INTEGRATION.state,
    ...CHAINSSETTING.state
  },
  actions: {
    ...SHOPLIST.actions,
    ...SHOPGROUP.actions,
    ...ERP_SYSTEM_INTEGRATION.actions,
    ...CHAINSSETTING.actions
  },
  mutations: {
    ...SHOPLIST.mutations,
    ...SHOPGROUP.mutations,
    ...ERP_SYSTEM_INTEGRATION.mutations,
    ...CHAINSSETTING.mutations
  }
};
