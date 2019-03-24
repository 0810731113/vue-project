<template>
  <div class="base-main-list">
    <el-button size="small" class="btn-primary" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <slot name="sort-button"></slot>
    <el-table :data="list" border class="setting-table">
      <el-table-column prop="word" align="center" label="内容" min-width="35%">
      </el-table-column>
      <el-table-column prop="updateUserName" align="center" label="最后修改人" min-width="20%">
      </el-table-column>
      <el-table-column prop="updateTime" align="center" label="最后修改时间" min-width="20%">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="25%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount">
    </pagination>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="() => this.onClickDelete(selectedItem.id)"
      ref="popup"
    >
    </popup>
    <slot name="sortable"></slot>
  </div>
</template>

<script>
import { Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'BaseMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  props: {
    onClickDelete: {
      type: Function,
      default: () => {}
    },
    onChangeSize: {
      type: Function,
      default: () => {}
    },
    onChangeCurrent: {
      type: Function,
      default: () => {}
    },
    list: {
      type: Array,
      default: []
    },
    pageSize: {
      type: Number,
      default: 1
    },
    pageIndex: {
      type: Number,
      default: 1
    },
    recordCount: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectedItem: null,
      isMaintain: !checkMaintainRight(this)
    };
  },
  methods: {
    onClickAdd () {
      this.$router.push(`/myd/businesssetting/${this.type}/add`);
    },
    onClickEdit (item) {
      this.$router.push(`/myd/businesssetting/${this.type}/edit/${item.id}`);
    },
    onShowPopup (item) {
      this.$refs.popup.isShow = true;
      this.selectedItem = item;
    }
  }
};
</script>

<style lang="scss">
.base-main-list {
  padding: 15px;

  .setting-table {
    margin-top: 20px;
  }
}
</style>
