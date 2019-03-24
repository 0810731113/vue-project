<template>
  <el-dialog custom-class="base-modal menu-setting" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">批量设置</div>
    <div class="select-count">已选择{{ data.length }}个菜品</div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">销售归属:</label>
      <div class="menu-introduction">
        <el-select v-model="expClsId">
          <el-option v-for="(item,index) in expclsList"
                     :key="item.expClsId"
                     :label="item.expClsName"
                     :value="item.expClsId"
                     :class="{ 'first-option': index === 0 }"
          />
        </el-select>
      </div>
    </div>

    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">收入归属:</label>
      <div class="menu-introduction">
        <el-select v-model="revenueTypeId">
          <el-option
            v-for="(item, index) in revenueTypeList"
            :key="item.revenueTypeId"
            :label="item.revenueTypeName"
            :value="item.revenueTypeId"
            :class="{ 'first-option': index === 0 }"
          />
        </el-select>
      </div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { Toast, Tips } from 'components';
import { SETMEAL_SETTING } from 'constant/dishMenu';
import cloneDeep from 'lodash/cloneDeep';
import { MENU_OPTIONS_BY_CLASS } from 'constant/dishMenu';

export default {
  name: 'BatchDishOptions',
  props: ['data','expclsList','revenueTypeList', 'onUpdateDishOptions',],
  components:{
    Tips
  },
  data () {
    return {
      isShow: false,
//      expclsList:[],
//      revenueTypeList:[],
      expClsId:'',
      revenueTypeId:'',

    };
  },
  watch: {
    isShow () {
      if (this.isShow) {
        this.initData();
      }
    }
  },
  methods: {
    initData () {},

    async onSubmit () {
      var info = {
        expClsId: this.expClsId,
        revenueTypeId: this.revenueTypeId,
      }
      console.log(info)
      await this.onUpdateDishOptions(info);
      //this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.isShow = false;
      this.initData();
    }
  }
};
</script>

<style lang="scss">
.menu-setting {
  width: 40%;
  white-space: nowrap;

  .select-count {
    padding-bottom: 30px;
    font-size: 16px;
  }

  .mw-form-item {
    width: 85%;
    margin-left: 30px;
    margin-bottom: 15px;

    .menu-make,
    .menu-price {
      width: calc(100% - 300px);
    }

    .menu-make {
      margin-left: 20%;
    }

    .menu-option-title {
      float: inherit;
    }

    .el-form-item__label {
      font-size: 16px;
    }
  }

  .menu-option {
    margin: 0 0 25px 20%;
  }

  .menu-options {
    margin-bottom: 0;
  }

  .btn-option {
    width: 100px;
    height: 26px;
    margin: 0 10px 5px 0;

    &:focus {
      background: transparent;
      border: 1px solid rgba(153, 153, 153, 0.62);
    }

    &.selected {
      color: #F36B5F;
      border: 1px solid #F36B5F;
      border-radius: 3px;
    }
  }
  .tips-wrapper {
    margin-left: -40px !important;
  }
}
</style>
