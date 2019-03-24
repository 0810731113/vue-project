<template>
  <div class="business-orderSource">
    <el-button size="small" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
    <el-button size="small" class="btn-primary" :disabled="isMaintain" @click="onShowModal">顺序调整</el-button>
    <el-table :data="orderSourceList" border class="mw-table">
      <el-table-column prop="billSourceName" class-name="table-auto" align="center" label="订单来源名称" />
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status === SYSTEM_KEY ? '正常' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <div v-if="scope.row.dataKind !== SYSTEM_KEY">
            <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
            <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onClickDelete(scope.row)" />
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount" />
    <Sortable
      :sortList="sortList"
      :handleOK="onUpdateOrderSourceSort"
      :headerKey="['序号', '订单来源']"
      :sortKey="['billSourceId', 'billSourceName']"
      ref="sortable" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="() => this.deleteOrderSource(editId)"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Sortable, Popup, Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';
import { DEFAULT_PAGE } from 'constant/pagination';
import { SYSTEM_KEY } from 'constant/constants';

export default {
  name: 'orderSourceMain',
  components: {
    Sortable,
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      SYSTEM_KEY,
      sortList: [],
      selectedId: null,
      editId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllOrderSource({ pageIndex, pageSize });
  },
  computed: mapState({
    orderSourceList: state => state.business.orderSource.orderSourceList,
    recordCount: state => state.business.orderSource.recordCount,
    sourceList: state => state.business.orderSource.sortList,
    pageIndex: state => state.business.orderSource.pageIndex,
    pageSize: state => state.business.orderSource.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchAllOrderSource',
      'deleteOrderSource',
      'updateOrderSourceSort',
      'fetchSortOrderSource'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchAllOrderSource({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllOrderSource({ pageIndex, pageSize: this.pageSize });
    },
    getAutoReceiptText (row) {
      return row['autoReceipt'] ? '自动接单' : '手动接单';
    },
    onClickAdd () {
      this.$router.push('/myd/business/ordersource/add');
    },
    onClickEdit (row) {
      this.$router.push(`/myd/business/ordersource/edit/${row.billSourceId}`);
    },
    onClickDelete (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.billSourceId;
    },
    async onUpdateOrderSourceSort (items) {
      let sortItems = [];
      items.map((item, index) => {
        const { billSourceId } = item;
        sortItems.push({ billSourceId, sort: index });
      });
      await this.updateOrderSourceSort({ dtos: sortItems });
      await this.fetchAllOrderSource({ pageIndex: DEFAULT_PAGE, pageSize: this.pageSize });
    },
    async onShowModal () {
      await this.fetchSortOrderSource();
      this.sortList = this.sourceList.slice();
      this.$refs.sortable.isShow = true;
    }
  }
};
</script>

<style lang="scss">
.business-orderSource {
  padding: 15px;
}
</style>

