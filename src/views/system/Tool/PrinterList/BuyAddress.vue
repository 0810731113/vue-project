<template>
  <el-form
    class="buy-address-form mw-form"
    ref="form"
    :model="form"
    :rules="rules"
    label-width="200px"
    label-position="top"
    @submit.prevent.native="onSubmit"
  >
    <!--新增-->
    <el-form-item label="打印机购买网址" v-if="!form.guid" prop="printerUrl">
      <el-input v-model="form.printerUrl" :maxlength="200" placeholder="请输入打印机购买地址"></el-input>
    </el-form-item>
    <!--编辑-->
    <el-form-item label="打印机购买网址" v-if="form.guid && isEdit">
      <el-input v-model="form.printerUrl" :maxlength="200" placeholder="请输入打印机购买地址"></el-input>
    </el-form-item>
    <el-form-item label="打印机购买网址" v-if="!!form.guid && !isEdit">
      <span>{{form.printerUrl}}</span>
      <a class="mw-link" @click="toEditPage">更改</a>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel" v-if="isEdit">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit" v-if="isEdit || !form.guid">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'BuyAddress',
    data () {
      return {
        form: {
          guid: null,
          printerUrl: '',
          newPrinterUrl: ''
        },
        isEdit: false,
        rules: {
          printerUrl: [
            { required: true, message: '请输入打印机购买地址', trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    async created () {
      await this.fetchPrinterBuyAddress();
      this.form = {
        ...this.form,
        ...this.printerBuyAddress
      };
    },
    computed: {
      ...mapState({
        printerBuyAddress: state => state.tool.printerList.printerBuyAddress
      })
    },
    methods: {
      ...mapActions([
        'fetchPrinterBuyAddress',
        'savePrinterBuyAddress',
        'updatePrinterBuyAddress'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });

        if (!validForm) return;
        this.isEdit ? await this.updatePrinterBuyAddress({ printerUrl: this.form }) : await this.savePrinterBuyAddress({ printerUrl: this.form });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$toast.show({ content: '操作成功' });

          this.isEdit = false;
          await this.fetchPrinterBuyAddress();
          this.form = {
            ...this.form,
            ...this.printerBuyAddress
          };
        }
      },
      onCancel () {
        this.form = {
          ...this.form,
          ...this.printerBuyAddress
        };
        this.isEdit = false;
      },
      toEditPage () {
        this.isEdit = true;
      }
    }
  };
</script>

<style lang="scss">
  .buy-address-form {
    .mw-link {
      margin-left: 10px;
    }
  }
</style>
