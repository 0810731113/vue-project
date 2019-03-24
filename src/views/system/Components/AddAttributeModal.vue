<template>
  <Popup
    class="add-attribute-modal"
    ref="popup"
    type="submit"
    title="请选择属性"
    okText="保存"
    :handleOk="onSubmit"
    :handleClose="onClose"
    size="small">
    <el-form
      slot="content" class="mw-form" :model="form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="项目名称" prop="Text">
        <el-select v-model="form.Text" placeholder="请选择" style="width: 100%" @change="onChange">
          <el-option
            v-for="item in systemReportAttributeList"
            :key="item.guid"
            :label="item.text"
            :value="item.text"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字体大小">
        <el-radio-group v-model="form.Size">
          <el-radio :label="NORMAL">普通</el-radio>
          <el-radio :label="LARGE">放大</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否加粗">
        <el-radio-group v-model="form.Bold">
          <el-radio :label="NO">否</el-radio>
          <el-radio :label="YES">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="对齐方式">
        <el-radio-group v-model="form.Align">
          <el-radio :label="LEFT">居左</el-radio>
          <el-radio :label="MIDDLE">居中</el-radio>
          <el-radio :label="RIGHT">居右</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.FillType">
          <el-radio :label="VISIBLE">始终显示</el-radio>
          <el-radio :label="HIDDEN">没有数据不显示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字符数" prop="Width">
        <el-input v-model="form.Width" placeholder="请输入字符数" :maxlength='INPUT_MAX_LENGTH'></el-input>
      </el-form-item>
      <el-form-item label="数据源" style="margin-top: 10px">
        <el-input v-model="form.Text" :maxlength='INPUT_MAX_LENGTH' style="width: 49%"></el-input>
        <el-input v-model="form.Value" :maxlength='INPUT_MAX_LENGTH' style="width: 49%"></el-input>
      </el-form-item>
    </el-form>
  </Popup>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Popup } from 'components';
  import { validateNumber } from 'utils/validateUtil';
  import { INPUT_MAX_LENGTH, LEFT, MIDDLE, RIGHT, YES, NO, NORMAL, LARGE, VISIBLE, HIDDEN, PROJECT_NAME_LIST } from 'constant/constants';

  export default {
    name: 'AddAttributeModal',
    props: {
      tagItem: Object,
      reportId: String
    },
    components: {
      Popup
    },
    data () {
      return {
        form: {
          Value: '',
          Align: LEFT,
          Size: NORMAL,
          Width: 24,
          Bold: NO,
          Text: '',
          FillType: VISIBLE
        },
        isShow: false,
        LEFT,
        MIDDLE,
        RIGHT,
        YES,
        NO,
        NORMAL,
        LARGE,
        VISIBLE,
        HIDDEN,
        INPUT_MAX_LENGTH,
        PROJECT_NAME_LIST,
        rules: {
          Text: [
            { required: true, message: '这是必选字段', trigger: 'blur' }
          ],
          Width: [
            { validator: validateNumber, trigger: 'blur' }
          ]
        }
      };
    },
    computed: {
      ...mapState({
        systemReportAttributeList: state => state.tool.systemReportTemplate.systemReportAttributeList
      })
    },
    watch: {
      async isShow () {
        this.$refs['popup'].isShow = this.isShow;
        await this.init();
      }
    },
    methods: {
      ...mapActions([
        'fetchSysReportAttributeList'
      ]),
      async init () {
        const { reportId } = this;
        await this.fetchSysReportAttributeList({ reportId, type: PROJECT_NAME_LIST });

        if (this.tagItem) {
          this.form = { ...this.form, ...this.tagItem };
        } else {
          this.form = {
            Value: '',
            Align: LEFT,
            Size: NORMAL,
            Width: 24,
            Bold: NO,
            Text: '',
            FillType: VISIBLE
          };
        }
      },
      onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;
        this.$emit('setTagItem', this.form);
        this.isShow = false;
      },
      onClose () {
        this.isShow = false;
      },
      onChange (value) {
        const item = this.systemReportAttributeList.find(item => item.text === value);
        if (item) this.form.Value = item.value;
      }
    }
  };
</script>
<style lang="scss" scoped>
  .add-attribute-modal {
    .mw-form {
      width: 80% !important;

      .el-form-item {
        margin-bottom: 20px !important;
      }
    }
  }
</style>
