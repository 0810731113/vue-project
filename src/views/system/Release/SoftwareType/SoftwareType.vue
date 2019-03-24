<template>
  <div class="software-type">
    <el-form class="mw-form" label-width="80px" ref="form" :rules="rules" :model="form">
      <el-form-item label="名称" prop="name">
        <el-input placeholder="请输入名称" v-model="form.name" :disabled="isEdit" :maxlength='20' />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input placeholder="请输入备注" v-model="form.note" :maxlength='50' />
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button @click="onCancel" class="btn-cancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';

export default {
  name: 'SoftwareType',
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        name: '',
        status: 1,
        note: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur, change' }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    if (this.isEdit) {
      const { id } = this.$route.params;
      await this.fetchSoftwareDetail({ id });
      this.form = { ...this.detail };
    }
  },
  computed: mapState({
    detail: state => state.release.software.detail,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'saveSoftware',
      'fetchSoftwareDetail'
    ]),
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });

      if (!validForm) return;
      const { form, isEdit } = this;
      await this.saveSoftware({ itemDto: form, operate: isEdit ? 'edit' : 'add' });
      if (!this.errorStatus) {
        this.onCancel();
      }
    },
    onCancel () {
      this.$router.push('/myd/release/software');
    }
  }
};
</script>
