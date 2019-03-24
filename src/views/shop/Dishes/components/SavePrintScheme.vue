<template>
  <el-dialog custom-class="base-modal save-print-scheme" :visible.sync="isShow" size="tiny" @close="handleClose">
    <div class="modal-title" slot="title">保存打印方案</div>
    <div v-if="!this.isShowCoverBox">
      <el-form ref="printPlanName" :model="form" :rules="rules" class="label-form" label-width="80px">
        <el-form-item label="保存为" prop="printPlanName">
          <el-input v-model="form.printPlanName" class="input-print-name"></el-input>
        </el-form-item>
        <el-form-item class="operation-item">
          <el-button class="btn-submit" type="primary" @click="onSaveSubmit">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="this.isShowCoverBox">
      <el-form :model="form" label-width="80px">
        <el-form-item class="operation-item">
          <div class="warning-message">{{form.printPlanName}}已存在，是否进行覆盖？</div>
        </el-form-item>
        <el-form-item class="operation-item">
          <el-button class="btn-cancel" @click="onOverwriteCancel">否，换个名字</el-button>
          <el-button class="btn-submit" type="primary" @click="onOverwriteSubmit">是，覆盖</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import { validateGeneralName } from 'utils/validateUtil';

  export default {
    name: 'savePrintScheme',
    props: ['isPrintPlanExist', 'saveMenuPrintPlan', 'lstMulDept', 'getPrintNameList'],
    data () {
      return {
        isShow: false,
        form: {
          printPlanName: ''
        },
        isShowCoverBox: false,
        rules: {
          printPlanName: [
            { required: true, message: '请输入打印方案', trigger: ['blur', 'change'] },
            { validator: validateGeneralName, trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    computed: mapState({
      isExist: state => state.dishes.menuPrint.isExist
    }),
    methods: {
      async onSaveSubmit () {
        let validForm;
        this.$refs.printPlanName.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const { printPlanName } = this.form;
        await this.isPrintPlanExist({ printPlanName });
        if (this.isExist) {
          this.onSaveCancel(true, true);
        } else {
          await this.saveMenuPrintPlan({ printPlanName, requestData: this.lstMulDept });
          const { errorStatus } = this.$store.state.error;
          if (!errorStatus) {
            this.onSaveCancel(false, false);
          }
        }
      },
      onSaveCancel (isShow, isShowCoverBox) {
        this.isShow = isShow;
        this.isShowCoverBox = isShowCoverBox;
      },
      async onOverwriteSubmit () {
        const { printPlanName } = this.form;
        await this.saveMenuPrintPlan({ printPlanName, requestData: this.lstMulDept });
        this.onSaveCancel(false, false);
      },
      onOverwriteCancel () {
        this.onSaveCancel(true, false);
      },
      handleClose () {
        this.onSaveCancel(false, false);
      }
    }
  };
</script>

<style lang="scss">
  .save-print-scheme {
    .el-dialog__body {
      padding: 10px 20px;
    }

    .modal-title {
      font-size: 18px;
      margin-left: 20px;
    }

    .modal-overwrite {
      margin-left: 20%;
    }
  }
</style>
