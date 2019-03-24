<template>
  <div
    class="sidebar-wrap"
  >
    <el-menu
      class="el-menu-vertical"
      :default-active="activeIndex"
      :unique-opened="true"
      @select="onSelectMenu"
      menuTrigger="click"
      :collapse="isCollapse"
      ref="slideMenu"
    >
      <!--不包含子导航-->
      <el-menu-item v-for="item in routes" v-if="!item.child" :key="item.route" :index="item.route">
        <span :class="`sidebar-item-icon sidebar-${ item.icon }`"></span>
        <span>
          {{item.name}}
        </span>
      </el-menu-item>

      <!--包含子导航-->
      <el-submenu v-else :key="item.name" :index="item.route">
        <template slot="title">
          <!-- <img class="icon-submenu" :src="getImgUrl(item)" /> -->
          <i :class="`sidebar-item-icon sidebar-${ item.icon } haha`"></i>
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item v-for="(subItem, index) in item.child" :key="subItem.route" :index="subItem.route">
          <span class="sidebar-dotted-border"></span>
          {{subItem.name}}
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import isEmpty from 'lodash/isEmpty';
  import {mapActions, mapState} from 'vuex';
  import {SIDEBARS_SYSTEM, SIDEBARS_SHOP, SIDEBARS_COMPANY} from 'constant/route';
  import {SHOPKIND} from 'constant/constants';

  export default {
    name: 'Sidebar',
    props: ['data'],
    data() {
      return {
        isCollapse: false,
        SHOPKIND,
        SIDEBARS_SYSTEM,
        SIDEBARS_SHOP,
        SIDEBARS_COMPANY,
        routes: [],
      };
    },
    computed: {
      activeIndex() {
        const {path, meta} = this.$route;
        return isEmpty(meta.path) ? (path.indexOf('/') === 0 ? path.substring(1) : path) : 'myd/' + meta.path;
      },
      ...mapState({
        sysetymenu: state => state.sysetymenu
      })
    },
    watch:{
      $route( to , from ){
        this.routes.map(item => {
          if (to.path && to.path.indexOf(item.route) === -1 && item.child) {
            this.$refs.slideMenu.close(item.route)
          }
        })
      }
    },
    async created() {
      await this.fetchSystemMenu();
      this.routes = this.sysetymenu.sideBarMenu;
      // 如接口无返回  临时调用本地菜单
//    if (!this.routes) {
//      const { shopKind } = this.$store.state.sysetymenu;
//      switch (shopKind) {
//        case SHOPKIND.SYSTEM:
//          this.routes = SIDEBARS_SYSTEM;
//          break;
//        case SHOPKIND.COMPANY:
//          this.routes = SIDEBARS_COMPANY;
//          break;
//        case SHOPKIND.SHOP:
//          this.routes = SIDEBARS_SHOP;
//          break;
//      }
//    }
    },
    methods: {
      ...mapActions([
        'fetchSystemMenu',
        'setIframeInfo'
      ]),
      onSelectMenu(key) {
        /*this.routes.map(item => {
          if (key.indexOf(item.route) === -1 && item.child) {
            this.$refs.slideMenu.close(item.route)
          }
        })*/
        if (!key) {
          this.isCollapse = !this.isCollapse;
          return;
        }
        // 新版切入老版, 老版是绝对路径 新版是相对路径
        if (key.includes('www.mwpos')) {
          this.setIframeInfo({isIframe: true, route: `http://${key}`});
        } else {
          this.setIframeInfo({isIframe: false, route: key});
          if (key !== this.$route.fullPath) {
            this.$router.push('/' + key);
          }
        }
      },
      handleCollapse() {
        this.isCollapse = !this.isCollapse;
      },
      getImgUrl(item) {
        if (!item.icon) return;
        const images = require.context('./images/', false, /\.png$/);
        return images('./' + item.icon + '.png');
      }
    }
  };
</script>

<style lang="scss">
  .no-collapse {
    width: 220px !important;
    transition: all .3s ease-in-out;
  }

  .collapse {
    width: 50px !important;
    min-width: inherit !important;
    transition: all .3s ease-in-out;
  }

  .sidebar-wrap {
    font-family: PingFangSC-Regular;
    height: calc(100% - 60px);
    float: left;
    box-sizing: border-box;
    width: 220px;
    background: #fff;
    overflow: auto;
    box-shadow: 4px 0 7px 0 hsla(0,0%,40%,.15);
    max-height: 100%;
    .el-menu-vertical {
      border-right: none;
      position: relative;
      .sidebar-item-icon {
        position: absolute;
        left: 24px;
        top: 21px;
        display: block;
        width: 14px;
        height: 14px;
      }

      .el-submenu {
        overflow: hidden;
        &.is-opened{
          .el-submenu__title{
            font-family: PingFangSC-Medium;
            color:#000;
          }
        }
        .el-menu-item {
          position: relative;
          text-align: left;
          color: rgba(0,0,0,.65);
          font-size: 14px;
          height: 36px;
          line-height: 36px;
          &.is-active{
            color: #1890ff;
          }
          &:hover {
            background-color:#fff;
            color: #1890ff;
          }
        }
        .el-submenu__title {
          height: 52px;
          line-height: 52px;
          font-size: 14px;
          color: rgba(0,0,0,.65);
          &:hover{
            background-color:#fff;
            color: rgba(0,0,0,.85);
          }
          .el-submenu__icon-arrow {
            color: rgba(0,0,0,.65);
            margin-top: -3px;
            font-size: 12px;
            font-weight: bold;
          }
        }
        .el-menu-item {

        }
      }
      .icon-submenu {
        vertical-align: sub;
      }

      .el-menu-item,
      .el-submenu__title {
        padding-left: 50px !important;
      }

    }

    .el-menu-item {
      min-width: inherit;
      i {
        margin-left: 77%;
      }
    }

    .el-menu--collapse {
      width: 100%;
    }

    .arrow-expand,
    .arrow-collapse {
      position: absolute;
      top: 70px;
      height: 22px;
      width: 22px;
      display: block;
      background-size: 22px 22px !important;
      font-size: 18px;
      line-height: 18px;
    }

    .arrow-expand {
      left: 10px;
      bottom: 0;
    }

    .arrow-collapse {
      left: 180px;
    }
  }
</style>
