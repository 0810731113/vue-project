<template>
  <el-dialog custom-class="base-modal payment-setting-modal" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">批量设置</div>
    <div class="ids-wrapper">
      <span class="payment-id">{{ data.toString() }}</span>
      等 {{ data.length }} 个付款方式
    </div>
    <div class="settinng-wrapper">
      <span>将</span>
      <el-select v-model="type" class="select-type">
        <el-option
          v-for="item in settings"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      <span>设置为</span>
      <el-select v-model="value" class="select-type">
        <el-option
          v-for="subItem in items"
          :key="subItem.value"
          :label="subItem.name"
          :value="subItem.value">
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { PAYMENT_SETTING } from 'constant/payment';

export default {
  name: 'paymentSetting',
  props: ['data', 'paymentTypes', 'updatePayments'],
  data () {
    return {
      isShow: false,
      settings: PAYMENT_SETTING,
      type: '',
      items: [],
      value: ''
    };
  },
  watch: {
    paymentTypes () {
      const typeItem = [];
      if (!this.paymentTypes || this.paymentTypes.length) return;

      this.paymentTypes.map(item => {
        const { paymentTypeId, paymentTypeName } = item;
        typeItem.push({ value: paymentTypeId, name: paymentTypeName });
      });
      PAYMENT_SETTING[0].item = typeItem;
      this.settings = PAYMENT_SETTING;
      this.initData();
    },
    type (val) {
      if (!this.type) return;

      const datas = PAYMENT_SETTING.find(setting => this.type === setting.value);
      this.items = datas.item;
      this.value = this.items[0] ? this.items[0].value : null;
    }
  },
  methods: {
    initData () {
      const { value, item } = PAYMENT_SETTING[0];
      this.type = value;
      this.items = item;
      this.value = this.items[0] ? this.items[0].value : null;
    },
    onSubmit () {
      const { type, value } = this;
      this.$parent.onUpdatePayments({ selectType: type, selectValue: value });
      this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.initData();
      this.isShow = false;
    }
  }
};
</script>

<style lang='scss'>
.payment-setting-modal {
  .ids-wrapper {
    width: 100%;
    word-wrap: break-word;
    display: inline-block;
    margin-bottom: 20px;

    .payment-id {
      font-size: 14px;
      margin-left: 8px;
    }
  }

  .settinng-wrapper {
    text-align: center;
  }

  .select-type {
    width: 38%;
  }
}
</style>
