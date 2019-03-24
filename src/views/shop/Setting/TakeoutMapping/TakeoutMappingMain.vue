<template>
  <div class="takeout-mapping-container">
    <div v-if="iframeVisible" class="iframe-container">
      <el-button class="go-back-link" icon="d-arrow-left" @click="onGoBackClick">返回</el-button>
      <iframe v-if="meituanOrElem == 'ELEME'"  class="iframe" frameborder=0 scrolling=auto :src="takeoutLink"></iframe>
      <div v-if="meituanOrElem == 'MEITUAN'" class="close-takeout-default">
        <div class="img-box">
          <img src="../../../../assets/close_takeout_default.png" alt="">
        </div>
        <div class="text-box">
          <div class="text">因美团外卖策略调整，暂时下架自助绑定流程。</div>
          <div class="text">若需开通美团外卖接单服务，请致电美味客服人工受理，客服电话：4008-166-477</div>
        </div>
      </div>
    </div>
    <div v-else class="table-container">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="第三方菜品名称">
          <el-input v-model="searchForm.thdMenuName" placeholder="请输入第三方菜品名称"></el-input>
        </el-form-item>
        <el-form-item label="外卖平台">
          <el-select v-model="searchForm.thdType">
            <el-option
              v-for="item in TAKE_OUT_PLATFORMS"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              style="width: 100%">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-search" @click="onSearchClick">搜索</el-button>
          <el-button class="btn-reset" @click="onResetClick">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="division-line" />
      <div class="btn-wrapper">
        <el-button class="btn-primary" :disabled="isMaintain" @click="onEditBatchClick">批量编辑</el-button>
        <el-button class="btn-base" @click="onLinkToMeituanClick">美团外卖店铺搜索</el-button>
        <el-button class="btn-base" @click="onLinkToElemeClick">饿了么外卖店铺搜索</el-button>
      </div>
      <div>
        <el-table :data="takeoutMappingList" border>
          <el-table-column prop="thdType" align="center" label="外卖平台" min-width="15%">
          </el-table-column>
          <el-table-column prop="thdMenuId" align="center" label="第三方菜品编码" min-width="15%">
          </el-table-column>
          <el-table-column prop="thdMenuName" align="center" label="第三方菜品名称" min-width="15%">
          </el-table-column>
          <el-table-column prop="thdSpecId" align="center" label="第三方菜品规格id" min-width="15%">
          </el-table-column>
          <el-table-column prop="itemId" align="center" label="菜品编号" min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.itemId === null ? '-' : scope.row.itemId }}
            </template>
          </el-table-column>
          <el-table-column prop="itemName" align="center" label="菜品名称" min-width="15%">
            <template slot-scope="scope">
              {{ scope.row.itemName === null ? '-' : scope.row.itemName }}
            </template>
          </el-table-column>
          <el-table-column prop="orderUint" align="center" label="规格" min-width="10%">
            <template slot-scope="scope">
              {{ scope.row.orderUint === null ? '-' : scope.row.orderUint }}
            </template>
          </el-table-column>
        </el-table>
        <Pagination
          :totalCount="recordCount"
          :currentPage="pageIndex"
          :pageSize="pageSize"
          :onChangeSize="onPageSizeChange"
          :onChangeCurrent= "onChangeCurrent"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { TAKE_OUT_PLATFORMS, ELE_ME, MEI_TUAN } from 'constant/constants';
  import { mapActions, mapState } from 'vuex';
  import { Pagination } from 'components';

  export default {
    name: 'TakeoutMapping',
    components: {
      Pagination
    },
    data () {
      return {
        ELE_ME,
        MEI_TUAN,
        TAKE_OUT_PLATFORMS,
        DEFAULT_PAGES,
        DEFAULT_PAGE,
        iframeVisible: false,
        searchForm: {
          thdType: TAKE_OUT_PLATFORMS[0].id,
          thdMenuName: null
        },
        isMaintain: !checkMaintainRight(this),
        meituanOrElem: '',  //  点击了美团或饿了吗  MEITUAN ELEME
      };
    },
    computed: {
      ...mapState({
        takeoutMappingList: state => state.setting.takeoutMapping.takeoutMappingList,
        pageIndex: state => state.setting.takeoutMapping.pageIndex,
        pageSize: state => state.setting.takeoutMapping.pageSize,
        recordCount: state => state.setting.takeoutMapping.recordCount,
        takeoutLink: state => state.setting.takeoutMapping.takeoutLink
      })
    },
    methods: {
      ...mapActions([
        'fetchTakeoutMappingList',
        'fetchTakeoutLink'
      ]),
      async onLinkToMeituanClick () {
        this.meituanOrElem = MEI_TUAN
        await this.fetchTakeoutLink({ takeawaySource: MEI_TUAN });
        this.iframeVisible = true;
      },
      async onLinkToElemeClick () {
        this.meituanOrElem = ELE_ME
        await this.fetchTakeoutLink({ takeawaySource: ELE_ME });
        this.iframeVisible = true;

      },
      onGoBackClick () {
        this.iframeVisible = false;
      },
      onEditBatchClick () {
        this.$router.push(`/myd/setting/takeout/editBatch`);
      },
      async onSearchClick () {
        const { thdType, thdMenuName } = this.searchForm;
        await this.fetchTakeoutMappingList({ pageSize: DEFAULT_PAGES, pageIndex: DEFAULT_PAGE, thdType, thdMenuName, isPage: 1 });
      },
      onResetClick () {
        this.searchForm.thdType = TAKE_OUT_PLATFORMS[0].id;
        this.searchForm.thdMenuName = null;
      },
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        const { thdType, thdMenuName } = this.searchForm;
        this.fetchTakeoutMappingList({ pageSize, pageIndex, thdType, thdMenuName });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        const { thdType, thdMenuName } = this.searchForm;
        this.fetchTakeoutMappingList({ pageSize, pageIndex, thdType, thdMenuName });
      }
    },
    async created () {
      const { pageSize, pageIndex } = this;
      const { thdType, thdMenuName } = this.searchForm;
      await this.fetchTakeoutMappingList({ pageSize, pageIndex, thdType, thdMenuName });
    }
  };

</script>
<style lang="scss">
  .takeout-mapping-container {
    .iframe-container {
      position: relative;

      .go-back-link {
        position: absolute;
        background: transparent;
        border: none;
      }

      .iframe {
        width: 100%;
        height: 650px;
      }
    }

    .table-container {
      padding: 20px;
    }

    .btn-wrapper {
      margin: 15px 0;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .close-takeout-default{
      .img-box{
        width: 300px;
        margin: 0 auto 40px auto;
        img{
          padding-top: 48px;
          width: 100%;
        }
      }
      .text-box{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0,0,0,0.65);
        text-align: center;
        line-height: 28px;
        padding: 36px;
        .text{

        }
      }
    }
  }
</style>
