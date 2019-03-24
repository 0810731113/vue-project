<template>
  <div class="guide-wrapper">
    <el-tabs type="border-card" v-model="activeName" class="dish-tab" @tab-click="onClickTab">
      <el-tab-pane name="classify">
        <span slot="label" class="tab-title">
          <span class="requied">*</span>添加菜品分类
          <div class="icon-error" v-show="dishStatus.classify" />
        </span>
        <div class="tab-tips">
          <span class="requied">*</span>
          <span>添加菜品分类</span>
          <span class="tips-note">（添加菜品所属的分类。例如：招牌菜、家常菜等）</span>
        </div>
        <dish-classify v-if="!selectedIndex" :showError="dishStatus.classify"></dish-classify>
      </el-tab-pane>
      <el-tab-pane name="menu">
        <span slot="label" class="tab-title">
          <span class="requied">*</span>添加菜品
          <div class="icon-error" v-show="dishStatus.menu" />
        </span>
        <dish-menu :showError="dishStatus.menu"></dish-menu>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label" class="tab-title">添加菜品要求</span>
        <div class="tab-tips">
          <span>添加菜品要求</span>
          <span class="tips-note">（用户对某些菜品的烹饪要求。例如：辣度可以设置中辣、微辣；熟度可以设置七分熟、九分熟等）</span>
        </div>
        <dish-explain></dish-explain>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label" class="tab-title">设置营销选项</span>
        <div class="tab-tips">
          <span>设置营销选项</span>
          <span class="tips-note">（设置菜品运营过程中的一些选项，例如菜品是否可以打折，是否为时价菜，是否可赠送等）</span>
        </div>
        <dish-discount></dish-discount>
      </el-tab-pane>
      <el-tab-pane name="menuPrint">
        <span slot="label" class="tab-title">
          <span class="requied">*</span>设置菜品打印机
          <div class="icon-error" v-show="dishStatus.menuPrint" />
        </span>
        <div class="tab-tips">
          <div class="tip-wrapper">
            <span>设置菜品打印机</span>
            <show-error-tip ref="showErrorTip" class="setting-error-tip" :showError="dishStatus.menuPrint" errorText="您尚未对菜品设置打印机" />
          </div>
          <br/>
          <span class="tips-note">开店向导中单个菜品只能设置一个打印机，如部分菜品需要在多个打印机同时打印，请移步菜单“餐桌管理-菜品打印部门”中进行设置。</span>
        </div>
        <dish-printer></dish-printer>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { DishClassify, DishExplain } from './index';
import DishMenu from './DishMenu.vue';
import DishDiscount from './DishDiscount.vue';
import DishPrinter from './DishPrinter.vue';
import { ShowErrorTip } from 'components';

export default {
  name: 'dishSetting',
  props: ['dishStatus', 'active'],
  components: {
    DishClassify,
    DishExplain,
    DishDiscount,
    DishMenu,
    DishPrinter,
    ShowErrorTip
  },
  data () {
    return {
      selectedIndex: 0,
      activeName: 'classify'
    };
  },
  watch: {
    'dishStatus.classify' () {
      this.setActiveName(this.dishStatus);
    },
    'dishStatus.menu' () {
      this.setActiveName(this.dishStatus);
    },
    'dishStatus.menuPrint' () {
      this.setActiveName(this.dishStatus);
    }
  },
  methods: {
    onClickTab (tab) {
      this.selectedIndex = +tab.index;
    },
    setActiveName (obj) {
      for (let key in obj) {
        if (obj[key]) {
          this.activeName = key;
          break;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.guide-wrapper {
  padding: 15px;

  .dish-tab {
    .requied {
      color: #f36b5f;
      height: 20px;
      line-height: 20px;
      vertical-align: sub;
      padding-right: 5px;
    }

    .icon-error {
      width: 19px;
      height: 19px;
      position: absolute;
      display: inherit;
      background-image: url('../images/icon_error.png');
    }

    .el-tabs__content {
      margin: 0 20px;
    }

    .el-tabs__header {
      background: #f2f2f2;
    }

    .el-tabs__item {
      color: #c8c8c8;
      padding: 0;

      .tab-title {
        padding: 0 20px;
        border-right: 1px solid #b3b3b3;
      }

      &.is-active {
        color: #191919;

        .tab-title {
          border-right: none;
        }
      }
    }

    .tab-tips {
      color: #191919;
      padding-top: 15px;

      .tip-wrapper {
        width: 270px;
        position: relative;

        .mw-tooltip {
          right: 0;
          top: -2px;
          z-index: 0 !important;
        }
      }

      .tips-note {
        color: #9e9e9e;
      }
    }
  }
}
</style>
