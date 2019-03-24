<template>
  <div class="company-main">
    <div class="top-wrap">
      <div class="top-item date-time">{{ fecha.format(new Date(), 'YYYY年MM月') }}</div>
      <div class="top-item">
        <div class="icon-revenue" />
        <div class="item-content">
          <div>本月各店营业额汇总</div>
          <div>¥{{ shopAmount }}</div>
        </div>
      </div>
      <div class="top-item">
        <div class="icon-newvip" />
        <div class="item-content">
          <div>本月新增会员数</div>
          <div>{{ ascMemberShip }}</div>
        </div>
      </div>
    </div>
    <div class="bottom-wrap">
      各店营业额列表
      <el-table :data="shopAmountList" border>
        <el-table-column :label="fecha.format(new Date(), 'YYYY年MM月')" align="center">
          <el-table-column prop="fsCustName" label="店名" align="center" />
          <el-table-column prop="fdExpAmt" label="营业额" align="center" />
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'main',
  async created () {
    await this.fetchCompanyDetail();
  },
  computed: mapState({
    shopAmount: state => state.cateringCompany.companyInfo.shopAmount,
    ascMemberShip: state => state.cateringCompany.companyInfo.ascMemberShip,
    shopAmountList: state => state.cateringCompany.companyInfo.shopAmountList
  }),
  methods: {
    ...mapActions([
      'fetchCompanyDetail'
    ])
  }
};
</script>

<style lang="scss">
.company-main {
  .top-wrap {
    height: 60px;
    text-align: center;
    padding: 10px 0;

    .top-item {
      width: 30%;
      height: 50px;
      display: inline-block;
      vertical-align: bottom;
    }

    .icon-newvip,
    .icon-revenue {
      width: 51px;
      height: 51px;
      display: inline-block;
      background-image: url('./images/icon_revenue.png');
      background-repeat: no-repeat;
    }

    .icon-newvip {
      background-image: url('./images/icon_newvip.png');
    }

    .date-time {
      line-height: 50px;
    }

    .item-content {
      display: inline-block;
      vertical-align: top;
      padding-top: 10px;
      text-align: left;
    }
  }

  .bottom-wrap {
    width: 70%;
    margin: auto;
  }
}
</style>
