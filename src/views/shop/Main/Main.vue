<template>
  <div class="main-container">
    <div class="common-usage-wrapper">
      <p class="tips">常用功能入口</p>
      <div v-for="(usage, index) in usages" :key="usage.name" class="usage-item" @click="() => goRoute(usage)">
        <div class="top">
          <span class="classify">{{usage.name}}</span>
          <span class="title">{{usage.tips}} &gt;</span>
        </div>
        <div class="bottom">
          <div class="img_div">
            <img :src="getImgUrl(index)" class="li_left">
          </div>
          <span class="num">{{usage.count}}</span>
        </div>
      </div>
      <p class="tips">一周营业指标</p>
      <line-chart :width="lineWidth" :height="lineHeight" :datas="lineData" :options="lineOption" />
      <div class="pie-wrapper">
        <pie-chart :height="pieHeight" :width="pieWidth" :datas="pieData" :options="pieOption" />
        <div class="table-wrapper">
          <el-table :data="pieData" stripe show-summary :summary-method="getSummaries" height="140">
            <el-table-column label="付款方式" prop="name" align="center" />
            <el-table-column label="现金" prop="value" align="center" />
            <el-table-column label="比例" align="center">
              <template slot-scope="scope">
                {{ Math.round(scope.row.value / totalPie * 10000) / 100.00 + "%" }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sales-wrapper">
        <div class="sales-title">销售排行</div>
        <el-table :data="sales" :show-header="false" height="350" empty-text="暂无排行">
          <el-table-column type="index" />
          <el-table-column prop="fsItemName" />
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.count + scope.row.fsOrderUint }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { PieChart, LineChart } from 'components';
import * as Config from 'utils/configUtil';

export default {
  name: 'Main',
  components: {
    PieChart,
    LineChart
  },
  data () {
    return {
      pieWidth: '425px',
      pieHeight: '290px',
      lineWidth: '910px',
      lineHeight: '310px',
      pieOption: {
        title: {
          text: '付款比例'
        },
        series: {
          name: '付款比例',
          radius: '45%'
        }
      },
      lineOption: {
        series: [{
          name: '收入曲线'
        }]
      }
    };
  },
  computed: mapState({
    usages: state => state.shop.baseData,
    lineData: state => state.shop.lineData,
    sales: state => state.shop.salesList,
    reportToken: state => state.shop.report.reportToken,
    shopKind: state => state.shop.report.shopKind,
    isStg: state => state.shop.report.isStg,
    account: state => state.shop.report.account,
    pieData () {
      const { pieData } = this.$store.state.shop;
      return pieData.map(item => {
        return { name: item.paymentName, value: item.fdReceMoney };
      });
    },
    totalPie () {
      const { pieData } = this.$store.state.shop;
      let sum = 0;
      pieData.map(item => {
        sum += item.fdReceMoney;
      });
      return sum;
    }
  }),
  async created () {
    await this.fetchBaseInfo();
  },
  methods: {
    ...mapActions([
      'fetchBaseInfo',
      'switchReportToken',
      'checkReportLogin'
    ]),
    getSummaries () {
      return ['合计', this.totalPie, ''];
    },
    getImgUrl (index) {
      const images = require.context('./images/', false, /\.png$/);
      return images('./icon-usage-' + index + '.png');
    },
    async goRoute (usage) {
      // 报表跳转
      if (usage.id === 'report') {
        if (!await Config.linkToReport()) {
          this.$toast.show({ content: '报表跳转失败', type: 'warning' });
        }
        return;
      }
      const { route, iframe } = usage;
      if (!route) return;
      if (sessionStorage.getItem('isIframe') === 'true') {
        window.parent.Navigation(iframe.parent, iframe.children);
      } else {
        this.$router.push(route);
      }
    }
  }
};
</script>

<style lang="scss">
.main-container {
  background-color: #f4f4f4;
  padding: 25px;
  width: 1000px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  margin: 0 auto;

  .common-usage-wrapper {
    padding-bottom: 25px;

    .tips {
      color: #000;
      font-size: 16px;
      font-weight: 600;
    }

    .usage-item {
      width: 27%;
      display: inline-block;
      background: #fff;
      padding: 19px;
      margin: 0 5px 10px;
      border: 2px solid #fff;

      .top {
        .classify {
          font-size: 16px;
          color: #5e5e5e;
        }

        .title {
          float: right;
          font-size: 14px;
          color: #8c8c8c;
        }
      }

      .bottom {
        margin-top: 20px;

        .img_div {
          width: 60px;
          height: 60px;
          display: inline-block;
        }

        .num {
          float: right;
          max-width: 70%;
          color: #5f5f5f;
          font-size: 30px;
          line-height: 60px;
          white-space: nowrap;
        }
      }

      &:hover {
        border: 2px solid #337ab7;
        cursor: pointer;
      }
    }

    .line-chart {
      background: #fff !important;
      padding: 0 20px;
      margin-bottom: 20px;
    }

    .pie-wrapper {
      display: inline-block;
      width: 48%;
      height: 420px;
      margin-right: 2%;
      background-color: #fff;
      padding: 20px;
    }

    .sales-wrapper {
      width: 41%;
      height: 420px;
      float: right;
      padding: 2%;
      background: #fff;

      .sales-title {
        font-size: 15px;
        line-height: 20px;
        font-weight: 600;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
