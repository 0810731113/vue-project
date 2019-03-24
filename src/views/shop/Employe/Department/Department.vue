<template>
  <el-form class="mw-form" label-width="80px" ref="form" :rules="rules" :model="form" @submit.prevent.native>
<!--    <el-form-item label="部门代码" prop="deptId">
      <el-input placeholder="请输入部门代码" v-model="form.deptId" :maxlength='50'></el-input>
    </el-form-item>-->
    <el-form-item label="部门名称" prop="deptName">
      <el-input placeholder="请输入部门名称" v-model="form.deptName" :maxlength='50'></el-input>
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { validateName, validateId } from 'utils/validateUtil';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';

export default {
  name: 'department',
  props: ['deptId'],
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        deptId: 0,
        deptName: '',
        status: OK
      },
      rules: {
        deptId: [
          { required: true, message: '请输入部门代码', trigger: 'blur, change' },
          { validator: validateId, trigger: 'blur, change' }
        ],
        deptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur, change' },
          { validator: validateName, trigger: 'blur, change' }
        ]
      },
      isEdit: !!this.$route.params.id || !!this.deptId
    };
  },
  async created () {
    const { isEdit } = this;
    const id = this.$route.params.id || this.deptId;
    await this.getShopDeptDetail({ deptId: isEdit ? id : null });
    const { shopDeptDetail } = this;
    this.form = { ...shopDeptDetail };
  },
  computed: {
    ...mapState({
      shopDeptDetail: state => state.employe.department.shopDeptDetail,
      errorStatus: state => state.error.errorStatus
    })
  },
  methods: {
    ...mapActions([
      'updateShopDeptInfo',
      'getShopDeptDetail'
    ]),
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return validForm;

      const { isEdit, form } = this;
      const data = { shopDeptItemDto: form, operate: isEdit ? 'edit' : 'add' };
      await this.updateShopDeptInfo(data);

      if (this.errorStatus) {
        return false;
      } else if (!this.guidance) {
        this.$router.back();
      }
      return validForm;
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>
