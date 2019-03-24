<template>
  <Popup
    class="add-line-modal"
    ref="popup"
    type="submit"
    title="请选择属性"
    okText="保存"
    :handleOk="onSubmit"
    :handleClose="onClose"
    size="small">
    <el-form slot="content" :rules="rules" class="mw-form" :model="form" ref="form" label-width="100px">
      <el-form-item label="分割字符" prop="Remarks">
        <el-input v-model="form.Remarks" :maxlength="1"></el-input>
      </el-form-item>
      <el-form-item label="分割线长度" prop="Width">
        <el-input v-model="form.Width" :maxlength="INPUT_MAX_LENGTH"></el-input>
      </el-form-item>
      <el-form-item label="行高" prop="Height">
        <el-select v-model="form.Height" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in LINE_HEIGHT"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </Popup>
</template>
<script>
  import { Popup } from 'components';
  import { LINE_HEIGHT, INPUT_MAX_LENGTH } from 'constant/constants';
  import { validateNumber } from 'utils/validateUtil';

  export default {
    name: 'AddLineModal',
    props: {
      lineItem: Object
    },
    components: {
      Popup
    },
    data () {
      return {
        LINE_HEIGHT,
        INPUT_MAX_LENGTH,
        form: {
          Type: 2,
          Data: '',
          Remarks: '',
          FillType: 0,
          Colour: 0,
          Width: '',
          Height: 0
        },
        isShow: false,
        rules: {
          Remarks: [
            { required: true, message: '请输入分割字符，最多输入1字符', trigger: 'blur, change' }
          ],
          Width: [
            { validator: validateNumber, trigger: 'blur, change' },
            { required: true, message: '请输入分割线长度，最多输入80字符', trigger: 'blur, change' }
          ]
        }
      };
    },
    watch: {
      async isShow () {
        this.$refs['popup'].isShow = this.isShow;
        await this.init();
      }
    },
    methods: {
      init () {
        if (this.lineItem) {
          this.form = { ...this.form, ...this.lineItem };
        } else {
          this.form = {
            Type: 2,
            Data: '',
            Remarks: '',
            FillType: 0,
            Colour: 0,
            Width: '',
            Height: 0
          };
        }
      },
      onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;
        this.$emit('setLineItem', this.form);
        this.isShow = false;
      },
      onClose () {
        this.isShow = false;
      }
    }
  };

</script>
<style lang="scss">
  .add-line-modal {
    .mw-form {
      width: 80% !important;

      .el-form-item {
        margin-bottom: 20px !important;
      }
    }
  }
</style>
