<template>
  <div class="table-setting">
    <!--餐桌类型设置-->
    <div class="title">
      <span class="required-mark">*</span><span>餐桌类型设置</span>
      <span class="sub-title">（设置餐桌的类型，用于区分。例如：大桌、小桌.）</span>
    </div>
    <table-type-main ref="tableTypeMain" :guidance="true" :showTableTypeModal="showModal" :tipVisibility="tipVisibility"></table-type-main>
    <Popup
      type="submit"
      :ref='TABLE_TYPE_POPUP_REF'
      :title="mtableClsId ? '编辑餐桌类型' : '新增餐桌类型'"
      okText="保存"
      :handleOk="() => onSubmit('tableType',TABLE_TYPE_POPUP_REF)"
      :handleClose="() => handleClose(TABLE_TYPE_POPUP_REF)"
      size="small"
      :errorMsg="errorMessage">
      <table-type ref="tableType" slot="content" :mTableClsId="mtableClsId" :guidance="true" v-if="dialogVisible"></table-type>
    </Popup>
    <!--餐桌区域-->
    <div class="title">
      <span class="required-mark">*</span><span>餐桌区域设置</span>
      <span class="sub-title">（设置餐桌的区域。例如：包厢、大厅.）</span>
    </div>
    <dining-area-main ref="diningAreaMain" :guidance="true" :showDiningAreaModal="showModal" :tipVisibility="tipVisibility"></dining-area-main>
    <Popup
      type="submit"
      :ref='DINING_AREA_POPUP_REF'
      :title="mareaId ? '编辑餐桌区域' : '新增餐桌区域'"
      okText="保存"
      :handleOk="() => onSubmit('diningArea', DINING_AREA_POPUP_REF)"
      :handleClose="() => handleClose(DINING_AREA_POPUP_REF)"
      size="small"
      :errorMsg="errorMessage">
      <dining-area ref="diningArea" slot="content" :mTableAreaId="mareaId" :guidance="true" v-if="dialogVisible"></dining-area>
    </Popup>
    <!--餐桌管理-->
    <div class="title">
      <span class="required-mark">*</span><span>餐桌管理</span>
    </div>
    <table-management-main ref="tableManagementMain" :guidance="true" :showTableManagementModal="showModal" :tipVisibility="tipVisibility"></table-management-main>
    <Popup
      type="submit"
      :ref='TABLE_MANAGEMENT_POPUP_REF'
      :title="mtableId ? '编辑餐桌' : '新增餐桌'"
      okText="保存"
      :handleOk="() => onSubmit('tableManagement',TABLE_MANAGEMENT_POPUP_REF)"
      :handleClose="() => handleClose(TABLE_MANAGEMENT_POPUP_REF)"
      size="small"
      :errorMsg="errorMessage">
      <table-management ref="tableManagement" slot="content" :mtableId="mtableId" :guidance="true" v-if="dialogVisible"></table-management>
    </Popup>
    <Popup
      type="submit"
      :ref="ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF"
      title="批量增加餐桌"
      okText="保存"
      :handleOk="() => onSubmit('addBatchTableManagement',ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF)"
      :handleClose="() => handleClose(ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF)"
      :errorMsg="errorMessage"
      size="small">
      <add-batch-table-management ref="addBatchTableManagement" slot="content" :mtableId="mtableId" :guidance="true" v-if="dialogVisible"></add-batch-table-management>
    </Popup>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import { Popup } from 'components';
  import { TableTypeMain, TableType } from '../Tables/TableType';
  import { DiningAreaMain, DiningArea } from '../Tables/DiningArea';
  import { TableManagementMain, TableManagement, AddBatchTableManagement } from '../Tables/TableManagement';
  import { TABLE_TYPE_POPUP_REF, DINING_AREA_POPUP_REF, TABLE_MANAGEMENT_POPUP_REF, ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF } from 'constant/constants';

  export default {
    name: 'tableSettings',
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
      DiningArea,
      DiningAreaMain,
      TableType,
      TableTypeMain,
      TableManagement,
      TableManagementMain,
      AddBatchTableManagement,
      Popup
    },
    data () {
      return {
        DINING_AREA_POPUP_REF,
        TABLE_TYPE_POPUP_REF,
        TABLE_MANAGEMENT_POPUP_REF,
        ADD_BATCH_TABLE_MANAGEMENT_POPUP_REF,
        errorMessage: '',
        dialogVisible: false,
        mtableClsId: '',
        mareaId: '',
        mtableId: ''
      };
    },
    computed: {
      ...mapState({
        tableTypeList: state => state.tables.tableType.tableTypeList,
        diningAreaList: state => state.tables.diningArea.diningAreaList,
        tableManagerPageList: state => state.tables.management.tableManagerPageList,
        errorMsg: state => state.error.errorMsg
      })
    },
    watch: {
      nextStepClick () {
        if (!this.tipVisibility) return;

        if (!this.diningAreaList || !this.diningAreaList.length) {
          this.$refs.diningAreaMain.$refs.addTable.$el.scrollIntoView();
        }

        if (!this.tableManagerPageList || !this.tableManagerPageList.length) {
          this.$refs.tableManagementMain.$refs.addTable.$el.scrollIntoView();
        }

        if (!this.tableTypeList || !this.tableTypeList.length) {
          this.$refs.tableTypeMain.$refs.addTable.$el.scrollIntoView();
        }
      }
    },
    methods: {
      showModal (popupRef, id) {
        switch (popupRef) {
          case DINING_AREA_POPUP_REF:
            this.mareaId = id;
            break;
          case TABLE_TYPE_POPUP_REF:
            this.mtableClsId = id;
            break;
          case TABLE_MANAGEMENT_POPUP_REF:
            this.mtableId = id;
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
  .table-setting {
    .base-modal {
      .form-container {
        .mw-form {
          width: 70%;
        }
      }

      .el-dialog__body {
        padding: 20px 10px 10px 20px;
      }
    }

    .title {
      margin-left: 13px;
    }

    .required-mark {
      color: red;
      margin-right: 4px;
    }

    .sub-title {
      color: #CCC;
    }
  }
</style>
