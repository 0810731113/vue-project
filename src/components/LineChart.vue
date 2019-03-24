<template>
  <IEcharts :class="className" :option="lineData" :style="{height:height,width:width}" />
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/line';

export default {
  name: 'LineChart',
  components: {
    IEcharts
  },
  props: {
    className: {
      type: String,
      default: 'line-chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    options: {
      type: Object,
      default: {}
    },
    datas: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      lineData: {}
    };
  },
  watch: {
    datas () {
      this.initChart();
    }
  },
  methods: {
    initChart () {
      const { data, lables } = this.datas;
      const { title } = this.options;
      this.lineData = {
        title: { ...title },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {},
        grid: {
          left: '10%',
          right: '10%',
          bottom: '20%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: lables
        }],
        yAxis: [{
          type: 'value'
        }],
        series: [{
          name: '收入曲线',
          type: 'line',
          data,
          areaStyle: { normal: {} },
          markLine: {
            data: [{ type: 'average', name: '平均值' }],
            label: {
              normal: {
                formatter: '{b}:\n {c}'
              }
            }
          }
        }]
      };
    }
  }
};
</script>
