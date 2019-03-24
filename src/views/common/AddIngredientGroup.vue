<template>
  <el-dialog custom-class="base-modal add-group-modal" :visible.sync="isShow" v-if="isShow" width="30%">
    <div class="modal-title" slot="title">新增配料分组</div>
    <div class="group-class">
      <el-form slot="content" class="group-form" :rules="rules" :model="form" ref="form" label-width="80px">
        <el-form-item label="分组编码" prop="menuClsId">
          <el-input placeholder="请输入分组编码" v-model="form.menuClsId" :maxlength='30'></el-input>
        </el-form-item>
        <el-form-item label="分组名称" prop="menuClsName">
          <el-input placeholder="请输入分组名称" v-model="form.menuClsName" :maxlength='INPUT_MAX_LENGTH'></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { isShop } from 'utils/configUtil';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import { validateNumber, validateName } from 'utils/validateUtil';
  import cloneDeep from 'lodash/cloneDeep';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

  export default {
    name: 'addIngredientGroup',
    props: {
      detail: {
        type: Object,
        default: () => {}
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      saveIngredientGroup: {
        typs: Function,
        default: () => {}
      },
      fetchIngredientGroup: {
        typs: Function,
        default: () => {}
      },
      pageIndex: {
        typs: Number,
        default: DEFAULT_PAGE
      },
      pageSize: {
        type: Number,
        default: DEFAULT_PAGES
      }
    },
    data () {
      return {
        isShow: false,
        INPUT_MAX_LENGTH,
        form: {
          menuClsId: '',
          menuClsName: ''
        },
        rules: {
          menuClsId: [
            { required: true, message: '请输入分组编码，最多输入30字符', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          menuClsName: [
            { required: true, message: '请输入分组名称', trigger: ['blur', 'change'] },
            { validator: validateName, trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    watch: {
      isShow () {
        if (this.isEdit) {
          this.form = cloneDeep(this.detail);
        } else {
          this.form = { ...this.form, menuClsId: '', menuClsName: '' };
        }
      }
    },
    methods: {
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const { menuClsId, menuClsName } = this.form;
        await this.saveIngredientGroup({ menuClsId, menuClsName });
        if (isShop()) {
          await this.fetchIngredientGroup();
        } else {
          await this.fetchIngredientGroup();
        }

        this.onClose();
      },
      onClose () {
        this.isShow = false;
      }
    }
  };
</script>

<style lang='scss'>
  .add-group-modal {
    padding: 15px;
  }

</style>
