<template>
  <div>
    <el-form class="mw-form set-meal-form" label-width="100px" ref="form" :rules="rules" :model="form">
      <el-form-item label="套餐名称:" prop="itemName">
        <el-input placeholder="请输入套餐名称" v-model="form.itemName" @blur="onBlurItemName" :maxlength='30' />
      </el-form-item>
      <el-form-item label="套餐助记码:" prop="helpCode">
        <el-input placeholder="请输入套餐助记码" v-model="form.helpCode" :maxlength='30' />
      </el-form-item>
      <el-form-item label="套餐分类:" prop="menuClsId">
        <el-select v-model="form.menuClsId" class="width-full">
          <el-option
            v-for="item in menuClsList"
            :key="item.menuClsId"
            :label="item.menuClsName"
            :value="item.menuClsId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第二语言:" prop="itemName2">
        <el-input placeholder="请输入第二语言" v-model="form.itemName2" :maxlength='50' />
      </el-form-item>
      <el-form-item label="选项:">
        <el-checkbox
          v-for="item in SET_MEAL_OPTIONS"
          :true-label="TRUE"
          :false-label="FALSE"
          :key="item.key"
          v-model="form[item.key]">
          {{item.name}}
        </el-checkbox>
      </el-form-item>
      <el-form-item label="秒点服务:" class="miaodian_radio">
        <!--<label class="option-menu-tips" style="width: 20%;">秒点服务</label>-->
        <el-radio v-for="item in saleTypeList" :key="item.tips" v-model="form.saleType" :label="item.key" border>{{item.tips}}</el-radio>
      </el-form-item>
      <el-form-item label="出售餐段:" prop="msectionName" v-if="isShop">
        <el-checkbox-group v-model="tbmsection" class="output-msection">
          <el-checkbox v-for="item in shiftList" :key="item.msectionId" :label="item.msectionId">{{ item.msectionName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="套餐价格:" prop="msectionName">
        <el-table :data="[menuItem]" class="table table-bordered">
          <el-table-column label="默认" min-width="25%">
            <template slot-scope="scope">
              <el-radio class="radio" :value="OK" :label="OK"></el-radio>
            </template>
          </el-table-column>
          <el-table-column props="orderUint" align="center" label="规格/单位" min-width="25%">
            <template slot-scope="scope">
              <el-input type="text" v-model="menuItem.orderUint" :readonly="!isEdit" />
            </template>
          </el-table-column>
          <el-table-column props="salePrice" align="center" label="价格" min-width="25%">
            <template slot-scope="scope">
              <el-input-number :controls="false" v-model="menuItem.salePrice" :min="0" :max="100000" />
            </template>
          </el-table-column>
          <el-table-column props="vipprice" align="center" label="会员价" min-width="25%">
            <template slot-scope="scope">
              <el-input-number :controls="false" v-model="menuItem.vipprice" :min="0" :max="100000" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="图片:">
        <mw-upload
          ref="picUpload"
          :dataSource= '(form.imageURL && form.imageURL.length) ? [{url: form.imageURL}] : []'
          :action="getActionUrl(`dishes/${API_UPLOAD_MENU_IMG}`)"
          :multipleSelect="false"
          :multipleUpload="false"
          :autoUpload="true"
          @getImageURI='getImageURI'>
        </mw-upload>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-text="ON_TEXT"
          :inactive-text="OFF_TEXT"
          :active-value="OK"
          :inactive-value="FORBIDDEN">
        </el-switch>
      </el-form-item>
      <el-form-item label="显示顺序:" v-if="!isShop">
        <el-input-number placeholder="请输入顺序" v-model="form.sortOrder" :min="0" :max="99999" controls-position="right"/>
      </el-form-item>
      <el-form-item label="预点餐盒费:" prop="lunchBoxCost" v-if="form.isPrePoint">
        <!--<el-input placeholder="请输入预点餐盒费" v-model="form.lunchBoxCost" @blur="onBlurItemName" :maxlength='30' />-->
        <el-input-number placeholder="请输入预点餐盒费" v-model.number="form.lunchBoxCost" :min="0" :max="9999999" class="width-full" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <toast
      ref='selectBelong'
      :content="belongToast.text"
      :timeout="3000"
      :type="belongToast.type"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { API_UPLOAD_MENU_IMG } from 'constant/API';
import { OK, FORBIDDEN, TRUE, FALSE } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH, SET_MEAL_OPTIONS } from 'constant/constants';
import { MIAODIAN_SERVICE_SINGLE_SELECT } from 'constant/dishMenu';
import { validateId, validateName, validateReportName,validateNumber,validatePrice } from 'utils/validateUtil';
import MwUpload from 'components/Upload';
import cloneDeep from 'lodash/cloneDeep';
import { isShop } from 'utils/configUtil';
import { Toast} from 'components';
import ElFormItem from '../../../node_modules/element-ui/packages/form/src/form-item.vue'

export default {
  name: 'setMeal',
  components: {
    ElFormItem,
    MwUpload,
    Toast,
  },
  data () {
    return {
      OK,
      TRUE,
      FALSE,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      INPUT_MAX_LENGTH,
      API_UPLOAD_MENU_IMG,
      SET_MEAL_OPTIONS,
      saleTypeList: cloneDeep(MIAODIAN_SERVICE_SINGLE_SELECT),  //秒点服务列表
      tbmsection: [],
      isShop: isShop(),
      menuItem: {
        orderUint: '套',
        salePrice: '0.00',
        vipprice: '0.00'
      },
      form: {
        itemId: '',
        itemName: '',
        helpCode: '',
        isDiscount: 1,
        isServiceFee: 1,
        isGift: 1,
        isWeChatOrder: 1,
        sortOrder: '999',
        splitStatus: FORBIDDEN,
        status: OK,
        isPrePoint: 1,  //可预点
        lunchBoxCost: 0,  //预点餐盒费
        saleType: 0, //秒点服务
      },
      rules: {
        menuClsId: [
          { required: true, message: '请选择菜品分类', trigger: ['blur', 'change'] }
        ],
        itemName: [
          { required: true, message: '请输入套餐名称', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ],
        helpCode: [{ validator: validateId, trigger: ['blur', 'change'] }],
        itemName2: [{ validator: validateReportName, trigger: ['blur', 'change'] }],
        lunchBoxCost: [
          { required: true, message: '请输入预点餐盒费', trigger: ['blur', 'change'] },
          { validator: validatePrice, trigger: ['blur', 'change'] }
        ],
      },
      isEdit: !!this.$route.params.id,
      belongToast:{
        text:'',
        type:'',
      },
    };
  },
  async created () {
    const { menuClsId, id } = this.$route.params;
    if (this.isShop) {
      await this.fetchAllShift();
    }
    await this.fetchSetMealMenuClsList();
    if (!this.isEdit) {
      //console.log("edit")
      await this.getSetMealDetail({ operate: 'add', menuClsId });
      const { info } = this.detail;
      this.form = { ...this.form, ...info, status: +info.status };
      this.form.isPrePoint = 1
      return;
    }

    await this.getSetMealDetail({ operate: 'edit', itemCd: id });
    const { info, tbmsection, menuItemUintDtos } = this.detail;
    this.form = { ...this.form, ...info, status: +info.status };
    this.menuItem = cloneDeep(menuItemUintDtos[0]) || this.menuItem;
    this.tbmsection = tbmsection ? tbmsection.split(',') : [];
  },
  computed: mapState({
    detail: state => state.dishes.setMeal.detail,
    menuClsList: state => state.dishes.setMeal.menuClsList,
    shiftList: state => state.business.shift.shiftList,
    helpCode: state => state.dishes.menu.helpCode,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveSetMeal',
      'updateSetMeal',
      'getSetMealDetail',
      'getMenuHelpCode',
      'fetchAllShift',
      'fetchSetMealMenuClsList'
    ]),
    getImageURI (path) {
      this.form.imageURL = path;
    },
    async onBlurItemName () {
      const { itemName } = this.form;
      if (itemName) {
        await this.getMenuHelpCode({ fsItemName: this.form.itemName });
        this.form.helpCode = this.helpCode;
      } else {
        this.form.helpCode = '';
      }
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });

      if (!validForm) return;
      const { tbmsection, form, menuItem } = this;
      form.saveType = 0;
      const params = {
        info: form,
        tbmsection: tbmsection.toString(),
        menuUints: [menuItem]
      };
      this.isEdit
        ? await this.updateSetMeal(params)
        : await this.saveSetMeal(params);

      if (!this.errorStatus) {
        this.belongToast = {type: 'success',text:'保存成功'}
        this.$refs['selectBelong'].isShow = true
        this.$router.back();
      }else{
        this.belongToast = {type: 'error',text:'保存失败'}
        this.$refs['selectBelong'].isShow = true
      }
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.set-meal-form {
  .el-table .el-table__body .cell {
    .radio {
      margin-top: 17px;
    }
  }

  .table-bordered {
    border-spacing: 0;
    border: 1px solid #ddd;
    border-bottom: none;

    tbody > tr > td,
    thead > tr > th {
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      text-align: center;

      &:last-child {
        border-right: none;
      }
    }
  }

  .output-msection {
    .el-checkbox {
      width: 160px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }

  .upload-container {
    .upload-initial {
      margin-top: 0;
    }
  }

  .el-radio__label {
    display: none;
  }
  .miaodian_radio{
    .el-radio__label {
      display: inline-block;
    }
  }

}
</style>
