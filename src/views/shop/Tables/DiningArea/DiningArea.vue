<template>
  <div class="form-container">
    <el-form class="mw-form" :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="餐区名称" prop="mareaName">
        <el-input v-model="form.mareaName" placeholder="请输入餐区名称" :maxlength="50" />
      </el-form-item>
      <el-form-item label="秒点打印机" prop="printerName">
        <el-select v-model="form.printerName" placeholder="请选择" class="width-full">
          <el-option
            v-for="item in printerList"
            :key="item.fiID"
            :label="item.printerName"
            :value="item.printerName"
            class="width-full" />
        </el-select>
      </el-form-item>
      <el-form-item label="结账方式">
        <el-radio-group v-model="form.checkoutModel">
          <el-radio :label="PAY_FIRST">先付款</el-radio>
          <el-radio :label="PAY_LATER">后付款</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.mareaStatus" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
      </el-form-item>
      <el-form-item v-if="!guidance" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK, PAY_FIRST, PAY_LATER } from 'constant/statusCode';
  import { ON_TEXT, OFF_TEXT, MAX_PAGE_SIZE } from 'constant/constants';
  import { validateGeneralName } from 'utils/validateUtil';

  export default {
    name: 'DiningArea',
    props: ['guidance', 'mTableAreaId'],
    data () {
      return {
        FORBIDDEN,
        OK,
        ON_TEXT,
        OFF_TEXT,
        PAY_FIRST,
        PAY_LATER,
        form: {
          mareaId: null,
          mareaName: null,
          printerName: '',
          mareaStatus: OK,
          checkoutModel: PAY_LATER
        },
        MAX_PAGE_SIZE,
        rules: {
          mareaName: [
            { required: true, message: '请输入餐区名称', trigger: ['blur', 'change'] },
            { validator: validateGeneralName, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.mTableAreaId
      };
    },
    computed: {
      ...mapState({
        printerList: state => state.tables.diningArea.printerList,
        pageIndex: state => state.tables.diningArea.pageIndex
      })
    },
    methods: {
      ...mapActions([
        'fetchAllDiningArea',
        'fetchDiningAreaItem',
        'saveDiningArea',
        'editDiningArea',
        'fetchPrinterListForTable'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const data = { ...this.form, noShowError: this.guidance };
        this.isEdit ? await this.editDiningArea(data) : await this.saveDiningArea(data);
        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.$router.back();
        }
        if (this.guidance) {
          const { pageIndex } = this;
          await this.fetchAllDiningArea({ pageSize: MAX_PAGE_SIZE, pageIndex });
        }
        return validForm;
      },
      onCancel () {
        this.$router.back();
      },
      init () {
        const { diningAreaItem } = this.$store.state.tables.diningArea;
        if (diningAreaItem) {
          const { mareaId, mareaName, printerName, mareaStatus, checkoutModel } = diningAreaItem;
          this.form = {
            mareaId,
            mareaName,
            printerName,
            mareaStatus: mareaStatus === null ? OK : parseInt(mareaStatus),
            checkoutModel: checkoutModel === null ? PAY_LATER : parseInt(checkoutModel)
          };
        }
      }
    },
    async created () {
      this.isEdit
        ? await this.fetchDiningAreaItem({ mareaId: this.mTableAreaId || this.$route.params.id })
        : await this.fetchDiningAreaItem();
      this.init();
      await this.fetchPrinterListForTable();
    }
  };
</script>
