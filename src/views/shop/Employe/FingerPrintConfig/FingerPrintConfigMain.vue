<template>
  <div class="finger-print-config-main">
    <el-tabs v-model="activeName" type="card" @tab-click="onClickTab">
      <el-tab-pane name="fingerPrintConfig" label="指纹操作配置">
        <finger-print-config
          :datas="datas"
          :saveFingerConfig="saveFingerConfig"
          :errorStatus="errorStatus">
        </finger-print-config>
      </el-tab-pane>
      <el-tab-pane name="seniorManagement" label="高层消费(指纹)名单">
        <senior-management :superUserType="superUserType" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { SeniorManagement } from 'views/common';
import { FingerPrintConfig } from '../components/index';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'fingerPrintConfigMain',
  components: {
    SeniorManagement,
    FingerPrintConfig
  },
  data () {
    return {
      activeName: 'fingerPrintConfig',
      superUserType: '1'
    };
  },
  async created () {
    await this.fetchFingerConfigList();
  },
  computed: mapState({
    errorStatus: state => state.error.errorStatus,
    datas () {
      const { datas } = this.$store.state.employe.fingerPrintConfig;
      return cloneDeep(datas);
    }
  }),
  methods: {
    ...mapActions([
      'fetchFingerConfigList',
      'saveFingerConfig'
    ]),
    onClickTab (tab) {
      this.selectedIndex = +tab.index;
    }
  }
};
</script>

<style lang="scss">
  .finger-print-config-main {
    padding: 15px;
  }
</style>
