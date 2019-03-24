import * as CLASSIFY from './classify';
import * as EXPLAIN from './explain';
import * as INGREDIENT from './ingredient';
import * as MENU from './menu';
import * as MENUPRINT from './menuPrint';
import * as SELLPLAN from './sellPlan';
import * as SETMEAL from './setMeal';
import * as SECONDPOINTDISH from './secondpoint';

export default {
  state: {
    ...EXPLAIN.state,
    ...CLASSIFY.state,
    ...MENU.state,
    ...MENUPRINT.state,
    ...INGREDIENT.state,
    ...SELLPLAN.state,
    ...SETMEAL.state,
    ...SECONDPOINTDISH.state,
  },
  actions: {
    ...EXPLAIN.actions,
    ...CLASSIFY.actions,
    ...MENU.actions,
    ...MENUPRINT.actions,
    ...INGREDIENT.actions,
    ...INGREDIENT.actions,
    ...SELLPLAN.actions,
    ...SETMEAL.actions,
    ...SECONDPOINTDISH.actions,
  },
  mutations: {
    ...EXPLAIN.mutations,
    ...CLASSIFY.mutations,
    ...MENU.mutations,
    ...MENUPRINT.mutations,
    ...INGREDIENT.mutations,
    ...INGREDIENT.mutations,
    ...SELLPLAN.mutations,
    ...SETMEAL.mutations,
    ...SECONDPOINTDISH.mutations,
  }
};
