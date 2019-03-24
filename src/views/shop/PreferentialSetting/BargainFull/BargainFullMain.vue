<template>
  <div class="bargain-full">
    <el-button size="small" type="primary" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd" v-if="!isChain">新增</el-button>
    <el-table :data="bargainFullList" border>
      <el-table-column prop="bargainName" class-name="table-auto" align="center" label="金额满减方案名称" />
      <el-table-column prop="beginTime" align="center" label="开始时间" />
      <el-table-column prop="endTime" align="center" label="结束时间" />
      <el-table-column prop="menuCount" align="center" label="菜品数量" />
      <el-table-column prop="status" :formatter="(item) => getStatusText(item, true)" align="center" label="状态" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-link" content="关联菜品" :disabled="isMaintain" @click="onShowRelationModalClick(scope.row)" />
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
    <relation-modal-lite
      ref="relationModalLite"
      :treeData="menuClsList"
      :fetchMenuList="fetchMenuList"
      :onSubmitItems="onSubmitItems"
      :linkedMenus="linkedMenus"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { RelationModalLite } from 'views/common';
  import { BARGAIN } from 'constant/constants';
  import { Popup, Pagination, MwButton } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { isChain } from 'utils/configUtil';

  export default {
    name: 'bargainFullMain',
    components: {
      Popup,
      MwButton,
      Pagination,
      RelationModalLite
    },
    data () {
      return {
//        isChain: isChain(),
        isChain: false,
        isEditId: null,
        bargainId: null,
        isMaintain: !checkMaintainRight(this)
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchBargainFullList({ bargainCls: BARGAIN.BARGAINFULL, pageIndex, pageSize });
    },
    computed: mapState({
      bargainFullList: state => state.preferential.bargainFull.bargainFullList,
      recordCount: state => state.preferential.bargainFull.recordCount,
      pageIndex: state => state.preferential.bargainFull.pageIndex,
      pageSize: state => state.preferential.bargainFull.pageSize,
      linkedMenus: state => state.preferential.bargainFull.linkedMenus,
      menuClsList: state => state.common.menuRelation.menuClsList,
      errorStatus: state => state.error.errorStatus
    }),
    methods: {
      ...mapActions([
        'fetchBargainFullList',
        'deleteBargainFull',
        'fetchMenuClassifyList',
        'fetchMenuList',
        'fetchBargainFullLinkedMenus',
        'updateBargainFullLinkedMenus'
      ]),
      onClickAdd () {
        this.$router.push({ path: '/myd/preferential/bargainFull/add' });
      },
      async onChangeCurrent (pageIndex) {
        await this.fetchBargainFullList({ bargainCls: BARGAIN.BARGAINFULL, pageIndex, pageSize: this.pageSize });
      },
      async onClickEdit (row) {
        this.$router.push(`/myd/preferential/bargainFull/edit/${row.bargainId}`);
      },
      async onClickDelete (row) {
        this.isEditId = row.bargainId;
        this.$refs.popup.isShow = true;
      },
      async onPopupDelete () {
        const { pageIndex, pageSize, isEditId } = this;
        await this.deleteBargainFull({ bargainId: isEditId, bargainType: BARGAIN.BARGAINFULL });
        if (!this.errorStatus) {
          this.$toast.show({ content: '删除成功' });
        }
        await this.fetchBargainFullList({ bargainCls: BARGAIN.BARGAINFULL, pageIndex, pageSize });
      },
      async onShowRelationModalClick (row) {
        await this.fetchMenuClassifyList({ fiMenuClsKind: 5 });
        this.bargainId = row.bargainId;
        await this.fetchBargainFullLinkedMenus({ bargainId: row.bargainId });
        this.$refs.relationModalLite.isShow = true;
      },
      async onSubmitItems (data) {
        await this.updateBargainFullLinkedMenus({
          bargainId: this.bargainId,
          bargainFullItems: (data || []).map(item => {
            return { itemCd: item.itemCd, orderUintCd: item.orderUintCd };
          })
        });
        if (!this.errorStatus) {
          this.$refs.relationModalLite.isShow = false;
          this.$toast.show({ content: '关联菜品成功' });
          await this.fetchBargainFullList({ bargainCls: BARGAIN.BARGAINFULL, pageIndex: this.pageIndex, pageSize: this.pageSize });
        }
      }
    }
  };
</script>

<style lang="scss">
  .bargain-full {
    padding: 15px;

    .btn-add {
      margin-bottom: 10px;
    }
  }
</style>
