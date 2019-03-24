<template>
  <el-dialog
    width="40%"
    :closeOnClickModal="false"
    class="base-modal"
    :visible.sync="isShow"
    title="新增区域">
    <el-form :model= "form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="餐厅名称" prop="mareaName">
        <el-input placeholder="请输入餐厅名称" v-model="form.mareaName"></el-input>
      </el-form-item>
      <el-form-item label="状态" >
        <el-switch
          v-model="form.mareaStatus"
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
    name: 'AddAreaModel',
    props: {
      onTableAreaCallBack: {
        type: Function,
        default: () => {}
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
          mareaId: null,
          mareaName: null,
          mareaStatus: OK
        },
        rules: {
          mareaName: [
            { required: true, message: '请输入餐区名称', trigger: ['blur', 'change'] },
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
        'fetchDiningAreaItem',
        'saveDiningArea',
        'getTableArealist'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.saveDiningArea(this.form);
        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          // update table area list
          await this.getTableArealist();
          this.onTableAreaCallBack(this.form.mareaId);
          this.isShow = false;
          return;
        }
      },
      async init () {
        await this.fetchDiningAreaItem();
        const { diningAreaItem } = this.$store.state.tables.diningArea;
        if (diningAreaItem) {
          this.form = { ...this.form, ...diningAreaItem, mareaStatus: OK };
        }
      }
    }
  };
</script>

