<template>
  <div class="form-container">
    <el-form class="mw-form" :class="editPopup" :model="form" ref="form" :rules="rules" label-width="160px">
      <el-form-item label="打印机名称" prop="printerName">
        <el-input v-model="form.printerName" :disabled="isEdit" placeholder="请输入打印机名称" :maxlength='INPUT_MAX_LENGTH'/>
      </el-form-item>
      <el-form-item label="是否为制作部门打印机">
        <el-checkbox v-model="form.isMakePrn" :true-label="TRUE" :false-label="FALSE"/>
      </el-form-item>
      <el-form-item label="打印机命令类型">
        <el-input v-model="form.commandType" placeholder="请输入打印机命令类型" :maxlength='20'/>
      </el-form-item>
      <el-form-item label="打印机接口类型" prop="printerCls">
        <el-select
          @change="onPortSelectionChange"
          v-model="form.printerCls"
          placeholder="请选择"
          class="width-full">
          <el-option
            v-for="item in PRINTER_PORT_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="打印机唯一标识" v-if='+form.printerCls !== PRINTER_CLOUD && +form.printerCls !== PRINTER_433'>
        <el-input v-model="form.ip" placeholder="请输入打印机唯一标识" :maxlength='INPUT_MAX_LENGTH'/>
      </el-form-item>
      <div v-if='+form.printerCls === PRINTER_433'>
        <el-form-item label="打印机唯一标识" prop="printerSN">
          <el-input v-model="form.printerSN" placeholder="请输入打印机唯一标识" maxlength='8'/>
          <Tips content="1：必须为8位，不能多也不能少<br/>2：只能是16进制字符：0~9，A~F，小写字母转成大写<br/>3：最后2位是校验码，校验规则如下<br/>123456xx，xx=12+34+56后取低8位，都是16进制"></Tips>
        </el-form-item>
      </div>
      <el-form-item label="云打印机SN号" v-if='+form.printerCls === PRINTER_CLOUD'>
        <el-input v-model="form.printerSN" placeholder="请输入云打印机SN号" :maxlength='20'
                  :disabled="snDisabled && isEdit && !isSnNull" @change="onSnChange"/>
        <el-button v-if='+form.printerCls === PRINTER_CLOUD && isEdit && !isSnNull'
                   :class="!snDisabled ? 'visibility-hidden bind btn-primary': 'bind btn-primary'"
                   @click="onUnbindClick">解绑
        </el-button>
      </el-form-item>
      <el-form-item label="打印机型号" v-if="+form.printerCls === PRINTER_CLOUD || +form.printerCls === 1">
        <el-select v-model="form.printerNum" placeholder="请选择" class="width-full" @change="onPrinterModelChange">
          <el-option
            v-for="item in +form.printerCls === PRINTER_CLOUD ? PRINTER_MODEL_CLOUD : (+form.printerCls === 1 ? PRINTER_MODEL_WANGKOU : PRINTER_MODEL_DEFAULT)"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="width-full"/>
        </el-select>
        <Tips content="版本支持：<br/>Android：2.7.7及以上<br/>Windows：暂不支持"></Tips>
      </el-form-item>
      <el-form-item label="控票方式" v-if="+form.printerCls === 1">
        <el-select v-model="form.controlBill" placeholder="请选择" class="width-full" >
          <el-option :key="0" label="无" :value="0" />
          <el-option :key="1" label="流控" :value="1" />
          <el-option :key="2" label="一票一控" :value="2" />
        </el-select>
        <Tips content="版本支持：<br/>Android：2.7.7及以上<br/>Windows：暂不支持"></Tips>
      </el-form-item>
      <el-form-item label="端口值1" v-if="!guidance">
        <el-select
          v-model="form.str1"
          placeholder="请选择"
          class="width-full"
          v-if="form.printerCls === SERIAL_PORT || form.printerCls === PARALLEL_PORT ">
          <el-option
            v-for="item in form.printerCls === SERIAL_PORT ? SERIAL_PORT_TYPE : PARALLEL_PORT_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="波特率" v-if="!guidance">
        <el-input-number
          :min="0"
          v-model="form.int1"
          class="width-full"
          controls-position="right"
          v-if="form.printerCls === SERIAL_PORT ||form.printerCls === USB_FOR_SERIAL_PORT"
        />
      </el-form-item>
      <el-form-item label="尺寸" prop="paperSize">
        <el-select v-model="form.paperSize" placeholder="请选择" class="width-full" @change="onPaperSizeSelectionChange">
          <el-option
            v-for="item in PRINTER_PAPER_SIZE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="单行打印字符数" prop="cpl">
        <el-input v-model.number="form.cpl" :maxlength='INPUT_MAX_LENGTH'/>
      </el-form-item>
      <el-form-item label="打印机类型">
        <el-select v-model="form.printerType" placeholder="请选择" class="width-full">
          <el-option
            v-for="item in PRINTER_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="是否逆向打印">
        <el-switch v-model="form.reverse" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"/>
      </el-form-item>
      <el-form-item label="打印机编码">
        <el-select v-model="form.language" placeholder="请选择" class="width-full">
          <el-option
            v-for="item in PRINTER_CODE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备用打印机" prop="bakPrinterName" v-if="!guidance">
        <el-select v-model="form.bakPrinterName" placeholder="请选择" class="width-full">
          <el-option
            v-for="item in printerNameList"
            :key="item"
            :label="item"
            :value="item"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="打印机性能">
        <el-radio v-model="form.newPrinter" :label="0">普通打印机</el-radio>
        <el-radio v-model="form.newPrinter" :label="1">低性能打印机<Tips content="使用年限较长、内存较低、性能较差的打印机<br/>版本支持：<br/>Android：2.7.1及以上<br/>Windows：暂不支持" class="radio-tips"></Tips></el-radio>
      </el-form-item>
      <el-form-item label="任务超时时间（秒）" prop="timeOut">
        <el-input v-model.number="form.timeOut" :maxlength='INPUT_MAX_LENGTH'/>
      </el-form-item>
      <el-form-item label="尝试重打次数" prop="retry">
        <el-input-number :min="1" :max="5" v-model="form.retry" :controls="false" class="width-full"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK"
                   :inactive-value="FORBIDDEN"/>
      </el-form-item>
      <el-form-item v-if="!guidance" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <toast
      ref='toast'
      :content="toastContent"
      :type="toastType">
    </toast>
    <popup
      type="warning"
      cancelText="取消"
      title="云打印机绑定提示"
      :tips="popupTips"
      ref="popup"></popup>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { validateIpAndMac, validateNumber, validateGeneralName, validatePrinterNumber, validate433Printer } from 'utils/validateUtil';
  import { TRUE, FALSE, FORBIDDEN, OK } from 'constant/statusCode';
  import {
    ON_TEXT,
    OFF_TEXT,
    PRINTER_PORT_TYPE,
    PRINTER_PAPER_SIZE,
    INPUT_MAX_LENGTH,
    SERIAL_PORT_TYPE,
    SERIAL_PORT,
    PARALLEL_PORT_TYPE,
    PARALLEL_PORT,
    USB_FOR_SERIAL_PORT,
    PRINTER_TYPE,
    PRINTER_CODE,
    PRINTER_CLOUD,
    PRINTER_433,
    PRINTER_MODEL_CLOUD,
    PRINTER_MODEL_WANGKOU,
    PRINTER_MODEL_DEFAULT
  } from 'constant/constants';
  import { Toast, Popup, Tips } from 'components';

  export default {
    name: 'Printer',
    components: { Toast, Popup, Tips },
    props: ['guidance', 'printerId'],
    data () {
      return {
        FORBIDDEN,
        OK,
        TRUE,
        FALSE,
        ON_TEXT,
        OFF_TEXT,
        INPUT_MAX_LENGTH,
        PRINTER_PORT_TYPE,
        PRINTER_PAPER_SIZE,
        PRINTER_TYPE,
        PRINTER_CODE,
        SERIAL_PORT_TYPE,
        PARALLEL_PORT_TYPE,
        SERIAL_PORT,
        PARALLEL_PORT,
        USB_FOR_SERIAL_PORT,
        PRINTER_CLOUD,
        PRINTER_433,
        PRINTER_MODEL_CLOUD,
        PRINTER_MODEL_WANGKOU,
        PRINTER_MODEL_DEFAULT,
        toastType: '',
        toastContent: '',
        popupTips: '',
        snDisabled: true,
        isSnNull: false,
        form: {
          printerName: '',
          ip: null,
          isMakePrn: '',
          commandType: '',
          printerCls: '',
          str1: '',
          int1: 0,
          paperSize: null,
          bakPrinterName: '',
          timeOut: 30,
          retry: 3,
          status: 1,
          cpl: 0,
          printerType: 0,
          reverse: 0,
          language: 0,
          printerSN: '',
          isBindPrintSN: 0,
          newPrinter: 0,
          printerNum: 0,
          controlBill: 0
        },
        rules: {
          printerName: [
            { required: true, message: '这是必填字段', trigger: ['blur', 'change'] },
            { validator: validateGeneralName, trigger: ['blur', 'change'] }
          ],
          printerSN: [
            { validator: validate433Printer, trigger: ['blur', 'change'] }
          ],
          ip: [
            { validator: validateIpAndMac, trigger: ['blur', 'change'] }
          ],
          timeOut: [
            { validator: validateNumber, trigger: ['blur', 'change'] },
            { type: 'number', min: 1, max: 30, message: '请输入1-30之间数字', trigger: ['blur', 'change'] }
          ],
          retry: [
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          cpl: [
            { validator: validatePrinterNumber, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.printerId
      };
    },
    computed: {
      ...mapState({
        printerList: state => state.setting.printer.printerList,
        printerNameList: state => state.setting.printer.printerNameList,
        printer: state => state.setting.printer.printer,
        error: state => state.error
      }),
      editPopup () {
        return {
          'edit-or-add-pop-up': this.guidance
        };
      }
    },
    methods: {
      ...mapActions([
        'fetchPrinterItem',
        'savePrinterItem',
        'updatePrinterItem',
        'bindCloudPrinter',
        'unbindCloudPrinter'
      ]),
      onPrinterModelChange (value) {
        if (value !== '0001') {
          this.form.controlBill = 0;
        }
      },
      onSnChange (value) {
        this.form.isBindPrintSN = value ? 1 : 0;
      },
      showToast (toastType, toastContent) {
        this.toastType = toastType;
        this.toastContent = toastContent;
        this.$refs.toast.isShow = true;
      },
      async onUnbindClick () {
        await this.unbindCloudPrinter({ sn: this.form.printerSN, printerId: this.form.id, noShowError: true });
        const { errorStatus } = this.error;
        if (errorStatus) {
          this.toastType = 'warning';
          this.toastContent = '云打印机解绑失败';
          this.$refs.toast.isShow = true;
        } else {
          this.toastType = 'success';
          this.toastContent = '云打印机解绑成功';
          this.$refs.toast.isShow = true;
          this.snDisabled = false;
          this.form.printerSN = null;
          this.form.isBindPrintSN = 0;
        }
      },
      onPaperSizeSelectionChange (value) {
        switch (value) {
          case 1:
            this.form.cpl = 32;
            break;
          case 3:
            this.form.cpl = 35;
            break;
          case 2:
            this.form.cpl = 48;
            break;
        }
      },
      onPortSelectionChange (selectedPort) {
        this.form.printerNum = 0;
        if (this.isEdit) return;

        if (selectedPort === SERIAL_PORT) {
          this.form.str1 = 'COM1';
          this.form.int1 = 0;
        } else if (selectedPort === PARALLEL_PORT) {
          this.form.str1 = 'LPT1';
        } else {
          this.form.str1 = '';
        }
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return validForm;

        if (!this.form.ip) this.form.ip = null;
        const data = { printer: this.form, noShowError: this.guidance, isBindPrintSN: this.form.isBindPrintSN };
        this.isEdit ? await this.updatePrinterItem(data) : await this.savePrinterItem(data);

        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.onCancel();
        }
        return validForm;
      },
      onCancel () {
        this.$router.push('/myd/setting/printer');
      },
      init () {
        if (this.printer) {
          const id = this.$route.params.id || this.printerId;
          this.form = { ...this.form, id, ...this.printer };
          this.isSnNull = !this.form.printerSN;
        }
      }
    },
    async created () {
      this.isEdit
        ? await this.fetchPrinterItem({ id: this.printerId || this.$route.params.id })
        : await this.fetchPrinterItem();
      this.init();
    }
  };
</script>

<style lang="scss">
  .form-container {
    .el-form-item {
      margin-bottom: 18px !important;
    }

    .edit-or-add-pop-up {
      width: 80% !important;
    }

    .bind {
      position: absolute;
      right: -110px;
      top: 0;
      width: 100px;
      height: 40px;
    }

    .radio-tips {
      right: inherit !important;
      top: -5px !important;
    }

    .tips-wrapper {
      position: absolute;
      right: -30px;
      top: 10px;
    }
  }
</style>
