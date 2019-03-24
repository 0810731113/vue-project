<template>
  <el-form
    class="business-setting-form"
    ref="form"
    :rules="rules"
    :model="form"
    label-width="100px"
    @submit.prevent.native="onSubmit"
  >
    <el-form-item :label="name" prop="reason">
      <el-input v-model="form.reason" :maxlength="20" :placeholder="`请输入${name}`"></el-input>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { validateReportName } from 'utils/validateUtil';

  export default {
    name: 'BaseForm',
    props: {
      submitForm: {
        type: Function,
        default: () => {}
      },
      form: {
        type: Object,
        default: {
          reason: '',
          sort: 99
        }
      },
      name: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        rules: {
          reason: [
            { validator: validateReportName, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id
      };
    },
    methods: {
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });

        if (!validForm) return;
        await this.submitForm(this.form);
      },
      onCancel () {
        this.$router.back();
      }
    }
  };
</script>

<style lang="scss">
  .business-setting-form {
    margin: auto;
    padding: 15px;
  }
</style>
