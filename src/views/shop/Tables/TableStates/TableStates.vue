<template>
  <el-row class="table-state-container">
    <el-row type="flex" justify="center">
      <div
        class="color-item"
        v-for="color in stateColors"
        :key="color"
        :style=" { backgroundColor: color}"
        @click="onSelectColor(color)">
      </div>
    </el-row>
    <el-row type="flex" justify="center">
      <div
        class="state-panel"
        v-for="(tableColor, index) in tableColorList"
        :class="{ selected: tableColor.mtableSteId === selectedPanelId}"
        @click="selectedPanelId = tableColor.mtableSteId"
        :key="index">
        <div class="state-panel-heading" :style="{ backgroundColor: tableColor.mtableSteColor}"></div>
        <div class="state-panel-body" align="center">{{tableColor.mtableSteName}}</div>
        <div class="state-panel-footer">
          <el-select
            v-if="table_select_enable.includes(tableColor.mtableSteId)"
            :value="parseInt(tableColor.mtableSteStatus)"
            @input="onSelectChange($event, tableColor.mtableSteId) ">
            <el-option label="启用" :value="OK" />
            <el-option label="禁用" :value="FORBIDDEN" />
          </el-select>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="center">
      <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
    </el-row>
    <Toast
      ref='toast'
      content="保存成功!"
      :timeout="2000" />
  </el-row>
</template>

<script>
  import { TABLE_STATE_COLOR, TABLE_STATE_SELECT_ENDABLE } from 'constant/constants';
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { mapActions, mapState } from 'vuex';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { Toast } from 'components';

  export default {
    name: 'TableStates',
    components: {
      Toast
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        stateColors: TABLE_STATE_COLOR,
        table_select_enable: TABLE_STATE_SELECT_ENDABLE,
        isMaintain: !checkMaintainRight(this),
        text: '',
        selectedPanelId: ''
      };
    },
    computed: mapState({
      tableColorList: state => state.tables.tableStates.tableColorList
    }),
    methods: {
      ...mapActions([
        'fetchAllTableColorList',
        'setStateStatus',
        'setStateColor',
        'saveTableColorList'
      ]),
      onSelectChange (mtableSteStatus, mtableSteId) {
        this.setStateStatus({ mtableSteId, mtableSteStatus });
      },
      onSelectColor (color) {
        this.setStateColor({ mtableSteId: this.selectedPanelId, mtableSteColor: color });
      },
      async onSubmit () {
        await this.saveTableColorList({ tableColorlist: this.tableColorList });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$refs.toast.isShow = true;
        }
      }
    },
    created () {
      this.fetchAllTableColorList();
    }
  };
</script>

<style lang="scss">
  .table-state-container {
    font-size: 14px;
    padding: 15px;
    border: 1px solid #ddd;

    .title {
      padding: 15px;
      background-color: #F5F5F5;
    }

    .color-item {
      border-radius: 50%;
      width: 50px;
      height: 50px;
      margin-right: 30px;
      cursor: pointer;
    }

    .state-panel {
      width: 130px;
      margin: 30px 25px;
      border: 1px solid #ccc;
      cursor: pointer;

      &.selected {
        border: 2px solid #0083C3;
      }
    }

    .state-panel-heading {
      border-radius: 3px;
      height: 40px;
      border: 1px solid #ccc;
      margin-bottom: 5px;
    }

    .state-panel-body {
      border: 1px solid #ccc;
      padding: 30px;
      margin-bottom: 5px;
    }

    .state-panel-footer {
      height: 50px;
      border-top: 1px solid #ccc;
      background-color: #f5f5f5;

      .el-select {
        margin: 5px 10px;
      }
    }

    .btn-submit {
      width: 150px;
    }
  }
</style>
