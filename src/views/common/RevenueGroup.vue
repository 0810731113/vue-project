<template>
  <el-form class="mw-form revenueGp-container" label-width="120px" ref="form" :rules="rules" :model="form">
    <el-form-item label="分类分组名称" prop="revenueGroupName">
      <el-input placeholder="请输入分类分组名称" :maxlength="15" v-model="form.revenueGroupName" />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="goRoute('/myd/business/revenue/group')">取消</el-button>
      <el-button type="primary" @click="onSubmit" class="btn-submit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateName } from 'utils/validateUtil';

export default {
  name: 'revenueGroup',
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        revenueGroupName: '',
        status: OK
      },
      rules: {
        revenueGroupName: [
          { required: true, message: '请输入分类分组名称', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  async created () {
    const { id } = this.$route.params;
    if (id) {
      await this.getRevenueGroupDetail(id);
      this.form = { ...this.detail };
    }
  },
  computed: mapState({
    detail: state => state.business.revenueGroup.detail,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'getRevenueGroupDetail',
      'insertRevenueGroup',
      'updateRevenueGroup'
    ]),
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      this.isEdit ? await this.updateRevenueGroup(this.form) : await this.insertRevenueGroup(this.form);

      if (!this.errorStatus) {
        this.goRoute('/myd/business/revenue/group');
      }
    },
    goRoute (router) {
      this.$router.push(router);
    }
  }
};
</script>
<style lang="scss">
  .revenueGp-container {
    .operation-item {
      .el-form-item__content {
        margin-left: 30px !important;
      }
    }
  }
</style>
