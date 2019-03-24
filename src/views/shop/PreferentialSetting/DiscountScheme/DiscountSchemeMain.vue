<template>
  <div class="module-padding">
    <el-button size="small" class="btn-add btn-bottom" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd" >新增</el-button>
    <el-button size="small" class="btn-add btn-bottom" :disabled="isEdit" @click="onShowCopyDiscountSchemeModal" >复制</el-button>
    <el-table :data="discountSchemeList" border>
      <el-table-column prop="discountName" align="center" label="折扣名称" min-width="20%" />
      <el-table-column prop="couponId" :formatter="getDiscount" align="center" label="方案类型" min-width="20%" />
      <el-table-column prop="isVIPUse" align="center" label="会员使用" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.isVIPUse ? '是' : '否'}}
        </template>
      </el-table-column>
      <el-table-column prop="menuCount" align="center" label="菜品数量" min-width="10%" />
      <el-table-column :formatter="(item) => getStatusText(item, true)" align="center" label="状态" min-width="10%" />
      <el-table-column align="center" :render-header="renderHeader" min-width="25%">
        <template slot-scope="scope" >
          <mw-button
            v-if="scope.row.dataKind === CUSTOM_KEY || +scope.row.discountId === 99999 || scope.row.discountId === 'sysmsy2'"
            class="btn-edit"
            content="编辑"
            :disabled="isEdit"
            @click="onClickEdit(scope.row)"
          />
          <mw-button
            v-if="(scope.row.dataKind === CUSTOM_KEY || +scope.row.discountId === 99999)"
            :disabled="isEdit"
            :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            :content="scope.row.status == FORBIDDEN ? '启用' : '禁用'"
            @click="onClickChangeStatus(scope.row)"
          />
          <mw-button
            v-if="scope.row.dataKind === CUSTOM_KEY || +scope.row.discountId === 99999"
            class="btn-link"
            content="关联菜品"
            @click="onShowRelationModalClick(scope.row)"
          />
          <mw-button
            v-if="scope.row.dataKind === CUSTOM_KEY"
            class="btn-manage"
            content="关联菜品分类"
            @click="onShowClassifyRelationModalClick(scope.row)"
          />
          <mw-button
            v-if="scope.row.dataKind === CUSTOM_KEY"
            :disabled="isDelete"
            class="btn-delete"
            content="删除"
            @click="onShowDeletePopup(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent">
    </Pagination>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="deletePopup"/>
    <popup
      type="submit"
      size="small"
      title="方案信息复制"
      :handleOk="onCopyDiscountSchemeClick"
      ref="copyDiscountSchemeModal">
      <div slot="errorMessage" class="error-wrapper" v-if="!!errorMessage">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMessage }}
        </div>
      </div>
      <div slot="content" class="modal-content">
        <span>将</span>
        <el-select
          placeholder="请选择"
          v-model="originalScheme"
          @change="onOriginalSchemeChange"
          @visible-change="beforeOriginalSchemeChange">
          <el-option
            v-for="item in originalDiscountSchemeList"
            :key="item.discountId"
            :value="item.discountId"
            :label="item.discountName">
          </el-option>
        </el-select>
        <span>方案复制到</span>
        <el-select placeholder="请选择" v-model="destScheme">
          <el-option
            v-for="item in destDiscountSchemeList"
            :key="item.discountId"
            :value="item.discountId"
            :label="item.discountName">
          </el-option>
        </el-select>
      </div>
    </popup>
    <relation-modal
      :withDiscountScheme="true"
      :withDiscountRate="true"
      title="关联菜品"
      :linkedMenus="linkedMenus"
      :treeData="menuClsList"
      :menuList="menuList"
      :rightTable="rightTable"
      :fetchAllMenuItems="fetchAllMenuItems"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :onSelectedSubmitMenu="onSelectedSubmitMenu"
      :onDiscountRateChange="onDiscountRateChange"
      :onBatchDiscountRateChange="onBatchDiscountRateChange"
      ref="relationModal"
    />
    <classify-relation-modal
      :discountId="discountId"
      ref="classifyRelationModal"
      @onSubmit="() => this.$toast.show({ content: '关联菜品分类成功' })"
    />
  </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';
  import { mapActions, mapState } from 'vuex';
  import { RelationModal } from 'views/common';
  import ClassifyRelationModal from './ClassifyRelationModal';
  import { FORBIDDEN, OK, DELETE } from 'constant/statusCode';
  import { DISCOUNT_SCHEME, CUSTOM_KEY } from 'constant/constants';
  import { Popup, Pagination, MwButton, Tips } from 'components';
  import { checkMaintainRight, checkEditRight, checkDeleteRight } from 'utils/permissionUtil';
  import { isShop, isChain } from 'utils/configUtil';

  export default{
    name: 'DiscountSchemeMain',
    components: {
      ClassifyRelationModal,
      RelationModal,
      Pagination,
      MwButton,
      Popup,
      Tips
    },
    data () {
      return {
        OK,
        DELETE,
        FORBIDDEN,
        CUSTOM_KEY,
        DISCOUNT_SCHEME,
        isShop: isShop(),
        isChain: isChain(),
        errorMessage: '',
        destScheme: '',
        discountId: '',
        originalScheme: '',
        destDiscountSchemeList: [],
        originalDiscountSchemeList: [],
        isEdit: !checkEditRight(this),
        isDelete: !checkDeleteRight(this),
        isMaintain: !checkMaintainRight(this),
        linkedMenus: [],
        rightTable: [
          { key: 'itemName', name: '菜品' },
          { key: 'orderUint', name: '规格' },
          { key: 'salePrice', name: '售价' }
        ]
      };
    },
    computed: {
      ...mapState({
        discountSchemeCopyList: state => state.preferential.discountScheme.discountSchemeCopyList,
        discountSchemeList: state => state.preferential.discountScheme.discountSchemeList,
        discountLinkedMenus: state => state.preferential.discountScheme.discountLinkedMenus,
        recordCount: state => state.preferential.discountScheme.recordCount,
        pageIndex: state => state.preferential.discountScheme.pageIndex,
        pageSize: state => state.preferential.discountScheme.pageSize,
        menuClsList: state => state.common.menuRelation.menuClsList,
        menuList: state => state.common.menuRelation.menuList,
        error: state => state.error
      })
    },
    methods: {
      ...mapActions([
        'copyDiscountScheme',
        'updateDiscountStatus',
        'fetchDiscountSchemeList',
        'fetchDiscountSchemeCopyList',
        'fetchMenuList',
        'fetchMenuClassifyList',
        'saveDiscountLinkedMenus',
        'saveDiscountLinkedMenuCls',
        'fetchDiscountLinkedMenus'
      ]),
      renderHeader (createElement) {
        return (['操作', createElement(
            Tips,
          {
            props: {
              content: '优惠折扣关联菜品分类功能，<br/>客户端暂不支持，后续版本会接入。'
            }
          }
          )]
        );
      },
      async refreshDiscountSchemeList () {
        const { pageSize, pageIndex } = this;
        await this.fetchDiscountSchemeList({ pageSize, pageIndex });
      },
      async onShowCopyDiscountSchemeModal () {
        this.errorMessage = '';
        this.destScheme = '';
        this.originalScheme = '';
        this.destDiscountSchemeList = [];
        await this.fetchDiscountSchemeCopyList();
        this.$refs.copyDiscountSchemeModal.isShow = true;
      },
      async onCopyDiscountSchemeClick () {
        const { originalScheme, destScheme } = this;
        await this.copyDiscountScheme({ fromDiscountId: originalScheme, toDiscountId: destScheme, noShowError: true });

        const { errorStatus, errorMsg } = this.error;
        if (errorStatus) {
          this.errorMessage = errorMsg;
        } else {
          this.$refs.copyDiscountSchemeModal.isShow = false;
          await this.refreshDiscountSchemeList();
          if (!errorStatus) {
            this.$toast.show({ content: '复制成功' });
          }
        }
      },
      getDiscount (row) {
        return DISCOUNT_SCHEME[row.couponId].name;
      },
      beforeOriginalSchemeChange (visible) {
        if (!visible) return;
        this.originalDiscountSchemeList = this.discountSchemeCopyList.filter(item => item.discountId !== this.destScheme);
      },
      onOriginalSchemeChange (value) {
        const selectedItem = this.discountSchemeCopyList.find(item => item.discountId === value);
        const selectedCouponId = selectedItem ? selectedItem.couponId : null;
        this.destDiscountSchemeList = this.discountSchemeCopyList.filter(item =>
          item.discountId !== value && item.couponId === selectedCouponId);
      },
      onClickAdd () {
        this.$router.push('/myd/preferential/discountscheme/add');
      },
      async onClickDelete () {
        const { discountId } = this;
        await this.updateDiscountStatus({ discountId, status: DELETE });
        await this.refreshDiscountSchemeList();

        const { errorStatus } = this.error;
        if (!errorStatus) {
          this.$toast.show({ content: '删除成功' });
        }
      },
      onClickEdit (row) {
        this.$router.push(`/myd/preferential/discountscheme/edit/${row.discountId}`);
      },
      async onClickChangeStatus (row) {
        const status = +row.status === OK ? FORBIDDEN : OK;
        const { discountId } = row;
        await this.updateDiscountStatus({ discountId, status });
        await this.refreshDiscountSchemeList();
      },
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        this.fetchDiscountSchemeList({ pageSize, pageIndex });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchDiscountSchemeList({ pageSize, pageIndex });
      },
      onShowDeletePopup (row) {
        this.$refs.deletePopup.isShow = true;
        this.discountId = row.discountId;
      },
      async onShowRelationModalClick (row) {
        const { discountId } = row;
        this.discountId = discountId;
        //await this.fetchMenuClassifyList({ fiMenuClsKind: 1 });
        await this.fetchMenuClassifyList({ fiMenuClsKind: 5,type:5 });
        await this.fetchMenuList();
        await this.fetchDiscountLinkedMenus({ discountId });
        this.linkedMenus = cloneDeep(this.discountLinkedMenus);
        this.$refs.relationModal.isShow = true;
      },
      onChangeLinkedMenu (item) {
        item.discountRate = this.discountRate;
        const index = this.linkedMenus.findIndex(menu =>
          menu.itemCd === item.itemCd &&
          menu.orderUintCd === item.orderUintCd
        );
        if (index >= 0) {
          this.linkedMenus.splice(index, 1);
        } else {
          this.linkedMenus.push(item);
        }
      },
      async fetchAllMenuItems (params) {
        params = { ...params, itemName: params.searchMenuName };
        await this.fetchMenuList(params);
      },
      async onSelectedSubmitMenu () {
        const { discountId } = this;

        let discountMenuList = [];
        this.linkedMenus.map(item => {
          const { itemCd, orderUintCd, discountRate } = item;
          discountMenuList.push({
            discountId, itemCd, orderUintCd, discountRate: discountRate || 0
          });
        });
        await this.saveDiscountLinkedMenus({ discountMenuList, discountId });
        await this.refreshDiscountSchemeList();

        const { errorStatus } = this.error;
        if (!errorStatus) {
          this.$toast.show({ content: '关联菜品成功' });
        }
      },
      onDiscountRateChange (value) {
        this.discountRate = parseInt(value);
      },
      onBatchDiscountRateChange () {
        this.linkedMenus.map(item => {
          item.discountRate = this.discountRate;
        });
        this.linkedMenus.splice();
      },
      // 菜品分类关联
      async onShowClassifyRelationModalClick (row) {
        this.discountId = row.discountId;
        this.$refs.classifyRelationModal.isShow = true;
      }
    },
    async created () {
      await this.refreshDiscountSchemeList();
    }
  };
</script>
<style lang="scss">
  .modal-content {
    text-align: center;
    margin: 10px 0;
  }
</style>
