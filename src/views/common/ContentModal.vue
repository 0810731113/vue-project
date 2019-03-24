<template>
  <el-dialog v-if="isShow" custom-class="base-modal explain-content-modal" :visible.sync="isShow" :before-close="onShowOrHideModal" size="small">
    <div class="modal-title" slot="title">{{ data.name }}</div>
    <el-form ref="form" :rules="rules" inline :model="form" class="form-inline">
      <el-form-item>
        <el-button type="primary" class="btn-base" @click="onClickAdd" v-show="!selectedRow.askName">新增</el-button>
      </el-form-item>
      <el-form-item prop="askName">
        <el-input v-model="form.askName" placeholder="内容" :maxlength="30" />
      </el-form-item>
      <el-form-item>
        <el-input-number v-model="form.addPrice" :controls="false" :min="0" :max="9999.99" placeholder="加价" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="btn-base" @click="onClickEdit" v-show="!!selectedRow.askName">保存</el-button>
        <el-button type="primary" class="btn-base" @click="onClickCancel" v-show="!!selectedRow.askName">取消</el-button>
      </el-form-item>
    </el-form>
    <el-table class="table-content" ref="content" :data="list" highlight-current-row border :height="450">
      <el-table-column prop="askName" align="center" label="内容" />
      <el-table-column prop="addPrice" align="center" label="加价" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button content="编辑" class="btn-edit" @click="onSelectCurrent(scope.row)" />
          <mw-button content="删除" class="btn-delete" @click="onDeleteRow(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onShowOrHideModal">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { validateName } from 'utils/validateUtil';
import { MwButton } from 'components';

export default {
  name: 'Modal',
  props: [
    'data',
    'list',
    'saveExplainContent',
    'updateExplainContent',
    'deleteExplainContent',
    'fetchAllExplainByPage'
  ],
  components: {
    MwButton
  },
  data () {
    return {
      isShow: false,
      form: {
        askName: '',
        addPrice: ''
      },
      rules: {
        askName: [
          { validator: validateName, trigger: 'blur' },
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      selectedRow: {}
    };
  },
  watch: {
    isShow () {
      this.onClickCancel();
    }
  },
  methods: {
    async onShowOrHideModal () {
      this.isShow = false;
      await this.fetchAllExplainByPage();
    },
    async onClickAdd () {
      if (!this.validateForm()) return;
      const { form, data } = this;
      const content = { ...form, askGpId: data.askGpId };
      await this.saveExplainContent(content);
      this.onClickCancel();
    },
    onSelectCurrent (row) {
      this.selectedRow = row;
      this.form = { ...row, addPrice: row.addPrice.toString() };
    },
    async onDeleteRow (row) {
      await this.deleteExplainContent(row);
    },
    async onClickEdit () {
      if (!this.validateForm()) return;
      const { askName, addPrice, id } = this.form;
      const { askGpId } = this.data;
      await this.updateExplainContent({ askName, addPrice, id, askGpId });
      this.onClickCancel();
    },
    validateForm () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      return validForm;
    },
    onClickCancel () {
      this.selectedRow = {};
      if (this.$refs.content) {
        this.$refs.content.setCurrentRow();
      }
      this.form = { askName: '', addPrice: '' };
    }
  }
};
</script>

<style lang="scss">
.explain-content-modal {
  .table-content {
    .current-row {
      > td {
        background: #dff0d8;
      }
    }
  }
}
</style>
