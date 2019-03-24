<template>
  <div class="upgrade-main">
    <div class="opertion-wrap">
      <el-button class="btn-add" @click="onClickAdd" icon="el-icon-plus">添加版本</el-button>
      <el-input class="search-input" placeholder="软件类型、版本号、更新内容" v-model="searchText">
        <el-button slot="append" @click="onClickSearch" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <el-table border :data="list">
      <el-table-column align="center" label="软件类型" prop="softName" />
      <el-table-column align="center" label="版本号" prop="version" />
      <el-table-column align="center" label="升级方式" prop="updateType">
        <template slot-scope="scope">
          {{ getUpgradeType(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新内容" prop="upContent" />
      <el-table-column align="center" label="发布渠道" prop="publishChannel">
        <template slot-scope="scope">
          {{ getChannel(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="升级文件" prop="fileName">
        <template slot-scope="scope">
          <a target="_blank" :href="scope.row.fileUrl">{{ scope.row.fileName }}</a>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          {{ scope.row.status === OK ? '已发布' : '待发布' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" prop="updateTime" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-upgrade" content="推送" v-show="scope.row.status !== OK" :disabled="isMaintain" @click="onClickPush(scope.row)" />
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
import { UPGRADE_TYPE, PUBLISH_CHANNEL } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'UpgradeMain',
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
    const { pageIndex, pageSize } = this;
    await this.fetchUpgradeList({ pageIndex, pageSize });
  },
  computed: mapState({
    list: state => state.release.upgrade.list,
    recordCount: state => state.release.upgrade.recordCount,
    pageIndex: state => state.release.upgrade.pageIndex,
    pageSize: state => state.release.upgrade.pageSize,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'deleteUpgrade',
      'fetchUpgradeDetail',
      'fetchUpgradeList',
      'pushUpgradeVersion',
      'saveUpgrade'
    ]),
    onClickAdd () {
      this.$router.push('/myd/release/upgrade/add');
    },
    onClickEdit (row) {
      const { id, softId, version } = row;
      this.$router.push(`/myd/release/upgrade/edit/${id}/${softId}?version=${version}`);
    },
    onShowPopup (row) {
      this.editItem = row;
      this.$refs.popup.isShow = true;
    },
    async onClickDelete () {
      const { id, softId, version } = this.editItem;
      await this.deleteUpgrade({ id, softId, version });
      if (!this.errorStatus) this.$toast.show({ content: '删除成功' });
      await this.onClickSearch();
    },
    async onClickPush (row) {
      const { id, softId, version } = row;
      await this.pushUpgradeVersion({ id, softId, version });
      if (!this.errorStatus) this.$toast.show({ content: '推送成功' });
      await this.onClickSearch();
    },
    async onClickSearch () {
      const { pageSize, pageIndex, searchText } = this;
      await this.fetchUpgradeList({ pageSize, pageIndex, searchText });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchUpgradeList({ pageIndex, pageSize: this.pageSize });
    },
    getUpgradeType (row) {
      return UPGRADE_TYPE.find(item => item.value === +row.updateType).name;
    },
    getChannel (row) {
      return PUBLISH_CHANNEL.find(item => item.value === +row.publishChannel).name;
    }
  }
};
</script>

<style lang="scss">
.upgrade-main {
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
