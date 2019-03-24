<template>
  <IEcharts :class="className" :option="pieData" :style="{height:height,width:width}" />
</template>

<script>
import IEcharts from 'vue-echarts-v3/src/lite.js';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/pie';

export default {
  name: 'pieChart',
  components: {
    IEcharts
  },
  props: {
    className: {
      type: String,
      default: 'pie-chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    datas: {
      type: Array,
      default: []
    },
    options: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {
      pieData: {}
    };
  },
  watch: {
    datas () {
      this.initChart();
    }
  },
  methods: {
    initChart () {
      const { title, series } = this.options;
      this.pieData = {
        title: { ...title },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: { show: false },
        grid: { top: 'top' },
        color: ['#00abdf', '#f25549'],
        series: [
          {
            name: '付款比例',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.datas || [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0)'
              }
            },
            ...series
          }
        ]
      };
    }
  }
};
</script>
