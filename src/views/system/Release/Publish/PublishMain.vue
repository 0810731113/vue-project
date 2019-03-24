<template>
  <div class="release-main">
    <div class="opertion-wrap">
      <el-button class="btn-add" @click="onClickAdd" icon="el-icon-plus">新增发布</el-button>
      <el-input class="search-input" placeholder="软件类型、版本号、更新内容" v-model="searchText">
        <el-button slot="append" @click="onClickSearch">搜索</el-button>
      </el-input>
    </div>

    <el-table border :data="list">
      <el-table-column label="软件类型" prop="softName" align="center" min-width="10%" />
      <el-table-column label="版本号" prop="version" align="center" min-width="10%" />
      <el-table-column label="更新内容" prop="upContent" align="center" />
      <el-table-column label="升级文件" prop="status" align="center" min-width="10%">
        <template slot-scope="scope">
          <a target="blank" :href="scope.row.fileUrl">{{ scope.row.fileName }}</a>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime" align="center" min-width="10%" />
      <el-table-column label="操作" align="center" min-width="10%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { OK } from 'constant/statusCode';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'SoftwareTypeMain',
  components: {
    Popup,
    Pagination,
    MwButton
  },
  data () {
    return {
      OK,
      searchText: '',
      editItem: {},
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageSize, pageIndex } = this;
    await this.fetchPublishList({ pageSize, pageIndex });
  },
  computed: mapState({
    list: state => state.release.publish.list,
    recordCount: state => state.release.publish.recordCount,
    pageIndex: state => state.release.publish.pageIndex,
    pageSize: state => state.release.publish.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchPublishList',
      'deletePublish'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchPublishList({ pageIndex, pageSize: this.pageSize });
    },
    async onClickDelete () {
      const { id, name } = this.editItem;
      await this.deletePublish({ id, name });
      await this.onClickSearch();
    },
    async onClickSearch () {
      const { pageSize, pageIndex, searchText } = this;
      await this.fetchPublishList({ pageSize, pageIndex, searchText });
    },
    onShowPopup (row) {
      this.editItem = row;
      this.$refs.popup.isShow = true;
    },
    onClickAdd () {
      this.$router.push('/myd/release/publish/add');
    },
    onClickEdit (row) {
      const { id, softId, version } = row;
      this.$router.push(`/myd/release/publish/edit/${id}/${softId}?version=${version}`);
    }
  }
};
</script>

<style lang="scss">
.release-main {
  padding: 15px;

  .opertion-wrap {
    margin-bottom: 10px;

    .search-input {
      width: 360px;
      float: right;
    }
  }
}
</style>
