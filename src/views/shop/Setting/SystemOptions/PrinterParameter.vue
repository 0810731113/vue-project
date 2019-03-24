<template>
  <div class="printer-parameter-container">
    <el-form class="mw-form" :model="parameterList" ref="form" label-width="240px">
      <el-form-item class="label-title" label="打印参数设置:" />
      <el-form-item label="打印机故障报警及通知站点">
        <el-select
          :value="parameterList[WARNING_REPORT_SITE].paramValue"
          @input="(value) => onChangeItem(value, WARNING_REPORT_SITE, 'paramValue')"
          placeholder="请选择" class="width-50-percent">
          <el-option
            v-for="item in hostListForSystemOptions"
            :key="item.hostId"
            :label="item.hostId"
            :value="item.hostId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印任务过时几分钟后，任务逾期">
        <el-input-number
          :controls="false"
          :min="0"
          :max="999"
          class="width-50-percent"
          :value="parameterList[PRINTER_TIME_OUT].paramValue"
          @input="(value) => onChangeItem(value, PRINTER_TIME_OUT, 'paramValue')">
        </el-input-number>
      </el-form-item>
      <el-form-item label="备用打印机切换">
        <span>离线</span>
        <el-input-number
          style="margin: 0 10px"
          size="small"
          :controls="false"
          :min="0"
          :value="parameterList[CHANGE_PRINTER_BACK_UP].paramValue"
          @input="(value) => onChangeItem(value, CHANGE_PRINTER_BACK_UP, 'paramValue')">
        </el-input-number>
        <span>分钟后切换</span>
      </el-form-item>
      <el-form-item label="打印时是否发出蜂鸣声">
        <el-radio-group
          :value="parameterList[BEE_WHEN_PRINT].paramValue"
          @input="(value) => onChangeItem(value, BEE_WHEN_PRINT, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="消费单、结账单表尾广告词1">
        <el-input
          class="width-50-percent"
          :maxlength='INPUT_MAX_LENGTH'
          :value="parameterList[AD_MESSAGE_1].paramValue"
          @input="(value) => onChangeItem(value, AD_MESSAGE_1, 'paramValue')">
        </el-input>
      </el-form-item>
      <el-form-item label="预点单打印方式" v-if="false">
        <el-radio-group
          :value="parameterList[WAY_OF_BILL_PRINT].paramValue"
          @input="(value) => onChangeItem(value, WAY_OF_BILL_PRINT, 'paramValue')">
          <el-radio label="0">一菜一切</el-radio>
          <el-radio label="1">一单一切</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预结单是否打印二维码">
        <el-radio-group
          :value="parameterList[PRINT_QR_CODE].paramValue"
          @input="(value) => onChangeItem(value, PRINT_QR_CODE, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预结单二维码下方文案" v-show="parameterList[PRINT_QR_CODE].paramValue==0">
        <el-input
          class="width-50-percent"
          :maxlength="qrCodeTextMaxLength"
          :value="parameterList[QR_CODE_TEXT].paramValue"
          @input="(value) => onChangeItem(value, QR_CODE_TEXT, 'paramValue')"
        />
      </el-form-item>
      <el-form-item label="外卖单打印张数">
        <el-select
          :value="parameterList[TAKEOUT_PRINT].paramValue"
          @input="(value) => onChangeItem(value, TAKEOUT_PRINT, 'paramValue')"
          placeholder="请选择"
          class="width-50-percent">
          <el-option
            v-for="item in TAKEOUT_PRINT_NUMBER"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="点菜单是否打印菜品金额">
        <el-radio-group
          :value="parameterList[PRINT_MENU_CASH].paramValue"
          @input="(value) => onChangeItem(value, PRINT_MENU_CASH, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="批量退菜打印方式" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：2.5及其以上<br/>Windows：未对接"></Tips>
        <el-radio-group
          :value="parameterList[BATCH_RETREAT_PRINT].paramValue"
          @input="(value) => onChangeItem(value, BATCH_RETREAT_PRINT, 'paramValue')">
          <el-radio label="0">合并打印</el-radio>
          <el-radio label="1">分开打印</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预结单、结账单打印语言">
        <el-radio-group
          :value="parameterList[LANGUAGE_PRINT].paramValue"
          @input="(value) => onChangeItem(value, LANGUAGE_PRINT, 'paramValue')">
          <el-radio label="0">第一语言</el-radio>
          <el-radio label="1">第二语言</el-radio>
          <el-radio label="2">第一语言与第二语言</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结账单打印会员储值余额" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上"></Tips>
        <el-radio-group
          :value="parameterList[PRINT_MEMBER_BALANCE].paramValue"
          @input="(value) => onChangeItem(value, PRINT_MEMBER_BALANCE, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="传菜单打印会员信息" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上"></Tips>
        <el-radio-group
          :value="parameterList[MEMBERS_PRINT].paramValue"
          @input="(value) => onChangeItem(value, MEMBERS_PRINT, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="站点退菜下单后是否打印「退菜单」">
        <el-radio-group
          :value="parameterList[PRINT_AFTER_RETREAT].paramValue"
          @input="(value) => onChangeItem(value, PRINT_AFTER_RETREAT, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="打印「预结单、结账单」是否相同菜品规格数量合并" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上"></Tips>
        <el-radio-group
          :value="parameterList[COMBINE_WHEN_PRINT_BILL].paramValue"
          @input="(value) => onChangeItem(value, COMBINE_WHEN_PRINT_BILL, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="客户调查表是否打印">
        <el-radio-group
          :value="parameterList[PRINT_CUSTOMER_SURVEY].paramValue"
          @input="(value) => onChangeItem(value, PRINT_CUSTOMER_SURVEY, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="打烊后自动打印报表">
        <el-radio-group
          :value="parameterList[PRINT_REPORT_AFTER_CLOSING].paramValue"
          @input="(value) => onChangeItem(value, PRINT_REPORT_AFTER_CLOSING, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="美小二预结单打印">
        <el-radio-group
          :value="parameterList[MEI_XIAO_ER_BILL_PRINT].paramValue"
          @input="(value) => onChangeItem(value, MEI_XIAO_ER_BILL_PRINT, 'paramValue')">
          <el-radio label="0">区域打印机</el-radio>
          <el-radio label="1">收银站点</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="秒付结单打印">
        <el-radio-group
          :value="parameterList[MIAO_FU_BILL_PRINT].paramValue"
          @input="(value) => onChangeItem(value, MIAO_FU_BILL_PRINT, 'paramValue')">
          <el-radio label="0">区域打印机</el-radio>
          <el-radio label="1">收银站点</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结账单自动切纸">
        <el-radio-group
          :value="parameterList[PAY_BILL_CUT_AUTOMATICALLY].paramValue"
          @input="(value) => onChangeItem(value, PAY_BILL_CUT_AUTOMATICALLY, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="档口统计报表是否统计套餐" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：前端未对接<br/>Windows：1863及以上"></Tips>
        <el-radio-group
          :value="parameterList[REPORT_INCLUDE_SET].paramValue"
          @input="(value) => onChangeItem(value, REPORT_INCLUDE_SET, 'paramValue')">
          <el-radio label="1">否</el-radio>
          <el-radio label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="外卖平台自动接单后是否打印" class="el-form-item-tips">
        <Tips content="解释：开启后自动结单并打印第三方平台的外卖单<br/>版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上"></Tips>
        <el-radio-group
          :value="parameterList[PLATFORM_PRINT_AUTOMATICALLY].paramValue"
          @input="(value) => onChangeItem(value, PLATFORM_PRINT_AUTOMATICALLY, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结账单是否打印实收金额">
        <!--<Tips content="解释：开启后自动结单并打印第三方平台的外卖单<br/>版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上"></Tips>-->
        <el-radio-group
          :value="parameterList[IF_PRINT_NETRECIPTS].paramValue"
          @input="(value) => onChangeItem(value, IF_PRINT_NETRECIPTS, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="结账小票是否打印退菜信息">
        <el-radio-group
          :value="parameterList[BILL_WITH_RETREAT_INFO].paramValue"
          @input="(value) => onChangeItem(value, BILL_WITH_RETREAT_INFO, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="快餐模式是否打印传菜单" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：V2.8.2及其以上<br/>Windows：暂不支持"></Tips>
        <el-radio-group
          :value="parameterList[FAST_FOOD_PRINT_PASS_FOOD_BILL].paramValue"
          @input="(value) => onChangeItem(value, FAST_FOOD_PRINT_PASS_FOOD_BILL, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否打印留存单" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：V3.0及其以上<br/>Windows：暂不支持"></Tips>
        <el-radio-group
          :value="parameterList[IF_PRINT_SAVE].paramValue"
          @input="(value) => onChangeItem(value, IF_PRINT_SAVE, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否打印外卖结账单" class="el-form-item-tips">
        <Tips content="版本支持：<br/>Android：V3.0及其以上<br/>Windows：暂不支持"></Tips>
        <el-radio-group
          :value="parameterList[IF_PRINT_TAKEOUT].paramValue"
          @input="(value) => onChangeItem(value, IF_PRINT_TAKEOUT, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <div style="text-align: center">
        <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
    <toast
      ref='toast'
      :content="toastContent"
      :timeout="2000"
      :type="toastType"/>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Toast, Tips } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import {
    WARNING_REPORT_SITE,
    PRINT_AFTER_RETREAT,
    PRINTER_TIME_OUT,
    BEE_WHEN_PRINT,
    AD_MESSAGE_1,
    QR_CODE_TEXT,
    TAKEOUT_PRINT,
    PRINT_MENU_CASH,
    COMBINE_WHEN_PRINT_BILL,
    PRINT_CUSTOMER_SURVEY,
    CHANGE_PRINTER_BACK_UP,
    PRINT_REPORT_AFTER_CLOSING,
    MEI_XIAO_ER_BILL_PRINT,
    MIAO_FU_BILL_PRINT,
    BATCH_RETREAT_PRINT,
    LANGUAGE_PRINT,
    MEMBERS_PRINT,
    PAY_BILL_CUT_AUTOMATICALLY,
    WAY_OF_BILL_PRINT,
    REPORT_INCLUDE_SET,
    SYSTEM_KEYS,
    TAKEOUT_PRINT_NUMBER,
    PRINT_QR_CODE,
    PRINT_MEMBER_BALANCE,
    PLATFORM_PRINT_AUTOMATICALLY,
    BILL_WITH_RETREAT_INFO,
    FAST_FOOD_PRINT_PASS_FOOD_BILL,
    IF_PRINT_SAVE,
    IF_PRINT_TAKEOUT,
    IF_PRINT_NETRECIPTS,  //是否打印实收
  } from 'constant/systemOptions';

  export default {
    name: 'PrinterParameter',
    components: { Toast, Tips },
    data () {
      return {
        WARNING_REPORT_SITE,
        PRINT_AFTER_RETREAT,
        PRINTER_TIME_OUT,
        BEE_WHEN_PRINT,
        BATCH_RETREAT_PRINT,
        LANGUAGE_PRINT,
        MEMBERS_PRINT,
        AD_MESSAGE_1,
        PRINT_QR_CODE,
        QR_CODE_TEXT,
        TAKEOUT_PRINT,
        PRINT_MENU_CASH,
        COMBINE_WHEN_PRINT_BILL,
        PRINT_CUSTOMER_SURVEY,
        CHANGE_PRINTER_BACK_UP,
        PRINT_REPORT_AFTER_CLOSING,
        MEI_XIAO_ER_BILL_PRINT,
        MIAO_FU_BILL_PRINT,
        PAY_BILL_CUT_AUTOMATICALLY,
        WAY_OF_BILL_PRINT,
        REPORT_INCLUDE_SET,
        INPUT_MAX_LENGTH,
        TAKEOUT_PRINT_NUMBER,
        PRINT_MEMBER_BALANCE,
        PLATFORM_PRINT_AUTOMATICALLY,
        BILL_WITH_RETREAT_INFO,
        FAST_FOOD_PRINT_PASS_FOOD_BILL,
        IF_PRINT_SAVE,
        IF_PRINT_TAKEOUT,
        IF_PRINT_NETRECIPTS,
        qrCodeText: '',
        qrCodeTextMaxLength: 20,
        toastType: '',
        toastContent: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        parameterList: state => state.setting.systemOptions.parameterList,
        hostListForSystemOptions: state => state.setting.systemOptions.hostListForSystemOptions,
        errorStatus: state => state.error.errorStatus
      })
    },
    methods: {
      ...mapActions([
        'updateParameterList',
        'fetchParameterList',
        'updateParameter',
        'fetchHostListForSystemOptions'
      ]),
      async onChangeItem (value, type, parameterName) {
        if (QR_CODE_TEXT === type) {
          if (this.getStrLength(value) < 20) {
            this.qrCodeTextMaxLength = 20;
          } else {
            console.log(this.getLastCharIndex(value));
            this.qrCodeTextMaxLength = this.getLastCharIndex(value);
            value = value.substr(0, this.getLastCharIndex(value));
          }
        }

        await this.updateParameter({ value, type, parameterName });
      },
      getLastCharIndex (str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
            if (++length > 20) {
              return i - 1;
            }
          } else {
            length += 2;
            if (length > 20) {
              return i - 1;
            }
          }
        }
        return str.length;
      },
      getStrLength (str) {
        let length = 0;
        for (let i = 0; i < str.length; i++) {
          let c = str.charCodeAt(i);
          if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
            length++;
          } else {
            length += 2;
          }
        }
        return length;
      },
      onShowModal (ref) {
        this.$refs[ref].isShow = true;
      },
      async onSubmit () {
        await this.updateParameterList();
        this.toastType = this.errorStatus ? 'warning' : 'success';
        this.toastContent = this.errorStatus ? '保存失败' : '保存成功';
        this.$refs.toast.isShow = true;
      }
    },
    async created () {
      await this.fetchParameterList({ paramCls: SYSTEM_KEYS.PRINT });
      await this.fetchHostListForSystemOptions();
      const { paramValue } = this.parameterList[WARNING_REPORT_SITE];
      const item = this.hostListForSystemOptions.find(item => item.hostId === paramValue);
      if (!item) { // 过滤打印机及通知站点
        const value = this.hostListForSystemOptions[0] || {};
        this.onChangeItem(value.hostId, WARNING_REPORT_SITE, 'paramValue');
      }
    }
  };

</script>
<style lang="scss">
  .printer-parameter-container {
    .mw-form {
      width: 60%;
      margin-bottom: 30px;

      .el-input-number__decrease,
      .el-input-number__increase {
        top: 5px;
      }
    }
  }
</style>
