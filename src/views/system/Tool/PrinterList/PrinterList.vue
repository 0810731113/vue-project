<template>
  <div class="printer-list-container">
    <el-form class="mw-form" :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="打印机类型" prop="printerType">
        <el-select v-model="form.printerType" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in SYSTEM_PRINTER_TYPE_LIST"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="打印机品牌">
        <el-input v-model="form.printerBrand" placeholder="请输入打印机品牌"></el-input>
      </el-form-item>
      <el-form-item label="打印机型号" prop="printerNum">
        <el-input v-model="form.printerNum" placeholder="请输入打印机型号"></el-input>
      </el-form-item>
      <el-form-item label="打印机图片" prop="imageURL" v-if="form.printerType !== 3">
        <mw-upload
          ref="upload"
          :dataSource = '(form.imageURL && form.imageURL.length) ? [{url: form.imageURL}] : []'
          @getImageURI='getImageURI'
          :action="getActionUrl(`shop/${API_UPLOAD_SYSTEM_PRINTER_IMAGE}`)"
          :multipleUpload="false"
          :multipleSelect="false"/>
      </el-form-item>
      <el-form-item label="打印机图片" v-if="form.printerType === 3">
        <mw-upload
          ref="upload"
          :dataSource = '(form.imageURL && form.imageURL.length) ? [{url: form.imageURL}] : []'
          @getImageURI='getImageURI'
          :action="getActionUrl(`shop/${API_UPLOAD_SYSTEM_PRINTER_IMAGE}`)"
          :multipleUpload="false"
          :multipleSelect="false"/>
      </el-form-item>
      <el-form-item label="适用产品">
        <el-checkbox-group v-model="form.suitableProd">
          <el-checkbox label="1">美小易</el-checkbox>
          <el-checkbox label="2">美收银</el-checkbox>
          <el-checkbox label="3">美易点Android</el-checkbox>
          <el-checkbox label="4">美易点Windows</el-checkbox>
        </el-checkbox-group>
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
  import { ON_TEXT, OFF_TEXT, SYSTEM_PRINTER_TYPE_LIST } from 'constant/constants';
//  import { validateNumber, validateName } from 'utils/validateUtil';
  import { MwUpload } from 'components';
  import { API_UPLOAD_SYSTEM_PRINTER_IMAGE } from 'constant/API';

  export default {
    name: 'PrinterList',
    components: { MwUpload },
    data () {
      return {
        FORBIDDEN,
        OK,
        ON_TEXT,
        OFF_TEXT,
        SYSTEM_PRINTER_TYPE_LIST,
        API_UPLOAD_SYSTEM_PRINTER_IMAGE,
        form: {
          printerType: 1,
          printerBrand: '',
          printerNum: '',
          imageURL: null,
          suitableProd: [],
          status: OK
        },
        rules: {
          printerType: [
            { required: true, message: '打印机类型不能为空', trigger: ['blur', 'change'] }
          ],
          printerNum: [
            { required: true, message: '打印机型号不能为空', trigger: ['blur', 'change'] }
          ],
          imageURL: [
            { required: true, message: '打印机图片不能为空', trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id
      };
    },
    computed: {
      ...mapState({
        printerType: state => state.tool.printerList.printerType
      })
    },
    methods: {
      ...mapActions([
        'fetchSystemPrinterType',
        'updateSystemPrinterType',
        'saveSystemPrinterType'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;
        let printerType = { ...this.form, suitableProd: this.form.suitableProd.toString() };
        this.isEdit
          ? await this.updateSystemPrinterType({ printerType })
          : await this.saveSystemPrinterType({ printerType });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.onCancel();
        }
      },
      onCancel () {
        this.$router.push('/myd/tool/printerlist');
      },
      init () {
        if (this.printerType) {
          const { suitableProd } = this.printerType;
          this.form = { ...this.form, ...this.printerType, suitableProd: suitableProd ? suitableProd.split(',') : [] };
        }
      },
      getImageURI (path) {
        this.form.imageURL = path;
      }
    },
    async created () {
      const { id } = this.$route.params;
      if (this.isEdit) {
        await this.fetchSystemPrinterType({ guid: id });
        this.init();
      }
    }
  };
</script>

<style lang="scss">
  .printer-list-container {
    padding: 20px;
  }
</style>
