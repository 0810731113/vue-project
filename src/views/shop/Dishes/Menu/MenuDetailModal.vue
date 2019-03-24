<template>
  <el-dialog custom-class="base-modal" :visible.sync="isShow" width="80%" title="菜品详情">
    <div class="menu-detail-wrapper">
      <el-form class="mw-form" label-width="20%" ref="form" :model="form">
        <el-form-item label="菜品条码:" prop="barCode" v-if="isShop">
          <el-input v-model="form.barCode" :maxlength='32' disabled/>
        </el-form-item>
        <el-form-item label="菜品名称:" prop="itemName">
          <el-input v-model="form.itemName" :maxlength='30' disabled/>
        </el-form-item>
        <el-form-item label="菜品助记码:" prop="helpCode">
          <el-input ref="helpCode" v-model="form.helpCode" :maxlength='30' disabled/>
        </el-form-item>
        <el-form-item label="第二语言:" prop="itemName2">
          <el-input v-model="form.itemName2" :maxlength='50' disabled/>
        </el-form-item>
        <el-form-item label="菜单分类:" prop="menuClsId">
          <el-cascader
            class="menu-cascader"
            :options="classListWithAll"
            :props="defaultProps"
            v-model="form.menuClsId"
            disabled
          />
        </el-form-item>
        <el-form-item label="销售归属" prop="expClsId" v-if="isShop">
          <el-select v-model="form.expClsId" class="width-full" disabled>
            <el-option
              v-for="item in expclsList"
              :key="item.expClsId"
              :label="item.expClsName"
              :value="item.expClsId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收入归属" prop="revenueTypeId" v-if="isShop">
          <el-select v-model="form.revenueTypeId" class="width-full" disabled>
            <el-option
              v-for="item in revenueTypeList"
              :key="item.revenueTypeId"
              :label="item.revenueTypeName"
              :value="item.revenueTypeId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="mw-form-item menu-options">
        <div class="el-form-item__label menu-option-title" style="width: 20%;">菜品选项:</div>
      </div>
      <div class="menu-option">
        <div v-for="option in menuOptions" :key="option.name" class="option-menu-btns">
          <el-button
            v-for="item in option.items"
            :key="item.tips"
            :class="{ 'selected': item.isSelect }"
            class="btn-base btn-option"
            disabled
          >
            {{ item.tips }}
          </el-button>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">菜品价格:</label>
        <menu-price-table
          :readOnly="true"
          ref="priceTable"
          :isQuality="checkOptions('isEditQty')"
          :isEdit="true"
          :data="priceTable"
          :menuUnit="menuUnit"
          :deleteMenuUnit="deleteMenuUnit" />
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">菜品要求:</label>
        <div class="menu-explain-table">
          <el-table :data="explainTable" ref="explainTable" border>
            <el-table-column prop="askGpId" align="center" label="要求组编号" min-width="50%" />
            <el-table-column prop="askGpName" align="center" label="要求组名称" min-width="50%" />
          </el-table>
          <div class="expand-explain" v-if="explainList.length > 2">
            <el-button class="btn-expand" type="primary" :icon="isExpandExplain ? 'arrow-up' : 'arrow-down'" @click="onClickExpandExplain">
              {{ isExpandExplain ? "收起" : "展开" }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">菜品配料:</label>
        <div class="menu-ingredient-table">
          <el-table :data="ingredientTable" ref="ingredientTable" border>
            <el-table-column prop="menuClsId" align="center" label="配料组编号" min-width="35%" />
            <el-table-column prop="menuClsName" align="center" label="配料组名称" min-width="35%" />
            <el-table-column prop="count" align="center" label="配料数量" min-width="30%" />
          </el-table>
          <div class="expand-explain" v-if="ingredientList.length > 2">
            <el-button class="btn-expand" type="primary" :icon="isExpandIngredient ? 'arrow-up' : 'arrow-down'" @click="onClickExpandIngredient">
              {{ isExpandIngredient ? "收起" : "展开" }}
            </el-button>
          </div>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">菜品做法:</label>
        <menu-make-table ref="makeTable" v-model="makeTable" :readOnly="true"></menu-make-table>
        <div class="mw-form-content">
          <el-checkbox
            class="el-form-item__label"
            :true-label="1"
            :false-label="0"
            v-model="form.multiPractice"
            disabled>
            做法可多选
          </el-checkbox>
          <el-input-number v-model="form.practiceMin" :controls="false" :min="1" :max="form.practiceMax" :disabled="form.multiPractice === 0"></el-input-number>
          <span>~</span>
          <el-input-number v-model="form.practiceMax" :controls="false" :min="1" :max="makeTable.length" :disabled="form.multiPractice === 0"> </el-input-number>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">菜品图片:</label>
        <div class="menu-upload">
          <img :src="form.imageURL" width="100"/>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">菜品简介:</label>
        <div class="menu-introduction">
          <el-input
            disabled
            v-model="form.itemDesc"
            type="textarea"
            :maxlength="200">
          </el-input>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">备注:</label>
        <div class="menu-introduction">
          <el-input
            disabled
            v-model="form.note"
            :maxlength="20">
          </el-input>
        </div>
      </div>
      <div class="mw-form-item" v-if="!isShop">
        <label class="el-form-item__label" style="width: 20%;">显示顺序:</label>
        <div class="menu-introduction">
          <el-input-number v-model="form.sortOrder" :min="0" class="sort-input" :controls="false" disabled/>
        </div>
      </div>
      <div class="mw-form-item">
        <label class="el-form-item__label" style="width: 20%;">时间限制:</label>
        <div class="menu-sortorder">
          <el-select v-model="form.isEffectiveDate" disabled>
            <el-option label="无限制" :value="0"></el-option>
            <el-option label="固定时间" :value="1"></el-option>
          </el-select>
          <el-date-picker
            v-show="form.isEffectiveDate"
            v-model="dateTime"
            type="datetimerange">
          </el-date-picker>
          <div class="empty-date-tips" v-show="checkEmptyDate()">*请选择时间范围</div>
        </div>
      </div>
      <div class="btn-wrapper">
        <el-button class="btn-submit" @click="onCancel">返回</el-button>
      </div>
      <toast
        ref='toast'
        content="称重菜和时价菜不能与临时菜同时选择"
        type="warning" />
    </div>
  </el-dialog>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { API_UPLOAD_MENU_IMG } from 'constant/API';
  import { UNCLASSIFIED } from 'constant/statusCode';
  import { MENU_OPTIONS_BY_CLASS } from 'constant/dishMenu';
  import { INPUT_MAX_LENGTH, ITEMKIND } from 'constant/constants';
  import { MenuPriceTable, MenuMakeTable } from 'views/common/components';
  import cloneDeep from 'lodash/cloneDeep';
  import { MwUpload, Toast } from 'components';

  export default {
    name: 'MenuDetailModal',
    components: {
      MenuPriceTable,
      MenuMakeTable,
      MwUpload,
      Toast
    },
    props: {
      itemCd: {
        type: [String, Number],
        default: null
      },
      isShop: {
        type: Boolean,
        default: true
      },
      menuClsId: {
        type: Array,
        default: () => [-1]
      }
    },
    data () {
      return {
        isShow: false,
        UNCLASSIFIED,
        INPUT_MAX_LENGTH,
        API_UPLOAD_MENU_IMG,
        menuOptions: cloneDeep(MENU_OPTIONS_BY_CLASS),
        explainTable: [],
        isExpandExplain: false,
        isExpandIngredient: false,
        ingredientTable: [],
        menuitemaskgpDtos: [],
        menuingredgprelDtos: [],
        dateTime: [],
        menuClsList: [],
        form: {
          itemId: '',
          barCode: null,
          itemName: '',
          itemName2: '',
          helpCode: '',
          menuClsId: [-1],
          isEffectiveDate: 0,
          expClsId: UNCLASSIFIED,
          revenueTypeId: UNCLASSIFIED,
          note: null,
          itemDesc: null,
          practiceMin: 1,
          practiceMax: 1,
          multiPractice: 0
        },
        makeTable: [],
        priceTable: [],
        defaultProps: {
          value: 'menuClsId',
          label: 'menuClsName',
          children: 'children'
        }
      };
    },
    watch: {
      'makeTable.length' () {
        if (this.form.practiceMax > this.makeTable.length) {
          this.form.practiceMax = this.makeTable.length;
        }

        if (this.form.practiceMin > this.makeTable.length) {
          this.form.practiceMin = this.makeTable.length;
        }

        if (this.makeTable.length === 0) {
          this.form.multiPractice = 0;
        }
      },
      async isShow () {
        if (this.isShow) {
          await this.fetchMenuClassList({
            type: ITEMKIND.DISH,
            showSystemData: true
          });
          if (this.isShop) {
            await this.fetchAllExpcls();
            await this.fetchAllRevenueType();
          }

          await this.getMenuDetail({ itemCd: this.itemCd });
          this.initEditData(this.detail);

          this.menuClsList = this.getMenuClsList();
          const { explainList, ingredientList } = this;
          this.explainTable = explainList ? explainList.slice(0, 2) : [];
          this.ingredientTable = ingredientList ? ingredientList.slice(0, 2) : [];
        }
      }
    },
    computed: mapState({
      lastId: state => state.dishes.menu.lastId,
      helpCode: state => state.dishes.menu.helpCode,
      errorStatus: state => state.error.errorStatus,
      detail: state => state.dishes.menu.detail,
      menuUnit: state => state.dishes.menu.menuUnit,
      expclsList: state => state.dishes.classify.expclsList,
      revenueTypeList: state => state.dishes.classify.revenueTypeList,
      ingredientList () {
        return (this.detail.menuingredgprelDtos || []).map(item => {
          const { menuClsId, menuClsName, count, checked } = item;
          return { menuClsId, menuClsName, count, checked };
        });
      },
      explainList () {
        return (this.detail.menuitemaskgpDtos || []);
      },
      classListWithAll () {
        const allClassify = this.$store.state.dishes.menu.classList;
        const classListWithAll = allClassify ? allClassify.slice() : [];
        classListWithAll.unshift({ menuClsId: -1, menuClsName: '全部分类', children: null });
        return classListWithAll;
      }
    }),
    methods: {
      ...mapActions([
        'getMenuDetail',
        'getMenuLastId',
        'getMenuHelpCode',
        'fetchMenuClassList',
        'fetchAllExplain',
        'getIngredientGroups',
        'saveMenuItem',
        'deleteMenuUnit',
        'updateMenuItem',
        'fetchAllExpcls',
        'fetchAllRevenueType'
      ]),
      initEditData (data) {
        const { barCode, menuClsId, isEffectiveDate, starDate, endDate } = data;
        let clsIds = [menuClsId];

        this.classListWithAll.map(first => {
          if (first.children) {
            first.children.map(second => {
              if (second.menuClsId === menuClsId) {
                clsIds.unshift(second.menuClsId_P);
              }
              if (second.children) {
                second.children.map(third => {
                  if (third.menuClsId === menuClsId) {
                    clsIds.unshift(third.menuClsId_P);
                    clsIds.unshift(second.menuClsId_P);
                  }
                });
              }
            });
          }
        });

        this.form = {
          ...data,
          menuClsId: clsIds,
          barCode: barCode || null
        };

        if (isEffectiveDate) {
          this.dateTime = [new Date(starDate), new Date(endDate)];
        }
        this.menuOptions = this.menuOptions.map(options => {
          options.items.map(option => {
            option.isSelect = data[option.key];
            return option;
          });
          return options;
        });

        this.explainList.map(item => {
          if (+item.checked) {
            this.menuitemaskgpDtos.push(item);
          }
        });
        this.ingredientList.map(item => {
          if (+item.checked) {
            this.menuingredgprelDtos.push(item);
          }
        });
        this.makeTable = cloneDeep(data.askDtos);
        this.priceTable = data.menuItemUintDtos;
        this.onSelectedItems('explainTable', this.menuitemaskgpDtos);
        this.onSelectedItems('ingredientTable', this.menuingredgprelDtos);
      },
      onClickExpandExplain () {
        const { explainList, isExpandExplain } = this;
        this.explainTable = isExpandExplain ? explainList.slice(0, 2) : explainList;
        this.isExpandExplain = !isExpandExplain;
        this.onSelectedItems('explainTable', this.menuitemaskgpDtos);
      },
      onClickExpandIngredient () {
        const { ingredientList, isExpandIngredient } = this;
        this.ingredientTable = isExpandIngredient ? ingredientList.slice(0, 2) : ingredientList;
        this.isExpandIngredient = !isExpandIngredient;
        this.onSelectedItems('ingredientTable', this.menuingredgprelDtos);
      },
      onSelectedItems (type, datas) {
        const refDom = this.$refs[type];
        setTimeout(() => {
          datas.map(row => { refDom.toggleRowSelection(row); });
        }, 0);
      },
      getMenuClsList (items, menuClsId) {
        let list = [...this.classListWithAll];
        this.classListWithAll.map(item => {
          if (item.children) {
            list = [...list, ...item.children];
            item.children.map(subItem => {
              if (subItem.children) {
                list = [...list, ...subItem.children];
              }
            });
          }
        });
        return list;
      },
      getImageURI (path) {
        this.form.imageURL = path;
      },
      checkOptions (key) {
        let allOptions = [];
        this.menuOptions.map(option => { allOptions = [...allOptions, ...option.items]; });
        return allOptions.find(item => item.key === key).isSelect;
      },
      checkEmptyDate () {
        const [starDate, endDate] = this.dateTime;
        const { isEffectiveDate } = this.form;
        return isEffectiveDate ? !starDate && !endDate : false;
      },
      onCancel () {
        this.isShow = false;
      }
    }
  };
</script>

<style lang="scss">
  .menu-detail-wrapper {
    .mw-form {
      width: 80%;
      padding-bottom: 0;

      .el-form-item__content {
        width: 400px;
      }

      .el-form-item__label {
        font-size: 16px;
      }

      .menu-cascader {
        width: 100%;
      }
    }

    .mw-form-item {
      width: 85%;
      margin: 0 auto;
      margin-bottom: 15px;
      min-height: 100px;

      .menu-make,
      .menu-price {
        width: calc(100% - 300px);
      }

      .menu-option-title {
        float: inherit;
      }

      .el-form-item__label {
        font-size: 16px;
      }
    }

    .menu-option {
      margin: 0 0 25px 20%;
    }

    .menu-options {
      margin-bottom: 0;
    }

    .option-menu-btns {
      margin-left: 50px;
      margin-bottom: 10px;

      .option-menu-tips {
        font-size: 11pt;
        font-weight: 500;
        color: #999;
        margin-right: 10px;
      }
    }

    .menu-introduction,
    .menu-ingredient-table,
    .menu-explain-table {
      width: calc(100% - 300px);
      display: inline-block;

      .sort-input {
        width: 100%;
      }

      thead {
        .el-table-column--selection {
          .el-checkbox {
            visibility: hidden;
          }
        }
      }
    }

    .mw-form-content {
      margin-left: 20%;
      margin-top: 10px;
    }

    .expand-explain {
      text-align: center;

      .btn-expand {
        width: 100%;
        margin-top: -4px;
        border-radius: 0;
        border-color: #ddd;
      }
    }

    .btn-option {
      width: 100px;
      height: 26px;
      margin: 0 10px 5px 0;
      display: none;

      &:focus {
        background: transparent;
        border: 1px solid rgba(153, 153, 153, 0.62);
      }

      &.selected {
        display: inline-block;
        color: #F36B5F;
        border: 1px solid #F36B5F;
        border-radius: 3px;
      }
    }

    .menu-upload {
      display: inline-block;

      .upload-tips {
        color: #ddd;
        margin-top: 8px;
      }

      .upload-initial {
        margin-top: 15px;
      }
    }

    .empty-date-tips {
      padding-left: 15px;
      color: #ff4949;
      display: inline-block;
    }

    .btn-wrapper {
      width: 100%;
      text-align: center;
      margin: 20px 0 30px;
    }
  }
</style>
