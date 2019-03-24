<template>
  <div
    class="nheader clear"
  >
    <div>
    <img src='./images/img-header-logo.png' class="logo" />

    <div class="header-menu">
      <ul class="header-menu-list">
        <li class="header-menu-list-item" v-for="item in menuInfo" :key="item.id">
          <a
            :href="item.href"
            :class="item.id === 13?'selected':''"
            :target="item.id === 6?'_blank':''"
          ><span>{{item.title}}</span></a>
        </li>
      </ul>
    </div>

    <section class="header-right">
      <div class="drop-box" @click="toggleShopDown" ref="dropdownEle">
        <span class="account-info">
          <p class="bottom-text">
            <span :class="canSwitchShop?'':'no-decoration'">{{shopInfo.shopname}}</span>
            <i v-if="canSwitchShop" class="icon"></i>
          </p>
        </span>

        <ul v-if="isShopDropdown" class="account-info-dropdown-left dropdown-menu dropdown-caret">
          <li @click="changeShop">
            <i class="fa fa-exchange"></i>切换门店
          </li>
        </ul>

      </div>

      <div class="drop-box" @click="isAccountDropdown=!isAccountDropdown" ref="dropdownEl">
        <span class="account-info text-align-right">
          <p class="bottom-text">
            <span>{{shopInfo.username}}</span>
            <i class="icon"></i>
          </p>
        </span>
        <ul v-if="isAccountDropdown" class="account-info-dropdown-right dropdown-menu dropdown-caret dropdown-close">
          <li @click="logoutAction">
            <i class="fa fa-power-off"></i>注销
          </li>
        </ul>
      </div>
    </section>
    <popup
      ref="popup"
      type="other"
      title="切换门店"
      class="shop-list-modal"
    >
      <div slot="content">
        <div class="shop-list-box">
          <el-tabs v-if="brandList.length>1"  ref="brandRef" @tab-click="changeBrand">
            <el-tab-pane v-for="(item,key) in brandList" :key="item.brandId" :label="item.brandName" :name="''+key">
              <div>
                <div class="search-wrap">
                  <div class="mw-form-control-wrapper search-group-input">
                    <input
                      type="text"
                      class="mw-form-control"
                      v-model="search"
                      placeholder="请输入店铺名/店铺地址/店铺ID"
                    />
                  </div>
                  <a class="mw-btn mw-btn-tyellow" @keyup.enter="throttleSearchFunc" @click="throttleSearchFunc">搜索</a>
                </div>
                <ul v-if="tableData" class="shop-list-ul">
                  <li class="shop-row title-row">
                    <div class="shop-id">门店ID</div>
                    <div class="shop-name">门店名称</div>
                    <div class="shop-address">门店地址</div>
                  </li>
                  <li v-for="(item,index) in tableData" class="shop-row" :key="index">
                    <div class="shop-id">{{item.shopId}}</div>
                    <div class="shop-name">
                      <a @click="handleChangeShop(item.shopId, item.manageShopId)">{{item.shopName}}</a>
                    </div>
                    <div class="shop-address">
                      <span :title="item.address">{{item.address}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div v-else>
            <div class="search-wrap">
              <div class="mw-form-control-wrapper search-group-input">
                <input
                  type="text"
                  class="mw-form-control"
                  v-model="search"
                  placeholder="请输入店铺名/店铺地址/店铺ID"
                />
              </div>
              <a class="mw-btn mw-btn-tyellow" @keyup.enter="throttleSearchFunc" @click="throttleSearchFunc">搜索</a>
            </div>
            <ul v-if="tableData" class="shop-list-ul">
              <li class="shop-row title-row">
                <div class="shop-id">门店ID</div>
                <div class="shop-name">门店名称</div>
                <div class="shop-address">门店地址</div>
              </li>
              <li v-for="(item,index) in tableData" class="shop-row" :key="index">
                <div class="shop-id">{{item.shopId}}</div>
                <div class="shop-name">
                  <a @click="handleChangeShop(item.shopId, item.manageShopId)">{{item.shopName}}</a>
                </div>
                <div class="shop-address">
                  <span :title="item.address">{{item.address}}</span>
                </div>
              </li>
            </ul>
          </div>
          <pagination
            :totalCount="totalCount"
            :currentPage="currentPage"
            :pageSize="pageSize"
            :onChangeCurrent="onChangeCurrent">
          </pagination>
        </div>
      </div>
    </popup>
    <template>

    </template>
    </div>
  </div>
</template>

<script>
  import {Toast, Popup, Pagination} from 'components';
  import {onLogOut} from 'utils/configUtil';
  import {FeedbackMessage} from 'views/common';
  import {SHOPKIND, LOCAL_KEY_ACCOUNT_INFO} from 'constant/constants';
  import {SUCCESS} from 'constant/statusCode';
  import local from 'utils/localstorageUtil';
  import {fetchBrandList, fetchAllShopList, doChangeShop, getShopInfo} from 'api/header';

  export default {
    name: 'Header',
    components: {
      Toast,
      Popup,
      Pagination,
      FeedbackMessage
    },
    data() {
      return {
        menu: [],
        shopInfo: {},
        isShopDropdown: false,
        isAccountDropdown: false,
        brandList: [],
        tabId: '',
        currentPage: 1,
        pageSize: 5,
        tableData: [],
        totalCount: 0,
        canSwitchShop: true,
        search: ''
      };
    },
    created() {
      const accountInfo = local.getInstance().getItem(LOCAL_KEY_ACCOUNT_INFO);
      if (accountInfo) {
        this.menu = accountInfo.menu || [];
        this.shopInfo = accountInfo.shop_info || {};
        if (this.shopInfo.accountType === '门店账号' || this.shopInfo.accountType === '门店子账号') {
          this.canSwitchShop = false;
        }
      } else {
        getShopInfo().then(data => {
          if (data) {
            local.getInstance().setItem(LOCAL_KEY_ACCOUNT_INFO, data);
            this.menu = data.menu || [];
            this.shopInfo = data.shop_info || {};
            if (this.shopInfo.accountType === '门店账号' || this.shopInfo.accountType === '门店子账号') {
              this.canSwitchShop = false;
            }
          }
        });
      }
      // this.$toast.show({content: 'test', type: 'success'});
    },
    mounted() {
      document.addEventListener('click', this.handleClickDocument, false);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.handleClickDocument, false);
    },
    computed: {
      menuInfo() {
        return this.menu.map(item => {
          const firstMenu = item.menu[0];
          if (firstMenu) {
            return {
              id: item.id,
              title: item.title,
              href: firstMenu.subMenu.length ? firstMenu.subMenu[0].pathname : firstMenu.pathname
            };
          }
          return {
            id: item.id,
            title: item.title,
            href: item.pathname
          };

        });
      }
    },
    methods: {
      throttleSearchFunc() {
        this.currentPage = 1;
        this.fetchShopList(this.search);
      },
      handleChangeShop(shopId, manageShopId) {
        doChangeShop({brandId: manageShopId, shopId: shopId}).then(data => {
          if (data) {
            this.$refs.popup.isShow = false;
            local.getInstance().removeItem(LOCAL_KEY_ACCOUNT_INFO);
            this.$toast.show({content: '门店切换成功', type: 'success'});
            setTimeout(() => {
              location.href = process.env.VUE_APP_BM_HOST + 'myd/';
            }, 2000);
          }
        });
      },
      onChangeCurrent(pageIndex) {
        this.currentPage = pageIndex;
        this.fetchShopList(this.search);
      },
      changeShop() {
        fetchBrandList().then(data => {
          if (data) {
            this.brandList = data && data.list || [];
            this.tabId = data && data.list && data.list[0] && data.list[0]['brandId'] || '';
            this.$refs.popup.isShow = true;
            this.fetchShopList();
          }
        });
      },
      fetchShopList(search = '') {
        fetchAllShopList({
          brandId: this.tabId,
          search,
          page: this.currentPage,
          pageSize: this.pageSize
        }).then(data => {
          if (data) {
            this.tableData = data && data.list || [];
            this.totalCount = ~~data.total;
          }
        });
      },
      changeBrand(tab, event) {
        const index = tab.index;
        this.tabId = ~~this.brandList[index]['brandId'];
        this.currentPage = 1;
        this.fetchShopList();
      },
      logoutAction() {
        onLogOut();
      },
      toggleShopDown() {
        if (this.canSwitchShop) {
          this.isShopDropdown = !this.isShopDropdown;
        }
      },
      handleClickDocument(e) {
        if (!this.isChildOf(e.target, this.$refs.dropdownEl) && this.isAccountDropdown) {
          this.isAccountDropdown = false;
        }
        if (!this.isChildOf(e.target, this.$refs.dropdownEle) && this.isShopDropdown) {
          this.isShopDropdown = false;
        }
      },
      isChildOf(child, parent) {
        if (child.parentNode === parent) {
          return true;
        }
        if (child.parentNode === null) {
          return false;
        }
        return this.isChildOf(child.parentNode, parent);
      }
    }
  };

</script>

<style lang="scss">
  .nheader {
    z-index: 999;
    width: 100%;
    height: 60px;
    border-bottom: none!important;
    font-size: 0;
    line-height: 28px;
    margin-bottom: 0;
    margin-top: 0;
    background: #324057;
    box-shadow: 0 1px 4px 0 rgba(0,21,41,.12);
    > div{
      position: relative;
      height: 60px;
    }
    .logo {
      width: 125px;
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }

    .header-menu {
      position: relative;
      height: 60px;
      line-height: 60px;
      display: inline-block;
      margin-left: 220px;
      overflow: auto;
      overflow-y: hidden;

      .header-menu-list {
        margin: 0;
        padding: 0;
        width: auto;
        text-align: justify;
        float: left;
        list-style: none;
        height: 100%;

        .header-menu-list-item {
          display: inline-block;
          width: auto;
          height: 60px;
          transition: all .2s;
          a {
            height: 60px;
            text-decoration: none;
            margin: 0 5px;
            font-size: 14px;
            font-weight: 500;
            color: rgba(255,255,255,0.66);
            display: inline-block;
            &:hover{
              color:#fff;
            }
            span{
              box-sizing: border-box;
              display: inline-block;
              line-height: 60px;
              height: 50px;
              padding: 0 10px;
            }
            &.selected span{
              font-size: 16px;
              border-bottom: 2px solid #fff;
              color:#fff;
            }
          }
        }
      }
    }

    .header-right {
      display: inline-block;
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      font-size: 0;
      text-align: right;
      height: 60px;

      .drop-box {
        &:not(:first-child) {
          border-left: 1px solid #ccc;
        }
        box-sizing: content-box;
        display: inline-block;
        margin-top: 10px;
        height: 40px;
        // border-left: 1px solid #ccc;
        padding: 0 30px 0 20px;
        text-align: right;
        vertical-align: top;
        cursor: pointer;

        .account-info {
          p{
            margin-block-start: 0;
            margin-block-end: 0;
          }
          margin-top: 11px;
          // max-width: 150px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: right;
          vertical-align: top;
          line-height: 15px;
          position: relative;
          .top-text {
            font-size: 13px;
            line-height: 17px;
            &.text-color-orange {
              color: #ff892a !important;
            }
          }
          .bottom-text {
            color: #FFFFFF;
            line-height: 22px;
            height: 22px;
            font-size: 12px;
            span {
              display: inline-block;
              text-overflow: ellipsis;
              max-width: 180px;
              overflow: hidden;
              white-space: nowrap;
              word-break: break-all;

              &.no-decoration{
                text-decoration: none !important;
              }
              &:hover {
                text-decoration: underline;
                text-overflow: unset;
                white-space: normal;
              }
            }
            .icon {
              display: inline-block;
              margin-left: 7px;
              width: 9px;
              height: 17px;
              background-image: url(../../assets/triangle-down.png);
              background-repeat: no-repeat;
              background-size: 9px 5px;
              background-position: 0 8px;
              vertical-align: top;
            }
          }
        }

        .dropdown-menu {
          position: absolute;
          top: 70px;
          z-index: 10;
          float: left;
          min-width: 150px;
          padding: 5px 0;
          margin: 2px 0 0 0;
          list-style: none;
          font-size: 14px;
          background-color: #fff;
          border: 1px solid #ccc;
          border: 1px solid rgba(0,0,0,0.15);
          border-radius: 0px;
          -webkit-box-shadow: 0 6px 12px rgba(0,0,0,0.175);
          box-shadow: 0 6px 12px rgba(0,0,0,0.175);
          background-clip: padding-box;

          &.account-info-dropdown-right {
            right: 27px;
          }
          &.account-info-dropdown-left {
            right: 166px;
          }
          &.dropdown-caret:before {
            border-bottom: 7px solid rgba(0, 0, 0, 0.2);
            -moz-border-bottom-colors: rgba(0, 0, 0, 0.2);
            border-left: 7px solid transparent;
            border-right: 7px solid transparent;
            content: "";
            display: inline-block;
            left: auto;
            right: 9px;
            position: absolute;
            top: -7px;
          }
          &.dropdown-caret:after {
            border-bottom: 6px solid #FFF;
            -moz-border-bottom-colors: #FFF;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            content: "";
            display: inline-block;
            left: auto;
            right: 10px;
            position: absolute;
            top: -6px;
          }

          li {
            width: 100%;
            text-align: left;

            &:hover {
              background-color: #fee188;
            }

            i {
              font-size: 14px;
              padding: 0 10px;
            }
          }
        }
      }
    }
  }

  .shop-list-modal {
    /*.el-tabs__header {
      .el-tabs__item {
        box-sizing: content-box;
        color: #a9a9a9;
        padding: 0 40px;
        height: 47px;
        line-height: 47px;
        &:hover{
          color: #409EFF;
        }
        &.is-active {
          border-top: 2px solid #3498db;
          color: #333;
        }
      }
    }*/
    .el-tabs__header {
      .el-tabs__item {
        height: 42px;
        line-height: 42px;
        color: #8391a5;
        &:hover{
          color: #1f2d3d;
        }
        &.is-active {
          color: #20a0ff;
        }
      }
    }
    .el-dialog {
      width: 740px !important;
      border-radius: 5px;
    }
    .el-dialog__body {
      padding: 15px;
    }
    .mw-pagination-wrap {
      padding: 10px 0;
    }
    .el-dialog__header {
      border-bottom: 1px solid #e5e5e5;
      div {
        text-align: left;
        font-weight: 700;
      }
      .el-dialog__headerbtn {
        top: 12px;
        background: none;
        .el-icon-close {
          font-size: 17px;
          font-weight: 700;
          color: rgba(0, 0, 0, .2);
        }
      }
    }
    font-size: 14px;
    .tabs-navigation {
      max-height: none;
    }
    .mw-modal-title {
      font-size: 16px;
      font-weight: bold;
      color: #4c5a5f;
    }
    .mw-modal-container {
      width: 710px;
    }
    .shop-list-box {
      padding: 0 9px 9px;
      .search-wrap {
        margin: 0 0 10px 0;
        a.mw-btn{
          vertical-align: top;
        }
        .search-group-input {
          margin: 0 20px 0 0;
          display: inline-block;
        }
      }

      .shop-row {
        width: 100%;
        height: 54px;
        line-height: 54px;
        border-bottom: 1px dotted #D0D8E0;
        border-radius: 4px 4px 0 0;
        color: #777;
        &:hover {
          background-color: #F4F9FD;
        }
        &.title-row {
          background: #FAFAFA;
          border-bottom: 0;
          border-radius: 0;
          color: #333;
          &:hover {
            background-color: #FAFAFA;
          }
          div {
            font-weight: 500;
          }
        }

        div {
          display: inline-block;
          overflow: hidden;
          box-sizing: border-box;
          padding-left: 16px;
          &.shop-id {
            width: 20%;
          }
          &.shop-name {
            width: 35%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            a {
              color: #299FFE;
              cursor: pointer;
              &:hover {
                color: #288FFE;
                text-decoration: underline;
              }
            }
          }
          &.shop-address {
            width: 43%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .mw-form-control {
      padding: 0 10px;
      width: 270px;
      height: 36px;
      color: #373d40;
      border: 1px solid #c2cdd3;
      background-color: rgba(245, 248, 249, .8);
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
      box-shadow: none;
      vertical-align: middle;
      &:focus{
        border-color: #9dc5d9;
        background-color: rgba(243,252,255,.8);
        box-shadow: 0 3px 10px 0 rgba(69,69,69,.11);
        outline: 0;
      }
    }

    .mw-btn {
      cursor: pointer;
      padding: 7px 22px;
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.42857143;
      border: 1px solid transparent;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      border-radius: 3px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      text-decoration: none;
    }

    .mw-btn.mw-btn-tyellow {
      color: #fff;
      border-color: #ffb40d;
      background-color: #ffb40d;
    }

    .shop-list-ul {
      list-style: none;
      -webkit-margin-before: 0;
      -webkit-margin-after: 0;
      -webkit-margin-start: 0;
      -webkit-margin-end: 0;
      -webkit-padding-start: 0;
      margin-bottom: 20px;
    }

  }


</style>
