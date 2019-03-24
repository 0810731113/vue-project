<template>
  <div class="upload-bill-main">
    <el-form :inline="true" :model="searchForm" class="search-bar">
      <el-form-item label="">
        <el-date-picker
          v-model="searchForm.date"
          placeholder="选择日期"
          :editable="false">
        </el-date-picker>
      </el-form-item>
      <div style="line-height: 40px; display: inline-block">
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </div>
    </el-form>
    <div class="division-line"></div>
    <el-row class="operation-button">
      <el-button class="btn-primary" :disabled="isMaintain" @click="onUploadBill">上传账单</el-button>
    </el-row>
    <el-table ref="billTable" :data="billistupload.dtoList" border @selection-change="handleSelectionChange" @row-click="handleRowClick">
      <el-table-column type="selection" min-width="50px" :selectable="onCheckDefalut" />
      <el-table-column prop="sellNo" align="center" label="账单号"/>
      <el-table-column prop="realAmt" align="center" label="实收金额" />
      <el-table-column prop="createUserName" align="center" label="收银员"/>
      <el-table-column prop="uploadStatus" align="center" label="账单状态">
        <template slot-scope="scope">
          {{ getUploadStatus(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column prop="uploadMsg" align="center" :formatter="formatEmptyText" label="上传结果" />
      <el-table-column prop="uploadTime" align="center" :formatter="formatEmptyText" label="上传时间" />
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="billistupload.pageIndex"
      :pageSize="billistupload.pageSize"
      :totalCount="billistupload.recordCount"
      layout="slot, ->, prev, pager, next, sizes"
    >
    </pagination>
    <toast
      ref='toast'
      content="请选择要上传的账单!"
      :timeout="2000"
      type="warning">
    </toast>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup, Toast } from 'components';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import fecha from 'fecha';

  export default{
    name: 'UploadBill',
    components: {
      Pagination,
      Popup,
      Toast
    },
    data () {
      return {
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        INPUT_MAX_LENGTH,
        searchForm: {
          date: new Date()
        },
        pageNum: 1,
        pageSize:10,
        multipleSelection: [],
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      await this.fetchBillListUpload(this.getFormParams());
    },
    computed: {
      ...mapState({
        errorStatus: state => state.error.errorStatus,
        billistupload: state => state.bill.billistupload,
        error: state => state.error
      })
    },
    methods: {
      ...mapActions([
        'fetchBillListUpload',
        'fetchBillListUploadBatch'
      ]),
      async onClickSearch () {
        await this.fetchBillListUpload(this.getFormParams());
      },
      onClickReset () {
        this.searchForm = {
          date: new Date()
        };
      },
      async onChangeSize (pageSize) {
        this.pageSize = pageSize
        const postParameter = this.getFormParams();
        await this.fetchBillListUpload({ ...postParameter, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        this.pageNum = pageIndex
        const postParameter = this.getFormParams();
        await this.fetchBillListUpload({ ...postParameter, pageIndex });
      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },
      getUploadStatus (item) {
        switch (item.uploadStatus) {
          case 0:
            return '未上传';
          case 1:
            return '上传成功';
          case 2:
            return '上传失败';
          case 3:
            return '上传中';
          default:
            return '未知';
        }
      },
      getFormParams () {
        const { id } = this.$route.params;
        const { date } = this.searchForm;
        const fsSellDate = fecha.format(date || new Date(), 'YYYY-MM-DD');
        var params = {
          billInfoListVO:{
            "sellDate":fsSellDate, //上传日期
            "accountBookId":id, //账单id
            "pageNum":this.pageNum,
            "pageSize":this.pageSize

          }
        }
        return params;
      },
      handleRowClick (row, event, column) {
        this.$refs.billTable.toggleRowSelection(row);
      },
      onCheckDefalut (row) {
        return /^[02]$/.test(row.uploadStatus);
      },
      async onUploadBill () {
        if (!this.multipleSelection.length) {
          this.$refs.toast.isShow = true;
          return;
        }
        let sellNos = [];
        this.multipleSelection.map(x => {
          sellNos.push(x.sellNo);
        });
        const {accountBookId = '',accountBookName = ''} = this.$route.query
        const sellDate = fecha.format(this.searchForm.date || new Date(), 'YYYY-MM-DD');
        //await this.fetchBillListUploadBatch({ sellNos, accountBookId, sellDate, accountBookName });
        await this.fetchBillListUploadBatch({ sellNos, accountBookId, sellDate, accountBookName });
        if (!this.error.errorStatus) {
          this.$toast.show({ content: '操作成功' });
        } else {
          this.$toast.show({ content: '账单上传失败' });
        }
        await this.fetchBillListUpload(this.getFormParams());
      }
    }
  };
</script>

<style lang="scss">
  .upload-bill-main {
    padding: 15px;

    .search-bar {
      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .operation-button {
      padding: 10px 0;
    }
  }
</style>
