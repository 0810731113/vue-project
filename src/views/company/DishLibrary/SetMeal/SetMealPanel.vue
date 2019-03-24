<template>
    <div class="set-meal-panel">
      <div class="el-breadcrumb">
        <div
          v-for="item in breadcrumb"
          :key="item.name"
          class="el-breadcrumb__item"
          :class="{ 'selected': index === item.index }"
          @click="onChangeItem(item.index)">
          <span class="el-breadcrumb__item__inner">{{ item.name }}</span>
        </div>
      </div>
      <transition name="fade">
        <SetMealClsMain v-if="index === 0" transition="fade" />
        <SetMealMain :isShop="false" v-if="index === 1" transition="fade" />
        <SetMealManage :isShop="false" v-if="index === 2" transition="fade" />
      </transition>
    </div>
</template>

<script>
import { SetMealClsMain } from './index';
import { SetMealMain, SetMealManage } from 'common';

export default {
  name: 'setMealPanel',
  components: {
    SetMealMain,
    SetMealManage,
    SetMealClsMain
  },
  data () {
    return {
      breadcrumb: [{
        name: '1.套餐分类',
        index: 0
      }, {
        name: '2.套餐管理',
        index: 1
      }, {
        name: '3.套餐配菜项管理',
        index: 2
      }, {
        // 空，用以补位
      }],
      index: 1
    };
  },
  methods: {
    onChangeItem (index) {
      this.index = index;
    }
  }
};
</script>

<style lang="scss">
.set-meal-panel {
  .el-breadcrumb {
    padding: 10px 0;
    border-bottom: 2px solid #ddd;

    .el-breadcrumb__item {
      width: 160px;
      font-size: 18px;
      text-align: center;
    }

    .selected {
      .el-breadcrumb__item__inner {
        color: #20a0ff;
        cursor: pointer;
      }
    }
  }

  .fade-enter-active {
    transition: all .5s ease;
    -webkit-transition: all .5s ease;
  }

  .fade-enter {
    opacity: 0;
    transform: translateX(20%);
    -webkit-transform: translateX(20%);
  }
}
</style>
