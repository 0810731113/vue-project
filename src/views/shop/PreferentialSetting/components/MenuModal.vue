<template>
  <el-dialog custom-class="base-modal discount-modal" :visible.sync="isShow" size="small">
    <div class="modal-title" slot="title">请选择菜品</div>
    <div class="content">
      <div class="search-wrap">
        <el-input class="search-input" placeholder="请输入菜品名称" v-model="itemName">
          <el-button slot="append" icon="el-icon-search" @click="onClickSearch"></el-button>
        </el-input>
      </div>
      <div class="left-wrap el-col-7">
        <el-tree
          class="relation-tree"
          :data="treeDatas"
          :props="defaultProps"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
          @node-click="onClickNode"
        />
      </div>
      <div class="right-wrap el-col-17">
        <el-table border ref="discount" :data="list" :height="420" @selection-change="onChangeSelection">
          <el-table-column type="selection" :selectable="onCheckDefalut" />
          <el-table-column prop="itemId" align="center" label="菜品编号" min-width="30%" />
          <el-table-column prop="itemName" class-name="table-auto" align="center" label="菜品名称" min-width="30%">
            <template slot-scope="scope">
              {{ scope.row.itemName }}
              <div class="discount-tips" v-if="isFull && getBargainPrice(scope.row)">已添加 {{ getBargainPrice(scope.row) }}元</div>
            </template>
          </el-table-column>
          <el-table-column prop="orderUint" align="center" label="规格" min-width="20%" />
          <el-table-column prop="salePrice" align="center" label="销售单价" min-width="20%" />
        </el-table>
      </div>
      <div class="bottom-wrap" v-if="isFull">
        <div class="el-col-10">
          <div class="title">请输入折扣率</div>
          <div class="item">
            <el-input-number :min="0" :max="100" size="small" v-model="fullForm.discount" controls-position="right"/>
            <span class="tips">举例：打九折折扣率为10%</span>
          </div>
        </div>
        <div class="el-col-7">
          <div class="title">计算精度</div>
          <div class="item">
            <el-radio v-model="fullForm.accuracy" :label="1">元</el-radio>
            <el-radio v-model="fullForm.accuracy" :label="10">角</el-radio>
            <el-radio v-model="fullForm.accuracy" :label="100">分</el-radio>
          </div>
        </div>
        <div class="el-col-7">
          <div class="title">尾数处理</div>
          <div class="item">
            <el-radio v-model="fullForm.mantissa" :label="-1">进位</el-radio>
            <el-radio v-model="fullForm.mantissa" :label="0">四舍五入</el-radio>
            <el-radio v-model="fullForm.mantissa" :label="1">舍去</el-radio>
          </div>
        </div>
      </div>
      <div class="bottom-wrap buy-gift" v-if="!isFull">
        <div class="item el-col-8" align="center">
          <div>前
            <el-input-number :min="0" size="small" :value="giftForm.saleQty" @change="(e) => onChangeNumber(e, 'saleQty')" controls-position="right"/>
            份原价
          </div>
          <div>后
            <el-input-number :min="0" size="small" :value="giftForm.saleQty_gift" @change="(e) => onChangeNumber(e, 'saleQty_gift')" controls-position="right"/>
            份变价
          </div>
        </div>
        <div class="item el-col-8" align="center">
          <div>原价</div>
          <div class="tips">举例：打九折折扣率为10%</div>
        </div>
        <div class="item el-col-8">
          <div>
            <el-radio v-model="giftForm.isDiscount" :label="false" >{{ '' }}</el-radio>
            <span class="buy-gift-tips">以</span><el-input-number :min="0" size="small" v-model="giftForm.bargainPrice" controls-position="right"/>元执行
          </div>
          <div>
            <el-radio v-model="giftForm.isDiscount" :label="true" >{{ '' }}</el-radio>
            <span>以折扣率</span><el-input-number :min="0" :max="100"  size="small" v-model="giftForm.discountRate" controls-position="right"/>％执行
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'menuModal',
  props: {
    isFull: {
      type: Boolean,
      default: true
    },
    selectedItem: {
      type: Array,
      default: () => []
    },
    onSubmitItems: {
      type: Function,
      default: () => {}
    },
    selectedIds: {
      type: Array,
      default: () => []
    },
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isShow: false,
      itemName: '',
      menuClsId: '',
      items: [],
      fullForm: {
        discount: 0,
        accuracy: 1,
        mantissa: -1
      },
      giftForm: {
        saleQty: 0,
        saleQty_gift: 0,
        isDiscount: false,
        discountRate: 0,
        bargainPrice: 0
      },
      defaultProps: {
        children: 'children',
        label: 'menuClsName'
      }
    };
  },
  async created () {
    await this.fetchBargainMenus();
    await this.fetchMenuTrees();
  },
  watch: {
    selectedIds () {
      this.onSelectedItem();
    }
  },
  computed: mapState({
    list: state => state.preferential.menuList,
    treeDatas: state => state.preferential.treeDatas
  }),
  methods: {
    ...mapActions([
      'fetchBargainMenus',
      'fetchMenuTrees'
    ]),
    async onClickNode (data) {
      this.menuClsId = data.menuClsId;
      await this.onClickSearch();
    },
    async onClickSearch () {
      const { menuClsId, itemName } = this;
      await this.fetchBargainMenus({ menuClsId, itemName });
      this.items = this.list.filter(item => this.selectedIds.includes(item.itemCd));
      this.onSelectedItem();
    },
    onChangeSelection (items) {
      this.items = items;
    },
    onCheckDefalut (row) {
      return this.selectedIds.findIndex(item =>
        item.itemCd === row.itemCd &&
        item.orderUint === row.orderUint &&
        item.salePrice === row.salePrice
      ) < 0;
    },
    onSelectedItem () {
      this.items.map(item => {
        this.$refs.discount.toggleRowSelection(item, !this.onCheckDefalut(item));
      });
    },
    onChangeNumber (value, type) {
      this.giftForm[type] = parseInt(value);
    },
    onSubmit () {
      if (!this.items.length) return;
      const { items, isFull, giftForm } = this;

      const datas = items.map(item => {
        if (isFull) {
          return { ...item, bargainPrice: this.getDiscountPrice(item.salePrice) };
        }

        return { ...item, ...giftForm };
      });
      this.onSubmitItems(datas);
      this.isShow = false;
    },
    getBargainPrice (row) {
      const item = this.selectedItems.find(item =>
        item.itemCd === row.itemCd &&
        item.orderUint === row.orderUint &&
        item.salePrice === row.salePrice
      );
      return item && item.bargainPrice;
    },
    getDiscountPrice (price) {
      const { discount, accuracy, mantissa } = this.fullForm;
      const discountPrice = (price * (100 - discount) / 100) * accuracy;

      switch (mantissa) {
        case -1:
          return Math.ceil(discountPrice) / accuracy;
        case 0:
          return Math.round(discountPrice) / accuracy;
        case 1:
          return Math.floor(discountPrice) / accuracy;
      }
    }
  }
};
</script>

<style lang="scss">
.discount-modal {
  width: 1000px;

  .content {
    display: inline-block;

    .search-wrap {
      text-align: end;
      padding-bottom: 10px;
      margin-top: -24px;

      .search-input {
        width: 35%;
      }
    }

    .left-wrap {
      width: 230px !important;
      height: 420px;
      border: 1px solid #d1dbe5;
      overflow: auto;

      .el-tree {
        border: none;
      }
    }

    .right-wrap {
      width: 720px !important;
      height: 420px;
      margin-left: 10px;
    }

    .bottom-wrap {
      width: 100%;
      padding: 15px;
      display: inline-block;

      .title {
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 5px;
      }

      .item {
        height: 36px;
        line-height: 36px;

        .el-input-number {
          width: 120px;

          .el-input-number__decrease,
          .el-input-number__increase {
            display: none;
          }

          .el-input__inner {
            padding-right: 0;
          }
        }

        .tips {
          color: #F36B5F;
        }
      }
    }

    .buy-gift {
      font-size: 16px;

      .buy-gift-tips {
        width: 64px;
        display: inline-block;
      }
    }

    .discount-tips {
      color: #ff4949;
      margin-left: 5px;
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
