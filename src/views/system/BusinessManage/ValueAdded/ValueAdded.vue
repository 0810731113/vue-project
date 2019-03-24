<template>
  <div class="value-added-main">
    <el-form inline :model="searchForm" ref="search" class="search-form">
      <el-form-item label="门店ID:" prop="shopId">
        <el-input v-model="searchForm.shopId" placeholder="请输入门店ID" />
      </el-form-item>
      <el-form-item label="门店名称:" prop="shopFullName">
        <el-input v-model="searchForm.shopFullName" placeholder="请输入门店名称" />
      </el-form-item>
      <el-form-item label="餐饮业态:" prop="foodTradeId">
        <el-select placeholder="请选择" v-model="searchForm.foodTradeId">
          <el-option label="全部" :value='null' />
          <el-option
            v-for="item in TRADE_TYPE"
            :key="item.value"
            :label="item.name"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </el-form-item>
    </el-form>
    <a :href="getActionUrl(`shop/${API_EXPORT_VALUE_ADDED}`, isMaintain)">
      <el-button class="btn-primary btn-export">导出</el-button>
    </a>
    <el-table border :data="list">
      <el-table-column align="center" label="门店ID" prop="shopGUID" />
      <el-table-column align="center" label="门店名称" prop="shopName" />
      <el-table-column align="center" label="所属总店" prop="superiorShopName" />
      <el-table-column align="center" label="餐饮业态" prop="foodTradeId">
        <template slot-scope="scope">
          {{ getTrade(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="省" prop="provinceName" />
      <el-table-column align="center" label="市" prop="cityName" />
      <el-table-column align="center" label="区" prop="districtName" />
      <el-table-column align="center" label="类型" prop="shopKind">
        <template slot-scope="scope">
          {{ getShopKind(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开通服务" prop="serviceNames" />
      <el-table-column align="center" label="终端类型" prop="clientType" />
      <el-table-column align="center" label="版本号" prop="softVersion" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button :disabled="isMaintain" class="btn-manage" content="设置" @click="onClickSetting(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount" />
      <ValueAddedModal
        ref="setting"
        :data="detail"
        :saveValueAdded="saveValueAdded" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { TRADE_TYPE, SHOPKIND_NAME } from 'constant/constants';
import { Pagination, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';
import ValueAddedModal from './ValueAddedModal.vue';
import { API_EXPORT_VALUE_ADDED } from 'constant/API';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'valueAdded',
  components: {
    Pagination,
    MwButton,
    ValueAddedModal
  },
  data () {
    return {
      TRADE_TYPE,
      API_EXPORT_VALUE_ADDED,
      searchForm: {
        shopId: '',
        shopFullName: '',
        foodTradeId: ''
      },
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchValueAddedList({ pageIndex, pageSize });
  },
  computed: mapState({
    list: state => state.businessManage.valueAdded.list,
    detail: state => {
      return cloneDeep(state.businessManage.valueAdded.detail);
    },
    pageIndex: state => state.businessManage.valueAdded.pageIndex,
    pageSize: state => state.businessManage.valueAdded.pageSize,
    recordCount: state => state.businessManage.valueAdded.recordCount
  }),
  methods: {
    ...mapActions([
      'saveValueAdded',
      'fetchValueAddedList',
      'fetchValueAddedDetail'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.getValueAddedList(pageIndex, this.pageSize);
    },
    getTrade (row) {
      return TRADE_TYPE.find(item => +item.value === +row.foodTradeId).name;
    },
    getShopKind (row) {
      return SHOPKIND_NAME.find(item => item.value === row.shopKind).name;
    },
    async onClickSearch () {
      const { pageSize, pageIndex } = this;
      await this.getValueAddedList(pageIndex, pageSize);
    },
    async onClickSetting (row) {
      await this.fetchValueAddedDetail({ shopId: row.shopGUID });
      this.$refs.setting.isShow = true;
    },
    onClickReset () {
      this.$refs.search.resetFields();
    },
    async getValueAddedList (pageIndex, pageSize) {
      await this.fetchValueAddedList({ pageIndex, pageSize, ...this.searchForm });
    }
  }
};
</script>

<style lang="scss">
.value-added-main {
  padding: 15px;

  .search-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }

  .btn-export {
    margin-bottom: 10px;
  }
}
</style>
