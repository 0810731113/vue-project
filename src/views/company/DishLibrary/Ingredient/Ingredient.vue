<template>
  <el-form class="mw-form ingredient-add-or-edit" :rules="rules" ref="form" :model="form" label-width="120px">
    <el-form-item label="配料编码" prop="itemId" v-if="isEdit && isShop">
      <el-input placeholder="请输入配料编码" v-model="form.itemId" :disabled="isEdit" :maxlength='30'></el-input>
    </el-form-item>
    <el-form-item label="配料名称" prop="itemName">
      <el-input placeholder="请输入配料名称" v-model="form.itemName" :maxlength='INPUT_MAX_LENGTH'></el-input>
    </el-form-item>
    <el-form-item label="第二语言" prop="itemName2">
      <el-input placeholder="请输入第二语言" v-model="form.itemName2" :maxlength='INPUT_MAX_LENGTH'></el-input>
    </el-form-item>
    <el-form-item label="最大点菜数量" prop="foodCount">
      <el-select v-model="form.foodCount" class="el-col-7">
        <el-option label="无限制" :value="0"></el-option>
        <el-option label="限制" :value="1"></el-option>
      </el-select>
      <el-input-number v-model="form.max" placeholder="请输入限制数量" v-if="form.foodCount > 0" :min="0" :controls="false" class="max-order-count">
      </el-input-number>
    </el-form-item>
    <el-form-item label="配料分组" prop="menuClsId">
      <el-select v-model="form.menuClsId">
        <el-option label="所有分组" :value="null"></el-option>
        <el-option
          v-for="item in ingredGroupsList"
          :key="item.menuClsId"
          :label="item.menuClsName"
          :value="item.menuClsId">
        </el-option>
      </el-select>
      <span class="new-add-group" @click="addGroup">新增分组</span>
    </el-form-item>
    <el-form-item label="配料单位" prop="orderUint">
      <el-input placeholder="请输入配料单位" v-model="form.orderUint" :maxlength='INPUT_MAX_LENGTH'></el-input>
    </el-form-item>
    <el-form-item label="配料价格" prop="salePrice">
      <el-input-number placeholder="请输入配料价格" v-model="form.salePrice" :min='0' class="width-full" :controls="false"></el-input-number>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
    <add-ingredient-group
      ref="addIngredientGroup"
      :saveIngredientGroup="wrapSaveIngredientGroup"
      :fetchIngredientGroup="getIngredientGroups"
    />
  </el-form>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { AddIngredientGroup } from 'views/common';
  import { YES, INPUT_MAX_LENGTH } from 'constant/constants';
  import { validateName, validateNumber, validatePrice } from 'utils/validateUtil';
  import { isShop } from 'utils/configUtil';

  export default {
    name: 'Ingredient',
    components: {
      AddIngredientGroup
    },
    data () {
      return {
        YES,
        INPUT_MAX_LENGTH,
        isShop: isShop(),
        form: {
          itemId: '',
          itemName: '',
          itemName2: '',
          foodCount: 0,
          menuClsId: null,
          orderUint: '',
          salePrice: '',
          max: ''
        },
        operate: '',
        isEdit: !!this.$route.params.itemCd,
        rules: {
          itemId: [
            { required: true, message: '请输入配料编码，最多输入30字符', trigger: [['blur', 'change']] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          itemName: [
            { required: true, message: '请输入配料名称', trigger: ['blur', 'change'] },
            { validator: validateName, trigger: ['blur', 'change'] }
          ],
          menuClsId: [{ required: true, message: '请输入配料分组', trigger: ['blur', 'change'] }],
          orderUint: [
            { required: true, message: '请输入配料单位', trigger: ['blur', 'change'] },
            { validator: validateName, trigger: ['blur', 'change'] }
          ],
          max: [
            { required: true, message: '请输入限制数量', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          salePrice: [
            { required: true, type: 'number', message: '请输入价格', trigger: ['blur', 'change'] },
            { validator: validatePrice, trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    async created () {
      const { itemCd } = this.$route.params;
      if (this.isEdit) {
        await this.fetchIngredientDetail({ itemCd });
        this.initData();
      } else {
        this.operate = 'add';
      }
      await this.getIngredientGroups({ type: YES });
    },
    computed: mapState({
      pageIndex: state => state.dishes.explain.pageIndex,
      pageSize: state => state.dishes.explain.pageSize,
      ingredGroupsList: state => state.dishes.ingredient.ingredGroupsList,
      ingredientDetail: state => state.dishes.ingredient.ingredientDetail
    }),
    methods: {
      ...mapActions([
        'getIngredientGroups',
        'fetchIngredientDetail',
        'saveIngredientGroup',
        'saveMenuIngredient'
      ]),
      initData () {
        const { max } = this.ingredientDetail;
        this.form = { ...this.form, ...this.ingredientDetail, foodCount: max > 0 ? 1 : 0 };
        this.form = { ...this.form, ...this.ingredientDetail };
        this.operate = 'edit';
      },
      addGroup () {
        this.$refs.addIngredientGroup.isShow = true;
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.saveMenuIngredient({ item: { ...this.form, operate: this.operate } });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$router.back();
        }
      },
      onCancel () {
        this.$router.back();
      },
      async wrapSaveIngredientGroup (value) {
        await this.saveIngredientGroup(value);
        await this.getIngredientGroups({ type: YES });
        this.form.menuClsId = value.menuClsId;
      }
    }
  };
</script>

<style lang="scss">
  .ingredient-add-or-edit {
    .max-order-count {
      .el-input-number {
        margin-left: 60px;
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
      margin-left: 68px;
    }
  }
</style>
