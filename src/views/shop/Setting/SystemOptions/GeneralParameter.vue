<template>
  <div class="general-parameter-container">
    <el-form class="mw-form" :model="parameterList" ref="form" label-width="200px">
      <el-form-item label="营业时间">
        <el-input :disabled="true" :value="parameterList[BUSINESS_DATE].paramValue" class="width-50-percent"></el-input>
      </el-form-item>
      <el-form-item label="试营业数据">
        <el-button class="btn-base" @click="onShowModal('ClearDataModal')" :disabled="!resetSettingEnable">清除</el-button>
        <el-button class="btn-base" @click="onShowModal('ResetDataModal')" :disabled="!resetSettingEnable">恢复</el-button>
      </el-form-item>
      <el-form-item label="是否自动打烊">
        <Tips content="版本支持：<br/>美易点客户端暂未接入"></Tips>
        <el-radio-group
          :value="parameterList[IF_AUTO_CLOSE].paramValue"
          @input="(value) => onChangeItem(value, IF_AUTO_CLOSE, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="自动打烊时间" v-show="parameterList[IF_AUTO_CLOSE].paramValue==='1'">
        <el-time-select
          class="width-50-percent"
          placeholder="结束时间"
          :value="parameterList[CLOSE_TIME].paramValue"
          @input="(value) => onChangeItem(value, CLOSE_TIME)"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59'
          }" />
      </el-form-item>
      <el-form-item label="客户端数据保留">
        <el-radio-group
          :value="parameterList[CLIENT_DATA].paramValue"
          @input="(value) => onChangeItem(value, CLIENT_DATA)">
          <el-radio :label="PREVIOUS_DAY">前一天</el-radio>
          <el-radio :label="WEEK">7天</el-radio>
          <el-radio :label="MONTH">30天</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="label-title" label="接口选项服务:" />
      <el-form-item label="外卖厨房打印机">
        <el-select
          :value="parameterList[TAKE_OUT_PRINTER].paramValue"
          @input="(value) => onChangeItem(value, TAKE_OUT_PRINTER)"
          placeholder="请选择">
          <el-option
            v-for="item in printerListForSystemOptions"
            :key="item.printerID"
            :label="item.printerName"
            :value="item.printerID">
          </el-option>
          <el-option label="(空)" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="外卖店（客户联）打印机">
        <el-select
          :value="parameterList[TAKE_OUT_CUSTOMER_PRINTER].paramValue"
          @input="(value) => onChangeItem(value, TAKE_OUT_CUSTOMER_PRINTER)"
          placeholder="请选择">
          <el-option
            v-for="item in printerListForSystemOptions"
            :key="item.printerID"
            :label="item.printerName"
            :value="item.printerID">
          </el-option>
          <el-option label="(空)" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="外卖打印机打印外卖结账单">
        <el-radio-group
          :value="parameterList[TAKE_OUT_PRINTER_PRINT_BILL].paramValue"
          @input="(value) => onChangeItem(value, TAKE_OUT_PRINTER_PRINT_BILL, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="销售单号规则">
        <el-radio-group
          :value="parameterList[SALE_RULES].paramValue"
          @input="(value) => onChangeItem(value, SALE_RULES)">
          <el-radio label="0">日期+四位数顺序递归</el-radio>
          <el-radio label="1">日期+小时+分钟</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账单优化" v-if="billServiceVisible">
        <el-radio-group
          :value="parameterList[BILL_OPTIMIZE_SERVICE].paramValue"
          @input="(value) => onChangeItem(value, BILL_OPTIMIZE_SERVICE)">
          <el-radio label="1">启用</el-radio>
          <el-radio label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="美味自助云" v-if="parameterList[SELF_CLOUD].paramId">
        <el-radio-group
          :value="parameterList[SELF_CLOUD].paramValue"
          @input="(value) => onChangeItem(value, SELF_CLOUD)">
          <el-radio label="1">开启</el-radio>
          <el-radio label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="KDS服务">
        <Tips content="该配置仅供KDS设备使用"></Tips>
        <el-radio-group
          :value="parameterList[KDS_SERVICE].paramValue"
          @input="(value) => onChangeItem(value, KDS_SERVICE, 'paramValue')">
          <el-radio label="0">关闭</el-radio>
          <el-radio label="1">开启</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="外卖菜品是否进KDS">
        <Tips content="当前配置只对KDS设备生效"></Tips>
        <el-radio-group
          :value="parameterList[TAKEOUT_KDS_SWITCH].paramValue"
          @input="(value) => onChangeItem(value, TAKEOUT_KDS_SWITCH, 'paramValue')">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <div style="text-align: center">
        <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
    <ClearDataModal ref="ClearDataModal" :submitCallBack="() => showToast('success', '设置成功')" />
    <popup
      title="恢复数据"
      tips="是否将清除的试运营数据恢复？ 数据将在次日凌晨4点恢复?"
      :handleOk="onResetClick"
      ref="ResetDataModal" />
    <toast
      ref='toast'
      :content="toastContent"
      :timeout="2000"
      :type="toastType" />
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import {
    ON,
    OFF,
    PREVIOUS_DAY,
    WEEK,
    MONTH,
    INTERVAL_MINUTE,
    INTERVAL_DAY,
    INPUT_MAX_LENGTH
  } from 'constant/constants';
  import {
    CLIENT_DATA,
    BUSINESS_DATE,
    RECEIPT_UPLOAD,
    CLOSE_TIME,
    IF_AUTO_CLOSE,
    SALE_RULES,
    SELF_CLOUD,
    TAKE_OUT_PRINTER,
    SYSTEM_KEYS,
    BILL_OPTIMIZE_SERVICE,
    TAKE_OUT_PRINTER_PRINT_BILL,
    KDS_SERVICE,
    TAKE_OUT_CUSTOMER_PRINTER,
    TAKEOUT_KDS_SWITCH,
  } from 'constant/systemOptions';
  import ClearDataModal from '../Component/ClearDataModal';
  import { Popup, Toast, Tips } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'GeneralParameter',
    components: {
      ClearDataModal,
      Popup,
      Toast,
      Tips
    },
    data () {
      return {
        ON,
        OFF,
        PREVIOUS_DAY,
        WEEK,
        MONTH,
        INTERVAL_MINUTE,
        INTERVAL_DAY,
        BUSINESS_DATE,
        RECEIPT_UPLOAD,
        CLOSE_TIME,
        IF_AUTO_CLOSE,
        CLIENT_DATA,
        SALE_RULES,
        SELF_CLOUD,
        TAKE_OUT_PRINTER,
        INPUT_MAX_LENGTH,
        BILL_OPTIMIZE_SERVICE,
        TAKE_OUT_PRINTER_PRINT_BILL,
        KDS_SERVICE,
        TAKE_OUT_CUSTOMER_PRINTER,
        TAKEOUT_KDS_SWITCH,
        isMaintain: !checkMaintainRight(this),
        toastType: '',
        toastContent: ''
      };
    },
    computed: {
      ...mapState({
        printerListForSystemOptions: state => state.setting.systemOptions.printerListForSystemOptions,
        parameterList: state => state.setting.systemOptions.parameterList,
        resetSettingEnable: state => state.setting.systemOptions.resetSettingEnable,
        billServiceVisible: state => state.setting.systemOptions.billServiceVisible
      })
    },
    methods: {
      ...mapActions([
        'updateParameter',
        'changeBusinessData',
        'updateParameterList',
        'fetchParameterList',
        'checkResetSettingEnable',
        'checkBillOptimizeServiceVisible',
        'fetchPrinterListForSystemOptions'
      ]),
      onChangeItem (value, type, parameterName = 'paramValue') {


        this.updateParameter({ value, type, parameterName });
      },
      onShowModal (ref) {
        this.$refs[ref].isShow = true;
      },
      async onResetClick () {
        await this.changeBusinessData({ fiModel: 1 });

        const { errorStatus, errorMsg } = this.$store.state.error;
        if (errorStatus) {
          this.showToast('warning', errorMsg);
        } else {
          this.isShow = false;
          this.showToast('success', '设置成功');
          await this.checkResetSettingEnable({ paramCls: SYSTEM_KEYS.ALL });
        }
      },
      async onSubmit () {
        await this.updateParameterList();
        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.showToast('success', '保存成功');
        }
      },
      showToast (type, content) {
        this.toastType = type;
        this.toastContent = content;
        this.$refs.toast.isShow = true;
      }
    },
    async created () {
      await this.fetchPrinterListForSystemOptions();
      await this.checkResetSettingEnable({ paramCls: SYSTEM_KEYS.ALL });
      await this.checkBillOptimizeServiceVisible({ paramCls: SYSTEM_KEYS.ALL });
      await this.fetchParameterList({ paramCls: SYSTEM_KEYS.ALL });
//      const { paramValue } = this.parameterList[TAKE_OUT_PRINTER];
//      const item = this.printerListForSystemOptions.find(item => item.printerName === paramValue);
//      if (!item) { // 过滤外卖厨房打印机
//        const value = this.printerListForSystemOptions[0] || {};
//        this.onChangeItem(value.printerName, TAKE_OUT_PRINTER);
//      }
    }
  };

</script>
<style lang="scss" scoped>
  .general-parameter-container {
    .mw-form {
      margin-bottom: 30px;
    }

    .el-select-dropdown .el-popper {
      max-width: 200px !important;
    }
  }
</style>
