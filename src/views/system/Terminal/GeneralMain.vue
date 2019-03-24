<template>
  <div class="general-main">
    <div class="el-col-12">
      <GeneralCard :data="dinner" />
      <GeneralCard :data="fastFood" />
    </div>
    <div class="distribution el-col-12">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span class="card-title">系统分布</span>
          <span class="card-title" v-if="showList">{{ `-${version.name}` }}</span>
          <span class="card-title btn-back" v-if="showList" @click="onClickBack">返回</span>
        </div>
      </el-card>
      <div class="pie-chart" v-if="!showList">
        <IEcharts :option="pieData" :loading="false" @click="onClick" />
      </div>
      <el-table v-if="showList" border :data="versionList" max-height="560" @cell-click="onShowModal">
        <el-table-column align="center" label="版本号" sortable prop="softwareVersion" />
        <el-table-column align="center" label="终端数量" sortable prop="count" />
      </el-table>
    </div>
    <VersionModal ref="versionModal" :data="terminalList" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { CLIENT, TRADEID } from 'constant/constants';
import GeneralCard from './components/GeneralCard.vue';
import VersionModal from './components/VersionModal.vue';
import IEcharts from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/pie';

export default {
  name: 'GeneralMain',
  components: {
    IEcharts,
    GeneralCard,
    VersionModal
  },
  data () {
    return {
      dinner: {},
      fastFood: {},
      pieData: {},
      version: {},
      showList: false
    };
  },
  computed: mapState({
    summary: state => state.release.terminal.summary,
    versionList: state => state.release.terminal.versionList,
    terminalList: state => state.release.terminal.terminalList
  }),
  async created () {
    await this.fetchTerminalSummary();
    const {
      totalAndroidCount, totalCount, totalFastAndroidCount,
      totalFastCount, totalFastWindowsCount, totalWindowsCount } = this.summary;
    this.dinner = {
      totalCount,
      title: '正餐',
      androidCount: totalAndroidCount,
      windowsCount: totalWindowsCount
    };
    this.fastFood = {
      title: '快餐',
      totalCount: totalFastCount,
      androidCount: totalFastAndroidCount,
      windowsCount: totalFastWindowsCount
    };
    this.pieData = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}</br>{d}%'
      },
      legend: { show: false },
      grid: { top: 'top' },
      color: ['#00abdf', '#f25549', '#52d01a', '#fec20e'],
      series: [
        {
          type: 'pie',
          radius: '75%',
          center: ['50%', '60%'],
          data: [{
            value: totalAndroidCount,
            name: '正餐Android',
            foodTradeId: TRADEID.DINNER,
            clientType: CLIENT.ANDROID
          }, {
            value: totalWindowsCount,
            name: '正餐Windows',
            foodTradeId: TRADEID.DINNER,
            clientType: CLIENT.WINDOWS
          }, {
            value: totalFastAndroidCount,
            name: '快餐Android',
            foodTradeId: TRADEID.FAST,
            clientType: CLIENT.ANDROID
          }, {
            value: totalFastWindowsCount,
            name: '快餐Windows',
            foodTradeId: TRADEID.FAST,
            clientType: CLIENT.WINDOWS
          }],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  },
  methods: {
    ...mapActions([
      'fetchVersionList',
      'fetchTerminalList',
      'fetchTerminalSummary'
    ]),
    onClickBack () {
      this.showList = false;
    },
    async onShowModal (row, column) {
      const { property } = column;
      if (property === 'count') {
        const { clientType, foodTradeId, softwareVersion } = row;
        await this.fetchTerminalList({ clientType, foodTradeId, versionName: softwareVersion });
        this.$refs.versionModal.isShow = true;
      }
    },
    async onClick (event) {
      const { clientType, foodTradeId } = event.data;
      this.version = event.data;
      await this.fetchVersionList({ clientType, foodTradeId });
      this.showList = true;
    }
  }
};
</script>

<style lang="scss">
.general-main {
  padding: 15px;

  .distribution {
    display: inline-block;

    .el-card {
      .el-card__body {
        display: none;
      }
    }
  }

  .btn-back {
    float: right;
    cursor: pointer;
  }

  .pie-chart {
    width: 800px;
    height: 350px;
  }
}
</style>
