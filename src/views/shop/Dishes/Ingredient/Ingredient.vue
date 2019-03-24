<template>
  <div>
    <el-form class="mw-form ingredient-add-or-edit" :rules="rules" ref="form" :model="form" label-width="120px">
      <el-form-item label="配料编码" prop="itemId" v-if="isEdit">
        <el-input placeholder="请输入配料编码" v-model="form.itemId" :disabled="isEdit" :maxlength='30' />
      </el-form-item>
      <el-form-item label="配料名称" prop="itemName">
        <el-input placeholder="请输入配料名称" v-model="form.itemName" :maxlength='INPUT_MAX_LENGTH' />
      </el-form-item>
      <el-form-item label="第二语言" prop="itemName2">
        <el-input placeholder="请输入第二语言" v-model="form.itemName2" :maxlength='INPUT_MAX_LENGTH' />
      </el-form-item>
      <el-form-item label="最大点菜数量" prop="foodCount">
        <el-select v-model="form.foodCount">
          <el-option label="无限制" :value="0" />
          <el-option label="限制" :value="1" />
        </el-select>
        <el-input-number v-model.number="form.max" placeholder="请输入限制数量" v-if="form.foodCount > 0" :min="0" :max="99999" controls-position="right"/>
      </el-form-item>
      <el-form-item label="配料分组" prop="menuClsId">
        <el-select v-model="form.menuClsId" style="width: 80%">
          <el-option label="所有分组" :value="null" />
          <el-option
            v-for="item in ingredGroupsList"
            :key="item.menuClsId"
            :label="item.menuClsName"
            :value="item.menuClsId"
          />
        </el-select>
        <span class="new-add-group" @click="addGroup">新增分组</span>
      </el-form-item>
      <el-form-item label="配料单位" prop="orderUint">
        <el-input placeholder="请输入配料单位" v-model="form.orderUint" :maxlength='INPUT_MAX_LENGTH' />
      </el-form-item>
      <el-form-item label="配料价格" prop="salePrice">
        <el-input-number placeholder="请输入配料价格" v-model="form.salePrice" :controls="false" class="width-full sale-price"/>
      </el-form-item>
      <el-form-item label="配料菜选项:">
        <el-checkbox
          :true-label="TRUE"
          :false-label="null"
          key="isBonus"
          v-model="form.isBonus">可提成
        </el-checkbox>
        <el-checkbox
          :true-label="1"
          :false-label="0"
          key="isBonus"
          v-model="form.isPrePoint">口碑可预点
        </el-checkbox>
      </el-form-item>
      <el-form-item label="预点餐盒费:" prop="lunchBoxCost" v-if="form.isPrePoint">
        <!--<el-input placeholder="请输入预点餐盒费" v-model="form.lunchBoxCost" @blur="onBlurItemName" :maxlength='30' />-->
        <el-input-number placeholder="请输入预点餐盒费" v-model.number="form.lunchBoxCost" :min="0" :max="9999999" class="width-full" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
      <add-ingredient-group
        ref="addIngredientGroup"
        :saveIngredientGroup="onSaveIngredientGroup"
        :fetchIngredientGroup="getIngredientGroups"
      />
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
  import { AddIngredientGroup } from 'views/common';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import { TRUE } from 'constant/statusCode';
  import { validateName, validateNumber, validatePrice } from 'utils/validateUtil';
  import { Toast} from 'components';

  export default {
    name: 'Ingredient',
    components: {
      AddIngredientGroup,
      Toast,
    },
    data () {
      return {
        INPUT_MAX_LENGTH,
        TRUE : TRUE,
        form: {
          itemId: '',
          itemName: '',
          itemName2: '',
          foodCount: 0,
          menuClsId: '',
          orderUint: '',
          salePrice: '',
          max: '',
          operate: '',
          isBonus : 0,
          isPrePoint: 1,  //可预点
          lunchBoxCost: 0,  //预点餐盒费
        },
        isEdit: !!this.$route.params.itemCd,
        rules: {
          itemName: [
            { required: true, message: '请输入配料名称', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          menuClsId: [
            { required: true, message: '请输入配料分组', trigger: 'blur' }
          ],
          orderUint: [
            { required: true, message: '请输入配料单位', trigger: 'blur' },
            { validator: validateName, trigger: 'blur' }
          ],
          max: [
            { required: true, message: '请输入限制数量', trigger: 'blur' },
            { validator: validateNumber, trigger: 'blur' }
          ],
          salePrice: [
            { required: true, type: 'number', message: '请输入价格', trigger: 'blur' },
            { validator: validatePrice, trigger: 'blur' }
          ],
          lunchBoxCost: [
            { required: true, message: '请输入预点餐盒费', trigger: ['blur', 'change'] },
            { validator: validatePrice, trigger: ['blur', 'change'] }
          ],
        },
        belongToast:{
          text:'',
          type:'',
        },
      };
    },
    async created () {
      const { itemCd } = this.$route.params;
      if (this.isEdit) {
        await this.fetchIngredientDetail({ itemCd });
        this.initData();
      } else {
        this.form = { ...this.form, operate: 'add', itemCd };
      }
      await this.getIngredientGroups();
    },
    computed: mapState({
      pageIndex: state => state.dishes.explain.pageIndex,
      pageSize: state => state.dishes.explain.pageSize,
      ingredGroupsList: state => state.dishes.ingredient.ingredGroupsList,
      ingredientDetail: state => state.dishes.ingredient.ingredientDetail,
      errorStatus: state => state.error.errorStatus
    }),
    methods: {
      ...mapActions([
        'fetchAllIngredientList',
        'getIngredientGroups',
        'fetchIngredientDetail',
        'saveIngredientGroup',
        'saveMenuIngredient'
      ]),
      initData () {
        const { max } = this.ingredientDetail;
        this.form = { ...this.form, ...this.ingredientDetail, operate: 'edit', foodCount: max.length > 0 ? 1 : 0 };
      },
      addGroup () {
        this.$refs.addIngredientGroup.isShow = true;
      },
      async onSaveIngredientGroup (params) {
        await this.saveIngredientGroup(params);
        if (!this.errorStatus) {
          this.form.menuClsId = params.menuClsId;
        }
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const { form } = this;
        await this.saveMenuIngredient({ item: form });

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
  .ingredient-add-or-edit {
    .sale-price {
      .el-input input {
        text-align: left !important;
      }
    }

    .new-add-group {
      border: 0;
      color: #39c;
      font-style: italic;
      font-size: 16px;
      text-decoration: underline;
      cursor: pointer;
      padding-top: 8px;
      margin-left: 10px;
    }
  }
</style>
