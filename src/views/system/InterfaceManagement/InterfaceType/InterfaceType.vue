<template>
  <div class="interface-type-form-container">
    <el-form class="mw-form"  ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="类型ID" prop="apiTypeId">
        <el-input v-model="form.apiTypeId" placeholder="类型ID"></el-input>
      </el-form-item>
      <el-form-item label="类型名称" prop="apiTypeName">
        <el-input v-model="form.apiTypeName" placeholder="类型名称"></el-input>
      </el-form-item>
      <el-form-item label="接口分类">
        <el-select
          v-model="form.apiTypeClass"
          placeholder="请选择"
          class="width-full">
          <el-option
            v-for="item in INTERFACE_CLASSIFY"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.apiComment"></el-input>
      </el-form-item>
      <el-form-item class="btn-bar">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { INTERFACE_CLASSIFY } from 'constant/constants';
  import { validateName, validateId } from 'utils/validateUtil';

  export default {
    name: 'InterfaceType',
    data () {
      return {
        INTERFACE_CLASSIFY,
        form: {
          apiTypeId: '',
          apiTypeName: '',
          apiTypeClass: '1',
          apiComment: '',
          apiTypeGuid: ''
        },
        rules: {
          apiTypeName: [
            { validator: validateName, trigger: 'blur, change' },
            { required: true, message: '请输入类型名称', trigger: 'blur, change' }
          ],
          apiTypeId: [
            { validator: validateId, trigger: 'blur, change' },
            { required: true, message: '请输入类型ID', trigger: 'blur, change' }
          ]
        },
        isEdit: !!this.$route.params.id
      };
    },
    async created () {
      const { id } = this.$route.params;
      this.isEdit
        ? await this.fetchInterfaceTypeItem({ apiTypeGuid: id, operate: 'edit' })
        : await this.fetchInterfaceTypeItem({ operate: 'add' });

      this.init();
    },
    computed: mapState({
      interfaceTypeItem: state => state.interfaceManagement.interfaceType.interfaceTypeItem
    }),
    methods: {
      ...mapActions([
        'fetchInterfaceTypeItem',
        'updateInterfaceTypeItem'
      ]),
      init () {
        this.isEdit
          ? this.form = { ...this.form, ...this.interfaceTypeItem }
          : this.form.apiTypeId = this.interfaceTypeItem.apiTypeId;
      },
      async onSubmit () {
        if (!this.validateForm()) return;

        this.isEdit
          ? await this.updateInterfaceTypeItem({ itemDto: this.form, operate: 'edit' })
          : await this.updateInterfaceTypeItem({ itemDto: this.form, operate: 'add' });

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.onCancel();
        }
      },
      validateForm () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });

        return validForm;
      },
      onCancel () {
        this.$router.push('/myd/interface/type');
      }
    }
  };
</script>
<style lang="scss">
  .interface-type-form-container {
    padding: 20px;
  }
</style>

