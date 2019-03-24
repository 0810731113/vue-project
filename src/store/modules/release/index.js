import * as FUNCTION_DETECTION from './functionDetection';
import * as GATEDLAUNCH from './gatedLaunch';
import * as PUBLISH from './publish';
import * as SOFTWARE from './softwareType';
import * as TERMINAL from './terminal';
import * as UPGRADE from './upgrade';

export default {
  state: {
    ...FUNCTION_DETECTION.state,
    ...GATEDLAUNCH.state,
    ...TERMINAL.state,
    ...SOFTWARE.state,
    ...PUBLISH.state,
    ...UPGRADE.state
  },
  actions: {
    ...FUNCTION_DETECTION.actions,
    ...GATEDLAUNCH.actions,
    ...TERMINAL.actions,
    ...SOFTWARE.actions,
    ...PUBLISH.actions,
    ...UPGRADE.actions
  },
  mutations: {
    ...FUNCTION_DETECTION.mutations,
    ...GATEDLAUNCH.mutations,
    ...TERMINAL.mutations,
    ...SOFTWARE.mutations,
    ...PUBLISH.mutations,
    ...UPGRADE.mutations
  }
};
