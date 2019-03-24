<template>
  <Popup
    class="report-template-datasource-modal"
    ref="popup"
    type="submit"
    title="请选择绑定的数据源"
    okText="保存"
    :handleOk="onSubmit"
    :handleClose="onClose"
    size="small">
    <el-form slot="content" class="mw-form" :model="form" ref="form" :rules="rules" label-width="80px">
      <el-form-item label="行属性">
        <el-select v-model="form.Type" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in LINE_ATTRIBUTE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="行高">
        <el-select v-model="form.Height" placeholder="请选择" style="width: 100%">
          <el-option
            v-for="item in LINE_HEIGHT"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据源" v-if="form.Type !== SINGLE_LINE">
        <el-select placeholder="请选择" v-model="form.Data" style="width: 100%" @change="onChange">
          <el-option
            v-for="item in systemReportAttributeList"
            :key="item.guid"
            :label="item.text"
            :value="item.value"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" v-if="form.Type !== SINGLE_LINE">
        <el-select placeholder="请选择" style="width: 100%" v-model="form.Remarks">
          <el-option
            v-for="item in systemReportTemplateDataSource"
            :key="item.guid"
            :label="item.text"
            :value="item.value"
            style="width: 100%"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-radio-group v-model="form.Colour">
          <el-radio :label="BLACK">黑色</el-radio>
          <el-radio :label="RED">红色</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否显示">
        <el-radio-group v-model="form.FillType">
          <el-radio :label="VISIBLE">始终显示</el-radio>
          <el-radio :label="HIDDEN">没有数据不显示</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </popup>
</template>
<script>
  import { Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { VISIBLE, HIDDEN, LINE_ATTRIBUTE, LINE_HEIGHT, BLACK, RED, SINGLE_LINE, DATA_SOURCE_LIST } from 'constant/constants';

  export default {
    name: 'ReportTemplateDataSourceModal',
    props: {
      rowItem: Object,
      reportId: String
    },
    components: {
      Popup
    },
    data () {
      return {
        RED,
        BLACK,
        HIDDEN,
        VISIBLE,
        LINE_HEIGHT,
        SINGLE_LINE,
        LINE_ATTRIBUTE,
        DATA_SOURCE_LIST,
        isShow: false,
        form: {
          Type: 0,
          Height: 0,
          Colour: BLACK,
          Remarks: '',
          Data: '',
          FillType: VISIBLE
        },
        rules: {
        }
      };
    },
    watch: {
      async isShow () {
        this.$refs['popup'].isShow = this.isShow;
        await this.init();
      }
    },
    computed: {
      ...mapState({
        systemReportAttributeList: state => state.tool.systemReportTemplate.systemReportAttributeList,
        systemReportTemplateDataSource: state => state.tool.systemReportTemplate.systemReportTemplateDataSource
      })
    },
    methods: {
      ...mapActions([
        'fetchSysReportAttributeList',
        'fetchSysReportTemplateDataSources'
      ]),
      async init () {
        const { reportId } = this;
        await this.fetchSysReportAttributeList({ reportId, type: DATA_SOURCE_LIST });

        this.form = { ...this.form, ...this.rowItem };
      },
      onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;
        this.$emit('setRowItem', this.form);

        this.isShow = false;
      },
      onClose () {
        this.isShow = false;
      },
      async onChange (value) {
        const selectedItem = this.systemReportAttributeList.find(item => item.value === value);
        if (!selectedItem) {
          return;
        }

        const { guid } = selectedItem;
        const { reportId } = this;
        await this.fetchSysReportTemplateDataSources({ reportId, guid });
        this.form.Remarks = '';
      }
    }
  };

</script>
<style lang="scss">
  .report-template-datasource-modal {
    .mw-form {
      width: 80% !important;

      .el-form-item {
        margin-bottom: 20px !important;
      }
    }
  }
</style>
