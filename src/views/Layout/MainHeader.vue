<template>
  <div class="layout-container">
    {{name}}
    <app-main/>
  </div>
</template>

<script>
  import AppMain from './AppMain.vue'


export default {
    name: 'MainHeader',
    components: {AppMain},
  props: {
    msg: String
  },
  data(){
      return {
          name: "我是页头"
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less"  scoped>
  .layout-container{
    position: absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    overflow:hidden ;
    background: #f2f2f2;
  }
</style>
