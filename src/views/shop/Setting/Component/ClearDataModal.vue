<template>
  <Popup
    ref="popup"
    type="submit"
    title="数据清除"
    okText="确认"
    :handleOk="onSubmit"
    :handleClose="onClose"
    size="small">
    <el-form slot="content" class="clear-data-modal" :rules="rules" ref="form" :model="form">
      <div class="date-picker">
        <span>将</span>
        <el-form-item prop="dateTime" class="date-time">
          <el-date-picker
            v-model="form.dateTime"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <span>之前的交易数据清除</span>
      </div>
      <label class="label">清除数据的目的</label>
      <p>为了将试运营的数据清除，不使试运营的数据影响报表统计。</p>
      <label class="label">清除数据的内容</label>
      <p>只清理营业数据，不清理设置数据；数据清理后，报表上就找不到相应的数据了</p>
      <div class="warning-tips">
        <label class="label">清除数据的规则</label>
        <p>一天只能清除或恢复一次数据，清除或恢复将将在次日凌晨4点执行</p>
      </div>
    </el-form>
    <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
      <div>
        <i class="el-icon-circle-cross"></i>
        {{ errorMessage }}
      </div>
    </div>
  </Popup>
</template>
<script>
  import fecha from 'fecha';
  import { Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { SYSTEM_KEYS } from 'constant/systemOptions';

  export default {
    name: 'ClearDataModal',
    props: ['submitCallBack'],
    components: {
      Popup
    },
    data () {
      return {
        isShow: false,
        form: {
          dateTime: null
        },
        errorMessage: '',
        rules: {
          dateTime: [
            { required: true, message: '请选择时间', trigger: 'blur, change' }
          ]
        }
      };
    },
    watch: {
      async isShow () {
        this.$refs['popup'].isShow = this.isShow;
        this.$refs.form ? this.$refs.form.resetFields() : null;
      }
    },
    computed: {
      ...mapState({
        errorMsg: state => state.error.errorMsg
      })
    },
    methods: {
      ...mapActions([
        'changeBusinessData',
        'updateParameterList',
        'checkResetSettingEnable'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const { dateTime } = this.form;
        await this.changeBusinessData({ dateTime: fecha.format(dateTime, 'YYYY-MM-DD'), fiModel: 0 });

        const { errorStatus, errorMsg } = this.$store.state.error;
        if (errorStatus) {
          this.errorMessage = errorMsg;
        } else {
          this.isShow = false;
          await this.checkResetSettingEnable({ paramCls: SYSTEM_KEYS.ALL });
          this.submitCallBack();
        }
      },
      onClose () {
        this.isShow = false;
      }
    }
  };
</script>
<style lang="scss">
.clear-data-modal {
  .label {
    font-weight: 700;
  }

  .date-time {
    display: inline-block;
    margin-bottom: 20px !important;
  }

  .warning-tips {
    color: #ff4949;
  }
}
</style>
