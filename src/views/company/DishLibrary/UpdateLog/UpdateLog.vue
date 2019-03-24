<template>
  <div class="update-log-container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="内容">
        <el-select v-model="searchForm.fsContent">
          <el-option
            v-for="item in UPDATE_LOG_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="searchForm.fiType">
          <el-option
            v-for="item in UPDATE_TIME_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.fiStatus">
          <el-option
            v-for="item in UPDATE_LOG_STATUS"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-search" @click="onSearchClick">搜索</el-button>
        <el-button class="btn-reset" @click="onResetClick">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="division-line"></div>
    <div>
      <el-table :data="updateLogList" ref="multipleTable" border>
        <el-table-column prop="fsCreateTime" align="center" label="操作时间" min-width="20%"/>
        <el-table-column prop="fsContent" align="center" label="内容" min-width="10%">
          <template slot-scope="scope">
            {{UPDATE_LOG_TYPE[scope.row.fsContent].name}}
          </template>
        </el-table-column>
        <el-table-column prop="fiType" align="center" label="类型" min-width="10%">
          <template slot-scope="scope">
            {{ UPDATE_TIME_TYPE[scope.row.fiType].name}}
          </template>
        </el-table-column>
        <el-table-column prop="shopNumber" align="center" label="更新门店数" min-width="10%"/>
        <el-table-column align="center" label="状态" class-name="table-auto" min-width="20%">
          <template slot-scope="scope">
            {{ UPDATE_LOG_STATUS[scope.row.fiStatus].name}}
          </template>
        </el-table-column>
        <el-table-column prop="fsJobTime" align="center" label="更新日期" min-width="20%"/>
        <el-table-column  align="center" label="操作" min-width="10%" class="table-operation">
          <template slot-scope="scope">
            <mw-button class="btn-preview" content="查看" @click="onShowDetail(scope.row)" v-if="+scope.row.fsContent === 1" />
            <mw-button class="btn-delete" content="取消" @click="onDeleteConfirm(scope.row)" v-if="+scope.row.fiStatus === TO_BE_UPDATED"/>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :totalCount="recordCount"
        :currentPage="pageIndex"
        :pageSize="pageSize"
        :onChangeSize="onPageSizeChange"
        :onChangeCurrent="onChangeCurrent">
      </Pagination>
      <update-log-detail ref="updateLogDetail" :guid="fsGuid"></update-log-detail>
      <popup
        title="取消操作"
        tips="确定'取消'该次更新?"
        :handleOk="onCancelTimedUpdate"
        ref="deleteConfirm" />
    </div>
  </div>
</template>
<script>
  import { Pagination, MwButton, Popup } from 'components';
  import UpdateLogDetail from './UpdateLogDetails';
  import { mapActions, mapState } from 'vuex';
  import { UPDATE_LOG_TYPE, UPDATE_LOG_STATUS, UPDATE_TIME_TYPE, TO_BE_UPDATED } from 'constant/constants';

  export default {
    name: 'UpdateLog',
    components: { Pagination, MwButton, UpdateLogDetail, Popup },
    data () {
      return {
        UPDATE_LOG_TYPE,
        UPDATE_LOG_STATUS,
        UPDATE_TIME_TYPE,
        TO_BE_UPDATED,
        searchForm: {
          fiType: null,
          fsContent: null,
          fiStatus: null,
          updateType: null
        },
        fiType: null,
        fiStatus: null,
        fsGuid: null
      };
    },
    async  created () {
      const { pageSize, pageIndex } = this;
      await this.refreshTableFromServer(pageSize, pageIndex);
    },
    computed: {
      ...mapState({
        updateLogList: state => state.dishLibrary.updateLog.updateLogList,
        recordCount: state => state.dishLibrary.updateLog.recordCount,
        pageIndex: state => state.dishLibrary.updateLog.pageIndex,
        pageSize: state => state.dishLibrary.updateLog.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchUpdateLogList',
        'cancelTimedUpdate'
      ]),
      onShowDetail (data) {
        this.fsGuid = data.fsGuid;
        this.$refs.updateLogDetail.isShow = true;
      },
      async onPageSizeChange (pageSize) {
        await this.refreshTableFromServer(pageSize, this.pageIndex);
      },
      async onChangeCurrent (pageIndex) {
        await this.refreshTableFromServer(this.pageSize, pageIndex);
      },
      async onSearchClick () {
        this.fiType = this.searchForm.fiType;
        this.fiStatus = this.searchForm.fiStatus;
        this.fsContent = this.searchForm.fsContent;
        await this.refreshTableFromServer(this.pageSize, this.pageIndex);
      },
      onResetClick () {
        this.fiType = this.searchForm.fiType = null;
        this.fiStatus = this.searchForm.fiStatus = null;
      },
      onDeleteConfirm (row) {
        this.fsGuid = row.fsGuid;
        this.$refs.deleteConfirm.isShow = true;
      },
      async onCancelTimedUpdate () {
        const { fsGuid } = this;
        await this.cancelTimedUpdate({ fsGuid });
        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          await this.refreshTableFromServer(this.pageSize, this.pageIndex);
        }
      },
      async refreshTableFromServer (pageSize, pageIndex) {
        const { fiType, fiStatus, fsContent } = this;
        await this.fetchUpdateLogList({ pageSize, pageIndex, fiType, fiStatus, fsContent });
      }
    }
  };
</script>
<style lang="scss">
  .update-log-container {
    padding: 20px;

    .cancel-update-button {
      height: 30px;
      width: 60px;
    }

    .cell {
      align-items: center;
    }
  }
</style>
