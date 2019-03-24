<template>
  <el-dialog custom-class="base-modal discount-plan-list" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">选择允许折扣方案</div>
    <el-form class="plan-list" >
      <el-form-item>
        <el-checkbox-group v-model="discountArray" >
          <el-checkbox v-for="item in discountPlanList" :label="item.discountId" :key="item.discountId">{{item.discountName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'discountPlanList',
    props: {
      selectedDiscount: {
        type: Array
      },
      onSelectedDiscount: {
        type: Function
      }
    },
    data () {
      return {
        isShow: false,
        discountArray: []
      };
    },
    watch: {
      selectedDiscount () {
        this.discountArray = this.selectedDiscount.slice();
      }
    },
    computed: {
      ...mapState({
        discountPlanList: state => state.employe.shopUser.discountPlanList
      })
    },
    methods: {
      ...mapActions([
        'fetchAllDiscountPlan'
      ]),
      async onSubmit () {
        const { discountArray } = this;
        this.onSelectedDiscount(discountArray);
        this.isShow = false;
      }
    }
  };
</script>

<style lang="scss">
  .discount-plan-list {
    .modal-title {
      color: red;
    }

    .plan-list {
      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }

      .el-checkbox {
        width: 260px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
