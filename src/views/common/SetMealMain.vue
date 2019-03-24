<template>
  <div class="set-meal-main">
    <div class="search-form">
      <el-form inline>
        <el-form-item label="套餐名称:" class="search-item">
          <el-input v-model="form.menuName" placeholder="请输入套餐名称" />
        </el-form-item>
        <el-form-item label="套餐编号:" class="search-item">
          <el-input v-model="form.menuNumber" placeholder="请输入套餐编号" />
        </el-form-item>
        <el-form-item label="价格范围:">
          <input-price
            minType="menuPriceMin"
            :priceMin="form.menuPriceMin"
            maxType="menuPriceMax"
            :priceMax="form.menuPriceMax"
            @change-price="onChangePrice" />
        </el-form-item>
        <el-form-item label="后厨打印:" class="search-item" v-if="isShop">
          <el-select v-model="form.print">
            <el-option label="全部" :value="null" />
            <el-option v-for="item in printList" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
          </el-select>
        </el-form-item>
        <el-form-item label="分账状态:" class="search-item">
          <el-select v-model="form.splitStatus">
            <el-option label="全部" :value="null" />
            <el-option label="启用" :value="OK" />
            <el-option label="未启用" :value="FORBIDDEN" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐选项:" class="search-item-option">
          <el-checkbox
            v-for="item in SET_MEAL_OPTIONS"
            :true-label="TRUE"
            :false-label="null"
            :key="item.key"
            v-model="form[item.key]">{{item.name}}
          </el-checkbox>
        </el-form-item>
      </el-form>
      <div class="btn-wrapper">
        <el-button class="btn-search" @click="onSearchSetMeal">搜索</el-button>
        <el-button class="btn-reset" @click="init">重置</el-button>
      </div>
      <div class="division-line"></div>
    </div>
    <div class="bottom-wrapper">
      <div class="left-wrapper el-col-4">
        <el-tree
          ref="tree"
          class="set-meal-tree"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @node-click="onClickNode" />
      </div>
      <div class="right-wrapper el-col-20">
        <div class="btn-wrapper">
          <el-button class="btn-primary" icon="el-icon-plus"  :disabled="isMaintain" @click="goRoute('add')">新增</el-button>
          <el-button class="btn-primary"  @click="onShowModal('move')" :disabled="isMaintain">移动到</el-button>
          <el-button class="btn-primary"  @click="onShowModal('setting')" :disabled="isMaintain">批量设置</el-button>
          <el-button class="btn-primary"  @click="onShowPopup" :disabled="isMaintain">删除</el-button>
          <!--<el-button size="small" class="btn-base" v-if="!isShop" @click="goToManage">套餐内菜品管理</el-button>-->
        </div>
        <el-table :data="comboList" border ref="comboTable" height="600" class="mw-table" @selection-change="onSelectedItems">
          <el-table-column type="selection" />
          <el-table-column prop="itemName" align="center" label="套餐名称" min-width="15%" />
          <el-table-column prop="salePrice" align="center" label="价格" min-width="15%">
            <template slot-scope="scope">
              {{ `¥${scope.row.salePrice}` }}
            </template>
          </el-table-column>
          <el-table-column prop="orderUint" align="center" label="单位" min-width="15%" />
          <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="10%" />
          <el-table-column prop="splitStatus" align="center" label="分账状态" min-width="10%">
            <template slot-scope="scope">
              {{ scope.row.splitStatus === OK ? '启用' : '未启用' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="选项" min-width="15%">
            <template slot-scope="scope">
              <menu-options :data="scope.row" />
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="15%">
            <template slot-scope="scope">
              <mw-button class="btn-edit" content="编辑" :disabled="isMaintain"
                         @click="onClickEdit(scope.row)" v-if="!isShop || (isShop && +scope.row.source !== 1)"/>
              <mw-button class="btn-copy" content="复制" :disabled="isMaintain"
                         @click="showCopyPopup(scope.row)" v-if="!isShop || (isShop && +scope.row.source !== 1)"/>
              <mw-button
                class="btn-manage"
                content="分账设置"
                @click="() => onBillSplitChange(scope.row)" v-if="!isShop || (isShop && +scope.row.source !== 1)"/>
              <mw-button class="btn-delete" content="删除" :disabled="isMaintain"
                         @click="onShowPopup(scope.row)" v-if="!isShop || (isShop && +scope.row.source !== 1)"/>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <menu-setting ref="setting" :data="selectedIds" :onUpdateSettings="onUpdateSettings" />
    <popup
      ref="move"
      title="选择套餐移动位置"
      size="small"
      :handleOk="() => onSubmitMove()">
      <div slot="content">
        共{{ selectedIds.length }}个套餐
        <el-tree
          ref="tree"
          class="set-meal-tree"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @node-click="onClickNodeInModal">
        </el-tree>
      </div>
    </popup>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="() => this.onClickDelete()"
      ref="popup" />
    <popup
      title="复制操作"
      tips="您确认要复制此数据吗?"
      :handleOk="() => this.copySetSideItem(copySetMeal)"
      ref="copy" />
    <toast
      ref='toast'
      :content="content"
      :timeout="2000"
      type="warning" />
    <toast
      ref='copyOver'
      :content="content"
      :timeout="2000" />
    <toast
      ref='delete'
      :content="content"
      :timeout="2000" />
    <bill-split-modal ref="billSplitModal" :itemCd="selectedSetMeal" :callBack="() => this.fetchAllSetMeal(this.form)"></bill-split-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { SET_MEAL_OPTIONS } from 'constant/constants';
import { OK, TRUE, FORBIDDEN } from 'constant/statusCode';
import { MenuOptions, MenuSetting, BillSplitModal } from './components';
import { checkMaintainRight } from 'utils/permissionUtil';
import { Popup, Toast, MwButton, InputPrice } from 'components';
import { isGroupStore } from 'utils/configUtil';


export default {
  name: 'setMealMain',
  props: ['isShop'],
  components: {
    Popup,
    Toast,
    InputPrice,
    MwButton,
    MenuOptions,
    MenuSetting,
    BillSplitModal
  },
  data () {
    return {
      OK,
      TRUE,
      FORBIDDEN,
      SET_MEAL_OPTIONS,
      form: {},
      selectedIds: [],
      menuClsId: null,
      defaultProps: {
        children: 'children',
        label: 'menuClsName'
      },
      content: '',
      //isMaintain: !checkMaintainRight(this),
      isMaintain: false,
//      isDelete: !checkDeleteRight(this),
//      isAdd: !checkAddRight(this),
      selectedSetMeal: '',
      copySetMeal: '',
      isGroupStore : isGroupStore()
    };
  },
  async created () {
    this.init();
    await this.fetchAllSetMeal(this.form);
    await this.fetchSetMealTrees({ type: 2 });
    if (this.isShop) await this.fetchSetMealPrinterList();
  },
  computed: mapState({
    comboList: state => state.dishes.setMeal.list,
    treeData: state => state.dishes.setMeal.trees,
    printList: state => state.dishes.setMeal.printerList,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'fetchSetMealPrinterList',
      'fetchAllSetMeal',
      'fetchSetMealTrees',
      'deleteSetMeals',
      'batchSetMealSetting',
      'batchMoveSetMeal',
      'fetchSetMealBillSplitDetail',
      'fetchCopySetSideItem'
    ]),
    async onClickNode (data) {
      const { menuClsId } = data;
      this.menuClsId = menuClsId;
      await this.fetchAllSetMeal({ ...this.form, menuClsId });
    },
    async onClickDelete () {
      await this.deleteSetMeals({ itemCds: this.selectedIds });
      if (this.errorStatus) return;
      this.content = '删除成功';
      this.$refs.delete.isShow = true;
    },
    async onUpdateSettings (datas) {
      await this.batchSetMealSetting({ ...datas, itemCds: this.selectedIds });
      await this.fetchAllSetMeal(this.form);
    },
    async onSubmitMove () {
      await this.batchMoveSetMeal({ menuClsId: this.selectedCls, itemCds: this.selectedIds });
    },
    async onSearchSetMeal () {
      await this.fetchAllSetMeal(this.form);
    },
    init () {
      this.form = {
        menuName: '',
        menuNumber: '',
        menuPriceMin: '',
        menuPriceMax: '',
        print: null,
        isDiscount: null,
        isServiceFee: null,
        isOut: null,
        isGift: null,
        isWeChatOrder: null,
        isTakeAway: null,
        isHot: null,
        isSpecialty: null,
        isNew: null,
        splitStatus: null,
        isPrePoint: null,
      };
    },
    goRoute (type) {
      if (type === 'add') {
        if (this.menuClsId) {
          this.$router.push(`/myd/dishes/setmeal/add/${this.menuClsId}`);
        } else {
          this.content = '全部分类项，不能新增套餐!';
          this.$refs.toast.isShow = true;
        }
      }
    },
    goToManage () {
      this.$router.push('/myd/dishes/setmeal/manage');
    },
    onChangePrice (value, type) {
      this.form[type] = value;
    },
    onClickNodeInModal (data) {
      this.selectedCls = data.menuClsId;
    },
    onClickEdit (item) {
      this.$router.push(`/myd/dishes/setmeal/edit/${item.itemCd}`);
    },
    onSelectedItems (datas) {
      this.selectedIds = [];
      datas.map(item => {
        this.selectedIds.push(item.itemCd);
      });
    },
    onShowModal (type) {
      if (!this.selectedIds.length) {
        this.content = '请选择要操作的数据!';
        this.$refs.toast.isShow = true;
        return;
      }
      this.$refs[type].isShow = true;
    },
    onShowPopup (item) {
      if (item.itemCd) {
        this.selectedIds = [item.itemCd];
        this.$refs.comboTable.clearSelection();
        this.$refs.comboTable.toggleRowSelection(item);
      }

      if (!this.selectedIds.length) {
        this.content = '请选择要操作的数据!';
        this.$refs.toast.isShow = true;
        return;
      }
      this.$refs.popup.isShow = true;
    },
    async onBillSplitChange (row) {
      const { itemCd } = row;
      this.selectedSetMeal = itemCd;
      await this.fetchSetMealBillSplitDetail({ itemCd });
      this.$refs.billSplitModal.isShow = true;
    },
    showCopyPopup (item) {
      this.copySetMeal = item.itemCd;
      this.$refs.comboTable.clearSelection();
      this.$refs.comboTable.toggleRowSelection(item);
      this.$refs.copy.isShow = true;
    },
    async copySetSideItem (copySetMeal) {
      await this.fetchCopySetSideItem({ itemCd: copySetMeal });
      if (this.errorStatus) return;
      this.$toast.show({ content: '复制成功' });
      // 传递给后台后刷新页面数据
      await this.fetchAllSetMeal(this.form);
    }
  }
};
</script>

<style lang="scss">
.set-meal-main {
  padding: 15px;

  .search-form {
    .el-form {
      padding: 15px 0 0 5px;
    }

    .btn-wrapper {
      text-align: center;
      margin-bottom: 6px;
    }
  }

  .search-item {
    width: 23%;
    margin-bottom: 20px;
    display: inline-block;

    .el-form-item__label {
      font-size: 14px;
      font-weight: 400;
      white-space: nowrap;
    }

    .el-form-item__content {
      width: 70%;

      .el-cascader,
      .el-select,
      &:first-child {
        width: 100%;
      }
    }

    .price-input {
      width: 40% !important;
    }
  }

  .search-item-option {
    margin-bottom: 0;

    .el-form-item__content {
      white-space: nowrap;
    }
  }

  .left-wrapper {
    .set-meal-tree {
      margin-top: 8px;
    }
  }

  .right-wrapper {
    padding: 5px;
  }
}
</style>
