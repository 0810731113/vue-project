<template>
  <div class="menu-options">
    <el-tooltip
      v-for="option in options"
      v-if="data[option.key]"
      :key="option.key"
      :content="option.tips"
      effect="dark"
      placement="bottom">
      <img class="icon-option" :src="getImgUrl(option)" />
    </el-tooltip>
  </div>
</template>

<script>
import { MENU_OPTIONS } from 'constant/dishMenu';

export default {
  name: 'menuOptions',
  props: ['data'],
  data () {
    return {
      options: MENU_OPTIONS
    };
  },
  methods: {
    getImgUrl (option) {
      if (!option.key) return;
      const images = require.context('../images/', false, /\.png$/);
      return images('./' + option.key + '.png');
    }
  }
};
</script>

<style lang="scss">
.menu-options {
  .icon-option {
    width: 14px;
    height: 14px;
    margin: 1px;
  }
}
</style>
