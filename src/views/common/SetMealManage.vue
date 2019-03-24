<template>
  <div class="setmeal-manage">
    <div class="left-wrap el-col-5">
      <el-tree
        ref="tree"
        class="set-meal-tree"
        :data="treeData"
        :props="defaultProps"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        @node-click="onClickNode">
      </el-tree>
    </div>
    <div class="right-wrap el-col-19">
      <div class="btn-wrapper">
        <el-button class="btn-base" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">新增</el-button>
        <el-button size="small" class="btn-primary" :disabled="isMaintain" @click="onShowSortable()">排序</el-button>
        <!--<el-button class="btn-base" v-if="!isShop" @click="onClickBack">返回套餐列表</el-button>-->
      </div>
      <el-table :data="list" border ref="comboTable" height="640" class="mw-table">
        <el-table-column prop="setFoodName" align="center" label="配菜项名称" min-width="15%" />
        <el-table-column align="center" :formatter="formatFoodType" label="类型" min-width="14%" />
        <el-table-column align="center" :formatter="formatCountText" label="数量" min-width="14%" />
        <el-table-column align="center" :formatter="formatRequired" label="是否必选" min-width="14%" />
        <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="14%" />
        <el-table-column align="center" label="操作" min-width="15%">
          <template slot-scope="scope">
            <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
            <mw-button class="btn-link" content="菜品关联" :disabled="isMaintain" @click="onShowRelation(scope.row)" />
            <mw-button v-if="splitStatus !== OK" class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowModal('popup', scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
    <toast
      ref='toast'
      :content="content"
      :timeout="2000"
      type="warning" />
    <garnish-modal
      :addSetSideDtl="addSetSideDtl"
      :selectedItemCd="selectedItemCd"
      :fetchSetSideDtlList="fetchSetSideDtlList"
      :isEdit="isEdit"
      ref="garnish" />
    <garnish-menu
      :selectedItem="selectedItem"
      :treeData="classifyList"
      :menuList="garnishList"
      :linkedMenus="linkedMenus"
      :fetchAllMenuItems="fetchGarnishList"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :onSubmitMenu="onSubmitMenu"
      ref="relation" />
    <Sortable :sortList="sortableList" :handleOK="onUpdateSortList" :headerKey="['套餐顺序调整']" :sortKey="['setFoodName']" ref="sortable">
    </Sortable>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK } from 'constant/statusCode';
import { Popup, Toast, MwButton,Sortable } from 'components';
import { GarnishModal, GarnishMenu } from './components';
import { checkMaintainRight } from 'utils/permissionUtil';
import cloneDeep from 'lodash/cloneDeep';
import {queryPackageSortList,savePackageSortList} from 'api/dishes'

export default {
  name: 'setMealManage',
  props: ['isShop'],
  components: { Popup, Toast, MwButton, GarnishModal, GarnishMenu,Sortable },
  data () {
    return {
      OK,
      isEdit: false,
      selectedItem: null,
      selectedItemCd: null,
      linkedMenus: [],
      content: '',
      splitStatus: OK,
      defaultProps: {
        children: 'nodes',
        label: 'text'
      },
      isMaintain: !checkMaintainRight(this),
      sortableList:[],
    };
  },
  async created () {
    await this.fetchSetSideDtlTree({ isThree: false });
    if (this.treeData[0] && this.treeData[0].nodes[0]) {
      await this.fetchSetSideDtlList({ fiItemCd_M: this.treeData[0].nodes[0].attr.fiItemCd_M });
    }
  },
  async destroyed () {
    await this.clearSetSideDtlList();
  },
  computed: mapState({
    treeData: state => state.dishes.setMeal.setSideDtlTree,
    list: state => state.dishes.setMeal.setSideDtlList,
    detail: state => state.dishes.setMeal.setSideDtlDetail,
    garnishList: state => state.dishes.setMeal.garnishList,
    linkedGarnishs: state => state.dishes.setMeal.linkedGarnishs,
    classifyList () {
      const allClassify = this.$store.state.dishes.menu.classList;
      return [{ children: allClassify, menuClsName: '全部分类' }];
    }
  }),
  methods: {
    ...mapActions([
      'fetchSetSideDtlTree',
      'fetchSetSideDtlList',
      'fetchSetSideDtlDetail',
      'fetchMenuClassList',
      'clearSetSideDtlList',
      'fetchGarnishList',
      'fetchSelectedGarnishList',
      'saveGarnishMenus',
      'deleteSetSideDtl',
      'addSetSideDtl'
    ]),
    async onShowSortable () {
      const { splitStatus, selectedItemCd } = this;
      console.log(splitStatus)
      console.log(selectedItemCd)

      if (!selectedItemCd || splitStatus === OK) {
        this.content = !selectedItemCd ? '请选择要添加的配菜分类!' : '分账状态已启用, 无法新增配菜项!';
        this.$refs.toast.isShow = true;
        return;
      }

      var result = await queryPackageSortList({fiItemCd_M:selectedItemCd }); // 0或者null查全部
      console.log(result)
      if(result.err.errNo == 0){
        this.sortableList = result.setSidelist
      }else{
        this.sortableList = []
      }

      this.$refs.sortable.isShow = true;
    },
    async onUpdateSortList(data){ //排序好提交
      console.log(data)
      var datas = []
      data.map((item,index) => {
        const {setFoodCd,itemCd_M} = item
        datas.push({setFoodCd,itemCd_M,sortOrder:index})
      })
      await savePackageSortList({setSidelist:datas})
      await this.fetchSetSideDtlList({ fiItemCd_M: this.selectedItemCd });
    },

    async onClickNode (data) {
      const { attr, id, splitStatus } = data;
      this.selectedItemCd = attr.fiItemCd_M ? id : null;
      if (!attr.fiItemCd_M) return;
      this.splitStatus = +splitStatus;
      await this.fetchSetSideDtlList({ fiItemCd_M: id });
    },
    async onClickDelete () {
      const { itemCd_M, setFoodCd } = this.selectedItem;
      await this.deleteSetSideDtl({ itemCd_M, setFoodCd });
      await this.fetchSetSideDtlList({ fiItemCd_M: itemCd_M });
    },
    async onClickEdit (item) {
      const { itemCd_M, setFoodCd } = item;
      await this.fetchSetSideDtlDetail({ operate: 'edit', itemCd_M, setFoodCd });
      this.isEdit = true;
      this.$refs.garnish.form = cloneDeep(this.detail);
      this.$refs.garnish.isShow = true;
    },
    async onShowRelation (row) {
      await this.fetchMenuClassList();
      await this.fetchGarnishList({ menuClsId: '0' });

      const { itemCd_M, setFoodCd, isRequired } = row;
      await this.fetchSelectedGarnishList({ fiItemCd_M: itemCd_M, fiSetFoodCd: setFoodCd });
      this.selectedItem = row;
      const relation = this.$refs.relation;
      this.linkedMenus = cloneDeep(this.linkedGarnishs);
      relation.isRequired = isRequired;
      relation.isShow = true;
    },
    formatCountText (row) {
      const { setFoodType, setSideDtlCount, setFoodQty } = row;
      return setFoodType ? `${setSideDtlCount}选${setFoodQty}` : setSideDtlCount;
    },
    formatFoodType (row) {
      return row.setFoodType ? '可选' : '固定';
    },
    formatRequired (row) {
      return row.isRequired ? '必选' : '非必选';
    },
    onChangeLinkedMenu (item) {
      const index = this.linkedMenus.findIndex(menu =>
        +menu.itemCd === item.itemCd &&
        menu.orderUint === item.orderUint &&
        +menu.salePrice === +item.salePrice
      );

      if (index >= 0) {
        this.linkedMenus.splice(index, 1);
      } else {
        item.saleQty = 1;
        this.linkedMenus.push(item);
      }
    },
    async onSubmitMenu (list) {
      const { itemCd_M, setFoodCd, setFoodType } = this.selectedItem;
      await this.saveGarnishMenus({ itemCd_M, setFoodCd, foodType: setFoodType, list });
      await this.fetchSetSideDtlList({ fiItemCd_M: itemCd_M });
    },
    onClickBack () {
      this.$router.push('/myd/dishes/setmeal');
    },
    onClickAdd () {
      const { splitStatus, selectedItemCd } = this;
      if (!selectedItemCd || splitStatus === OK) {
        this.content = !selectedItemCd ? '请选择要添加的配菜分类!' : '分账状态已启用, 无法新增配菜项!';
        this.$refs.toast.isShow = true;
        return;
      }

      this.isEdit = false;
      this.$refs.garnish.isShow = true;
    },
    onShowModal (type, item) {
      this.$refs[type].isShow = true;
      this.selectedItem = item;
    }
  }
};
</script>

<style lang="scss">
.setmeal-manage {
  padding: 15px;

  .left-wrap {
    padding-right: 15px;
  }
}
</style>
