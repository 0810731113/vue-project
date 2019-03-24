<template>
  <div class="loading-wrap" v-show="loading">
    <img src="../assets/loading.gif">
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: ['loading']
};
</script>
