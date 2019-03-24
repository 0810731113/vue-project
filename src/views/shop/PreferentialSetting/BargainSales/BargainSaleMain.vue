<template>
  <div class="bargain-sale-main">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd" v-if="!isChain"> 新增</el-button>
    <el-table :data="bargainSaleList" border>
      <el-table-column prop="bargainName" class-name="table-auto" align="center" label="菜品特价方案名称" />
      <el-table-column prop="beginTime" align="center" label="开始时间" />
      <el-table-column prop="endTime" align="center" label="结束时间" />
      <el-table-column prop="status" :formatter="(item) => getStatusText(item, true)" align="center" label="状态" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onClickDelete(scope.row)" v-if="!isChain"/>
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
      :handleOk="onPopupDelete"
      ref="popup" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton } from 'components';
import { BARGAIN } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';
import { isShop, isChain } from 'utils/configUtil';

export default {
  name: 'bargainSaleMain',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      isShop: isShop(),
//      isChain: isChain(),
      isChain: false,
      isEditId: null,
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchBargainSaleList({ bargainCls: BARGAIN.BARGAINSALE, pageIndex, pageSize });
  },
  computed: mapState({
    bargainSaleList: state => state.preferential.bargainSale.bargainSaleList,
    recordCount: state => state.preferential.bargainSale.recordCount,
    pageIndex: state => state.preferential.bargainSale.pageIndex,
    pageSize: state => state.preferential.bargainSale.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchBargainSaleList',
      'deleteBargainSale'
    ]),
    onClickAdd () {
      this.$router.push({ path: '/myd/preferential/bargainSale/add' });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchBargainSaleList({ bargainCls: BARGAIN.BARGAINSALE, pageIndex, pageSize: this.pageSize });
    },
    onClickEdit (row) {
      this.$router.push(`/myd/preferential/bargainSale/edit/${row.bargainId}`);
    },
    onClickDelete (row) {
      this.isEditId = row.bargainId;
      this.$refs.popup.isShow = true;
    },
    async onPopupDelete () {
      const { pageIndex, pageSize, isEditId } = this;
      await this.deleteBargainSale({ bargainId: isEditId, bargainType: BARGAIN.BARGAINSALE });
      await this.fetchBargainSaleList({ bargainCls: BARGAIN.BARGAINSALE, pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
  .bargain-sale-main {
    padding: 15px;

    .btn-add {
      margin-bottom: 15px;
    }
  }
</style>
