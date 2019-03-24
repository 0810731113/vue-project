<template>
  <el-dialog custom-class="base-modal garnish-modal" v-if="isShow" :visible.sync="isShow" :before-close="onCloseModal" size="tiny">
    <div class="modal-title" slot="title">{{ isEdit ? '修改' : '添加' }}配菜项</div>
    <el-form :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="配菜项名称" prop="setFoodName">
        <el-input v-model="form.setFoodName" placeholder="请输入配菜项名称" auto-complete="off" />
      </el-form-item>
      <el-form-item label="第二语言" prop="setFoodName2">
        <el-input v-model="form.setFoodName2" placeholder="请输入第二语言" auto-complete="off" />
      </el-form-item>
      <el-form-item label="类型" prop="name">
        <div class="type-wrap">
          <el-radio class="radio" v-model="form.setFoodType" :label="0">固定菜品</el-radio><br/>
          <el-radio class="radio" v-model="form.setFoodType" :label="1">可选菜品</el-radio>
          可选<el-input-number :min="1" ref="number" :controls="false" v-model="form.setFoodQty" />个
        </div>
      </el-form-item>
      <el-form-item label="是否必选" v-if="form.setFoodType == 1">
        <el-switch v-model="form.isRequired" active-text="必选" inactive-text="非必选" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="sortOrder">
        <el-input v-model.number="form.sortOrder" placeholder="请输入显示顺序" auto-complete="off" />
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
      <div class="btn-wrapper error-wrapper horizontal-center" v-if="!!errorMessage">
        <i class="el-icon-circle-cross"></i>
        {{ errorMessage }}
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { mapState } from 'vuex';
import { validateNumber, validateName } from 'utils/validateUtil';

export default {
  name: 'garnishModal',
  props: ['isEdit', 'selectedItemCd', 'addSetSideDtl', 'fetchSetSideDtlList'],
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      isShow: false,
      form: {
        setFoodName: '',
        setFoodName2: '',
        setFoodQty: 0,
        isRequired: 0,
        sortOrder: 99,
        status: OK,
        setFoodType: 0,
        type: 0,
        setSideDtlCount: 0
      },
      errorMessage: '',
      rules: {
        setFoodName: [
          { validator: validateName, trigger: ['blur', 'change'] },
          { required: true, message: '请输入配菜项名称', trigger: ['blur', 'change'] }
        ],
        sortOrder: [
          { validator: validateNumber, trigger: ['blur', 'change'] },
          { required: true, type: 'number', message: '请输入显示顺序', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  watch: {
    'form.setFoodQty': {
      immediate: true,
      handler (value) {
        if (this.$refs.number) {
          this.$refs.number.setCurrentValue(parseInt(this.form.setFoodQty));
        }
      }
    }
  },
  computed: mapState({
    error: state => state.error
  }),
  methods: {
    initData (data = {}) {
      this.form = {
        setFoodName: '',
        setFoodName2: '',
        setFoodQty: 0,
        isRequired: 0,
        sortOrder: 99,
        status: OK,
        setFoodType: 0,
        type: 0,
        setSideDtlCount: 0,
        ...data
      };
      this.errorMessage = '';
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      if (+this.form.isRequiredStuts === 1 && +this.form.isRequired === 0) {
        this.errorMessage = '已分账套餐配菜项必须“必选”';
        return;
      }
      const model = { ...this.form, itemCd_M: this.selectedItemCd };
      if(model.setFoodType == 0){
        model.isRequired = 1
      }
      await this.addSetSideDtl({ model });
      const { errorStatus, errorMsg } = this.error;
      if (errorStatus) {
        this.errorMessage = errorMsg;
      } else {
        this.isShow = false;
        this.initData();
        await this.fetchSetSideDtlList({ fiItemCd_M: this.selectedItemCd });
      }
    },
    onCloseModal (done) {
      this.initData();
      done();
    }
  }
};
</script>

<style lang="scss">
  .garnish-modal {
    .el-dialog__body {
      padding: 30px;
    }

    .el-input-number {
      margin: auto 4px;
    }

    .split-price {
      width: 120px;
      margin-right: 6px;
    }
  }
</style>
