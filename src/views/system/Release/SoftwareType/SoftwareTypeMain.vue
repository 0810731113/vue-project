<template>
  <div class="software-type-main">
    <div class="opertion-wrap">
      <el-button class="btn-add" @click="onClickAdd" icon="el-icon-plus">新增类型</el-button>
      <el-input class="search-input" placeholder="请输入名称" v-model="searchText">
        <el-button slot="append" @click="onClickSearch">搜索</el-button>
      </el-input>
    </div>

    <el-table border :data="list">
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ +scope.row.status === OK ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center" />
      <el-table-column label="操作" align="center">
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
    await this.fetchSoftwareList({ pageSize, pageIndex });
  },
  computed: mapState({
    list: state => state.release.software.list,
    recordCount: state => state.release.software.recordCount,
    pageIndex: state => state.release.software.pageIndex,
    pageSize: state => state.release.software.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchSoftwareList',
      'deleteSoftware'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchSoftwareList({ pageIndex, pageSize: this.pageSize });
    },
    async onClickDelete () {
      const { id, name } = this.editItem;
      await this.deleteSoftware({ id, name });
      await this.onClickSearch();
    },
    async onClickSearch () {
      const { pageSize, pageIndex, searchText } = this;
      await this.fetchSoftwareList({ pageSize, pageIndex, searchText });
    },
    onShowPopup (row) {
      this.editItem = row;
      this.$refs.popup.isShow = true;
    },
    onClickAdd () {
      this.$router.push('/myd/release/software/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/release/software/edit/${row.id}`);
    }
  }
};
</script>

<style lang="scss">
.software-type-main {
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
