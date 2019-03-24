<template>
  <div class="mw-tab-panel">
    <menu-main :isDiscount="true" />
  </div>
</template>

<script>
import { MenuMain } from '../../Dishes/Menu';

export default {
  name: 'dishMenu',
  components: {
    MenuMain
  }
};
</script>

<style lang="scss">
.mw-tab-panel {
  .dish-menu {
    padding: 0;
  }
}
</style>
