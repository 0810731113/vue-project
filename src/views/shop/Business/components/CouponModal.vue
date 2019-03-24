<template>
  <el-dialog custom-class="base-modal coupon-modal" :visible.sync="isShow" size="small">
    <div class="modal-title" slot="title">美味优惠券选择</div>
    <el-select v-model="selectedType" class="payment-type" @change="onChangeType">
      <el-option label="所有" value="1,2,3"></el-option>
      <el-option
        v-for="item in types"
        :key="item.value"
        :label="item.name"
        :value="item.value">
      </el-option>
    </el-select>
    <hr />
    <el-table :data="datas" border @current-change="onSelectedCoupon">
      <el-table-column align="center" width="60" class-name="single-check">
        <template slot-scope="scope">
          <el-radio class="radio" :disabled="scope.row.status === FORBIDDEN" v-model="selected.couponID" :label="scope.row.couponID"></el-radio>
        </template>
      </el-table-column>
      <el-table-column property="couponID" align="center" label="优惠券编号" width="120">
      </el-table-column>
      <el-table-column property="couponName" align="center" label="优惠券名称">
      </el-table-column>
      <el-table-column property="couponType" align="center" label="类型">
        <template slot-scope="scope">
          {{ types[scope.row.couponType - 1].name }}
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount">
    </pagination>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onShowOrHideModal">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import { Pagination } from 'components';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import { COUPONS } from 'constant/payment';
import { FORBIDDEN } from 'constant/statusCode';

export default {
  name: 'couponModal',
  props: ['datas', 'fetchMWCoupons', 'recordCount'],
  components: {
    Pagination
  },
  data () {
    return {
      FORBIDDEN,
      isShow: false,
      types: COUPONS,
      selectedType: '1,2,3',
      selected: {},
      pageIndex: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGES
    };
  },
  methods: {
    async onChangeCurrent (pageIndex) {
      this.pageIndex = pageIndex;
      await this.fetchMWCoupons({ type: this.selectedType, pageSize: DEFAULT_PAGES, pageIndex });
    },
    async onChangeType (value) {
      this.pageIndex = DEFAULT_PAGE;
      this.pageSize = DEFAULT_PAGES;
      await this.fetchMWCoupons({ type: value, pageIndex: DEFAULT_PAGE, pageSize: DEFAULT_PAGES });
    },
    onSelectedCoupon (couponItem) {
      const { status } = couponItem;
      if (status === FORBIDDEN) return;
      this.selected = couponItem || {};
    },
    onSubmit () {
      if (isEmpty(this.selected)) return;

      const query = {};
      for (let key in this.selected) {
        if (this.selected[key] !== null) {
          query[key] = this.selected[key];
        }
      }

      this.$router.push({ path: '/myd/business/payment/add', query });
      this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.isShow = false;
      this.selected = {};
    }
  }
};
</script>

<style lang="scss">
.coupon-modal {
  .el-dialog__body {
    padding: 0 20px;

    .el-table .cell {
      line-height: 35px;
    }
  }

  .single-check {
    .el-radio .el-radio__label {
      display: none;
    }
  }
}
</style>
