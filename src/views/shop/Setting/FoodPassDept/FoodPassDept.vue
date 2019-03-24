<template>
  <div class="food-pass-form-container">
    <el-form class="mw-form" :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="传菜点名称" prop="deptName">
        <el-input v-model="form.deptName" placeholder="请输入传菜点名称"></el-input>
      </el-form-item>
      <el-form-item label="打印机选择" prop="ip">
        <el-select v-model="form.printerName" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in printerList"
            :key="item.printerName"
            :label="item.printerName"
            :value="item.printerName"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印来源" prop="ip">
        <el-select v-model="form.transferSource" placeholder="请选择" style="width: 100%">
          <el-option label="按打印部门" :value="0" style="width: 100%"></el-option>
          <el-option label="按下单餐区" :value="1" style="width: 100%"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="打印部门" v-if="form.transferSource === 0">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="item in deptList" :label="item.deptId" :key="item.deptId">{{item.deptName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="下单餐区" v-if="form.transferSource === 1" class="warn-btn-match">
        <Tips content="打印来源按下单餐区设置”只支持安卓V3.4及以上版本"></Tips>
        <el-checkbox-group v-model="mareaCheckedList">
          <el-checkbox v-for="item in mareaList" :label="item.mareaId" :key="item.mareaId">{{item.mareaName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="打印份数" prop="printCopies">
        <el-input-number v-model.number="form.printCopies" :min="0" :max="999" class="width-full" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK } from 'constant/statusCode';
  import { ON_TEXT, OFF_TEXT } from 'constant/constants';
  import { validateNumber, validateName } from 'utils/validateUtil';
  import { Tips } from 'components';

  export default {
    name: 'FoodPassDept',
    components: {
      Tips,
    },
    data () {
      return {
        FORBIDDEN,
        OK,
        ON_TEXT,
        OFF_TEXT,
        checkList: [],
        mareaCheckedList:[], //下餐区域
        previousName: '',
        form: {
          deptName: '',
          deptCls: 1,
          printerName: '',
          printerName2: null,
          printCopies: 1,
          status: OK,
          id: null,
          transferSource:0, // 0:打印部门 , 1:打印区域
        },
        rules: {
          deptName: [
            { required: true, message: '传菜口名称不能为空', trigger: 'blur, change' },
            { validator: validateName, trigger: 'blur, change' }
          ],
          printCopies: [
            { required: true, type: 'number', message: '打印份数不能为空', trigger: 'blur, change' },
            { validator: validateNumber, trigger: 'blur, change' }
          ]

        },
        isEdit: !!this.$route.params.id
      };
    },
    watch: {
      checkedPrnList () {
        if (this.checkedPrnList !== null) {
          this.checkList = this.checkedPrnList.map(item => item.deptId_Make);
        }
      },
      transferAreaList () {
        if (this.transferAreaList !== null) {
          this.mareaCheckedList = this.transferAreaList.map(item => item.mareaId_Make);
        }
      },
    },
    computed: {
      ...mapState({
        printerList: state => state.setting.foodPass.printerList,
        department: state => state.setting.foodPass.department,
        deptList: state => state.setting.foodPass.deptList,
        checkedPrnList: state => state.setting.foodPass.checkedPrnList,
        mareaList: state => state.setting.foodPass.mareaList,
        transferAreaList: state => state.setting.foodPass.transferAreaList,
      })
    },
    methods: {
      ...mapActions([
        'fetchFoodPassDeptItem',
        'updateFoodPassDeptItem'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        this.isEdit
        ? await this.updateFoodPassDeptItem({ operate: 'edit', dept: this.form, deptIdMake: this.checkList.toString(), mareaIdMake:this.mareaCheckedList.toString(),  oldName: this.previousName })
        : await this.updateFoodPassDeptItem({ operate: 'add', dept: this.form, deptIdMake: this.checkList.toString(), mareaIdMake:this.mareaCheckedList.toString(),});

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.onCancel();
        }
      },
      onCancel () {
        this.$router.push('/myd/setting/foodpass');
      },
      init () {
        if (this.department) {
          this.previousName = this.department.deptName;
          this.form = { ...this.form, ...this.department };
        } else {
          this.form = { ...this.form, printerName: this.printerList ? this.printerList[0].printerName : null };
        }
      }
    },
    async created () {
      const { id } = this.$route.params;
      this.isEdit
        ? await this.fetchFoodPassDeptItem({ deptId: id, operate: 'edit' })
        : await this.fetchFoodPassDeptItem({ operate: 'add' });
      this.init();
    }
  };
</script>

<style lang="scss">
  .food-pass-form-container {
    padding: 20px;
    border: 1px solid #ccc;
    .warn-btn-match{
      .el-checkbox-group{
        float: left;
      }
      .el-button--default{
        float: left;
        margin-top: 8px;
      }
    }
  }
</style>
