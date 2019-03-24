<template>
  <el-dialog custom-class="base-modal explain-content-modal" :visible.sync="isShow" width="40%" :before-close="onShowOrHideModal">
    <div class="modal-title" slot="title">添加{{ type === 'sale' ? '销售' : '收入'}}归属</div>
    <el-form :model="form" ref="form" :rules="rules" label-width="100px" >
      <el-form-item label="归属名称" prop="name">
        <el-input v-model="form.name" :maxlength="30" placeholder="请输入归属名称" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="分类分组" prop="revenueGroupId" v-if="type !== 'sale'">
        <el-select v-model="form.revenueGroupId" class="width-full">
          <el-option
            v-if="item.status !== FORBIDDEN"
            v-for="item in revenueGroupList"
            :key="item.revenueGroupId"
            :label="item.revenueGroupName"
            :value="item.revenueGroupId" />
        </el-select>
      </el-form-item>
      <el-form-item label="顺序" prop="sortOrder">
        <el-input-number :controls="false" class="width-full" :min="0" :max='SORT' v-model="form.sortOrder" ref="orderInput"/>
      </el-form-item>
    </el-form>
    <div class="error-wrapper horizontal-center" v-if="!!errorMsg">
      <i class="el-icon-circle-cross"></i>
      {{ errorMsg }}
    </div>
    <div style="text-align: center">
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, SORT } from 'constant/constants';
import { validateName } from 'utils/validateUtil';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'attributionModal',
  props: ['type', 'onSaveAttribution'],
  data () {
    return {
      OK,
      ON_TEXT,
      OFF_TEXT,
      FORBIDDEN,
      SORT,
      errorMsg: '',
      isShow: false,
      form: {
        id: '',
        name: '',
        revenueGroupId: '99',
        status: 1,
        sortOrder: 0
      },
      rules: {
        name: [
          { validator: validateName, trigger: ['blur', 'change'] },
          { required: true, message: '请输入归属名称', trigger: ['blur', 'change'] }
        ],
        sortOrder: [
          { required: true, message: '顺序不能为空', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  computed: mapState({
    revenueGroupList: state => state.business.revenue.revenueGroupList,
    error: state => state.error
  }),
  created () {
    this.getRevenueGroupList();
  },
  methods: {
    ...mapActions([
      'getRevenueGroupList'
    ]),
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      await this.onSaveAttribution(this.type, this.form);
      const { errorStatus, errorMsg } = this.error;
      if (errorStatus) {
        this.errorMsg = errorMsg;
        return;
      }
      this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.$refs.form.resetFields();
      this.isShow = false;
      this.errorMsg = '';
      this.form = { ...this.from, id: '', name: '', sortOrder: 0, status: 1, revenueGroupId: '99' };
    }
  }
};
</script>
