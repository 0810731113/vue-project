<template>
  <div class="form-container">
    <el-form class="mw-form" :model="form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="类别名称" prop="mtableClsName">
        <el-input placeholder="请输入类别名称" v-model="form.mtableClsName" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
      </el-form-item>
      <el-form-item v-if="!guidance" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { ON_TEXT, OFF_TEXT, MAX_PAGE_SIZE } from 'constant/constants';
  import { validateGeneralName } from 'utils/validateUtil';

  export default {
    name: 'TableType',
    props: ['guidance', 'mTableClsId'],
    data () {
      return {
        OK,
        FORBIDDEN,
        ON_TEXT,
        OFF_TEXT,
        form: {
          mtableClsId: null,
          mtableClsName: null,
          status: OK
        },
        MAX_PAGE_SIZE,
        rules: {
          mtableClsName: [
            { required: true, message: '请输入类别名称', trigger: ['blur', 'change'] },
            { validator: validateGeneralName, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.mTableClsId
      };
    },
    computed: {
      ...mapState({
        pageIndex: state => state.tables.tableType.pageIndex
      })
    },
    methods: {
      ...mapActions([
        'fetchAllTableTypes',
        'fetchTableTypeItem',
        'saveTableType',
        'clearError',
        'editTableType'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const data = { ...this.form, noShowError: this.guidance };
        this.isEdit ? await this.editTableType(data) : await this.saveTableType(data);
        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.$router.back();
        }
        if (this.guidance) {
          const { pageIndex } = this;
          await this.fetchAllTableTypes({ pageSize: MAX_PAGE_SIZE, pageIndex });
        }
        return validForm;
      },
      onCancel () {
        this.$router.back();
      },
      init () {
        const { tableTypeItem } = this.$store.state.tables.tableType;
        if (tableTypeItem) {
          const { status, mtableClsId, mtableClsName } = tableTypeItem;
          this.form = {
            mtableClsId,
            mtableClsName,
            status: status === null ? OK : +status
          };
        }
      }
    },
    async created () {
      this.isEdit
        ? await this.fetchTableTypeItem({ mtableClsId: this.mTableClsId || this.$route.params.id, noShowError: this.mTableClsId })
        : await this.fetchTableTypeItem();

      this.init();
    }
  };
</script>

