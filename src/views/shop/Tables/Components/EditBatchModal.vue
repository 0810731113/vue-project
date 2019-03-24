<template>
  <el-dialog
    size='tiny'
    :closeOnClickModal="false"
    class="base-modal"
    :visible.sync="isShow"
    title="批量设置">
      <div class="text">
        {{ this.selectedNames.toString() }}
      </div>
      <span>将</span>
      <el-select v-model="type" style="width: 40%">
        <el-option
          v-for="item in TABLE_SETTING"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span>设置为</span>
      <el-select v-model="value" style="width: 40%">
        <el-option
          v-for="item in valueList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <span slot="footer" class="modal-footer">
        <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { TABLE_SETTING, TABLE_TYPE } from 'constant/constants';

  export default {
    name: 'EditBatchModal',
    props: {
      selectedNames: {
        type: Array,
        default: []
      },
      selectedIds: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        TABLE_SETTING,
        TABLE_TYPE,
        value: '',
        isShow: false,
        type: TABLE_TYPE
      };
    },
    watch: {
      async isShow () {
        if (this.isShow) {
          await this.init();
        }
      }
    },
    computed: {
      ...mapState({
        tableTypelist: state => state.tables.management.tableTypelist,
        tableAreaList: state => state.tables.management.tableAreaList
      }),
      valueList () {
        let result = [];
        if (this.type === TABLE_TYPE) {
          (this.tableTypelist || []).map(item => {
            const { mtableClsId, mtableClsName } = item;
            result.push({ name: mtableClsName, id: mtableClsId });
          });
        } else {
          (this.tableAreaList || []).map(item => {
            const { mareaId, mareaName } = item;
            result.push({ name: mareaName, id: mareaId });
          });
        }
        if (result.length) {
          this.value = result[0].id;
        }

        return result;
      }
    },
    methods: {
      ...mapActions([
        'getTableTypelist',
        'getTableArealist',
        'updateBatchTableManagement'
      ]),
      async init () {
        await this.getTableTypelist();
        await this.getTableArealist();
      },
      async onSubmit () {
        let form = {
          updateType: this.type,
          updateValue: this.value,
          updStatusList: this.selectedIds
        };
        await this.updateBatchTableManagement(form);

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.isShow = false;
        }
      }
    }
  };
</script>
<style lang="scss">
  .setting-container {
    text-align: center;
  }

  .text {
    margin-bottom: 20px;
    font-size: 14px;
    font-weight: Arial;
    word-break: break-all;
  }
</style>
