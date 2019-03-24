<template>
  <dish-menu :isShop="true" :menuClsId="menuClsId" />
</template>

<script>
import { DishMenu } from 'common';
export default {
  name: 'CompanyMenu',
  components: { DishMenu },
  data () {
    return {
      menuClsId: [-1]
    };
  },
  created () {
    const { menuClsId } = this.$route.params;
    this.menuClsId = [menuClsId];
  }
};
</script>
