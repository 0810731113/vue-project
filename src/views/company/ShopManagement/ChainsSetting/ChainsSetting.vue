<template>
  <div class="chain-setting-main">
    <div class="setting-tips">
      说明：所勾选上的基础数据由总部统一维护，门店就不能维护了
    </div>
    <el-form>
      <el-form-item label="基础数据:" class="form-title" />
      <el-form-item>
        <el-checkbox-group class="chain-items" v-model="checkList">
          <el-checkbox v-for="item in list" :label="item.tableId" :key="item.tableId">
            {{ item.tableName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <Toast ref="toast" :type="type" :content="content" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Toast } from 'components';

export default {
  name: 'chainsSetting',
  components: {
    Toast
  },
  data () {
    return {
      type: '',
      content: '',
      checkList: []
    };
  },
  async created () {
    await this.fetchChainsSettings();
    const { notMainTain } = this;
    this.checkList = notMainTain ? notMainTain.split(',') : [];
  },
  computed: mapState({
    list: state => state.shopManagement.chainsSetting.list,
    notMainTain: state => state.shopManagement.chainsSetting.notMainTain,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveChainsSettings',
      'fetchChainsSettings'
    ]),
    async onSubmit () {
      if (this.checkList.length) {
        await this.saveChainsSettings({
          notMaintain: this.checkList.toString(),
          noShowError: true
        });
        this.content = this.errorStatus ? '保存失败！' : '保存成功！';
        this.type = this.errorStatus ? 'error' : 'success';
      } else {
        this.content = '请选择提交基础数据！';
        this.type = 'warning';
      }
      this.$refs.toast.isShow = true;
    }
  }
};
</script>

<style lang="scss">
.chain-setting-main {
  padding: 15px 15%;

  .setting-tips {
    color: #20A0FF;
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 15px;
  }

  .form-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 0;
  }

  .chain-items {
    :first-child {
      margin-left: 15px;
    }

    .el-checkbox {
      width: 240px;
    }
  }

  .form-btn {
    margin-left: 35%;
  }
}
</style>
