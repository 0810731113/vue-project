import * as COMPANY_SALES from './companySales';
import * as COMPANY_REVENUE from './companyRevenue';

export default {
  state: {
    ...COMPANY_SALES.state,
    ...COMPANY_REVENUE.state
  },
  actions: {
    ...COMPANY_SALES.actions,
    ...COMPANY_REVENUE.actions
  },
  mutations: {
    ...COMPANY_SALES.mutations,
    ...COMPANY_REVENUE.mutations
  }
};
