<template>
  <div class="software-type">
    <el-form class="mw-form" label-width="80px" ref="form" :rules="rules" :model="form">
      <el-form-item label="软件类型" prop="softId">
        <el-select v-model="form.softId" :disabled="isEdit" placeholder="请选择">
          <el-option
            v-for="item in softList"
            :key="item.id"
            :label="item.name"
            :value="item.id.toString()" />
        </el-select>
      </el-form-item>
      <el-form-item label="更新内容">
        <el-input placeholder="请输入更新内容" v-model="form.upContent" :maxlength='200' />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input placeholder="请输入版本号" v-model="form.version" :disabled="isEdit" :maxlength='20' />
      </el-form-item>
      <el-form-item label="文件名称" prop="fileName">
        <el-input placeholder="请输入文件名称" v-model="form.fileName" :maxlength='20' />
      </el-form-item>
      <el-form-item label="文件地址" prop="fileUrl">
        <el-input placeholder="请输入文件地址" v-model="form.fileUrl" :maxlength='200' />
      </el-form-item>
      <el-form-item label="校验码">
        <el-input placeholder="请输入校验码" v-model="form.checkCode" :maxlength='100' />
      </el-form-item>
      <el-form-item label="备注">
        <el-input placeholder="请输入备注" v-model="form.note" :maxlength='50' />
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button @click="onCancel" class="btn-cancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from 'constant/pagination';
import { validateFileUrl } from 'utils/validateUtil';

export default {
  name: 'SoftwareType',
  data () {
    return {
      form: {
        softId: '',
        version: '',
        upContent: '',
        fileName: '',
        fileUrl: '',
        checkCode: null,
        note: null
      },
      rules: {
        softId: [
          { required: true, message: '请选择软件类型', trigger: 'change' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur, change' }
        ],
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur, change' }
        ],
        fileUrl: [
          { validator: validateFileUrl, trigger: 'blur' },
          { required: true, message: '请输入文件地址', trigger: 'blur, change' }
        ]
      },
      isEdit: false
    };
  },
  async created () {
    await this.fetchSoftwareList({
      pageIndex: DEFAULT_PAGE,
      pageSize: MAX_PAGE_SIZE
    });
    const { id, softId } = this.$route.params;
    const { version } = this.$route.query;

    if (id && softId && version) {
      this.isEdit = true;
      await this.fetchPublishDetail({ id, softId, version });
      console.error(typeof +softId);
      this.form = { ...this.detail, softId };
    }
  },
  computed: mapState({
    softList: state => state.release.software.list,
    detail: state => state.release.publish.detail,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'savePublish',
      'fetchSoftwareList',
      'fetchPublishDetail'
    ]),
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });

      if (!validForm) return;
      const { form, isEdit } = this;
      await this.savePublish({ itemDto: form, operate: isEdit ? 'edit' : 'add' });
      if (!this.errorStatus) {
        this.onCancel();
      }
    },
    onCancel () {
      this.$router.push('/myd/release/publish');
    }
  }
};
</script>
