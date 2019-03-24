<template>
  <div class="buy-gift-list">
    <el-button size="small" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="goRoute" v-if="!isChain">新增</el-button>
    <el-table border :data="list">
      <el-table-column prop="bargainName" class-name="table-auto" label="菜品买减方案名称" align="center" />
      <el-table-column prop="beginTime" label="开始时间" align="center" />
      <el-table-column prop="endTime" label="结束日期" align="center" />
      <el-table-column prop="status" :formatter="(item) => getStatusText(item, true)" label="状态" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="goRoute(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" v-if="!isChain"/>
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
import { BARGAIN } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';
import { isChain } from 'utils/configUtil';

export default {
  name: 'buyGift',
  components: {
    Popup,
    MwButton,
    Pagination
  },
  data () {
    return {
      isMaintain: !checkMaintainRight(this),
//      isChain: isChain(),
      isChain: false,
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchBuyGiftList({ pageIndex, pageSize, bargainCls: BARGAIN.BUYGIFT });
  },
  computed: mapState({
    list: state => state.preferential.buyGift.list,
    recordCount: state => state.preferential.buyGift.recordCount,
    pageIndex: state => state.preferential.buyGift.pageIndex,
    pageSize: state => state.preferential.buyGift.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchBuyGiftList',
      'deleteBuyGift'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchBuyGiftList({ pageIndex, pageSize: this.pageSize, bargainCls: BARGAIN.BUYGIFT });
    },
    async onClickDelete () {
      const { bargainId } = this.selectedItem;
      const { pageIndex, pageSize } = this;
      await this.deleteBuyGift({ bargainId, bargainType: BARGAIN.BUYGIFT });
      await this.fetchBuyGiftList({ pageIndex, pageSize, bargainCls: BARGAIN.BUYGIFT });
    },
    onShowPopup (item) {
      this.$refs.popup.isShow = true;
      this.selectedItem = item;
    },
    goRoute (item) {
      if (item.bargainId) {
        this.$router.push(`/myd/preferential/buygift/edit/${item.bargainId}`);
        return;
      }
      this.$router.push('/myd/preferential/buygift/add');
    }
  }
};
</script>

<style lang="scss">
.buy-gift-list {
  padding: 15px;

  .btn-add {
    margin-bottom: 15px;
  }
}
</style>
