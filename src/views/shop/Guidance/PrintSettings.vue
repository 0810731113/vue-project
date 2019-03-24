<template>
  <div class="print-setting">
    <el-button class="btn-primary" @click="openVideoDialog">查看视频教程</el-button>
    <!--打印机设置-->
    <div>
      <span class="required-mark">*</span><span>打印机设置</span>
      <span class="sub-title">（设置餐厅打印机的相关参数，确保收银机成功连接打印机，可以通过打印机打印单据）</span>
    </div>
    <PrinterMain ref="printerMain" :guidance="true" :showPrinterModal="showModal" :tipVisibility="tipVisibility"></PrinterMain>
    <Popup
      type="submit"
      :ref='PRINTER_POPUP_REF'
      :title="printerModalTitle"
      okText="保存"
      :handleOk="() => onSubmit('printer',PRINTER_POPUP_REF)"
      :handleClose="() => handleClose(PRINTER_POPUP_REF)"
      size="small">
      <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMessage }}
        </div>
      </div>
      <Printer ref="printer" slot="content" :printerId="printerId" :guidance="true" v-if="dialogVisible"></Printer>
    </Popup>
    <!--站点设置-->
    <span class="required-mark">*</span><span>站点设置</span>
    <span class="sub-title">（有收银机的工作区域。需要打印预结单、结账单等单据）</span>
    <HostMain ref="hostMain" :guidance="true" :showHostModal="showModal" :tipVisibility="tipVisibility"></HostMain>
    <Popup
      type="submit"
      :ref='HOST_POPUP_REF'
      :title="hostModalTitle"
      okText="保存"
      :handleOk="() => onSubmit('host',HOST_POPUP_REF)"
      :handleClose="() => handleClose(HOST_POPUP_REF)"
      size="small">
      <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMessage }}
        </div>
      </div>
      <Host ref="host" slot="content" :hostId="hostId" :guidance="true" v-if="dialogVisible"></Host>
    </Popup>
    <!--打印部门设置-->
    <span class="required-mark">*</span><span>打印部门设置</span>
    <span class="sub-title">（需要打印制作单、催菜单等单据）</span>
    <FoodOutDeptMain ref="foodOutDeptMain" :guidance="true" :showFoodOutDeptModal="showModal" :tipVisibility="tipVisibility"></FoodOutDeptMain>
    <Popup
      type="submit"
      :ref='FOOD_OUT_DEPT_POPUP_REF'
      :title="foodOutDeptModalTitle"
      okText="保存"
      :handleOk="() => onSubmit('foodOutDept',FOOD_OUT_DEPT_POPUP_REF)"
      :handleClose="() => handleClose(FOOD_OUT_DEPT_POPUP_REF)"
      size="small">
      <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMessage }}
        </div>
      </div>
      <FoodOutDept ref="foodOutDept" slot="content" :foodOutDeptId="foodOutDeptId" :guidance="true" v-if="dialogVisible"></FoodOutDept>
    </Popup>
    <Popup
      class="video-modal"
      type="other"
      title="视频教程"
      ref="videoTraining">
      <video slot="content" controls width="800px">
        <source :src="GUIDANCE_VIDEO_LINK">
      </video>
    </Popup>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import { Popup } from 'components';
  import { HostMain, Host } from '../Setting/Host';
  import { PrinterMain, Printer } from '../Setting/Printer';
  import { FoodOutDeptMain, FoodOutDept } from '../Setting/FoodOutDept';
  import { PRINTER_POPUP_REF, HOST_POPUP_REF, FOOD_OUT_DEPT_POPUP_REF, GUIDANCE_VIDEO_LINK } from 'constant/constants';

  export default {
    name: 'PrintSettings',
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
      Host,
      HostMain,
      Printer,
      PrinterMain,
      FoodOutDept,
      FoodOutDeptMain,
      Popup
    },
    data () {
      return {
        HOST_POPUP_REF,
        PRINTER_POPUP_REF,
        GUIDANCE_VIDEO_LINK,
        FOOD_OUT_DEPT_POPUP_REF,
        errorMessage: '',
        dialogVisible: false,
        printerId: '',
        printerModalTitle: '',
        hostId: '',
        hostModalTitle: '',
        foodOutDeptId: '',
        foodOutDeptModalTitle: ''
      };
    },
    computed: {
      ...mapState({
        printerList: state => state.setting.printer.printerList,
        hostList: state => state.setting.host.hostList,
        deptList: state => state.setting.foodOut.deptList,
        errorMsg: state => state.error.errorMsg
      })
    },
    watch: {
      printerId () {
        this.printerId
          ? this.printerModalTitle = '编辑打印机'
          : this.printerModalTitle = '新增打印机';
      },
      hostId () {
        this.hostId
          ? this.hostModalTitle = '编辑站点'
          : this.hostModalTitle = '新增站点';
      },
      foodOutDeptId () {
        this.hostId
          ? this.foodOutDeptModalTitle = '编辑打印部门'
          : this.foodOutDeptModalTitle = '新增打印部门';
      },
      nextStepClick () {
        if (!this.tipVisibility) return;

        if (!this.deptList || !this.deptList.length) {
          this.$refs.foodOutDeptMain.$refs.addPrinter.$el.scrollIntoView();
        }

        if (!this.hostList || !this.hostList.length) {
          this.$refs.hostMain.$refs.addPrinter.$el.scrollIntoView();
        }

        if (!this.printerList || !this.printerList.length) {
          this.$refs.printerMain.$refs.addPrinter.$el.scrollIntoView();
        }
      }
    },
    methods: {
      showModal (popupRef, id) {
        switch (popupRef) {
          case HOST_POPUP_REF:
            this.hostId = id;
            break;
          case PRINTER_POPUP_REF:
            this.printerId = id;
            break;
          case FOOD_OUT_DEPT_POPUP_REF:
            this.foodOutDeptId = id;
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
      },
      openVideoDialog () {
        this.$refs.videoTraining.isShow = true;
      }
    }
  };

</script>
<style lang="scss">
  .print-setting {
    .btn-primary {
      margin: 0 0 10px 15px;
    }

    .required-mark {
      color: red;
      margin-right: 4px;
    }

    .sub-title {
      color: #CCC;
    }

    .error-wrapper {
      margin-top: 5px;
      margin-bottom: 0;
      color: #ff4949;
    }

    .video-modal {
      .el-dialog {
        text-align: center;
        width: 900px;
      }
    }
  }
</style>
