<template>
  <div class="form-container">
    <el-form class="mw-form" :class="editPopup" :model="form" ref="form" :rules="rules" label-width="140px">
      <el-form-item label="打印部门名称" prop="deptName">
        <el-input v-model="form.deptName" placeholder="请输入打印部门名称" :maxlength='INPUT_MAX_LENGTH'></el-input>
      </el-form-item>
      <el-form-item label="打印机选择">
        <el-select v-model="form.printerId" placeholder="请选择" style="width: 100%">
          <el-option label="未配置打印机" :value="null"></el-option>
          <el-option
            v-for="item in printerList"
            :key="item.id"
            :label="item.printerName"
            :value="item.id"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印单据">
        <el-checkbox v-model="form.isBackBill" :true-label= "TRUE" :false-label= "FALSE">退菜单</el-checkbox>
        <el-checkbox v-model="form.isHurryBill" :true-label= "TRUE" :false-label= "FALSE">催菜单</el-checkbox>
        <el-checkbox v-model="form.isTurnBill" :true-label= "TRUE" :false-label= "FALSE">转菜单</el-checkbox>
        <el-checkbox v-model="form.isTaskBill" :true-label= "TRUE" :false-label= "FALSE">起菜单</el-checkbox>
        <el-checkbox v-model="form.isChangeBill" :true-label= "TRUE" :false-label= "FALSE">换桌单</el-checkbox>
      </el-form-item>
      <el-form-item label="是否打印所有菜品">
        <el-switch v-model="form.printDishes" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="制作单格式">
        <el-select v-model="form.isOneItemCut" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in ITEM_CUT_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印份数" prop="printCopies">
        <el-input-number v-model.number="form.printCopies" :min="0" :max="999" class="width-full" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="状态" v-if="!isChain">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
      </el-form-item>

      <el-form-item class="form-item-pos" label="最大同时制作数量" prop="makeNumber">
        <el-input-number v-model.number="form.makeNumber" :min="0" :max="999" class="width-full" controls-position="right"></el-input-number>
        <!--<el-input v-model="form.makeNumber" placeholder="请输入最大同时制作数量" maxlength="10"></el-input>-->
        <div class="tip-btn-on-tail"><Tips content="当前设置只对KDS设备生效"></Tips></div>
      </el-form-item>

      <el-form-item v-if="!guidance" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { validateName, validateNumber,validateNumberGreaterThanZero } from 'utils/validateUtil';
  import { isChain } from 'utils/configUtil';
  import { FORBIDDEN, OK, TRUE, FALSE } from 'constant/statusCode';
  import { ON_TEXT, OFF_TEXT, ITEM_CUT_TYPE, INPUT_MAX_LENGTH } from 'constant/constants';
  import {Tips} from 'components'
  export default {
    name: 'FoodOutDept',
    props: ['guidance', 'foodOutDeptId'],
    components:{Tips},
    data () {
      return {
        FORBIDDEN,
        OK,
        TRUE,
        FALSE,
        ON_TEXT,
        OFF_TEXT,
        ITEM_CUT_TYPE,
        INPUT_MAX_LENGTH,
        form: {
          deptName: '',
          printerId: '',
          isBackBill: FALSE,
          isHurryBill: FALSE,
          isTaskBill: FALSE,
          isTurnBill: FALSE,
          isChangeBill: FALSE,
          isOneItemCut: 1,
          printCopies: 0,
          status: OK,
          printDishes: 0,
          makeNumber:20,  //最大同时制作数量
        },
        rules: {
          deptName: [
            { required: true, message: '打印部门名称不能为空', trigger: 'blur, change' },
            { validator: validateName, trigger: ['blur', 'change'] }
          ],
          printCopies: [
            { required: true, type: 'number', message: '打印份数不能为空', trigger: 'blur, change' },
            { validator: validateNumber, trigger: 'blur, change' }
          ],
          makeNumber: [
            { required: true, type: 'number', message: '最大同时制作数量不能为空', trigger: 'blur, change' },
            { validator: validateNumber, trigger: 'blur, change' }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.foodOutDeptId,
        isChain: isChain()
      };
    },
    computed: {
      ...mapState({
        pageIndex: state => state.setting.foodOut.pageIndex,
        pageSize: state => state.setting.foodOut.pageSize,
        printerList: state => state.setting.foodOut.printerList,
        department: state => state.setting.foodOut.department
      }),
      editPopup () {
        return {
          'edit-or-add-pop-up': this.guidance
        };
      }
    },
    methods: {
      ...mapActions([
        'fetchFoodOutDeptItem',
        'updateFoodOutDeptItem'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return validForm;

        this.form.printerName = this.printerList.find(item => item.id === this.form.printerId) ? this.printerList.find(item => item.id === this.form.printerId).printerName : null;
        const operate = this.isEdit ? 'edit' : 'add';
        await this.updateFoodOutDeptItem({ operate, dept: this.form, noShowError: this.guidance });

        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.onCancel();
        }
        return validForm;
      },
      onCancel () {
        this.$router.push('/myd/setting/foodout');
      },
      init () {
        if (this.department) {
          const { printerId, isOneItemCut, status, deptName } = this.department;
          this.form = {
            ...this.form, ...this.department,
            deptName: deptName || '',
            isOneItemCut: !isOneItemCut ? 1 : isOneItemCut,
            printerId: (!this.isEdit && this.printerList && this.printerList.length) ? this.printerList[0].id : printerId,
            status: !status ? 1 : status
          };
        }
      }
    },
    async created () {
      this.isEdit
        ? await this.fetchFoodOutDeptItem({ deptId: this.$route.params.id || this.foodOutDeptId, operate: 'edit' })
        : await this.fetchFoodOutDeptItem({ operate: 'add' });
      this.init();
    }
  };
</script>

<style lang="scss">
  .form-container {
    display: flex;
    justify-content: center;

    .edit-or-add-pop-up {
      width: 80% !important;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 10px;
    }
    .form-item-pos{
      position: relative;
      .tip-btn-on-tail{
        position: absolute;
        right: -36px;
        top: 0px;

      }
    }

  }
</style>
