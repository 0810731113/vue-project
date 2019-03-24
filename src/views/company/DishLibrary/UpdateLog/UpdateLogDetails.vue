<template>
  <el-dialog
    width="70%"
    :visible.sync="isShow"
    title="数据下发详情"
    custom-class="base-modal"
  >
    <el-form inline>
      <el-form-item label="操作时间:">
        {{updateLogDetail.dataSend.createTime}}
      </el-form-item>
      <el-form-item label="更新开始时间:">
        {{updateLogDetail.dataSend.jobTime}}
      </el-form-item>
      <el-form-item label="更新完成时间:">
        {{updateLogDetail.dataSend.jobEndTime}}
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item label="业务类型:">
        {{(UPDATE_LOG_TYPE[updateLogDetail.dataSend.content] || {}).name}}
      </el-form-item>
      <el-form-item label="业务内容:">
        {{updateLogDetail.cookbook && updateLogDetail.cookbook.cookname}}
      </el-form-item>
    </el-form>
    <el-table border :data="updateLogDetail.menuItem" max-height="300">
      <el-table-column prop="itemName" align="center" label="菜品" />
      <el-table-column prop="orderUint" align="center" label="规格" />
      <el-table-column prop="salePrice" align="center" label="标准价" />
      <el-table-column prop="cbSalePrice" align="center" label="售价" />>
    </el-table>
    <div class="shop-detail" v-if="updateLogDetail.dataSend.status !== 1">
      <div class="success">
        <div class="tips">下发成功门店&nbsp;({{successShop.length}}家)</div>
        <div class="item" v-for="(item, index) in updateLogDetail.dataSendItem" v-if="+item.status === 2" :key="index">{{item.shopName}}</div>
      </div>
      <div class="fail">
        <div class="tips">下发失败门店&nbsp;({{failShop.length}}家)</div>
        <div class="item" v-for="(item, index) in updateLogDetail.dataSendItem" v-if="+item.status === 3" :key="index">{{item.shopName}}</div>
      </div>
    </div>
    <div class="shop-detail" v-if="+updateLogDetail.dataSend.status == 1">
      <div class="success">
        <div class="tips">待下发的门店&nbsp;({{updateLogDetail.dataSendItem.length}}家)</div>
        <div class="item" v-for="(item, index) in updateLogDetail.dataSendItem" :key="index">{{item.shopName}}</div>
      </div>
    </div>
    <div class="btn-wrapper">
      <el-button class="btn-submit" @click="onCancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { UPDATE_LOG_TYPE, UPDATE_LOG_STATUS, UPDATE_TIME_TYPE } from 'constant/constants';

  export default {
    name: 'UpdateLogDetail',
    props: ['guid'],
    data () {
      return {
        isShow: false,
        UPDATE_LOG_TYPE,
        UPDATE_LOG_STATUS,
        UPDATE_TIME_TYPE,
        successShop: [],
        failShop: []
      };
    },
    watch: {
      async isShow () {
        if (this.isShow) {
          await this.fetchUpdateLogDetail({ fsGuid: this.guid });
          this.successShop = [];
          this.failShop = [];
          this.updateLogDetail.dataSendItem.map(item => {
            if (+item.status === 3) {
              this.failShop.push(item);
            } else if (+item.status === 2) {
              this.successShop.push(item);
            }
          }
          );
        }
      }
    },
    computed: {
      ...mapState({
        updateLogDetail: state => state.dishLibrary.updateLog.updateLogDetail
      })
    },
    methods: {
      ...mapActions([
        'fetchUpdateLogDetail'
      ]),
      onCancel () {
        this.isShow = false;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .shop-detail {
    padding: 3%;
    min-height: 50px;
    max-height: 300px;

    .tips {
      border-bottom: 1px solid #ebeef5;
    }

    .success {
      width: 45%;
      float: left;
      height: 300px;

      .item {
        padding: 5px;
      }
    }

    .fail {
      margin-left: 1%;
      width: 45%;
      float: left;
      height: 300px;

      .item {
        color: red;
        padding: 5px;
      }
    }
  }

  .btn-wrapper {
    text-align: center;
  }

  .el-form-item {
    margin-bottom: 0;
  }
</style>
