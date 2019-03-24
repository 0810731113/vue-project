<template>
  <el-form class="mw-form explain-add-or-edit" :rules="rules" ref="form" :model="form" label-width="120px">
    <el-form-item label="分组名称" prop="askGpName">
      <el-input placeholder="请输入分组名称" v-model="form.askGpName" :maxlength='30' />
    </el-form-item>
    <el-form-item label="显示顺序" prop="sortOrder">
      <el-input-number
        class="sort-input"
        placeholder="请输入显示顺序"
        :controls="false"
        v-model="form.sortOrder"
        :min='0' :max="9999"
      />
    </el-form-item>
    <el-form-item label="是否显著显示">
      <el-switch v-model="form.isShow" active-text="是" inactive-text="否" :active-value="TRUE" :inactive-value="FALSE" />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button v-show="!isGuide" class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
    <div v-if="isGuide" v-show="error.errorStatus" class="error-wrapper">
      {{ error.errorMsg }}
    </div>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN, TRUE, FALSE } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH } from 'constant/constants';
import { validateName, validateNumber } from 'utils/validateUtil';

export default {
  name: 'Explain',
  props: {
    isGuide: Boolean,
    newId: [String, Number],
    editId: [String, Number],
    isEditExpalin: {
      type: Boolean,
      default: false
    },
    onClickSubmit: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      TRUE,
      FALSE,
      ON_TEXT,
      OFF_TEXT,
      INPUT_MAX_LENGTH,
      form: {
        askGpId: '0',
        askGpName: '',
        sortOrder: 99,
        isShow: FALSE,
        status: OK
      },
      rules: {
        askGpName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        sortOrder: [
          { required: true, type: 'number', message: '请输入顺序', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ]
      },
      isEdit: !!this.$route.params.id || !!this.editId
    };
  },
  async created () {
    const { id } = this.$route.params;
    if (this.isEdit) {
      const editId = id || this.editId;
      await this.fetchExplainDetail({ askGpId: editId });
      this.initData(this.explainDetail);
    } else {
      await this.getExplainNewId();
      this.form.askGpId = this.lastId;
    }
  },
  computed: mapState({
    pageIndex: state => state.dishes.explain.pageIndex,
    pageSize: state => state.dishes.explain.pageSize,
    lastId: state => state.dishes.explain.lastId,
    explainDetail: state => state.dishes.explain.detail,
    error: state => state.error
  }),
  methods: {
    ...mapActions([
      'fetchAllExplain',
      'fetchExplainDetail',
      'getExplainNewId',
      'saveExplain',
      'updateExplain'
    ]),
    initData (editData) {
      this.form = { ...editData };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      const { pageIndex, pageSize, isEdit, form, isGuide, newId } = this;

      if (isEdit) {
        const { sortOrder, status, askGpId, askGpName, isShow } = form;
        await this.updateExplain({ sortOrder, status, askGpId, askGpName, isShow, noShowError: isGuide });
      } else {
        const data = isGuide ? { ...form, askGpId: newId, noShowError: isGuide } : form;
        await this.saveExplain(data);
      }

      const { errorStatus } = this.$store.state.error;
      if (isGuide && !errorStatus) {
        await this.onClickSubmit();
        await this.fetchAllExplain({ pageIndex, pageSize });
        return;
      }

      if (!errorStatus) {
        this.$router.back();
      }
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
.explain-add-or-edit {
  .sort-input {
    width: 100%;
  }
}
</style>
