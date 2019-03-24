<template>
  <div class="order-parameter-container">
    <el-form class="mw-form" :model="parameterList" ref="form" label-width="270px">
      <el-form-item class="label-title" label="金额计算选项:" />
      <el-form-item label="「数量」圆整，小数位数">
        <el-select
          :value="parameterList[COUNT_PRECISION].paramValue"
          @input="(value) => onChangeItem(value, COUNT_PRECISION, 'paramValue')"
          placeholder="请选择" class="width-50-percent">
          <el-option
            v-for="item in DIGITAL_PRECISION"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="「单价」圆整，位数到">
        <el-radio-group
          :value="parameterList[UNIT_PRICE_PRECISION].paramValue"
          @input="(value) => onChangeItem(value, UNIT_PRICE_PRECISION, 'paramValue')">
          <el-radio label="0">元</el-radio>
          <el-radio label="1">角</el-radio>
          <el-radio label="2">分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="「金额小计」圆整，位数到">
        <el-radio-group
          :value="parameterList[SUB_TOTAL_PRICE_PRECISION].paramValue"
          @input="(value) => onChangeItem(value, SUB_TOTAL_PRICE_PRECISION, 'paramValue')">
          <el-radio label="0">元</el-radio>
          <el-radio label="1">角</el-radio>
          <el-radio label="2">分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="「总额」圆整位数计算到">
        <el-radio-group
          :value="parameterList[TOTAL_PRICE_PRECISION].paramValue"
          @input="(value) => onChangeItem(value, TOTAL_PRICE_PRECISION, 'paramValue')">
          <el-radio label="0">元</el-radio>
          <el-radio label="1">角</el-radio>
          <el-radio label="2">分</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="小数位处理方式">
        <el-radio-group
          :value="parameterList[BILL_ROUND].paramValue"
          @input="(value) => onChangeItem(value, BILL_ROUND, 'paramValue')">
          <el-radio label="1">四舍五入</el-radio>
          <el-radio label="2">舍去</el-radio>
          <el-radio label="3">进位</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="label-title" label="点菜下单:" />
      <el-form-item label="点菜系统-限制沽清菜品不能下单">
        <el-radio-group
          :value="parameterList[SOLD_OUT_ORDER].paramValue"
          @input="(value) => onChangeItem(value, SOLD_OUT_ORDER, 'paramValue')">
          <el-radio label="0">不能</el-radio>
          <el-radio label="1">能</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开台后是否打印[开台单]">
        <el-radio-group
          :value="parameterList[PRINT_AFTER_OPEN].paramValue"
          @input="(value) => onChangeItem(value, PRINT_AFTER_OPEN, 'paramValue')">
          <el-radio label="0">不能</el-radio>
          <el-radio label="1">能</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="点菜下单后是否打印[点菜单]">
        <el-radio-group
          :value="parameterList[PRINT_AFTER_ORDER].paramValue"
          @input="(value) => onChangeItem(value, PRINT_AFTER_ORDER, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="点菜系统-点菜下单完毕后做">
        <el-radio-group
          :value="parameterList[ACTION_AFTER_ORDER].paramValue"
          @input="(value) => onChangeItem(value, ACTION_AFTER_ORDER, 'paramValue')">
          <el-radio label="1">登出回登入界面</el-radio>
          <el-radio label="2">回桌况管理</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="预点单自动下单厨房">
        <el-radio-group
          :value="parameterList[ORDER_IN_ADVANCE].paramValue"
          @input="(value) => onChangeItem(value, ORDER_IN_ADVANCE, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否相同菜品规格数量合并">
        <el-radio-group
          :value="parameterList[COMBINE_SIMILARITY].paramValue"
          @input="(value) => onChangeItem(value, COMBINE_SIMILARITY, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否支持外卖预约">
        <el-radio-group
          :value="parameterList[SUPPORT_RESERVE].paramValue"
          @input="(value) => onChangeItem(value, SUPPORT_RESERVE, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="外卖配送前多少分钟下单厨房" v-if="+parameterList[SUPPORT_RESERVE].paramValue === 1">
        <el-input-number
          :controls="false"
          :min="0"
          :max="999"
          class="width-50-percent"
          :value="parameterList[MINUTES_BEFORE_TAKEAWAY].paramValue"
          @input="(value) => onChangeItem(value, MINUTES_BEFORE_TAKEAWAY, 'paramValue')">
        </el-input-number>&nbsp;&nbsp;分钟
      </el-form-item>
      <el-form-item label="称重菜下单后是否允许更改菜品数量">
        <el-radio-group
          :value="parameterList[WEIGHT_DISH_CHANGE_AMOUNT].paramValue"
          @input="(value) => onChangeItem(value, WEIGHT_DISH_CHANGE_AMOUNT, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="外卖未映射菜品是否自动映射到系统菜品" class="el-form-item-tips">
          <Tips content="版本支持：<br/>Android：2.7.7及以上<br/>Windows：暂不支持"></Tips>
        <el-radio-group
          :value="parameterList[DISH_MAPPING_AUTOMATICAL].paramValue"
          @input="(value) => onChangeItem(value, DISH_MAPPING_AUTOMATICAL, 'paramValue')">
          <el-radio label="0">否</el-radio>
          <el-radio label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提成菜模式">
        <el-select
          :value="parameterList[EXTRACT_DISH_MODE].paramValue"
          @input="(value) => onChangeItem(value, EXTRACT_DISH_MODE, 'paramValue')"
          placeholder="请选择" class="width-50-percent">
          <el-option
            v-for="item in EXTRACT_DISH_MODE_SELECT"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <div style="text-align: center">
        <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
    <toast
      ref='toast'
      :content="toastContent"
      :timeout="2000"
      :type="toastType" />
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Toast, Tips } from 'components';
  import { DIGITAL_PRECISION, EXTRACT_DISH_MODE_SELECT } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { REGEX_NUMBER } from 'constant/regex';
  import {
    BILL_PAYMENT,
    TOTAL_PRICE_PRECISION,
    BILL_ROUND,
    COUNT_PRECISION,
    UNIT_PRICE_PRECISION,
    SUB_TOTAL_PRICE_PRECISION,
    SERVICE_CHARGE,
    ACTION_AFTER_ORDER,
    SOLD_OUT_ORDER,
    PRINT_AFTER_OPEN,
    PRINT_AFTER_ORDER,
    COMBINE_SIMILARITY,
    ORDER_IN_ADVANCE,
    SYSTEM_KEYS,
    SUPPORT_RESERVE,
    MINUTES_BEFORE_TAKEAWAY,
    WEIGHT_DISH_CHANGE_AMOUNT,
    DISH_MAPPING_AUTOMATICAL,
    EXTRACT_DISH_MODE
  } from 'constant/systemOptions';

  export default {
    name: 'OrderParameter',
    components: { Toast, Tips },
    data () {
      return {
        DIGITAL_PRECISION,
        EXTRACT_DISH_MODE_SELECT,
        BILL_PAYMENT,
        TOTAL_PRICE_PRECISION,
        BILL_ROUND,
        COUNT_PRECISION,
        UNIT_PRICE_PRECISION,
        SUB_TOTAL_PRICE_PRECISION,
        SERVICE_CHARGE,
        ACTION_AFTER_ORDER,
        SOLD_OUT_ORDER,
        PRINT_AFTER_OPEN,
        PRINT_AFTER_ORDER,
        COMBINE_SIMILARITY,
        ORDER_IN_ADVANCE,
        SUPPORT_RESERVE,
        MINUTES_BEFORE_TAKEAWAY,
        WEIGHT_DISH_CHANGE_AMOUNT,
        DISH_MAPPING_AUTOMATICAL,
        EXTRACT_DISH_MODE,
        toastType: '',
        toastContent: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        parameterList: state => state.setting.systemOptions.parameterList,
        errorStatus: state => state.error.errorStatus
      })
    },
    methods: {
      ...mapActions([
        'updateParameterList',
        'fetchParameterList',
        'updateParameter'
      ]),
      onChangeItem (value, type, parameterName) {
        this.updateParameter({ value, type, parameterName });
      },
      onShowModal (ref) {
        this.$refs[ref].isShow = true;
      },
      async onSubmit () {
        // 不支持外卖预约时，外卖配送时间设置为0
        if (+this.parameterList[SUPPORT_RESERVE].paramValue === 0) {
          await this.onChangeItem(0, MINUTES_BEFORE_TAKEAWAY, 'paramValue');
        }

        if (!REGEX_NUMBER.test(this.parameterList[MINUTES_BEFORE_TAKEAWAY].paramValue)) {
          this.toastType = 'warning';
          this.toastContent = '外卖配送时间只能为正整数';
          this.$refs.toast.isShow = true;
          return;
        }

        await this.updateParameterList();
        this.toastType = this.errorStatus ? 'warning' : 'success';
        this.toastContent = this.errorStatus ? '保存失败' : '保存成功';
        this.$refs.toast.isShow = true;
      }
    },
    async created () {
      await this.fetchParameterList({ paramCls: SYSTEM_KEYS.ORDER });
    }
  };

</script>
<style lang="scss">
  .order-parameter-container {
    .mw-form {
      width: 60%;
      margin-bottom: 30px;
    }
  }
</style>
