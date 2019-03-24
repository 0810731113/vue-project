<template>
  <el-dialog custom-class="base-modal feedback-modal" :visible.sync="isShow" size="small">
    <div class="modal-title" slot="title">反馈建议-提交</div>
    <el-form ref="form" class="mw-form feedback-message-form" :rules="rules" :model="form" label-width="120px">
      <el-form-item label="类型:" prop="type">
        <el-select v-model="form.type">
          <el-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="主题:" prop="theme">
        <el-input
          placeholder="请输入您提交内容的核心标题(如：菜品新建议等), 最多输入50字符."
          type="textarea"
          v-model="form.theme"
          resize="none"
          :maxlength="50" />
      </el-form-item>
      <el-form-item label="联系人:" prop="contact">
        <el-input v-model="form.contact" placeholder="请输入联系人" :maxlength="INPUT_MAX_LENGTH" />
      </el-form-item>
      <el-form-item label="联系电话:" prop="cellphonect">
        <el-input v-model="form.cellphonect" placeholder="请输入联系电话" :maxlength="11" />
      </el-form-item>
      <el-form-item label="联系邮箱:" prop="email">
        <el-input v-model="form.email" placeholder="请输入联系邮箱" :maxlength="INPUT_MAX_LENGTH" />
      </el-form-item>
      <el-form-item label="建议内容:" prop="content">
        <el-input
          placeholder="请输入您的宝贵意见和建议, 以帮助我们更好地改进产品, 最多输入500字符."
          type="textarea"
          resize="none"
          class="advice-content"
          v-model="form.content"
          :maxlength="500" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { INPUT_MAX_LENGTH } from 'constant/constants';
import { TRUE } from 'constant/statusCode';
import { validateName, validateNumber } from 'utils/validateUtil';
import { ERROR_INVALID_EMAIL } from 'constant/errorMessage';

export default {
  name: 'feedbackMessage',
  props: ['showToast'],
  data () {
    return {
      TRUE,
      isShow: false,
      form: {
        type: '0',
        theme: '',
        email: '',
        contact: '',
        content: '',
        cellphonect: ''
      },
      feedbackId: TRUE,
      INPUT_MAX_LENGTH,
      typeList: [
        { id: '0', name: '请选择' },
        { id: '1', name: '菜品管理' },
        { id: '2', name: '店铺报表' },
        { id: '3', name: '营销活动' },
        { id: '4', name: '会员管理' },
        { id: '5', name: '基础设置' },
        { id: '6', name: '其它' }
      ],
      rules: {
        type: [{ required: true, message: '请选择建议类型!', trigger: ['blur', 'change'] }],
        theme: [{ required: true, message: '请输入主题', trigger: ['blur', 'change'] }],
        email: [{ type: 'email', message: ERROR_INVALID_EMAIL, trigger: ['blur', 'change'] }],
        cellphonect: [{ validator: validateNumber, message: '请输入联系电话', trigger: ['blur', 'change'] }],
        contact: [{ validator: validateName, trigger: ['blur', 'change'] }],
        content: [{ required: true, message: '请输入建议内容', trigger: ['blur', 'change'] }]
      }
    };
  },
  computed: mapState({
    errorStatus: state => state.error.errorStatus
  }),
  watch: {
    async isShow () {
      if (!this.isShow) {
        this.$refs.form.resetFields();
      }
    }
  },
  methods: {
    ...mapActions([
      'addFeedbackInfo'
    ]),
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return validForm;

      const { form, feedbackId } = this;
      await this.addFeedbackInfo({ feedbackItemDto: form, feedbackId });

      if (this.errorStatus) {
        return false;
      }
      this.isShow = false;
      this.showToast();
      return validForm;
    }
  }
};
</script>

<style lang="scss">
.feedback-modal {
  .el-dialog__body {
    padding: 30px 20px 0;
  }

  .feedback-message-form {
    width: 80%;

    .advice-content {
      .el-textarea__inner {
        height: 100px;
      }
    }
  }
}
</style>
