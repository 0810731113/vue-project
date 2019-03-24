<template>
  <el-dialog v-if="isShow || cookVisible" custom-class="base-modal relation-modal" :visible="true" size="small" width="70%" :title="title" :before-close="onShowOrHideModal">

    <!--<div class="modal-title" v-if="data" slot="title">要求关联菜品({{ data.askGpName }})</div>-->
    <div class="flex-block">
      <div class="tree-block">
        <slot name="sideBar"></slot>
        <div class="tree-box">
          <el-tree
            class="relation-tree"
            :data="treeData"
            :props="defaultProps"
            :highlight-current="true"
            :default-expand-all="true"
            :expand-on-click-node="false"
            @node-click="onClickNode">
          </el-tree>
        </div>
      </div>
      <div class="dishes-transfer">
        <el-form label-width="80px" ref="form" class="relation-search" @submit.prevent.native>
          <el-form-item v-if="withDiscountScheme" label="折扣率：">
            <el-input-number
              :controls="false"
              v-model="discountRate"
              :min="0"
              :max="100"
              placeholder="请输入折扣率"
              @blur="onDiscountRateBlur"
            />&nbsp;&nbsp;%&nbsp;&nbsp;
            <el-button class="btn-base" @click="onBatchDiscountRateChange" :disabled="!linkedMenus.length">更新折扣率</el-button>
            <label class="form-label">举例：打九折折扣率为10%</label>
          </el-form-item>
          <el-form-item label="菜品：">
            <el-input :value="searchMenuName" @input="onClickSearch" :maxlength="50">
              <el-button slot="append" icon="el-icon-search"/>
            </el-input>
            <label class="form-label">已添加:&nbsp;<span>{{linkedMenus.length}}</span></label>
          </el-form-item>
        </el-form>`
        <el-table
          ref="transfer"
          border
          :height="450"
          class="transfer-table"
          :data="menuList"
          @select="(selection, row) => onSelectedMenu(row)"
          @select-all="onSelectAll">
          <el-table-column align="center" type="selection" width="40" />
          <el-table-column prop="itemName" class-name="table-auto" align="center" label="菜品" />
          <el-table-column prop="orderUint" align="center" label="规格" width="60" />
          <el-table-column prop="salePrice" align="center" label="价格" width="60" />
        </el-table>
        <el-table class="transfer-table" :data="linkedMenus" border :height="450" v-if="rightTable">
          <el-table-column v-for="(item, index) in rightTable" :key="index" :prop="item.key" align="center" :label="item.name" min-width="60"/>
          <el-table-column prop="discountRate" align="center" label="折扣率(%)" v-if="withDiscountRate" min-width="60">
            <template slot-scope="scope">
              <el-input-number :controls="false" :min="0" :max="100" v-model="scope.row.discountRate" />
            </template>
          </el-table-column>
          <el-table-column prop="cbSalePrice" align="center" label="售价" v-if="withDiscountPrice" min-width="100">
            <template slot-scope="scope">
              <el-input-number :controls="false" :value="settlePrice(scope.row.cbSalePrice, decround)" @input="onSalePriceChange($event, scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>


    <div slot="footer" class="modal-footer">
      <!--<el-button type="primary" class="btn-submit" @click="onSubmit" v-if="!withDiscountPrice">保存</el-button>-->
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
  import { ITEMTYPE } from 'constant/constants';
  import { mapState, mapMutations } from 'vuex';

  export default {
    name: 'relationModal',
    props: [
      'decround',
      'type',
      'treeData',
      'data',
      'menuList',
      'itemType',
      'linkedMenus',
      'fetchAllMenuItems',
      'onChangeLinkedMenu',
      'onSelectedSubmitMenu',
      'rightTable',
      'title',
      'withDiscountScheme',
      'onDiscountRateChange',
      'onBatchDiscountRateChange',
      'withDiscountPrice',
      'onSalePriceChange',
      'onClose',
      'withDiscountRate'
    ],
    computed: {
      ...mapState({
        cookVisible: state => state.dishLibrary.cookBook.cookVisible
      })
    },
    data () {
      return {
        isShow: false,
        menuClsId: null,
        searchMenuName: '',
        defaultProps: {
          children: 'children',
          label: 'menuClsName'
        },
        discountRate: 0
      };
    },
    created () {
      this.onClickSearch();
    },
    updated () {
      if (!this.$refs.transfer) return;
      (this.menuList || []).map(item => {
        const hasIndex = this.linkedMenus.findIndex(menu => item.itemCd === menu.itemCd) > -1;
        if (hasIndex) {
          this.$refs.transfer.toggleRowSelection(item, true);
        } else {
          this.$refs.transfer.toggleRowSelection(item, false);
        }
      });
    },
    methods: {
      ...mapMutations([
        'CHANGE_COOK_VISIBLE'
      ]),
      settlePrice (price, decround) {
        price += '';
        const int = price.split('.')[0];
        const float = price.split('.')[1] || '0';
        if (decround === 0) {
          price = int + '.' + float.slice(0, 2);
        } else if (decround === 1) {
          price = int + '.' + float.slice(0, 1);
        } else {
          price = int;
        };

        return +price;
      },
      onSelectedMenu (item) {
        const selectedItems = [];
        this.menuList.map(menu => {
          if (menu.itemCd === item.itemCd) {
            selectedItems.push(menu);
          }
        });

        selectedItems.map(item => {
          this.onChangeLinkedMenu(item);
        });
      },
      async onClickNode (data) {
        const { menuClsId, menuClsKind } = data;
        const { itemType, searchMenuName } = this;
        this.menuClsId = +menuClsId > 0 ? menuClsId : '0';
        await this.fetchAllMenuItems({
          itemType: (itemType === undefined || itemType === null) ? ITEMTYPE.SINGLE : itemType,
          itemKind: menuClsKind,
          menuClsId: this.menuClsId,
          searchMenuName
        });
      },
      onSelectAll (selection) {
        if (selection.length && !selection[0]) {
          selection.shift();
        }

        if (!this.menuList) {
          return;
        }
        this.menuList.map(item => {
          const hasIndex = this.linkedMenus.findIndex(link =>
            +link.itemCd === +item.itemCd &&
            +link.orderUintCd === +item.orderUintCd
          ) > -1;
          if (!hasIndex || !selection.length) {
            this.onChangeLinkedMenu(item);
          }
        });
      },
      async onClickSearch (value) {
        this.searchMenuName = value;
        const { itemType, searchMenuName } = this;
        await this.fetchAllMenuItems({ itemType, searchMenuName });
      },
      async onSubmit () {
        const itemCds = [];
        this.linkedMenus.map(item => {
          itemCds.push(item.itemCd);
        });

        const { askGpId } = this.data || {};
        if (this.type === null) {
          await this.onSelectedSubmitMenu({ askGpId, itemCds });
        } else {
          const { type } = this;
          await this.onSelectedSubmitMenu({ askGpId, itemCds, type });
        }
        this.onShowOrHideModal();
      },
      onShowOrHideModal () {
        this.isShow = false;
        this.CHANGE_COOK_VISIBLE();
        if (this.onClose) {
          this.onClose();
        }
      },
      onDiscountRateBlur (e) {
        this.discountRate = parseInt(e.target.value);
        this.onDiscountRateChange(this.discountRate);
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-dialog {
    min-width: 640px;
  }
  .flex-block{
    display: flex;
    justify-content: flex-start;
    height: 500px;
    .tree-block{
      width: 36%;
      padding-right: 24px;

      .tree-box{
        height: 80%;
        overflow: auto;
      }
    }
  }
  .relation-modal {
    .relation-tree {
      /*width: 25%;*/
      padding-left: 15px;

      border: none;
      overflow-y: auto;
      display: inline-block;

      .el-tree-node .is-current {
        > .el-tree-node__content {
          color: white;
          background-color: #409EFF;
        }
      }
    }

    .menu-amount-label {
      color: #f36b5f;
    }

    .dishes-transfer {
      width: 64%;

      vertical-align: top;
      display: inline-block;

      .relation-search {
        text-align: left;

        .el-input-number {
          width: 35%;
        }

        .el-form-item {
          font-weight: 700;
          margin-bottom: 10px;
          vertical-align: middle;
        }
      }

      .transfer-table {
        width: 48%;
        display: inline-block;

        .cell,
        .el-table th > div {
          padding: 0 !important;
        }
      }

      .el-input-group {
        max-width: 300px !important;
      }

      .el-form-item__content {
        display: flex !important;
      }

      .form-label {
        min-width: 200px;
        height: 36px;
        line-height: 36px;
        font-weight: 700;
        margin-left: 30px;

        > span {
          color: #f36b5f;
        }
      }

      .add-tips {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        font-weight: 700;
        margin-left: 70px;
        width: 100px;
      }
    }
  }
</style>
