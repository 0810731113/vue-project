<template>
  <div class="print-dept-edit">
    <el-form class="menu-print mw-form" ref="form" :model="form" label-width="120px">
      <el-form-item>
        <el-radio class="radio" v-model="form.radioValue" :label="MENU_PRINT_RADIO.noDept">无后厨打印</el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio class="radio" v-model="form.radioValue" :label="MENU_PRINT_RADIO.singleDept">
          {{ form.itemKind === ITEMKIND.DISH ? "单个打印部门" : "套餐头部门" }}
        </el-radio>
        <el-select v-model="form.deptId" class="print-depart">
          <el-option label="不限" value="0" />
          <el-option
            v-for="item in printDeptList"
            v-if="+item.deptId !== -1"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-radio class="radio" v-model="form.radioValue" :label="MENU_PRINT_RADIO.multiDepts">
          {{ form.itemKind === ITEMKIND.DISH ? "多个制作部门" : "套餐明细部门" }}
        </el-radio>
      </el-form-item>
      <el-form-item v-show="(form.radioValue > 0) && (form.itemKind === ITEMKIND.DISH)">
        <multi-menu-print
          ref="multi-menu-print"
          v-model="form.lstMulDept"
          :printDeptList="printDeptList"
        />
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
      <toast
        ref='toast'
        :content="content"
        :timeout="2000"
        type="warning" />
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { MwButton, Toast } from 'components';
import { MultiMenuPrint } from '../components/index';
import { MENU_PRINT_RADIO, ITEMKIND } from 'constant/constants';

export default {
  name: 'menuPrint',
  components: {
    Toast,
    MwButton,
    MultiMenuPrint
  },
  data () {
    return {
      itemCd: !!this.$route.query.itemCd,
      form: {
        itemCd: '',
        isMulDept: '',
        isPrn: '',
        deptId: null,
        isSetDtlPrn: '',
        itemKind: ITEMKIND.DISH,
        lstMulDept: [{
          deptId: '',
          mareaId: ''
        }],
        radioValue: ''
      },
      ITEMKIND,
      MENU_PRINT_RADIO,
      content: ''
    };
  },
  async created () {
    const { itemCd, itemKind } = this.$route.query;
    if (!itemCd) return;
    if (+itemKind === ITEMKIND.DISH) {
      await this.getPrintPlanDetail({ itemCd });
    } else {
      await this.getSetMealPrintDetail({ itemCd });
    }
    this.form.itemCd = itemCd;
    await this.initData(+itemKind);
    await this.getAllPrintDept();
  },
  computed: mapState({
    printDeptList: state => state.dishes.menuPrint.printDeptList,
    printPlanDetail: state => state.dishes.menuPrint.printPlanDetail,
    setMealPrintDetail: state => state.dishes.menuPrint.setMealPrintDetail,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'updateMenuPrint',
      'getAllPrintDept',
      'getPrintPlanDetail',
      'updateSetMealMenuPrint',
      'getSetMealPrintDetail'
    ]),
    initData (itemKind) {
      if (itemKind === ITEMKIND.DISH) {
        const { form, printPlanDetail } = this;
        this.form = { ...form, ...printPlanDetail, lstMulDept: printPlanDetail.list || [{ deptId: '', mareaId: '' }] };
      } else {
        const { form, setMealPrintDetail } = this;
        const { isPrn, isSetDtlPrn } = setMealPrintDetail;
        this.form = { ...form, ...setMealPrintDetail, isSetDtlPrn: +isPrn === 0 ? 0 : isSetDtlPrn };
      }

      const { isMulDept, isPrn, isSetDtlPrn } = this.form;
      if ((+isPrn === 1) && ((+isMulDept > 0) || (+isSetDtlPrn > 1))) {
        this.form.radioValue = 1;
      } else if (((+isMulDept === 0) || (+isSetDtlPrn === 1)) && (+isPrn === 1)) {
        this.form.radioValue = 0;
      } else {
        this.form.radioValue = -1;
      }
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      const { radioValue, lstMulDept, itemKind, itemCd } = this.form;
      const { deptId } = { deptId: +radioValue === 0 ? this.form.deptId : null };
      if ((+radioValue === 0) && (deptId === null)) {
        this.content = +itemKind === ITEMKIND.DISH ? '请选择或选中单个制作部门!' : '请选择套餐头部门!';
        this.$refs.toast.isShow = true;
      }
      // 菜品
      if (+itemKind === ITEMKIND.DISH) {
        const params = { isMulDept: +radioValue > 0 ? 1 : 0, isPrn: +radioValue >= 0 ? 1 : 0, lstMulDept: +radioValue > 0 ? lstMulDept : [] };

        if (this.itemCd) {
          await this.updateMenuPrint({ ...params, deptId, itemCd });
        }
      }
      // 套餐
      if (+itemKind === ITEMKIND.SETMEAL) {
        const params = { isPrn: +radioValue >= 0 ? 1 : 0, isSetDtlPrn: +radioValue < 0 ? 0 : +radioValue + 1 };
        if (this.itemCd) {
          await this.updateSetMealMenuPrint({ ...params, deptId, itemCd });
        }
      }

      if (!this.errorStatus) {
        this.$router.back();
      }
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
  .print-dept-edit {
    .mw-form {
      width: 50%;
    }

    .menu-print {
      padding: 15px;

      .print-depart {
        margin-left: 20px;
        width: 200px;
      }
    }

    .operation-item .el-form-item__content {
      margin: 20px 0;
    }
  }
</style>
