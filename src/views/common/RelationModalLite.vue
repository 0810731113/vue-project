<template>
  <el-dialog v-if="isShow" custom-class="base-modal relation-modal-lite" :visible.sync="isShow" :before-close="onShowOrHideModal">
    <div class="modal-title" slot="title">请选择菜品</div>
    <div class="content">
      <div class="header-wrap">
        <div class="cls-title">
          菜品分类
        </div>
        <div class="menu-title">
          <span>菜品</span>
          <el-input placeholder="请输入菜品名称" v-model="searchMenuName" @keyup.enter.native="onSearchClick">
            <el-button slot="append" icon="el-icon-search" @click="onSearchClick" :maxlength='50'></el-button>
          </el-input>
        </div>
        <div class="total-tip">
          已添加：<span>{{selectedItems.length}}</span>
        </div>
      </div>
      <div class="left-wrap el-col-7">
        <el-tree
          class="relation-tree"
          :data="treeData"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @node-click="onClickNode"
        />
      </div>
      <div class="middle-wrap el-col-10">
        <el-table
          border
          ref="linkedTable"
          :data="menuList"
          :height="420"
          @select="onSelectionChange"
          @select-all="onSelectionAllChange">
          <el-table-column type="selection" />
          <el-table-column prop="itemId" align="center" label="菜品编号" min-width="30%" />
          <el-table-column prop="itemName" class-name="table-auto" align="center" label="菜品名称" min-width="30%" />
          <el-table-column prop="orderUint" align="center" label="规格" min-width="20%" />
          <el-table-column prop="salePrice" align="center" label="销售单价" min-width="20%" />
        </el-table>
      </div>
      <div class="right-wrap el-col-7">
        <el-table
          border
          :data="selectedItems"
          :height="420"
        >
          <el-table-column prop="itemName" align="center" label="菜品名称" />
        </el-table>
      </div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
    <div class="error-wrapper horizontal-center" v-if="!!errorMessage">
      <i class="el-icon-circle-cross"></i>
      {{ errorMessage }}
    </div>
  </el-dialog>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'menuModal',
    props: {
      treeData: {
        type: Array,
        default: () => []
      },
      fetchMenuList: {
        type: Function,
        default: () => {}
      },
      onSubmitItems: {
        type: Function,
        default: () => {}
      },
      linkedMenus: {
        type: Array,
        default: () => []
      }
    },
    data () {
      return {
        isShow: false,
        searchMenuName: '',
        menuClsId: null,
        menuClsKind: null,
        errorMessage: '',
        items: [],
        selectedItems: [],
        defaultProps: {
          children: 'children',
          label: 'menuClsName'
        }
      };
    },
    watch: {
      async isShow () {
        if (!this.isShow) return;

        await this.fetchMenuList();
        this.selectedItems = this.linkedMenus.slice();
        this.onDefaultSelectedItem();
      }
    },
    computed: mapState({
      menuList: state => state.common.menuRelation.menuList,
      error: state => state.error
    }),
    methods: {
      async onClickNode (data) {
        const { menuClsId, menuClsKind } = data;
        this.menuClsId = menuClsId;
        this.menuClsKind = menuClsKind;
        await this.onSearchClick(data);
      },
      async onSearchClick () {
        const { menuClsId, menuClsKind, searchMenuName } = this;
        await this.fetchMenuList({
          itemType: 1,
          itemKind: menuClsKind,
          menuClsId,
          searchMenuName
        });
        this.onDefaultSelectedItem();
      },
      onSelectionChange (selection, row) {
        // 已选择， 则从列表中删除； 未选择， 则加入列表
        const index = this.selectedItems.findIndex(item =>
          item.itemCd === row.itemCd && item.orderUintCd === row.orderUintCd
        );

        if (index >= 0) {
          this.selectedItems.splice(index, 1);
        } else {
          this.selectedItems.push(row);
        }
      },
      onSelectionAllChange (selection) {
        if (selection.length) {
          // 全选
          this.menuList.map(item => {
            const hasIndex = this.selectedItems.findIndex(selectedItem =>
                        +selectedItem.itemCd === +item.itemCd &&
                        +selectedItem.orderUintCd === +item.orderUintCd
                      ) > -1;
            if (!hasIndex) {
              this.selectedItems.push(item);
            }
          });
        } else {
          // 全取消
          this.menuList.map(item => {
            const index = this.selectedItems.findIndex(selectedItem =>
              +selectedItem.itemCd === +item.itemCd &&
              +selectedItem.orderUintCd === +item.orderUintCd
            );
            if (index > -1) {
              this.selectedItems.splice(index, 1);
            }
          });
        }
      },
      onDefaultSelectedItem () {
        this.menuList.map(row => {
          this.$refs.linkedTable.toggleRowSelection(row, this.selectedItems.findIndex(item =>
            item.itemCd === row.itemCd &&
            item.orderUintCd === row.orderUintCd
          ) > -1);
        });
      },
      async onSubmit () {
        await this.onSubmitItems(this.selectedItems);

        const { errorStatus, errorMsg } = this.error;
        if (!errorStatus) {
          this.onShowOrHideModal();
        } else {
          this.errorMessage = errorMsg;
        }
      },
      onShowOrHideModal () {
        this.errorMessage = '';
        this.isShow = false;
      }
    }
  };
</script>

<style lang="scss">
  .relation-modal-lite {
    $left-width: 230px;
    $middle-width: 500px;
    $right-width: 200px;

    width: 1000px;

    .content {
      display: inline-block;

      .header-wrap {
        padding-bottom: 10px;
        margin-top: -24px;

        .cls-title {
          text-align: left;
          width: $left-width;
          display: inline-block;
        }

        .menu-title {
          display: inline-block;

          .el-input {
            width: $middle-width - 30px;
          }
        }
      }

      .total-tip {
        margin-left: 10px;
        width: 200px;
        display: inline-block;
        text-align: left;

        > span {
          color: red;
        }
      }

      .left-wrap {
        width: $left-width !important;
        height: 420px;
        border: 1px solid #d1dbe5;
        overflow: auto;

        .el-tree {
          border: none;
        }
      }

      .middle-wrap {
        width: $middle-width !important;
        height: 420px;
        margin-left: 10px;
      }

      .right-wrap {
        width: $right-width !important;
        height: 420px;
        margin-left: 10px;
      }
    }

    .el-dialog__footer {
      .modal-footer {
        .btn-submit {
          margin-left: 0;
        }
      }
    }
  }
</style>
