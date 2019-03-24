<template>
  <div class="gated-launch-main">
    <el-button size="small" class="btn-add" icon="el-icon-plus" @click="onShowModal('chooseShopModal')">新增</el-button>
    <el-table :data="list" border class="mw-table">
      <el-table-column prop="shopGUID" align="center" label="门店ID" min-width="10%">
      </el-table-column>
      <el-table-column prop="shopName" align="center" label="门店名称" min-width="20%">
      </el-table-column>
      <el-table-column prop="provinceName" align="center" label="省" min-width="10%">
      </el-table-column>
      <el-table-column prop="cityName" align="center" label="市" min-width="10%">
      </el-table-column>
      <el-table-column prop="districtName" align="center" label="区" min-width="10%">
      </el-table-column>
      <el-table-column prop="foodTradeId" align="center" label="餐饮业态" min-width="10%">
        <template slot-scope="scope">
          {{ getTradeType(scope.row.foodTradeId) }}
        </template>
      </el-table-column>
      <el-table-column prop="clientType" align="center" label="终端类型" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.clientType === 1 ? 'windows' : 'android' }}
        </template>
      </el-table-column>
      <el-table-column prop="softVersion" align="center" label="版本号" min-width="10%">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%">
        <template slot-scope="scope">
          <el-button size="small" class="btn-delete" @click="onShowModal('popup', scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <ChooseShopModal
      v-model="selectedShops"
      errorMessage="请选择门店"
      ref="chooseShopModal"
      :multiple="true"
      :onSubmit="onSubmit"
    />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup"
    />
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { TRADE_TYPE } from 'constant/constants';
import { Popup, Pagination } from 'components';
import { DEFAULT_PAGE } from 'constant/pagination';
import ChooseShopModal from '../../Components/ChooseShopModal';

export default {
  name: 'gatedLaunchMain',
  components: { Popup, Pagination, ChooseShopModal },
  data () {
    return {
      TRADE_TYPE,
      selectedShops: [],
      company: {}
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchGatedLaunchList({ pageIndex, pageSize });
  },
  computed: mapState({
    list: state => state.release.gatedLaunch.list,
    recordCount: state => state.release.gatedLaunch.recordCount,
    pageIndex: state => state.release.gatedLaunch.pageIndex,
    pageSize: state => state.release.gatedLaunch.pageSize
  }),
  methods: {
    ...mapActions([
      'saveGatedLaunch',
      'deleteGatedLaunch',
      'fetchGatedLaunchList'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchGatedLaunchList({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchGatedLaunchList({ pageIndex, pageSize: this.pageSize });
    },
    getTradeType (type) {
      return type && TRADE_TYPE[type - 1].name;
    },
    onShowModal (type, item) {
      this.$refs[type].isShow = true;
      if (item) this.selected = item;
    },
    async onSubmit (shopItems) {
      await this.saveGatedLaunch({ shopItems });
      const { pageIndex, pageSize } = this;
      await this.fetchGatedLaunchList({ pageIndex, pageSize });
    },
    async onClickDelete () {
      await this.deleteGatedLaunch({ operaShopGUID: this.selected.shopGUID });
      const { pageIndex, pageSize } = this;
      await this.fetchGatedLaunchList({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.gated-launch-main {
  padding: 15px;

  .content {
    .left-content,
    .right-content {
      .title {
        width: 15%;
        display: inline-block;
        font-weight: 700;
      }

      .name {
        width: 80%;
      }

      .list {
        height: 350px;
        margin: 10px 0;
        border-radius: 5px;
        border: 1px solid #ddd;
      }
    }

    .center-content {
      .title {
        height: 34px;
        line-height: 34px;
        font-weight: 700;
      }
    }
  }
}
</style>
