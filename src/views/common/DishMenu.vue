<template>
  <div class="menu-wrapper">
    <el-form class="mw-form" label-width="20%" ref="form" :rules="rules" :model="form">
      <el-form-item label="菜品编码:" prop="itemId">
        <el-input placeholder="输入菜品编码, 支持数字、字母" v-model="form.itemId" :maxlength='16'/>
      </el-form-item>
      <el-form-item label="菜品条码:" prop="barCode" v-if="isShop">
        <el-input placeholder="输入菜品条码, 支持数字、字母, 最长32位" v-model="form.barCode" :maxlength='32'/>
      </el-form-item>
      <el-form-item label="菜品名称:" prop="itemName">
        <el-input ref="dishName" placeholder="输入菜品名称" v-model="form.itemName" @blur="onBlurItemName" :maxlength='30'/>
      </el-form-item>
      <el-form-item label="菜品助记码:" prop="helpCode">
        <el-input placeholder="输入菜品助记码" ref="helpCode" v-model="form.helpCode" :maxlength='30'/>
      </el-form-item>
      <el-form-item label="第二语言:" prop="itemName2">
        <el-input placeholder="输入菜品第二语言" v-model="form.itemName2" :maxlength='50'/>
      </el-form-item>
      <el-form-item label="菜单分类:" prop="menuClsId">
        <mw-cascader
          class="menu-cascader"
          :options="classListWithAll"
          :props="defaultProps"
          v-model="form.menuClsId"
          @change="onChangeMenuCls"
          @addMenu="handleAddClassify"
        />
      </el-form-item>
      <el-form-item label="销售归属" prop="expClsId" v-if="isShop">
        <el-select v-model="form.expClsId" class="width-50-percent">
          <div class="el-select-dropdown__item tool-item" @click="onShowModal('sale')"><i class="el-icon-plus"></i>添加销售归属
          </div>
          <el-option v-for="(item,index) in expclsList"
                     :key="item.expClsId"
                     :label="item.expClsName"
                     :value="item.expClsId"
                     :class="{ 'first-option': index === 0 }"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收入归属" prop="revenueTypeId" v-if="isShop">
        <el-select v-model="form.revenueTypeId" class="width-50-percent">
          <div class="el-select-dropdown__item tool-item" @click="onShowModal('income')"><i class="el-icon-plus"></i>添加收入归属
          </div>
          <el-option
            v-for="(item, index) in revenueTypeList"
            :key="item.revenueTypeId"
            :label="item.revenueTypeName"
            :value="item.revenueTypeId"
            :class="{ 'first-option': index === 0 }"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="mw-form-item menu-options">
      <div class="el-form-item__label menu-option-title" style="width: 20%;">菜品选项:</div>
    </div>
    <div class="menu-option">
      <div v-for="option in menuOptions" :key="option.name" class="option-menu-btns">
        <label class="option-menu-tips" style="width: 20%;">{{ option.name }}</label>
        <div v-for="item in option.items" :key="item.tips" style="display: inline-block">
          <el-button
            :class="{ 'selected': item.isSelect }"
            class="btn-base btn-option"
            @click="onSelectOption(item)"
          >
            {{ item.tips }}
          </el-button>
          <Tips v-if="item.key === 'isTemporaryMenu'"
                content="版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上<br/>若使用其它版本，客户端结账会有损失，请注意此风险"></Tips>
        </div>
      </div>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">秒点服务:</label>
      <!--<label class="option-menu-tips" style="width: 20%;">秒点服务</label>-->
      <el-radio v-for="item in saleTypeList" :key="item.tips" v-model="form.saleType" :label="item.key" border>{{item.tips}}</el-radio>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;"><span class="required">*</span>菜品价格:</label>
      <menu-price-table
        ref="priceTable"
        :isQuality="checkOptions('isEditQty')"
        :isEdit="isEdit"
        :data="priceTable"
        :menuUnit="menuUnit"
        :deleteMenuUnit="deleteMenuUnit"
        :itemCd="itemCd"/>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">菜品要求:</label>
      <div class="menu-explain-table">
        <el-table :data="explainTable" ref="explainTable" border @selection-change="onChangeExplain">
          <el-table-column type="selection"/>
          <el-table-column prop="askGpId" align="center" label="要求组编号" min-width="50%"/>
          <el-table-column prop="askGpName" align="center" label="要求组名称" min-width="50%"/>
        </el-table>
        <div class="expand-explain" v-if="explainList.length > 2">
          <el-button class="btn-expand" type="primary" :icon="isExpandExplain ? 'arrow-up' : 'arrow-down'"
                     @click="onClickExpandExplain">
            {{ isExpandExplain ? "收起" : "展开" }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">菜品配料:</label>
      <div class="menu-ingredient-table">
        <div class="mw-form-content">
          <span class="jard-max-cont">菜品配料最大可点数量</span>
          <el-input :class=" `jard-max` " v-model="form.matchMax" prop="limitIngredientMax" placeholder="不限" :min="0"
                    :max="ingredientMax" :disabled="!menuingredgprelDtos.length"></el-input>
          <span class="jard-min-cont">菜品配料起点数量</span>
          <el-input-number :class=" `jard-min` " v-model="form.matchMin" :controls="false" :min="0"
                           :max="+form.matchMax" :disabled="!menuingredgprelDtos.length"></el-input-number>
        </div>
        <el-table :data="ingredientTable" ref="ingredientTable" border @selection-change="onChangeIngredient">
          <el-table-column type="selection"/>
          <el-table-column prop="menuClsId" align="center" label="配料组编号" min-width="35%"/>
          <el-table-column prop="menuClsName" align="center" label="配料组名称" min-width="35%"/>
          <el-table-column prop="count" align="center" label="配料数量" min-width="30%"/>
        </el-table>
        <div class="expand-explain" v-if="ingredientList.length > 2">
          <el-button class="btn-expand" type="primary" :icon="isExpandIngredient ? 'arrow-up' : 'arrow-down'"
                     @click="onClickExpandIngredient">
            {{ isExpandIngredient ? "收起" : "展开" }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">菜品做法:</label>
      <div class="menu-ingredient-table">
        <div class="mw-form-content">
          <el-checkbox
            class="el-form-item__label"
            :true-label="1"
            :false-label="0"
            v-model="form.multiPractice"
            @change="onMenuCookCheckBoxChange"
            :disabled="makeTable.length === 0">
            做法可多选
          </el-checkbox>
          <span class="jard-max-cont">菜品做法最大可点数量</span>
          <el-input-number :class=" `jard-max` " v-model="form.practiceMax" :controls="false" placeholder="不限" :min="0"
                           :disabled="!makeTable.length || form.multiPractice === 0 "
                           :max="makeTable.length"></el-input-number>
          <span class="jard-min-cont">菜品做法起点数量</span>
          <el-input-number :class=" `jard-min` " v-model="form.practiceMin" :controls="false" :min="0"
                           :disabled="!makeTable.length" :max="form.practiceMax"></el-input-number>
        </div>
        <menu-make-table ref="makeTable" v-model="makeTable"></menu-make-table>
      </div>
    </div>

    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">上传菜品图片:</label>
      <div class="menu-upload">
        <div class="upload-tips">支持jpg，jpeg，bmp和png，建议分辨率大于 1280*800 且纵横比16:10</div>
        <mw-upload
          ref="picUpload"
          :dataSource='(form.imageURL && form.imageURL.length) ? [{url: form.imageURL}] : []'
          :action="getActionUrl(`dishes/${API_UPLOAD_MENU_IMG}`)"
          :multipleSelect="false"
          :multipleUpload="false"
          :autoUpload="true"
          :imageURL="form.imageURL"
          :uploadImages="uploadImages"
          :imgId="+imgId"
          @changeUploadList='changeUploadList'
          @getImageURI='getImageURI'
          @changeUploadImg='changeUploadImg'>
        </mw-upload>
      </div>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">菜品简介:</label>
      <div class="menu-introduction">
        <el-input
          v-model="form.itemDesc"
          type="textarea"
          :maxlength="200"
          placeholder="字数限制不超过200个字符, 支持中文、英文、数字、空格标点符号. 例如: 香甜柔软, 横扫饥饿">
        </el-input>
      </div>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">备注:</label>
      <div class="menu-introduction">
        <el-input
          v-model="form.note"
          :maxlength="20"
          placeholder="字数限制不超过20个字符, 支持中文、英文、数字. 例如: 活动菜、三份起点">
        </el-input>
      </div>
    </div>
    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">时间限制:</label>
      <div class="menu-sortorder">
        <el-select v-model="form.isEffectiveDate" placeholder="请选择">
          <el-option label="无限制" :value="0"></el-option>
          <el-option label="固定时间" :value="1"></el-option>
        </el-select>
        <el-date-picker
          v-show="form.isEffectiveDate"
          v-model="dateTime"
          type="datetimerange"
          placeholder="选择时间范围">
        </el-date-picker>
        <div class="empty-date-tips" v-show="checkEmptyDate()">*请选择时间范围</div>
      </div>
    </div>

    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">菜品上菜顺序:</label>
      <div class="menu-sortorder">
        <el-select v-model="form.upMenuOrder" placeholder="请选择">
          <el-option label="1" :value="1"></el-option>
          <el-option label="2" :value="2"></el-option>
          <el-option label="3" :value="3"></el-option>
          <el-option label="4" :value="4"></el-option>
          <el-option label="5" :value="5"></el-option>
          <el-option label="6" :value="6"></el-option>
          <el-option label="7" :value="7"></el-option>
        </el-select>
      </div>
    </div>

    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">允许最大并菜数:</label>
      <div class="menu-introduction">
        <el-input
          v-model="form.maxTogetherMenu"
          :maxlength="2"
          placeholder="输入允许最大并菜数">
        </el-input>
      </div>
    </div>

    <div class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">退菜有效期:</label>
      <div class="menu-introduction">
        <el-input
          v-model="form.retireMenuTime"
          :maxlength="10"
          placeholder="输入退菜有效期">
        </el-input>
      </div>
    </div>

    <div v-if="menuOptions[0]['items'][4].isSelect"
         class="mw-form-item">
      <label class="el-form-item__label" style="width: 20%;">预点餐盒费:</label>
      <div class="menu-introduction">
        <el-input
          v-model="form.lunchBoxCost"
          :maxlength="10"
          placeholder="输入预点餐盒费">
        </el-input>
      </div>
    </div>

    <div class="btn-wrapper">
      <el-button class="btn-cancel" @click="onClickCancel">取消</el-button>
      <el-button class="btn-submit" @click="onClickSubmit" native-type='submit'>保存</el-button>
    </div>
    <toast
      ref='toast'
      :timeout="3000"
      content="称重菜、时价菜、手机点菜、只属套餐不能与临时菜同时选择"
      type="warning"/>
    <attribution-modal
      :type="attributionType"
      tilte="添加归属"
      :onSaveAttribution="onSaveAttribution"
      ref="attribution"/>
    <classify-modal
      ref="classifyModal"
      :level="classifyLevel"
      @levelCallback="classifyLevelCallback"
    >
    </classify-modal>

    <popup
      title="菜品保存"
      tips="当前菜品编码曾经被使用，是否重新启用并保存当前菜品？"
      :handleOk="onEditDishWhenIDExist"
      ref="popup"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { API_UPLOAD_MENU_IMG } from 'constant/API'
  import { OK, UNCLASSIFIED } from 'constant/statusCode'
  import { MENU_OPTIONS_BY_CLASS, MIAODIAN_SERVICE_SINGLE_SELECT } from 'constant/dishMenu'
  import { INPUT_MAX_LENGTH, ITEMKIND } from 'constant/constants'
  import { validateDishName, validateId, validateReportName, validateNumberGreaterThanZero } from 'utils/validateUtil'
  import { MenuPriceTable, MenuMakeTable } from './components'
  import cloneDeep from 'lodash/cloneDeep'
  import { MwUpload, Toast, Tips, Popup } from 'components'
  import fecha from 'fecha'
  import { AttributionModal, ClassifyModal } from 'views/shop/Dishes/components'
  import MwCascader from 'views/common/components/cascader'

  export default {
    name: 'DishMenu',
    components: {
      MenuPriceTable,
      MenuMakeTable,
      MwUpload,
      Toast,
      AttributionModal,
      MwCascader,
      ClassifyModal,
      Tips,
      Popup
    },
    props: {
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
      const validateMenuCls = (rule, value, callback) => {
        if (!value[0] || value.toString() === '-1') {
          callback(new Error('请选择分类'))
        } else {
          callback()
        }
      }
      return {
        UNCLASSIFIED,
        INPUT_MAX_LENGTH,
        API_UPLOAD_MENU_IMG,
        attributionType: '',
        menuOptions: cloneDeep(MENU_OPTIONS_BY_CLASS),
        saleTypeList: cloneDeep(MIAODIAN_SERVICE_SINGLE_SELECT),  //秒点服务列表
        explainTable: [],
        isExpandExplain: false,
        isExpandIngredient: false,
        ingredientTable: [],
        menuitemaskgpDtos: [],
        menuingredgprelDtos: [],
        dateTime: [],
        menuClsList: [],
        imgId: -1,               // 推荐菜品选中的图片序列
        imagesListIndex: 0,         // 推荐菜品的组数序列（每组5张)
        ingredientMax: 10000,
        classifyLevel: [],
        form: {
          itemId: '',
          barCode: null,
          itemName: '',
          itemName2: '',
          helpCode: '',
          menuClsId: [-1],
          isEffectiveDate: 0,
//          expClsId: UNCLASSIFIED,
//          revenueTypeId: UNCLASSIFIED,
          expClsId: null,
          revenueTypeId: null,
          note: null,
          itemDesc: null,
          practiceMin: 0,
          practiceMax: 1,
          multiPractice: 0,
          matchMin: 0,         // 配菜最小数
          matchMax: null,          // 配菜最大数
          sortOrder: 0,
          upMenuOrder: 1, //  上菜顺序
          retireMenuTime: 5, //--退菜有效期，默认为5。只能设置大于0的整数
          maxTogetherMenu: 1, //--允许最大并菜数，默认为1。只能设置大于0的整数
          lunchBoxCost: 0, //预点餐盒费
          saleType: 0, //秒点服务
        },
        rules: {
          barCode: [{validator: validateId, trigger: ['blur', 'change']}],
          itemId: [
            {validator: validateId, trigger: ['blur', 'change']},
            {required: true, message: '请输入菜品编码，最多输入16字符', trigger: ['blur', 'change']}
          ],
          expClsId: [
            {required: true, message: '请选择销售归属', trigger: ['blur', 'change']}
          ],
          revenueTypeId: [
            {required: true, message: '请选择收入归属', trigger: ['blur', 'change']}
          ],
          itemName: [
            {validator: validateDishName, trigger: ['blur', 'change']},
            {required: true, message: '请输入菜品名称', trigger: ['blur', 'change']}
          ],
          helpCode: [{validator: validateDishName, trigger: ['blur', 'change']}],
          itemName2: [{validator: validateReportName, trigger: ['blur', 'change']}],
          limitIngredientMax: {type: 'number', min: 0, message: '请输入正确的数字', trigger: 'blur'},
          menuClsId: [
            {required: true, message: '请选择菜品分类', trigger: ['blur', 'change']},
            {validator: validateMenuCls, trigger: ['blur', 'change']}],
        },
        makeTable: [],
        priceTable: [],
        defaultProps: {
          value: 'menuClsId',
          label: 'menuClsName',
          children: 'children',
          parentId: 'menuClsId_P',
          GrandPId: 'menuClsId_G',
          level: 'level'
        },
        isEdit: !!this.$route.params.id
      }
    },
    watch: {
      'makeTable.length' () {
        if (this.form.practiceMax > this.makeTable.length) {
          this.form.practiceMax = this.makeTable.length
        }

        if (this.form.practiceMin > this.makeTable.length) {
          this.form.practiceMin = this.makeTable.length
        }

        if (this.makeTable.length === 0) {
          this.form.multiPractice = 0
        }
//      this.makeTable[this.makeTable.length - 1].addPrice = '0';
      }
    },
    async created () {
      await this.fetchMenuClassList({
        type: ITEMKIND.DISH,
        showSystemData: true
      })
      if (this.isShop) {
        await this.fetchAllExpcls()
        await this.fetchAllRevenueType()
      }
      if (this.isEdit) {
        await this.getMenuDetail({itemCd: this.$route.params.id})
        this.formatTable()
        //console.log(this.detail)
        this.initEditData(this.detail)
        const {itemName} = this.form
        await this.fetchUploadImg({
          pictureKey: itemName,
          cookTag: '1',
          noShowError: true
        })
      } else {
        await this.getMenuLastId()
        const {lastId} = this
        this.form = {...this.form, itemId: lastId, menuClsId: this.form.menuClsId}
        await this.getIngredientGroups({})
        this.formatTable()
      }
      this.formatClsList()
    },
    computed: mapState({
      error: state => state.error,
      lastId: state => state.dishes.menu.lastId,
      helpCode: state => state.dishes.menu.helpCode,
      errorStatus: state => state.error.errorStatus,
      detail: state => state.dishes.menu.detail,
      menuUnit: state => state.dishes.menu.menuUnit,
      expclsList: state => state.dishes.classify.expclsList,
      revenueTypeList: state => state.dishes.classify.revenueTypeList,
      alluploadImages: state => state.dishes.classify.uploadImages,
      editResult: function (state) {
        return state.dishes.menu.editResult
      },
      uploadImages (state) {
        return state.dishes.classify.uploadImages.slice(this.imagesListIndex * 5, (this.imagesListIndex + 1) * 5)
      },
      itemCd () {
        return this.isEdit ? this.detail.itemCd : -1
      },
      ingredientList () {
        if (this.isEdit) {
          return (this.detail.menuingredgprelDtos || []).map(item => {
            const {menuClsId, menuClsName, count, checked} = item
            return {menuClsId, menuClsName, count, checked}
          })
        }
        return this.$store.state.dishes.ingredient.ingredGroupsList || []
      },
      explainList () {
        return (this.detail.menuitemaskgpDtos || [])
      },
      classListWithAll () {
        const allClassify = this.$store.state.dishes.menu.classList
        const classListWithAll = allClassify ? allClassify.slice() : []
        classListWithAll.unshift({menuClsId: -1, menuClsName: '全部分类', children: null})
        return classListWithAll
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
        'fetchAllRevenueType',
        'fetchUploadImg',
        'fetchAllRevenueType',
        'saveExpcls',
        'saveRevenueType'
      ]),
      formatTable () {
        this.menuClsList = this.getMenuClsList()
        const {explainList, ingredientList} = this
        this.explainTable = explainList ? explainList.slice(0, 2) : []
        this.ingredientTable = ingredientList ? ingredientList.slice(0, 2) : []
        this.ingredientMax = this.getMaxIngredient()
      },
      formatClsList () {
        this.classListWithAll.map(first => {
          if (first.children) {
            first.children.map(second => {
              if (second.children) {
                second.children.map(third => {
                  // 为第三级加入祖宗节点id
                  third.menuClsId_G = first.menuClsId
                })
              }
            })
          }
        })
      },
      getClsIds (menuClsId) {
        let clsIds = [menuClsId]

        this.classListWithAll.map(first => {
          if (first.children) {
            first.children.map(second => {
              if (second.menuClsId === menuClsId) {
                clsIds.unshift(second.menuClsId_P)
              }
              if (second.children) {
                second.children.map(third => {
                  if (third.menuClsId === menuClsId) {
                    clsIds.unshift(third.menuClsId_P)
                    clsIds.unshift(second.menuClsId_P)
                  }
                })
              }
            })
          }
        })
        return clsIds
      },
      initEditData (data) {
        const {barCode, menuClsId, isEffectiveDate, starDate, endDate} = data
        let clsIds = this.getClsIds(menuClsId)
        console.log(data)
        this.form = {
          ...data,
          menuClsId: clsIds,
          barCode: barCode || null,
          matchMax: data.matchMax
        }

        if (isEffectiveDate) {
          this.dateTime = [new Date(starDate), new Date(endDate)]
        }
        this.menuOptions = this.menuOptions.map(options => {
          options.items.map(option => {
            option.isSelect = data[option.key]
            return option
          })
          return options
        })

        this.explainList.map(item => {
          if (+item.checked) {
            this.menuitemaskgpDtos.push(item)
          }
        })
        this.ingredientList.map(item => {
          if (+item.checked) {
            this.menuingredgprelDtos.push(item)
          }
        })
        this.makeTable = cloneDeep(data.askDtos)
        this.priceTable = data.menuItemUintDtos
        this.onSelectedItems('explainTable', this.menuitemaskgpDtos)
        this.onSelectedItems('ingredientTable', this.menuingredgprelDtos)
      },
      onSelectOption (item) {
        this.menuOptions = this.menuOptions.map((options) => {
          options.items.map(option => {
            if (option.key === item.key) {
              option.isSelect = !item.isSelect
            }
            return option
          })
          return options
        })

        // 称重菜和时价菜不能与临时菜同时被选中
        if ((this.menuOptions[1].items[0].isSelect || this.menuOptions[1].items[1].isSelect) && this.menuOptions[1].items[5].isSelect ||
          (this.menuOptions[3].items[0].isSelect || this.menuOptions[3].items[1].isSelect) && this.menuOptions[1].items[5].isSelect) {
          this.$refs.toast.isShow = true
          this.menuOptions = this.menuOptions.map((options) => {
            options.items.map(option => {
              if (option.key === item.key) {
                option.isSelect = !item.isSelect
              }
              return option
            })
            return options
          })
        }
      },
      onClickExpandExplain () {
        const {explainList, isExpandExplain} = this
        this.explainTable = isExpandExplain ? explainList.slice(0, 2) : explainList
        this.isExpandExplain = !isExpandExplain
        this.onSelectedItems('explainTable', this.menuitemaskgpDtos)
      },
      onClickExpandIngredient () {
        const {ingredientList, isExpandIngredient} = this
        this.ingredientTable = isExpandIngredient ? ingredientList.slice(0, 2) : ingredientList
        this.isExpandIngredient = !isExpandIngredient
        this.onSelectedItems('ingredientTable', this.menuingredgprelDtos)
      },
      onSelectedItems (type, datas) {
        const refDom = this.$refs[type]
        this.$nextTick(() => {
          datas.map(row => {
            if (row.checked === 1) {
              refDom.toggleRowSelection(row, true)
            }
          })
        })
      },
      onChangeExplain (explains) {
        this.menuitemaskgpDtos = explains
      },
      onChangeMenuCls (menuClsId) {
        const select = this.menuClsList.find(item => item.menuClsId === menuClsId[menuClsId.length - 1])
        const {expClsId, revenueTypeId} = select
        this.form = {...this.form, expClsId, revenueTypeId}
      },
      handleAddClassify (data) {
        if (data[0]) {
          const item = data[0]
          switch (+data[0].level) {
            case 2:
              this.classifyLevel = [item.menuClsId_P]
              break
            case 3:
              this.classifyLevel = [item.menuClsId_G, item.menuClsId_P]
              break
            default:
              this.classifyLevel = []
              break
          }
        }
        this.$refs.classifyModal.isShow = true
      },
      async classifyLevelCallback (data) {
        await this.fetchMenuClassList({
          type: ITEMKIND.DISH,
          showSystemData: true
        })
        await this.formatClsList()
        this.menuClsList = await this.getMenuClsList()
        this.form.menuClsId = data
      },
      getMenuClsList (items, menuClsId) {
        let list = [...this.classListWithAll]
        this.classListWithAll.map(item => {
          if (item.children) {
            list = [...list, ...item.children]
            item.children.map(subItem => {
              if (subItem.children) {
                list = [...list, ...subItem.children]
              }
            })
          }
        })
        return list
      },
      onChangeIngredient (items) {
        this.menuingredgprelDtos = items
      },
      getImageURI (path) {
        this.form.imageURL = path
      },
      checkOptions (key) {
        let allOptions = []
        this.menuOptions.map(option => { allOptions = [...allOptions, ...option.items] })
        return allOptions.find(item => item.key === key).isSelect
      },
      async onBlurItemName () {
        const {itemName} = this.form
        if (itemName) {
          await this.getMenuHelpCode({fsItemName: itemName})
          this.fetchUploadImg({
            pictureKey: itemName,
            cookTag: '1'
          })
          this.form.helpCode = this.helpCode
          this.$refs.helpCode.handleBlur()
        } else {
          this.form.helpCode = ''
        }
      },

      //是否在新建或修改菜品时ID冲突
      isIDConflict () {
        return this.editResult && this.editResult.err && this.editResult.err.msgType == '2'
      },

      getEditDishInfo (firstEdit = true) {

        this.makeTable.forEach(item => {
          if (!item.addPrice) {
            item.addPrice = 0
          }
        })

        const {form, menuOptions, menuingredgprelDtos, menuitemaskgpDtos} = this
        const {priceTable} = this.$refs
        const menuClsId = form.menuClsId[form.menuClsId.length - 1]
        const ingredient = []
        menuingredgprelDtos.map(item => {
          const {menuClsId, menuClsName, count} = item
          ingredient.push({menuClsId, menuClsName, count, checked: OK})
        })
        const explains = []
        menuitemaskgpDtos.map(item => {
          const {askGpId, askGpName} = item
          explains.push({askGpId, askGpName, checked: OK})
        })

        const [starDate, endDate] = this.dateTime
        const {isEffectiveDate} = this.form

        const info = {
          ...form,
          menuClsId,
          starDate: isEffectiveDate ? fecha.format(starDate, 'YYYY-MM-DD HH:mm') : null,
          endDate: isEffectiveDate ? fecha.format(endDate, 'YYYY-MM-DD HH:mm') : null,
          saveType: firstEdit ? 0 : 1,
          menuingredgprelDtos: ingredient,
          menuitemaskgpDtos: explains,
          menuItemUintDtos: priceTable.getData(),
          askDtos: this.makeTable
        }

        menuOptions.map(options => {
          options.items.map(item => {
            info[item.key] = item.isSelect ? 1 : 0
          })
        })

        return info
      },

      async onClickSubmit () {
        let validForm = true
        const {priceTable, makeTable} = this.$refs
        this.$refs.form.validate((valid) => {
          validForm = valid
        })

        if (!validForm || priceTable.checkEmpty() || makeTable.checkEmpty() || this.checkEmptyDate()) {
          document.getElementsByClassName('app-main')[0].scrollTop = 0
          return
        }


        if (this.checkOptions('isCuisine') && this.makeTable.length === 0) {
          this.$toast.show({content: '勾选必选做法，菜品做法不能为空!', type: 'warning'})
          return
        }

        if (!/^[1-9]\d*$/.test(this.form.maxTogetherMenu)) {
          this.$toast.show({content: '请输入正确的允许最大并菜数,只能设置大于0的整数', type: 'warning'})
          return
        }

        if (!/^[1-9]\d*$/.test(this.form.retireMenuTime)) {
          this.$toast.show({content: '请输入正确的退菜有效期,只能设置大于0的整数', type: 'warning'})
          return
        }

        this.makeTable.forEach(item => {
          if (!item.addPrice) {
            item.addPrice = 0
          }
        })
        const {form, menuOptions, menuingredgprelDtos, menuitemaskgpDtos} = this
        const menuClsId = form.menuClsId[form.menuClsId.length - 1]
        const ingredient = []
        menuingredgprelDtos.map(item => {
          const {menuClsId, menuClsName, count} = item
          ingredient.push({menuClsId, menuClsName, count, checked: OK})
        })
        const explains = []
        menuitemaskgpDtos.map(item => {
          const {askGpId, askGpName} = item
          explains.push({askGpId, askGpName, checked: OK})
        })

        const [starDate, endDate] = this.dateTime
        const {isEffectiveDate} = this.form
        let info = this.getEditDishInfo()
        menuOptions.map(options => {
          options.items.map(item => {
            info[item.key] = item.isSelect ? 1 : 0
          })
        })
        info.saleType = this.form.saleType  //外卖服务
        if (info.isPrePoint == 1) {
          if (!/^\d+(\.\d{1,2})?$/.test(this.form.lunchBoxCost)) {
            this.$toast.show({content: '请输入正确的预点餐盒费,只能设置大于0的最多两位小数的数字', type: 'warning'})
            return
          }
        }

        this.isEdit ? await this.updateMenuItem({info}) : await this.saveMenuItem({info})

        if (this.isIDConflict()) {
          this.$refs.popup.isShow = true
          return
        }
        if (!this.errorStatus) {
          this.$router.back()
        }
      },
      checkEmptyDate () {
        const [starDate, endDate] = this.dateTime
        const {isEffectiveDate} = this.form
        return isEffectiveDate ? !starDate && !endDate : false
      },
      onClickCancel () {
        this.$router.back()
      },
      onMenuCookCheckBoxChange () {
        if (this.form.multiPractice === 0) {
          this.form.practiceMin = this.form.practiceMax = 1
        }
      },
      // 切换上传的图片
      changeUploadImg (id) {
        this.imgId = id
        const index = this.uploadImages.findIndex((item) => item.id === id)
        this.form.imageURL = this.uploadImages[index]['image']
      },
      // 换一批菜品推荐图片
      changeUploadList () {
        const {imagesListIndex, alluploadImages} = this
        const num = Math.ceil(alluploadImages.length / 5)
        if (imagesListIndex + 2 > num) {
          this.imagesListIndex = 0
        } else {
          this.imagesListIndex += 1
        }
      },
      getMaxIngredient () {
        const {ingredientTable} = this
        let num = 0
        ingredientTable.forEach(item => {
          num += +item.count
        })

        return num
      },
      onShowModal (type) {
        this.$refs.attribution.isShow = true
        this.attributionType = type
      },
      async onSaveAttribution (type, params) {
        const {name, sortOrder, revenueGroupId, status} = params

        if (type === 'sale') {
          await this.saveExpcls({expClsName: name, sortOrder, status, noShowError: true})
          await this.fetchAllExpcls()

          if (!this.error.errorStatus) {
            this.form.expClsId = this.expclsList.find(item => item.expClsName === name).expClsId
          }
        } else {
          await this.saveRevenueType({revenueTypeName: name, sortOrder, revenueGroupId, status, noShowError: true})
          await this.fetchAllRevenueType()
          if (!this.error.errorStatus) {
            const item = this.revenueTypeList.find(item => item.revenueTypeName === name)
            this.form.revenueTypeId = item ? item.revenueTypeId : null
          }
        }
      },
      async onEditDishWhenIDExist () {
        let info = this.getEditDishInfo(false)
        this.isEdit ? await this.updateMenuItem({info}) : await this.saveMenuItem({info})
        if (!this.errorStatus) {
          this.$router.back()
        }
      }
    },
    beforeDestroy () {
      this.form.imageURL = ''
    }
  }
</script>

<style lang="scss" scoped>
  .menu-wrapper {
    .mw-form {
      width: 80%;
      padding-bottom: 0;

      .el-form-item__content {
        width: 400px;
      }

      .el-input {
        width: 50%;
      }

      .el-form-item__label {
        font-size: 16px;
      }

      .menu-cascader {
        width: 50%;
      }
    }

    .mw-form-item {
      width: 80%;
      margin: 0 auto;
      margin-bottom: 15px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      .menu-make,
      .menu-price {
        width: calc(100% - 300px);
      }

      .menu-make {
        margin-left: 20%;
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
      margin-left: 35px;
      margin-bottom: 10px;

      .option-menu-tips {
        font-size: 11pt;
        font-weight: 500;
        color: #999;
        margin-right: 15px;
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
      display: inline-block;
      margin-bottom: 10px;
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

      &:focus {
        background: transparent;
        border: 1px solid rgba(153, 153, 153, 0.62);
      }

      &.selected {
        color: #F36B5F;
        border: 1px solid #F36B5F;
        border-radius: 3px;
      }
    }

    .menu-upload {
      display: inline-block;
      width: 80%;

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

    .jard-min,
    .jard-max {
      width: 100px;
      margin-left: 5px;
    }

    .jard-min-cont {
      margin-left: 30px;
    }

    .required {
      color: #f36b5f;
    }

    .tips-wrapper {
      margin-left: -40px !important;
    }
  }
</style>
