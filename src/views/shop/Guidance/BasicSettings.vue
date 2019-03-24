<template>
  <div class="basic-setting-container">
    <el-steps :active="active" :align-center="true" style="padding-left: 20%">
      <el-step v-for="item in STEP_DETAIL" :title="item.title" :key="item.title"></el-step>
    </el-steps>
    <div class="des-label">{{STEP_DETAIL[active].description}}</div>
    <div class="content-container">
      <shop-info ref="shopInfo" :guidance="true" v-if="active === STEP_ONE" />
      <business-settings :nextStepClick="nextStepClick" :tipVisibility="tipVisibility" v-if="active === STEP_TWO" />
      <print-settings :nextStepClick="nextStepClick" :tipVisibility="tipVisibility" v-if="active === STEP_THREE" />
      <table-settings :nextStepClick="nextStepClick" :tipVisibility="tipVisibility" v-if="active === STEP_FOUR" />
      <dish-setting :dishStatus="dishStatus" :active="dishStatus" v-if="active === STEP_FIVE" />
    </div>
    <div class="btn-tool-bar">
      <el-button class="previous-btn" v-if="active !== STEP_ONE" size="large" @click="onPreviousStepClick">上一步</el-button>
      <el-button class="btn-submit" size="large" @click="onNextStepClick">{{nextStepBtnText}}</el-button>
    </div>
    <toast
      ref='toast'
      content="恭喜！您的店铺已设置完成。"
      :timeout="3000"
      type="success"
      :callback="() => { this.$router.push('/myd/guidance'); }"
    />
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Toast } from 'components';
  import ShopInfo from '../ShopInfo/ShopInfo';
  import { DishSetting } from './components';
  import PrintSettings from './PrintSettings';
  import TableSettings from './TableSettings';
  import BusinessSettings from './BusinessSettings';
  import { STEP_DETAIL, STEP_ONE, STEP_TWO, STEP_THREE, STEP_FOUR, STEP_FIVE, STEP_NAMES } from 'constant/constants';

  export default {
    name: 'BasicSettings',
    components: {
      ShopInfo,
      PrintSettings,
      BusinessSettings,
      TableSettings,
      DishSetting,
      Toast
    },
    data () {
      return {
        STEP_DETAIL,
        STEP_ONE,
        STEP_TWO,
        STEP_THREE,
        STEP_FOUR,
        STEP_FIVE,
        active: STEP_ONE,
        tipVisibility: false,
        nextStepClick: false,
        dishStatus: {
          classify: false,
          menu: false,
          menuPrint: false
        }
      };
    },
    async created () {
      await this.fetchAllGuidance();
      const step = this.steps.length;
      if ((step - 1) === STEP_FIVE || step <= STEP_ONE) {
        return;
      }
      this.active = step;
    },
    computed: {
      ...mapState({
        steps: state => state.guidance.steps,
        shiftList: state => state.business.shift.shiftList,
        cashierList: state => state.business.cashier.cashierList,
        printerList: state => state.setting.printer.printerList,
        hostList: state => state.setting.host.hostList,
        deptList: state => state.setting.foodOut.deptList,
        classifyList: state => state.dishes.classify.list,
        menuList: state => state.dishes.menu.list,
        menuPrintList: state => state.dishes.menuPrint.menuPrintList,
        tableTypeList: state => state.tables.tableType.tableTypeList,
        diningAreaList: state => state.tables.diningArea.diningAreaList,
        tableManagerPageList: state => state.tables.management.tableManagerPageList
      }),
      nextStepBtnText () {
        if (this.active === STEP_FIVE) {
          return '完成设置';
        }
        return '下一步';
      }
    },
    methods: {
      ...mapActions([
        'fetchAllGuidance',
        'updateStepOfGuidance'
      ]),
      async onNextStepClick () {
        this.tipVisibility = false;
        const currntStep = this.active;

        switch (this.active) {
          case STEP_ONE:
            if (this.$refs.shopInfo && !await this.$refs.shopInfo.onSubmit()) return;
            break;
          case STEP_TWO:
            this.nextStepClick = !this.nextStepClick;
            if (!this.shiftList.length || !this.cashierList.length) {
              this.tipVisibility = true;
              return;
            }
            break;
          case STEP_THREE:
            this.nextStepClick = !this.nextStepClick;
            if (!this.deptList || !this.deptList.length ||
              !this.hostList || !this.hostList.length ||
              !this.printerList || !this.printerList.length) {
              this.tipVisibility = true;
              return;
            }
            break;
          case STEP_FOUR:
            this.nextStepClick = !this.nextStepClick;
            if (!this.tableTypeList || !this.tableTypeList.length ||
              !this.diningAreaList || !this.diningAreaList.length ||
              !this.tableManagerPageList || !this.tableManagerPageList.length) {
              this.tipVisibility = true;
              return;
            }
            break;
          case STEP_FIVE:
            const { dishStatus } = this;
            let state = false;
            for (let key in dishStatus) {
              dishStatus[key] = !this[`${key}List`].length;
              state = state || dishStatus[key];
            }
            if (state) return;
            break;
          default: break;
        }

        if (++this.active >= STEP_DETAIL.length) this.active = STEP_DETAIL.length - 1;

        await this.updateStepOfGuidance({ dto: { stepName: STEP_NAMES[currntStep] } });

        if (STEP_FIVE === currntStep) {
          this.$refs.toast.isShow = true;
        }

        document.getElementsByClassName('app-main')[0].scrollTop = 0;
      },
      onPreviousStepClick () {
        this.tipVisibility = false;
        this.active--;
      }
    }
  };

</script>
<style lang="scss">
  .basic-setting-container {
    width: 70%;
    margin: auto;
    padding: 30px 0 60px;
    font-size: 14px;

    .btn-add {
      margin-bottom: 10px;
    }

    .el-step {
      .el-step__head .is-finish {
        color: #fff;
        background-color: #4A90E2;
        border-color: #4A90E2;
      }

      .is-process {
        color: #4A90E2;
        border-color: #4A90E2;
        background-color: transparent;
      }

      .el-step__line-inner {
        width: 100% !important;
      }
    }

    .des-label {
      text-align: center;
      line-height: 48px;
      font-size: 14px;
      color: #707F87;
      background-color: #F6F8F9;
      border: 0.5px solid rgba(153, 153, 153, 0.62);
      border-bottom: none;
      margin-top: 15px;
    }

    .content-container {
      padding: 40px;
      border: 0.5px solid rgba(153, 153, 153, 0.62);
    }

    .btn-tool-bar {
      text-align: center;
      margin-top: 15px;

      .el-button {
        border-radius: 23px;
        border: 0;
        height: 46px;
        width: 210px;
        color: white;
        font-size: 20px;
        letter-spacing: 4px;
      }

      .btn-submit {
        height: 46px;
        width: 210px;
      }

      .previous-btn {
        background: #CCC;

        &:hover {
          background: #878787;
          box-shadow: 0 0 6px 4px #AEAEAE;
          border-radius: 23px;
        }

        &:focus {
          background: #AEAEAE;
          box-shadow: 0 0 5px 0 rgba(51, 51, 51, 0.2);
          border-radius: 23px;
        }
      }
    }
  }
</style>
