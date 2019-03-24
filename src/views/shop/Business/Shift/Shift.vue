<template>
  <el-form
    class="mw-form"
    :class="editPopup"
    label-width="80px"
    ref="form"
    :rules="rules"
    :model="form"
    @submit.prevent.native
  >
    <el-form-item label="餐段名称" prop="msectionName">
      <el-input placeholder="请输入餐段名称" v-model="form.msectionName" :maxlength='50'></el-input>
    </el-form-item>
    <el-form-item label="开始时间" prop="beginTime">
      <el-time-picker
        placeholder="开始时间"
        v-model="form.beginTime"
        :editable="false"
        :picker-options="{
         selectableRange: ['00:00:00 - 23:59:00']
        }"
        format="HH:mm"
      />
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime">
      <el-time-picker
        placeholder="结束时间"
        v-model="form.endTime"
        :editable="false"
        :picker-options="{
         selectableRange: ['00:00:00 - 23:59:00`']
        }"
        format="HH:mm"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch
      v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item v-if="!guidance" class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH } from 'constant/constants';
import { validateName } from 'utils/validateUtil';
import moment from 'moment';

export default {
  name: 'shift',
  props: ['guidance', 'msectionId'],
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      INPUT_MAX_LENGTH,
      form: {
        msectionId: 0,
        msectionName: '',
        beginTime: null,
        endTime: null,
        status: OK
      },
      rules: {
        msectionName: [
          { required: true, message: '请输入餐段名称', trigger: 'blur, change' },
          { validator: validateName, trigger: ['blur', 'change'] }
        ],
        beginTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ]
      },
      isEdit: !!this.$route.params.id || !!this.msectionId
    };
  },
  async created () {
    const id = this.$route.params.id || this.msectionId;
    if (id) {
      await this.fetchShiftDetail(id);
      const { beginTime, endTime } = this.shiftDetail;
      const data = {
        ...this.shiftDetail,
        beginTime: new Date('1900/1/1 ' + beginTime),
        endTime: new Date('1900/1/1 ' + endTime)
      };
      this.initData(data);
    } else {
      await this.getShiftLastId();
      this.form.msectionId = this.lastId;
    }
  },
  computed: {
    ...mapState({
      shiftDetail: state => state.business.shift.shiftDetail,
      lastId: state => state.business.shift.lastId,
      errorStatus: state => state.error.errorStatus
    }),
    editPopup () {
      return {
        'edit-or-add-pop-up': this.guidance
      };
    }
  },
  methods: {
    ...mapActions([
      'saveShift',
      'updateShift',
      'fetchShiftDetail',
      'getShiftLastId'
    ]),
    initData (editData) {
      const { form } = this;
      this.form = { ...form, ...editData };
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });

      if (!validForm) return validForm;

      const { form, guidance } = this;
      const { beginTime, endTime } = form;
      const data = { ...form, beginTime: `${moment(beginTime).format('HH:mm')}:00`, endTime: `${moment(endTime).format('HH:mm')}:00`, noShowError: guidance };
      this.isEdit
        ? await this.updateShift(data)
        : await this.saveShift(data);

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
<style lang="scss">
  .mw-form {
    .edit-or-add-pop-up {
      width: 80% !important;
    }

    .el-date-editor.el-input {
      width: 100%;
    }
  }
</style>
