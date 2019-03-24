<template>
  <div class="bill-upload-log-container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="统计方式" prop="printerCls">
        <el-select
          v-model="searchForm.accountId"
          placeholder="请选择"
          class="width-full">
          <el-option
            v-for="item in billStatisticsTypeList"
            :key="item.accountId"
            :label="item.accountName"
            :value="item.accountId"
            class="width-full"/>
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
          <el-date-picker
            v-model="searchForm.fsSellDate"
            placeholder="选择日期"
            :editable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.uploadStatus">
            <el-option
              v-for="item in BILL_UPLOAD_LOG_STATUS_LOG"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-search" @click="onSearchClick">搜索</el-button>
          <el-button class="btn-reset" @click="onResetClick">重置</el-button>
        </el-form-item>
      </el-form>
    <el-form :inline="true">
        <el-form-item label="账单金额总计：">
          {{billTotal}}
        </el-form-item>
        <el-form-item label="实收金额总计：">
          {{realTotal}}
        </el-form-item>
      </el-form>
    <el-table :data="billUploadLogList" border>
      <el-table-column prop="uploadTime" class-name="table-auto" align="center" label="上传时间" min-width="20%"/>
      <el-table-column prop="sellNo" class-name="table-auto" align="center" label="账单号" min-width="20%"/>
      <el-table-column prop="originalAmt" class-name="table-auto" align="center" label="账单金额" min-width="10%"/>
      <el-table-column prop="realAmt" class-name="table-auto" align="center" label="实收金额" min-width="10%"/>
      <el-table-column prop="uploadStatus" class-name="table-auto" align="center" label="上传结果" min-width="10%">
        <template slot-scope="scope">
          {{ BILL_UPLOAD_LOG_STATUS_LOG[scope.row.uploadStatus].name }}
        </template>
      </el-table-column>
      <el-table-column prop="uploadmsg" class-name="table-auto" align="center" label="失败结果" min-width="20%"/>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent">
    </Pagination>
  </div>
</template>
<script>
  import fecha from 'fecha';
  import { Pagination } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { BILL_UPLOAD_LOG_STATUS_LOG } from 'constant/constants';

  export default {
    components: { Pagination },
    name: 'BillUploadLog',
    data () {
      return {
        BILL_UPLOAD_LOG_STATUS_LOG,
        searchForm: {
          fsSellDate: new Date(),
          uploadStatus: BILL_UPLOAD_LOG_STATUS_LOG[0].id,
          accountId:null,
        }
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchBillStatisticsTypeList()
      var sList = this.billStatisticsTypeList
      //this.searchForm.accountId = sList && sList.length ? sList[0].accountId : null
      var that = this
      var id = null
      sList && sList.length ? sList.map((item,index) => {
        if(item.accountName == 'B'){
          id = item.accountId
        }
        }) : null
      if(!id){
        id = sList && sList.length ? sList[0].accountId : null
      }

      that.searchForm.accountId = id

      await this.refreshTableFromServer(pageSize, pageIndex,id);
      //var id = this.billStatisticsTypeList
      //this.searchForm.accountId = id && id.length ? id[0].accountId : null
    },
    computed: {
      ...mapState({
        billUploadLogList: state => state.bill.billUploadLog.billUploadLogList,
        recordCount: state => state.bill.billUploadLog.recordCount,
        pageIndex: state => state.bill.billUploadLog.pageIndex,
        pageSize: state => state.bill.billUploadLog.pageSize,
        billTotal: state => state.bill.billUploadLog.billTotal,
        realTotal: state => state.bill.billUploadLog.realTotal,
        billStatisticsTypeList: state => state.bill.billUploadLog.billStatisticsTypeList,
      })
    },
    methods: {
      ...mapActions([
        'fetchBillUploadLogList',
        'fetchBillStatisticsTypeList',
        'fetchBillStatisticsIncome',
      ]),
      async onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        await this.refreshTableFromServer(pageSize, pageIndex);
      },
      async onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        await this.refreshTableFromServer(pageSize, pageIndex);
      },
      async onSearchClick () {
        const { pageIndex, pageSize } = this;
        await this.refreshTableFromServer(pageSize, pageIndex);
      },
      onResetClick () {
        this.searchForm = {
          fsSellDate: new Date(),
          uploadStatus: BILL_UPLOAD_LOG_STATUS_LOG[0].id
        };
      },
      async refreshTableFromServer (pageSize, pageIndex,aId) {
        const { uploadStatus,accountId } = this.searchForm;
        var params = {
          billUploadLogVO:{
            sellDate:fecha.format(this.searchForm.fsSellDate, 'YYYY-MM-DD'),
            accountBookId:aId || accountId, //账单id
            pageNum:pageIndex || 1,
            pageSize:pageSize || 10,
            uploadStatus: uploadStatus,
          }
        }
        //const fsSellDate = fecha.format(this.searchForm.fsSellDate, 'YYYY-MM-DD');
        //await this.fetchBillUploadLogList({ pageSize, pageIndex, uploadStatus, fsSellDate });
        await this.fetchBillUploadLogList(params);
        var paramsA = {
          billUploadLogVO:{
            sellDate:fecha.format(this.searchForm.fsSellDate, 'YYYY-MM-DD'),
            accountBookId:aId || accountId, //账单id
            pageNum:pageIndex || 1,
            pageSize:pageSize || 10,
            uploadStatus: uploadStatus,
          }
        }
        await this.fetchBillStatisticsIncome(paramsA)
      }
    }
  };
</script>
<style lang="scss">
  .bill-upload-log-container {
    padding: 15px;
  }
</style>
