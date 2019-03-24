<template>
  <div class="feedback-info-container">
    <el-table :data="feedbackInfoList" border @sort-change="onSortChangeClick">
      <el-table-column prop="feedbackId" align="center" label="序号" min-width="15%"/>
      <el-table-column prop="createTime" align="center" label="提交时间" min-width="20%" sortable="custom">
      </el-table-column>
      <el-table-column prop="feedbackType" align="center" label="类型" min-width="15%">
        <template slot-scope="scope">
         {{FEEDBACK_INFO_TYPE[scope.row.feedbackType].name}}
        </template>
      </el-table-column>
      <el-table-column prop="theme" align="center" label="主题" min-width="15%">
      </el-table-column>
      <el-table-column prop="content" align="center" label="建议内容" min-width="20%">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="15%">
        <template slot-scope="scope">
          <el-button class="btn-primary" @click="onShowDetailModalClick(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent= "onChangeCurrent"
    />
    <popup
      type="submit"
      title="反馈建议详情"
      ref="feedbackInfoModal">
      <div slot="content">
        <h3 class="title">{{feedbackInfoItem.shopName}}</h3>
        <el-form label-width="100px">
          <el-form-item label="主题">{{feedbackInfoItem.shopName}}</el-form-item>
          <el-form-item label="联系人">{{feedbackInfoItem.contact}}</el-form-item>
          <el-form-item label="联系电话">{{feedbackInfoItem.cellphonect}}</el-form-item>
          <el-form-item label="联系邮箱">{{feedbackInfoItem.email}}</el-form-item>
          <el-form-item label="建议内容">
            <template>
              <div class="content">{{feedbackInfoItem.content}}</div>
            </template>
          </el-form-item>
        </el-form>
      </div>
    </popup>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup } from 'components';
  import { ASCENDING, DESCENDING, FEEDBACK_INFO_TYPE } from 'constant/constants';

  export default {
    name: 'FeedbackInfo',
    components: { Pagination, Popup },
    data () {
      return {
        ASCENDING,
        DESCENDING,
        FEEDBACK_INFO_TYPE,
        orderName: ASCENDING
      };
    },
    async created () {
      const { pageIndex, pageSize, orderName } = this;
      await this.fetchFeedbackInfoList({ pageIndex, pageSize, orderName });
    },
    computed: {
      ...mapState({
        feedbackInfoList: state => state.feedbackInfoManagement.feedbackInfo.feedbackInfoList,
        recordCount: state => state.feedbackInfoManagement.feedbackInfo.recordCount,
        pageIndex: state => state.feedbackInfoManagement.feedbackInfo.pageIndex,
        pageSize: state => state.feedbackInfoManagement.feedbackInfo.pageSize,
        feedbackInfoItem: state => state.feedbackInfoManagement.feedbackInfo.feedbackInfoItem
      })
    },
    methods: {
      ...mapActions([
        'fetchFeedbackInfoList',
        'fetchFeedbackInfoItem'
      ]),
      async onPageSizeChange (pageSize) {
        const { pageIndex, orderName } = this;
        await this.fetchFeedbackInfoList({ pageIndex, pageSize, orderName });
      },
      async onChangeCurrent (pageIndex) {
        const { pageSize, orderName } = this;
        await this.fetchFeedbackInfoList({ pageIndex, pageSize, orderName });
      },
      async onSortChangeClick (value) {
        const { pageIndex, pageSize } = this;
        await this.fetchFeedbackInfoList({
          pageIndex,
          pageSize,
          orderName: value.order === 'ascending' ? ASCENDING : DESCENDING
        });
      },
      async onShowDetailModalClick (row) {
        const { feedbackId } = row;
        await this.fetchFeedbackInfoItem({ feedbackId });

        this.$refs.feedbackInfoModal.isShow = true;
      }
    }
  };
</script>
<style lang="scss">
  .feedback-info-container {
    padding: 20px;

    .btn-primary {
      height: 26px;
      width: 50px;
    }

    .title {
      text-align: center;
    }

    .content {
      max-height: 200px;
      overflow: auto;
    }
  }
</style>
