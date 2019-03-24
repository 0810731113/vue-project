<template>
  <el-form class="mw-form explain-add-or-edit" :rules="rules" ref="form" :model="form" label-width="120px">
    <el-form-item label="分组名称" prop="askGpName">
      <el-input placeholder="请输入分组名称" v-model="form.askGpName" :maxlength='30'></el-input>
    </el-form-item>
    <el-form-item label="显示顺序" prop="sortOrder">
      <el-input placeholder="请输入显示顺序" v-model.number="form.sortOrder" :maxlength='INPUT_MAX_LENGTH'></el-input>
    </el-form-item>
    <el-form-item label="是否显著显示">
      <el-switch v-model="form.isShow" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="TRUE" :inactive-value="FALSE"></el-switch>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN, TRUE, FALSE } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH } from 'constant/constants';
import { validateName, validateNumber } from 'utils/validateUtil';

export default {
  name: 'Explain',
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
          { required: true, message: '请输入分组名称，最多输入30字符', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ],
        sortOrder: [
          { required: true, message: '请输入顺序', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: ['blur', 'change'] }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    const { id } = this.$route.params;
    if (this.isEdit) {
      await this.fetchExplainDetail({ askGpId: id, operate: 'edit' });
      this.initData(this.explainDetail);
    } else {
      await this.getExplainNewId();
      this.form.askGpId = this.lastId;
    }
  },
  computed: mapState({
    lastId: state => state.dishes.explain.lastId,
    explainDetail: state => state.dishes.explain.detail
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
      const { isEdit, form } = this;

      if (isEdit) {
        const { sortOrder, status, askGpId, askGpName, isShow } = form;
        await this.updateExplain({ sortOrder, status, askGpId, askGpName, isShow });
      } else {
        await this.saveExplain(form);
      }

      const { errorStatus } = this.$store.state.error;
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
