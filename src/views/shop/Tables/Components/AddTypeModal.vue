<template>
  <el-dialog
    width="40%"
    :closeOnClickModal="false"
    class="base-modal"
    :visible.sync="isShow"
    title="新增类别">
    <el-form :model= "form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="类别名称" prop="mtableClsName">
        <el-input placeholder="请输入类别名称" v-model="form.mtableClsName"></el-input>
      </el-form-item>
      <el-form-item  label="状态">
        <el-switch
          v-model="form.status"
          :active-text="ON_TEXT"
          :inactive-text="OFF_TEXT"
          :active-value="OK"
          :inactive-value="FORBIDDEN"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import { mapActions } from 'vuex';
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { ON_TEXT, OFF_TEXT } from 'constant/constants';

  export default {
    name: 'AddTypeModal',
    props: {
      onTableTypeCallBack: {
        type: Function
      }
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        ON_TEXT,
        OFF_TEXT,
        isShow: false,
        form: {
          mtableClsId: null,
          mtableClsName: null,
          status: OK
        },
        rules: {
          mtableClsName: [
            { required: true, message: '请输入类别名称', trigger: ['blur', 'change'] },
            { min: 1, max: 50, message: '请输入1 - 50个字符', trigger: 'blur' }
          ]
        }
      };
    },
    watch: {
      async isShow () {
        if (this.$refs.form) this.$refs.form.resetFields();
        if (this.isShow) {
          await this.init();
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchTableTypeItem',
        'saveTableType',
        'getTableTypelist'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.saveTableType(this.form);
        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          // update tableType list
          console.log(this.form)
          await this.getTableTypelist();
          this.onTableTypeCallBack(this.form.mtableClsId);
          this.isShow = false;
        }
      },
      async init () {
        await this.fetchTableTypeItem();
        const { tableTypeItem } = this.$store.state.tables.tableType;
        if (tableTypeItem) {
          const { status } = tableTypeItem;
          this.form = {
            ...this.form,
            ...tableTypeItem,
            status: status === null ? OK : +status
          };
        }
      }
    }
  };
</script>
