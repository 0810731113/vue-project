<template>
  <div class="layout-container">
    <main-header />
    <sider-bar />
    <app-main/>
  </div>
</template>

<script>
  import AppMain from './AppMain.vue'
  import MainHeader from './MainHeader.vue'
  import SiderBar from './SiderBar.vue'


export default {
    name: 'Layout',
    components: {AppMain,MainHeader,SiderBar},
  props: {
    msg: String
  },
  data(){
      return {
          name: "我是李波"
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
