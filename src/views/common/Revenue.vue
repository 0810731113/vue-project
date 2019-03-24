<template>
  <el-form class="mw-form" label-width="80px" ref="form" :rules="rules" :model="form" @submit.prevent.native>
    <el-form-item label="分类名称" prop="revenueTypeName">
      <el-input placeholder="请输入分类名称" v-model="form.revenueTypeName" :maxlength='15' />
    </el-form-item>
    <el-form-item label="分类分组" prop="revenueGroupId">
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
      <!--<input  class="el-input el-input__inner width-full" v-model="form.sortOrder" ref="orderInput" min="0" max="99" type="number"/>-->
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex';
import { isShop } from 'utils/configUtil';
import { OK, FORBIDDEN, UNCLASSIFIED } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, SORT } from 'constant/constants';
import { validateName, validateNumber } from 'utils/validateUtil';

export default {
  name: 'revenue',
  props: ['saveRevenue', 'updateRevenue', 'fetchRevenueDetail', 'getRevenueLastId', 'revenueDetail', 'lastId', 'revenueGroupList', 'getRevenueGroupList'],
  data () {
    return {
      OK,
      SORT,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      UNCLASSIFIED,
      form: {
        revenueTypeId: 0,
        revenueTypeName: '',
        revenueGroupId: UNCLASSIFIED,
        sortOrder: 0,
        status: OK
      },
      isShop: isShop(),
      rules: {
        revenueTypeName: [
          { validator: validateName, trigger: ['blur', 'change'] },
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ],
        revenueGroupId: [
          { required: true, message: '请输入分类分组', trigger: ['blur', 'change'] }
        ],
        sortOrder: [
          { required: true, message: '顺序不能为空', trigger: ['blur', 'change'] },
          { validator: validateNumber, trigger: ['blur', 'change'] }
        ]
      },
      isEdit: !!this.$route.params.id
    };
  },
  watch: {
    revenueDetail () {
      this.initData(this.revenueDetail);
    }
  },
  async created () {
    const { id } = this.$route.params;

    if (id) {
      await this.fetchRevenueDetail(id);
    } else {
      await this.getRevenueLastId();
//      this.form.revenueTypeId = this.lastId;
    }
    await this.getRevenueGroupList();
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
        await this.updateRevenue(this.form);
      } else {
        await this.saveRevenue(this.form);
      }

      if (!this.errorStatus) {
        this.$router.push('/myd/business/revenue');
      }
    },
    onCancel () {
      this.$router.push('/myd/business/revenue');
    }
  }
};
</script>
