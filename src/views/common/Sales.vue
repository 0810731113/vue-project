<template>
  <el-form
    class="mw-form"
    label-width="80px"
    ref="form"
    :rules="rules"
    :model="form"
    @submit.prevent.native>
    <el-form-item label="分类名称" prop="expClsName">
      <el-input placeholder="请输入分类名称" v-model="form.expClsName" :maxlength='30'></el-input>
    </el-form-item>
    <el-form-item label="顺序" prop="sortOrder">
      <el-input-number placeholder="请输入顺序" :controls="false" v-model="form.sortOrder" :min="0" :max="99"style="width: 100%;"></el-input-number>
      <!--<input  class="el-input el-input__inner width-full" v-model="form.sortOrder" ref="orderInput" min="0" max="99" type="number"/>-->
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';
import { validateName } from 'utils/validateUtil';

export default {
  name: 'sales',
  props: ['saveSales', 'updateSales', 'fetchSalesDetail', 'getSalesLastId', 'saleDetail', 'lastId'],
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        expClsId: 0,
        expClsName: '',
        sortOrder: 0,
        status: OK
      },
      rules: {
        expClsName: [
          { validator: validateName, trigger: ['blur', 'change'] },
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  watch: {
    saleDetail () {
      this.initData(this.saleDetail);
    }
  },
  async created () {
    const { id } = this.$route.params;

    if (id) {
      await this.fetchSalesDetail(id);
    } else {
      await this.getSalesLastId();
      this.form.expClsId = this.lastId;
    }
  },
  computed: mapState({
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    initData (editData) {
      this.form = { ...editData };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      if (this.isEdit) {
        await this.updateSales(this.form);
      } else {
        await this.saveSales(this.form);
      }

      if (!this.errorStatus) {
        this.$router.push(`/myd/business/sales`);
      }
    },
    onCancel () {
      this.$router.push(`/myd/business/sales`);
    }
  }
};
</script>
