<template>
  <div class="notices-main">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd" v-if="isShowAdd">新增</el-button>
    <el-table :data="noticesList" border class="mw-table">
      <el-table-column prop="title" class-name="table-auto" align="center" label="公告标题" :min-width="isSystem ? '30%' : '35%'" />
      <el-table-column prop="crateTime" align="center" label="创建时间" :min-width="isSystem ? '15%' : '25%'" />
      <el-table-column align="center" label="公告时间" min-width="25%" v-if="isSystem">
        <template slot-scope="scope">
          {{ scope.row.starDate }}-{{ scope.row.endDate }}
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态" :min-width="isSystem ? '10%' : '15%'">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" :min-width="isSystem ? '20%' : '25%'">
        <template slot-scope="scope">
          <div>
            <mw-button content="编辑" class="btn-edit" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
            <mw-button content="查看" class="btn-preview" @click="onClickReview(scope.row)" />
            <mw-button content="删除" class="btn-delete" :disabled="isMaintain" @click="onClickDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeCurrent="onChangeCurrent" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onPopupDelete"
      ref="popup" />
    <notices-modal ref="noticesModal" :detail="noticesDetail" />
  </div>
</template>

<script>
import { OK } from 'constant/statusCode';
import { Popup, Pagination, MwButton } from 'components';
import { NoticesModal } from 'views/common/components';
import { NOTICES_TYPE } from 'constant/constants';

export default {
  name: 'noticesMain',
  props: [
    'isMaintain',
    'getNoticesDetail',
    'fetchNoticesList',
    'deleteNoticesById',
    'noticesDetail',
    'noticesList',
    'recordCount',
    'pageIndex',
    'pageSize',
    'isSystem'
  ],
  components: {
    NoticesModal,
    Pagination,
    MwButton,
    Popup
  },
  data () {
    return {
      OK,
      editId: '',
      type: '',
      isShowAdd: ''
    };
  },
  async created () {
    this.type = this.isSystem ? NOTICES_TYPE[1].id : NOTICES_TYPE[0].id;
    const { pageIndex, pageSize, type, isSystem } = this;
    await this.fetchNoticesList({ pageIndex, pageSize, type });
    this.isShowAdd = !isSystem || !this.noticesList.length;
  },
  methods: {
    async onChangeCurrent (pageIndex) {
      const { type, pageSize } = this;
      await this.fetchNoticesList({ pageIndex, pageSize, type });
    },
    onClickAdd () {
      this.$router.push({ path: '/myd/announcement/notices/add' });
    },
    onClickEdit (row) {
      this.$router.push(`/myd/announcement/notices/edit/${row.id}`);
    },
    async onClickReview (row) {
      await this.getNoticesDetail(row.id);
      this.$refs.noticesModal.isShow = true;
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.id;
    },
    async onPopupDelete () {
      const { pageIndex, pageSize, type, editId, isSystem } = this;
      await this.deleteNoticesById(editId);
      await this.fetchNoticesList({ pageIndex, pageSize, type });
      this.isShowAdd = !isSystem || !this.noticesList.length;
    }
  }
};
</script>

<style lang="scss">
  .notices-main {
    padding: 15px;
  }
</style>
