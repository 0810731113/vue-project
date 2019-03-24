<template>
  <el-form ref="form" :model="form" class="mw-form notices" :rules="rules" label-width="120px">
    <el-form-item label="公告标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入公告标题" :maxlength='50' />
    </el-form-item>
    <el-form-item label="公告时间" required v-if="isSystem">
      <el-date-picker
        v-model="dateTime"
        type="datetimerange"
        placeholder="选择时间范围">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="公告内容" prop="content">
      <el-input v-model="form.content" type="textarea" class="text-area" placeholder="请输入公告内容" :maxlength='2000'/>
    </el-form-item>
    <el-form-item label="公告状态" v-if="isEdit">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validateName } from 'utils/validateUtil';
import { ON_TEXT, OFF_TEXT, NOTICES_TYPE } from 'constant/constants';
import { OK, FORBIDDEN } from 'constant/statusCode';
import fecha from 'fecha';

export default {
  name: 'notices',
  props: ['noticesDetail', 'getNoticesDetail', 'insertNoticesEntity', 'isSystem'],
  data () {
    return {
      OK,
      ON_TEXT,
      OFF_TEXT,
      FORBIDDEN,
      form: {
        title: '',
        content: '',
        status: OK,
        type: '',
        opera: '',
        id: ''
      },
      dateTime: [new Date(), new Date()],
      isEdit: !!this.$route.params.id,
      rules: {
        title: [
          { required: true, message: '请输入公告标题，最多输入50字符', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ],
        content: [
          { required: true, message: '请输入公告内容，最多输入2000字符', trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  async created () {
    const { id } = this.$route.params;
    if (this.isEdit) {
      await this.getNoticesDetail(id);
      this.form = { ...this.form, ...this.noticesDetail, id };
      if (this.isSystem) {
        const { startDate, endDate } = this.form;
        this.dateTime = [new Date(startDate), new Date(endDate)];
      }
    } else {
      const { isSystem } = this;
      this.form = { ...this.form, type: isSystem ? NOTICES_TYPE[1].id : NOTICES_TYPE[0].id };
    }
  },
  methods: {
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      if (this.isSystem) {
        const [startDate, endDate] = this.dateTime;
        this.form = {
          ...this.form,
          starDate: fecha.format(startDate, 'YYYY-MM-DD HH:mm:ss'),
          endDate: fecha.format(endDate, 'YYYY-MM-DD HH:mm:ss'),
          opera: this.isEdit ? 2 : 1
        };
        delete this.form.startDate;
        delete this.form.Id;
      }

      await this.insertNoticesEntity(this.form);
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

<style lang="scss">
  .notices {
    width: 46%;
    margin: 1% auto;
    padding: 15px;

    .text-area {
      .el-textarea__inner {
        height: 200px;
      }
    }

    .operation-item {
      margin-top: 30px;
    }
  }
</style>
