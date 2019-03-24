<template>
    <div class="business-setting">
      <!--营业餐段-->
      <span class="required-mark">*</span><span>设置营业餐段</span>
      <span class="sub-title">（例：午市、晚市、全天等）</span>
      <ShiftMain ref="shiftMain" :guidance="true" :showShiftModal="showModal" :tipVisibility="tipVisibility"></ShiftMain>
      <Popup
        type="submit"
        :ref='BUSINESS_SHIFT_POPUP_REF'
        :title="shiftModalTitle"
        okText="保存"
        :handleOk="() => onSubmit('shift',BUSINESS_SHIFT_POPUP_REF)"
        :handleClose="() => handleClose(BUSINESS_SHIFT_POPUP_REF)"
        class="shift-popup"
        size="small">
        <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
          <div>
            <i class="el-icon-circle-cross"></i>
            {{ errorMessage }}
          </div>
        </div>
        <Shift ref="shift" slot="content" :msectionId="msectionId" :guidance="true" v-if="dialogVisible"></Shift>
      </Popup>
      <!--营业班别-->
      <span class="required-mark">*</span><span>设置收银班别</span>
      <span class="sub-title">（例：白班、晚班、全班等）</span>
      <CashierMain ref="cashierMain" :guidance="true" :showCashierModal="showModal" :tipVisibility="tipVisibility"></CashierMain>
      <Popup
        type="submit"
        :ref='BUSINESS_CASHIER_POPUP_REF'
        :title="cashierModalTitle"
        okText="保存"
        :handleOk="() => onSubmit('cashier',BUSINESS_CASHIER_POPUP_REF)"
        :handleClose="() => handleClose(BUSINESS_CASHIER_POPUP_REF)"
        size="small">
        <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
          <div>
            <i class="el-icon-circle-cross"></i>
            {{ errorMessage }}
          </div>
        </div>
        <Cashier ref="cashier" slot="content" :shiftId="shiftId" :guidance="true" v-if="dialogVisible"></Cashier>
      </Popup>
    </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { Popup } from 'components';
  import { Shift, ShiftMain } from '../Business/Shift';
  import { CashierMain, Cashier } from '../Business/Cashier';
  import { BUSINESS_CASHIER_POPUP_REF, BUSINESS_SHIFT_POPUP_REF } from 'constant/constants';

  export default {
    name: 'BusinessSettings',
    props: {
      tipVisibility: {
        type: Boolean,
        default: false
      },
      nextStepClick: {
        type: Boolean,
        default: false
      }
    },
    components: {
      Popup,
      Shift,
      Cashier,
      ShiftMain,
      CashierMain
    },
    data () {
      return {
        shiftId: '',
        errorMessage: '',
        msectionId: '',
        dialogVisible: '',
        cashierModalTitle: '',
        shiftModalTitle: '',
        BUSINESS_SHIFT_POPUP_REF,
        BUSINESS_CASHIER_POPUP_REF
      };
    },
    computed: {
      ...mapState({
        shiftList: state => state.business.shift.shiftList,
        cashierList: state => state.business.cashier.cashierList,
        errorMsg: state => state.error.errorMsg
      })
    },
    watch: {
      shiftId () {
        this.shiftId
          ? this.cashierModalTitle = '编辑班别'
          : this.cashierModalTitle = '新增班别';
      },
      msectionId () {
        this.msectionId
          ? this.shiftModalTitle = '编辑餐段'
          : this.shiftModalTitle = '新增餐段';
      },
      nextStepClick () {
        if (!this.tipVisibility) return;

        if (!this.cashierList.length) {
          this.$refs.cashierMain.$refs.btnAdd.$el.scrollIntoView();
        }

        if (!this.shiftList.length) {
          this.$refs.shiftMain.$refs.btnAdd.$el.scrollIntoView();
        }
      }
    },
    methods: {
      showModal (popupRef, id) {
        switch (popupRef) {
          case BUSINESS_CASHIER_POPUP_REF:
            this.shiftId = id;
            break;
          case BUSINESS_SHIFT_POPUP_REF:
            this.msectionId = id;
            break;

          default: break;
        }
        this.handleDialogVisible(true, true, popupRef);
      },
      async onSubmit (content, popupRef) {
        if (await this.$refs[content].onSubmit()) {
          this.errorMessage = '';
          this.handleDialogVisible(false, false, popupRef);
        } else {
          this.errorMessage = this.errorMsg;
        }
      },
      handleClose (popupRef) {
        this.errorMessage = '';
        this.handleDialogVisible(false, false, popupRef);
      },
      handleDialogVisible (dialogVisible, isShow, popupRef) {
        this.dialogVisible = dialogVisible;
        this.$refs[popupRef].isShow = isShow;
      }
    }
  };

</script>
<style lang="scss">
  .business-setting {
    .required-mark {
      color: red;
      margin-right: 4px;
    }

    .sub-title {
      color: #CCC;
    }

    .shift-popup {
      .mw-form {
        width: 80%;
      }
    }

    .error-wrapper {
      margin-top: 5px;
      margin-bottom: 0;
      color: #ff4949;
    }
  }

</style>
