<template>
  <div class="third-party-form-container">
    <el-form class="mw-form"  ref="form" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="第三方名称" prop="apiName">
        <el-input v-model="form.apiName" placeholder="第三方名称"></el-input>
      </el-form-item>
      <el-form-item label="数据源-门店" prop="dataShopGUID">
        <el-select
          v-model="form.dataShopGUID"
          filterable
          :filter-method="filterMethod"
          placeholder="输入门店名称或门店id"
          class="width-full">
          <el-option
            v-for="item in shopDataSource"
            :key="item.shopGuid"
            :label="item.shopName"
            :value="item.shopGuid">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口协议" prop="apiAPIType">
        <el-select
          @change="onInterfaceTypeSelectionChange"
          v-model="form.apiAPIType"
          placeholder="请选择"
          class="width-full">
          <el-option
            v-for="item in interfaceTypeList"
            :key="item.apiTypeId"
            :label="item.apiTypeName"
            :value="item.apiTypeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器地址" prop="serverAddress">
        <el-input v-model="form.serverAddress" placeholder="服务器地址"></el-input>
      </el-form-item>
      <el-form-item label="访问方式">
        <el-select
          v-model="form.accessMode"
          placeholder="请选择"
          class="width-full">
          <el-option
            v-for="item in ACCESS_MODE"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务器端口">
        <el-input-number v-model="form.serverPort" placeholder="服务器端口" :controls="false" class="width-full" controls-position="right"></el-input-number>
      </el-form-item>
      <el-form-item label="备用1">
        <el-input v-model="form.str1" placeholder="备用1"></el-input>
      </el-form-item>
      <el-form-item label="备用2">
        <el-input v-model="form.str2" placeholder="备用2"></el-input>
      </el-form-item>
      <el-form-item label="备用3">
        <el-input v-model="form.str3" placeholder="备用3"></el-input>
      </el-form-item>
      <el-form-item label="备用4">
        <el-input v-model="form.str4" placeholder="备用4"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.comment" disabled></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
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
  import { validateName } from 'utils/validateUtil';
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { ON_TEXT, OFF_TEXT, DISCOUNT_SCHEME, ACCESS_MODE } from 'constant/constants';

  export default {
    name: 'ThirdPartyInterface',
    data () {
      return {
        DISCOUNT_SCHEME,
        ACCESS_MODE,
        OK,
        FORBIDDEN,
        ON_TEXT,
        OFF_TEXT,
        shopDataSource: [],
        form: {
          apiName: '',
          dataShopGUID: '',
          serverAddress: '',
          serverPort: '',
          accessMode: 0,
          apiAPIType: '',
          str1: '',
          str2: '',
          str3: '',
          str4: '',
          comment: '',
          status: '',
          apiTypeClass: ''
        },
        rules: {
          apiName: [
            { validator: validateName, trigger: 'blur, change' },
            { required: true, message: '请输入第三方名称', trigger: 'blur, change' }
          ],
          dataShopGUID: [
            { required: true, message: '请输入数据源-门店', trigger: 'blur, change' }
          ],
          apiAPIType: [
            { required: true, message: '请选择', trigger: 'blur, change' }
          ],
          serverAddress: [
            { required: true, message: '请输入服务器地址', trigger: 'blur, change' }
          ]
        },
        isEdit: !!this.$route.params.id
      };
    },
    async created () {
      await this.fetchShopDataSource();
      await this.fetchInterfaceTypeListWithoutPagination();
      await this.init();
    },
    computed: mapState({
      interfaceShopList: state => state.interfaceManagement.thirdPartyInterface.interfaceShopList,
      thirdPartyInterfaceItem: state => state.interfaceManagement.thirdPartyInterface.thirdPartyInterfaceItem,
      interfaceTypeList: state => state.interfaceManagement.thirdPartyInterface.interfaceTypeList
    }),
    methods: {
      ...mapActions([
        'fetchShopDataSource',
        'saveThirdPartyInterfaceItem',
        'fetchThirdPartyInterfaceItem',
        'updateThirdPartyInterfaceItem',
        'fetchInterfaceTypeListWithoutPagination'
      ]),
      async init () {
        if (this.isEdit) {
          const { id } = this.$route.params;
          await this.fetchThirdPartyInterfaceItem({ apiGuid: id });

          this.form = { ...this.thirdPartyInterfaceItem };
          this.shopDataSource = this.interfaceShopList;
        }
      },
      filterMethod (value) {
        if (!value) {
          this.shopDataSource = [];
          this.form.dataShopGUID = null;
          return;
        }

        this.shopDataSource = this.interfaceShopList.filter(item => item.shopName.includes(value) || item.shopGuid.includes(value));
      },
      onInterfaceTypeSelectionChange (selectedItem) {
        const item = this.interfaceTypeList.find(item => item.apiTypeId === selectedItem);
        if (item) {
          this.form.comment = item.apiComment;
          this.form.apiTypeClass = item.apiTypeClass;
        }
      },
      async onSubmit () {
        if (!this.validateForm()) return;

        this.isEdit
          ? await this.updateThirdPartyInterfaceItem({ itemDto: this.form, operate: 'edit' })
          : await this.saveThirdPartyInterfaceItem({ itemDto: this.form, operate: 'add' });

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
        this.$router.push('/myd/interface/thirdparty');
      }
    }
  };
</script>
<style lang="scss">
  .third-party-form-container {
    padding: 20px;
  }
</style>

