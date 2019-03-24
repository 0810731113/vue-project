import * as SYSTEM_REPORT_TEMPLATE from './systemReportTemplate';
import * as PRINTER_LIST from './printerList';

export default {
  state: {
    ...SYSTEM_REPORT_TEMPLATE.state,
    ...PRINTER_LIST.state
  },
  actions: {
    ...SYSTEM_REPORT_TEMPLATE.actions,
    ...PRINTER_LIST.actions
  },
  mutations: {
    ...SYSTEM_REPORT_TEMPLATE.mutations,
    ...PRINTER_LIST.mutations
  }
};
