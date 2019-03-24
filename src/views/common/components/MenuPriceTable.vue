<template>
  <div class="menu-price-table">
    <el-table :data="tableData" border>
      <el-table-column align="center" width="50" v-if="!readOnly">
        <template slot-scope="scope">
          <el-radio class="radio" v-model="radio" :label="scope.$index" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="orderUint" label="规格／单位" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isEdit">{{ scope.row.orderUint }}</span>
          <el-select
            v-if="!scope.row.isEdit"
            :ref="getRefName(scope.$index)"
            v-model="scope.row.orderUint"
            @change="onChangeSelect(scope.row)">
            <div class="custom-unit" v-if="!isQuality">
              <el-input class="unit-input" placeholder="+新规格" v-model="scope.row.customUnit" :maxlength="10" @keyup.enter.native="handleAddUnit(scope.row, scope.$index)"/>
              <i class="el-icon-check" @click="handleAddUnit(scope.row, scope.$index)" />
            </div>
            <el-option v-for="(item, index) in orderUnitList" :key="index" :label="item.word" :value="item.word" class="custom-unit-option">{{item.word}}
              <i class="el-icon-close" @click="onShowDeleteConfirm(item)" />
            </el-option>
            <el-option v-for="item in options" :key="item" :label="item" :value="item" class="custom-unit-option">{{item}}
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="initCount" label="*起点数量">
        <template slot-scope="scope">
          <el-input-number class="price-input" v-model="scope.row.initCount" :min="1" :controls="false" :disabled="readOnly"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="minAddMenuCount" label="最小加菜数">
        <template slot-scope="scope">
          <el-input-number class="price-input" v-model="scope.row.minAddMenuCount" :min="1" :controls="false" :disabled="readOnly"/>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="maxNumber" label="最大可点数量">
        <template slot-scope="scope">
          <el-input
            :disabled="readOnly"
            class="price-input"
            placeholder="不限"
            v-model="scope.row.maxNumber"
            @blur="(event) => onBlurMaxNumber(event, scope.row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="salePrice" label="*价格(元)">
        <template slot-scope="scope">
          <el-input
            :disabled="readOnly"
            class="price-input"
            v-model="scope.row.salePrice"
            placeholder="金额"
            @blur="(event) => onBlurSalePrice(event, scope.row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="vipprice" label="*会员价(元)">
        <template slot-scope="scope">
          <el-input
            :disabled="readOnly"
            class="price-input"
            v-model="scope.row.vipprice"
            placeholder="金额"
            @blur="(event) => onBlurPrice(event, scope.row, 'vipprice')" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="costPrice" label="成本价(元)">
        <template slot-scope="scope">
          <el-input
            :disabled="readOnly"
            class="price-input"
            v-model="scope.row.costPrice"
            placeholder="金额"
            @blur="(event) => onBlurPrice(event, scope.row, 'costPrice')" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="!readOnly">
        <template slot-scope="scope">
          <mw-button class="btn-delete" content="删除" @click="onDeletePrice(scope.row, scope.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" class="btn-add-price" icon="el-icon-plus" @click="onClickAddPrice" v-if="!readOnly">添加价格</el-button>
    <div v-if="hasError" class="error-wrapper">*请填写正确的菜品价格</div>
    <Toast
      ref='toast'
      :content="content"
      :timeout="3000"
      type="warning" />
    <popup
      title="删除操作"
      tips="原绑定菜品规格全部默认为'份'或'斤'，是否确认"
      :handleOk="onDeleteUnit"
      ref="deleteConfirm" />
  </div>
</template>

<script>
  import { Toast, MwButton, Popup } from 'components';
  import { MENU_UNIT, MENU_UNIT_OF_QUALITY } from 'constant/constants';
  import { REGEX_PRICE, REGEX_NUMBER, REGEX_UNIT_NAME,REGEX_DISH_NAME } from 'constant/regex';
  import { ERROR_INVALID_DISH_NAME } from 'constant/errorMessage';
  import cloneDeep from 'lodash/cloneDeep';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'priceTable',
    components: {
      Toast,
      MwButton,
      Popup
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      isQuality: {
        type: [Boolean, Number],
        default: false
      },
      data: {
        type: Array,
        default: () => []
      },
      menuUnit: {
        type: Object,
        default: () => {}
      },
      deleteMenuUnit: {
        type: Function,
        default: () => {}
      },
      itemCd : {
        type : Number,
        default : -1,
      }
    },
    data () {
      return {
        radio: 0,
        hasError: false,
        content: '',
        options: this.isQuality ? MENU_UNIT_OF_QUALITY : MENU_UNIT,
        priceItem: {
          orderUint: this.isQuality ? MENU_UNIT_OF_QUALITY[0] : MENU_UNIT[0],
          initCount: '1',
          minAddMenuCount:'1',
          salePrice: '',
          vipprice: '',
          costPrice: '',
          customUnit: '',
          maxNumber: ''
        },
        tableData: [],
        toBeDeletedUnit: '',
        editRow: null
      };
    },
    computed: {
      ...mapState({
        error: state => state.error,
        orderUnitList: state => state.businessSetting.orderUint.orderUnitList
      })
    },
    watch: {
      isQuality () {
        this.options = this.isQuality ? MENU_UNIT_OF_QUALITY : MENU_UNIT;
        this.priceItem.orderUint = this.options[0];
        if (this.isEdit) return;
        this.tableData = this.tableData.map(item => {
          if (!item.isEdit) {
            item.orderUint = this.options[0];
          }
          return item;
        });
      },
      data () {
        const editData = this.data.slice();
        if (editData.length) {
          this.tableData = editData.map(item => {
            const { salePrice, vipprice, costPrice } = item;
            return {
              ...item,
              salePrice: !salePrice ? salePrice : salePrice.toFixed(2),
              vipprice: !vipprice ? vipprice : vipprice.toFixed(2),
              costPrice: !costPrice ? costPrice : costPrice.toFixed(2),
              isEdit: true
            };
          });

          this.radio = editData.findIndex(item => item.def);
        }
      }
    },
    created () {
      this.onClickAddPrice();
      this.fetchAllOrderUintList();
    },
    methods: {
      ...mapActions([
        'fetchAllOrderUintList',
        'saveOrderUint',
        'deleteOrderUint'
      ]),
      getRefName (index) {
        return 'unitSelect' + index;
      },
      async handleAddUnit (row, index) {
        const { customUnit } = row;
        //if (!REGEX_UNIT_NAME.test(customUnit)) {
        if (!REGEX_DISH_NAME.test(customUnit)) {
          //this.$toast.show({ content: '规格单位只能包含中英文', type: 'warning' });
          this.$toast.show({ content: ERROR_INVALID_DISH_NAME, type: 'warning' });
          return;
        }

        await this.saveOrderUint({ reason: customUnit });
        const { errorStatus } = this.error;
        if (errorStatus) {
          this.$toast.show({ content: '添加规格失败', type: 'warning' });
        } else {
          row.orderUint = customUnit;
          row.customUnit = '';
          this.fetchAllOrderUintList();
        }
        this.onCloseSelect(index);
      },
      async onDeletePrice (row, index) {
        const { itemCd, orderUintCd } = row;
        await this.deleteMenuUnit({ itemCd, orderUintCd });
        const { message, msgType } = this.menuUnit;
        if (msgType && message) {
          this.content = message;
          this.$refs.toast.isShow = true;
          return;
        }

        if (this.tableData.length > 1) {
          this.radio = 0;
          this.tableData.splice(index, 1);
        }
      },
      onClickAddPrice () {
        this.tableData.push(cloneDeep(this.priceItem));
      },
      onChangeSelect (row) {
        row.salePrice = '';
        row.vipprice = '';
        row.costPrice = '';
      },
      onBlurSalePrice (event, row) {
        const { value } = event.target;
        if (!value.length) return;
        row.salePrice = REGEX_PRICE.test(value) ? parseFloat(value).toFixed(2) : null;

        if (!row.vipprice) {
          row.vipprice = row.salePrice;
        }
      },
      onBlurPrice (event, row, type) {
        const { value } = event.target;
        if (!value.length) return;
        row[type] = REGEX_PRICE.test(value) ? parseFloat(value).toFixed(2) : null;
      },
      onBlurMaxNumber (event, row) {
        const { value } = event.target;
        row.maxNumber = REGEX_NUMBER.test(value) ? value : null;
      },
      onCloseSelect (index) {
        this.$refs['unitSelect' + index].handleClose();
      },
      onShowDeleteConfirm (row) {
        this.editRow = row;
        this.$refs.deleteConfirm.isShow = true;
      },
      async onDeleteUnit () {
        const item = this.orderUnitList.find(item => item.word === this.editRow.word);
        let {id, word} = item;
        console.log('itemCd ->',this.itemCd);
        await this.deleteOrderUint({id:item.id,unitId:item.id,unitName:word , itemCd : this.itemCd});
        const { errorStatus } = this.error;
        if (errorStatus) {
          this.$toast.show({ content: '删除规格失败', type: 'warning' });
        } else {
          await this.fetchAllOrderUintList();
          const unitList = this.orderUnitList.map(item => item.word);
          this.tableData.map((item) => {
            if (!unitList.includes(item.orderUint)) {
              item.orderUint = this.isQuality ? MENU_UNIT_OF_QUALITY[0] : MENU_UNIT[0];
            }
          });
        }
      },
      getData () {
        return this.tableData.map((item, index) => {
          return { ...item, def: index === this.radio ? 1 : 0 };
        });
      },
      checkEmpty () {
        let hasError = false;
        const noEmptykeys = ['initCount', 'salePrice', 'vipprice'];
        noEmptykeys.map(key => {
          this.tableData.map((item) => {
            if (!item[key] && item[key] !== 0) {
              hasError = true;
            }
          });
        });

        this.hasError = hasError;
        return hasError;
      }
    }
  };
</script>

<style lang="scss">
  .menu-price-table {
    width: calc(100% - 300px);
    display: inline-block;

    .cell {
      padding: 0;
    }

    .price-input {
      width: 100%;

      .el-input__inner {
        text-align: center;
      }
    }

    .error-wrapper {
      margin-top: 5px;
      color: #ff4949;
    }

    .radio {
      .el-radio__label {
        display: none;
      }
    }

    .btn-add-price {
      width: 100%;
      margin-top: -2px;
      border-radius: 0;
      border-color: #ddd;
    }
  }

  .custom-unit {
    padding: 5px 15px;

    .unit-input {
      width: 120px;
      display: inline-block;

      .el-input__inner {
        width: 120px;
        display: inline-block;
      }
    }
  }

  .custom-unit-option {
    > i {
      float: right;
      margin-top: 7px;
    }
  }
</style>
