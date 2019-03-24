<template>
    <div class="mw-tab-panel">
      <menu-print-main :isGuide="true" />
    </div>
</template>

<script>
import { MenuPrintMain } from '../../Dishes/MenuPrint';

export default {
  name: 'dishPrinter',
  components: {
    MenuPrintMain
  }
};
</script>

<style lang="scss">
.mw-tab-panel {
  .dishes-menu-print {
    display: initial;
  }
}
</style>
