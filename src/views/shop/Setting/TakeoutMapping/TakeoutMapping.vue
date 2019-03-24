<template>
  <div class="content-container">
    <el-select v-model="thdType" @change="onSelectionChange">
      <el-option
        v-for="item in TAKE_OUT_PLATFORMS"
        :key="item.id"
        :label="item.name"
        :value="item.id"
        style="width: 100%">
      </el-option>
    </el-select>
    <el-button class="btn-primary" @click="updateDishes">更新菜品</el-button>
    <el-table :data="menuList" border height="400">
      <el-table-column label="外卖菜品" align="center">
        <el-table-column prop="thdMenuId" align="center" label="编码" min-width="15%" />
        <el-table-column prop="thdMenuName" align="center" label="名称" min-width="15%" />
        <el-table-column prop="thdSpecId" align="center" label="菜品规格id" min-width="15%" />
        <el-table-column prop="thdSpecName" align="center" label="菜品规格" min-width="15%" />
      </el-table-column>
      <el-table-column label="点餐菜品" align="center">
        <el-table-column prop="itemId" align="center" label="编码" min-width="15%">
          <template slot-scope="scope">
            {{ scope.row.itemId === null ? '-' : scope.row.itemId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="菜品" min-width="15%">
          <template slot-scope="scope">
            <div @click="() => onShowDishSearchModal(scope.row)">
              <el-input :value="getDishName(scope.row)" disabled=""></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderUint" align="center" label="规格" min-width="10%">
          <template slot-scope="scope">
            {{ scope.row.orderUint === null ? '-' : scope.row.orderUint }}
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
    </el-row>
    <Toast
      ref='toast'
      content="操作成功!"
      :timeout="2000"/>
    <popup
      type="submit"
      title="搜索菜品"
      :handleOk="changeTableRow"
      :handleClose="handleModalClose"
      ref="dishSearchModal">
      <div slot="content" style="text-align: center">
        <el-select
          :value="selectedDish"
          @input="(value) => onChangeDish(value)"
          filterable
          placeholder="请选择"
          style="width: 100%">
          <el-option
            v-for="(item, index) in dishList"
            :key="index"
            :label="item.itemName + '_' +item.orderUint"
            :value="!item.itemCd || !item.orderUintCd ? null : item.itemCd + item.orderUintCd "
            style="width: 100%">
          </el-option>
        </el-select>
      </div>
    </popup>
  </div>
</template>
<script>
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { Pagination, Toast, Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { TAKE_OUT_PLATFORMS } from 'constant/constants';
  import cloneDeep from 'lodash/cloneDeep';
  import ElInput from '../../../../../node_modules/element-ui/packages/input/src/input.vue';

  export default {
    name: 'TakeoutMapping',
    components: {
      ElInput,
      Pagination,
      Toast,
      Popup
    },
    data () {
      return {
        menuList: [],
        DEFAULT_PAGE,
        DEFAULT_PAGES,
        TAKE_OUT_PLATFORMS,
        thdType: TAKE_OUT_PLATFORMS[0].id,
        editRow: {},
        selectedDish: ''
      };
    },
    computed: {
      ...mapState({
        noPageTakeoutList: state => state.setting.takeoutMapping.noPageTakeoutList,
        vendorList: state => state.setting.takeoutMapping.vendorList,
        dishList: state => state.setting.takeoutMapping.dishList,
        errorStatus: state => state.error.errorStatus
      })
    },
    watch: {
      noPageTakeoutList () {
        this.menuList = cloneDeep(this.noPageTakeoutList);
      }
    },
    methods: {
      ...mapActions([
        'fetchNoPageTakeoutList',
        'fetchVendorList',
        'fetchDishList',
        'saveVendorList'
      ]),
      async onSelectionChange (value) {
        await this.fetchNoPageTakeoutList({ thdType: value });
      },
      async updateDishes () {
        const { thdType } = this;
        await this.fetchVendorList({ takeawaySource: thdType });
        await this.fetchNoPageTakeoutList({ thdType });
        if (!this.errorStatus) {
          this.$refs.toast.isShow = true;
        }
      },
      onShowDishSearchModal (row) {
        this.$refs.dishSearchModal.isShow = true;
        this.editRow = row;
      },
      handleModalClose () {
        this.$refs.dishSearchModal.isShow = false;
        this.editRow = {};
        this.selectedDish = '';
      },
      getDishName (row) {
        if (row.itemName) { return row.itemName; }

        return '';
      },
      changeTableRow () {
        let orderUint, itemName, itemId, orderUintCd, itemCd;
        this.dishList.map(item => {
          if ((item.itemCd + item.orderUintCd) === this.selectedDish) {
            orderUint = item.orderUint;
            itemCd = item.itemCd;
            itemName = item.itemName;
            itemId = item.itemId;
            orderUintCd = item.orderUintCd;
          }
        });
        this.menuList.map(item => {
          if ((item.thdMenuId === this.editRow.thdMenuId) && (item.orderUintCd === this.editRow.orderUintCd)) {
            item.orderUint = orderUint;
            item.orderUintCd = orderUintCd;
            item.itemName = itemName;
            item.itemCd = itemCd;
            item.itemId = itemId;
          }
        });
        this.$refs.dishSearchModal.isShow = false;
        this.editRow = {};
        this.selectedDish = '';
      },
      onChangeDish (value) {
        this.selectedDish = value;
      },
      async onSubmit () {
        const data = this.menuList.map(item => {
          let dataItem = { ...item };
          delete dataItem['itemId'];
          delete dataItem['itemName'];
          delete dataItem['orderUnit'];
          delete dataItem['thdMenuId'];
          delete dataItem['thdMenuName'];
          delete dataItem['thdSpecId'];
          delete dataItem['thdSpecName'];
          delete dataItem['thdSpecPrice'];
          delete dataItem['thdType'];
          delete dataItem['orderUint'];
          return dataItem;
        });
        await this.saveVendorList({ thdType: this.thdType, thirdMenuItem: data });

        if (!this.errorStatus) {
          this.$refs.toast.isShow = true;
        }
      },
      onCancel () {
        this.$router.back();
      }
    },
    async created () {
      const { thdType } = this;
      await this.fetchNoPageTakeoutList({ thdType });
      await this.fetchDishList({ takeawaySource: thdType });
    }
  };
</script>

<style lang="scss">
  .content-container {
    padding: 20px;

    .el-table {
      margin-top: 20px;
    }

    .el-row {
      margin: 20px;
    }

    .mw-link {
      text-decoration: none;
    }
  }
</style>
