<template>
  <div class="layout-container"
       v-loading="loading"
       :element-loading-text="loadingText"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <MainHeader v-if="!IS_IFRAME"></MainHeader>
    <Sidebar v-if="!IS_IFRAME"></Sidebar>
    <div class="app-main" :class="{ 'iframe-main': IS_IFRAME }">
      <iframe :src="iframeInfo.route" v-if="iframeInfo.isIframe" class="iframe-dot-net"/>
      <div v-else>
        <el-breadcrumb separator=">" class="navigation" v-show="navigation.length">
          <el-breadcrumb-item v-for="item in navigation" :key="item.path">{{item.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <AppMain ref="main" v-if="hasAuth"/>
        <Unauthorized v-else/>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex';
  import Unauthorized from '../errors/Unauthorized';
  import {AppMain, MainHeader, Sidebar, MainFooter} from './index';
  import {Loading, Notification} from 'components';
  import * as AUTH from 'utils/permissionUtil';

  export default {
    name: 'Layout',
    components: {
      AppMain,
      MainHeader,
      Sidebar,
      MainFooter,
      Loading,
      Notification,
      Unauthorized
    },
    created() {
      sessionStorage.setItem('isIframe', this.IS_IFRAME);
      this.getNavigation();
    },
    data() {
      return {
        hasAuth: false,
        IS_IFRAME: !!this.$route.query.isIframe,
        navigation: []
      };
    },
    computed: mapState({
      loading: state => state.error.loading,
      loadingText: state => state.error.loadingText,
      iframeInfo: state => state.sysetymenu.iframeInfo
    }),
    watch: {
      $route() {
        this.getNavigation();
      }
    },
    methods: {
      ...mapActions([
        'fetchSystemMenu'
      ]),
      getNavigation() {
        const {matched, meta} = this.$route;
        if (meta.isIndex) {
          this.hasAuth = true;
        } else {
          this.hasAuth = meta.isMain ? AUTH.checkViewRight(meta.name) : AUTH.checkUserRight(this);
        }
        this.navigation = matched.filter(item => item.name);
      }
    }
  };
</script>

<style lang="scss">
  .layout-container {
    height: 100%;
    font-size: 14px;

    .iframe-main {
      max-height: inherit !important;
    }

    .iframe-dot-net {
      border: none;
      padding: 10px 0;
      width: 100%;
      height: 100%;
    }

    .el-menu--horizontal {
      border-bottom: 0 none;

      &:focus {
        outline: 0 none;
      }
    }

    .app-main {
      height: calc(100% - 60px);
      min-width: calc(100% - 310px);
      overflow: auto;

      .navigation {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #E7E7E7;
        font-size: 14px;
        color: #606266;
        margin-left: 15px;

        .el-breadcrumb__separator {
          color: #606266;
        }

        .el-breadcrumb__item__inner:hover {
          color: #666666;
          cursor: initial;
        }

        .el-breadcrumb__item:last-child {
          .el-breadcrumb__inner {
            color: #151515 !important;
          }
        }
      }
    }

    /*@media screen and (max-width: 1400px) {*/
    /*.app-main {*/
    /*max-height: 80%;*/
    /*}*/
    /*}*/

    .loading-wrap {
      height: 100%;
      width: 100%;
      background: #000;
      opacity: .375;
      z-index: 2024;
      position: absolute;
      top: 0;

      img {
        width: 40px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
    }
  }
</style>
