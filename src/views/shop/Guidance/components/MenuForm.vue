<template>
  <el-form class="menu-form" :rules="rules" ref="form" :model="info" label-width="120px">
    <el-form-item label=" 分类级别" prop="menuClsId">
      <el-cascader
        :options="allClassList"
        :props="defaultProps"
        v-model="info.menuClsId"
      >
      </el-cascader>
    </el-form-item>
    <el-form-item label="菜品名称" prop="itemName">
      <el-input placeholder="请输入菜品名称, 支持中文、英文、数字" v-model="info.itemName" :maxlength='30'></el-input>
    </el-form-item>
    <el-form-item label="规格单位" prop="orderUint">
      <el-input placeholder="请输入规格单位" v-model="info.orderUint" :maxlength='50'></el-input>
    </el-form-item>
    <el-form-item label="价格" prop="salePrice">
      <el-input placeholder="请输入价格" v-model.number="info.salePrice"></el-input>
    </el-form-item>
    <el-form-item class="btn-wrapper">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
    <el-form-item class="btn-wrapper error-wrapper" v-if="!!errorMsg">
      <div>
        <i class="el-icon-circle-cross"></i>
        {{ errorMsg }}
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { UNCLASSIFIED } from 'constant/statusCode';
import { INPUT_MAX_LENGTH } from 'constant/constants';
import { validateDishName, validateNumber } from 'utils/validateUtil';

export default {
  name: 'menuForm',
  props: ['onSubmitForm'],
  data () {
    const validateCls = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('请选择分类'));
      } else {
        callback();
      }
    };
    return {
      INPUT_MAX_LENGTH,
      info: {
        itemId: '',
        itemName: '',
        helpCode: '',
        menuClsId: [-1],
        saveType: 0,
        orderUint: '',
        salePrice: '',
        menuItemUintDtos: [{
          orderUintCd: 0,
          def: 1,
          costPrice: 0,
          initCount: 1,
          vipprice: ''
        }],
        expClsId: UNCLASSIFIED,
        revenueTypeId: UNCLASSIFIED
      },
      rules: {
        menuClsId: [{ required: true, validator: validateCls, trigger: ['blur', 'change'] }],
        itemName: [
          { validator: validateDishName, trigger: 'blur' },
          { required: true, message: '请输入菜品名称', trigger: 'change' }
        ],
        orderUint: [
          { validator: validateDishName, trigger: 'blur' },
          { required: true, message: '请输入规格单位', trigger: 'change' }
        ],
        salePrice: [
          { required: true, type: 'number', message: '请输入价格', trigger: 'blur' },
          { type: 'number', min: 0, max: 100000, message: '请输入0-100000之间数字', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      },
      defaultProps: {
        value: 'menuClsId',
        label: 'menuClsName',
        children: 'children'
      }
    };
  },
  async created () {
    await this.getMenuLastId();
    await this.fetchAllClassify();
    this.info.itemId = this.lastId;
  },
  computed: mapState({
    lastId: state => state.dishes.menu.lastId,
    errorMsg: state => state.error.errorMsg,
    allClassList () {
      const { allClassify } = this.$store.state.dishes.classify;
      const classList = allClassify ? allClassify.slice() : [];
      classList.unshift({ menuClsId: -1, menuClsName: '全部分类', children: null });
      return classList;
    }
  }),
  methods: {
    ...mapActions([
      'getMenuLastId',
      'fetchAllClassify'
    ]),
    onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      this.onSubmitForm(cloneDeep(this.info));
    }
  }
};
</script>

<style lang="scss">
.menu-form {
  width: 90%;

  .btn-wrapper {
    .el-form-item__content {
      margin-left: 0 !important;
      text-align: center;
    }
  }

  .error-wrapper {
    margin-top: 5px;
    margin-bottom: 0;
    color: #ff4949;
  }
}
</style>
