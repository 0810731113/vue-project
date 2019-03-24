<template>
  <el-form ref="form" :model="form" class="mw-form shop-group" :rules="rules" label-width="120px">
    <el-form-item label="分组名称" prop="shopGroupName">
      <el-input v-model="form.shopGroupName" placeholder="请输入分组名称" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="分组类型" prop="shopGroupKind">
      <el-input v-model="form.shopGroupKind" placeholder="请输入分组类型" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item label="分组门店">
      <all-shop-group
        ref="allShopList"
        :isShow="true"
        :allShopList="allShopList"
        :selectedList="form.selectedList"
        :onChangeSelectedShop="onChangeSelectedShop"
      />
    </el-form-item>
    <el-form-item label="状态">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item label="显示顺序" prop="sortOrder">
      <el-input-number class="sort-order" v-model="form.sortOrder" :min="0" :controls="false" :maxlength='INPUT_MAX_LENGTH' />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { validateShopName } from 'utils/validateUtil';
import { ON_TEXT, OFF_TEXT, INPUT_MAX_LENGTH } from 'constant/constants';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { AllShopGroup } from '../components/index';

export default {
  name: 'shopGroup',
  components: {
    AllShopGroup
  },
  data () {
    return {
      OK,
      ON_TEXT,
      OFF_TEXT,
      FORBIDDEN,
      INPUT_MAX_LENGTH,
      form: {
        shopGroupId: '',
        shopGroupName: '',
        shopGroupKind: '',
        selectedList: [],
        sortOrder: '0',
        status: 1
      },
      isEdit: !!this.$route.params.shopGroupId,
      rules: {
        shopGroupName: [
          { required: true, message: '请输入分组名称，最多80字符!', trigger: 'blur, change' },
          { validator: validateShopName, trigger: 'blur, change' }
        ]
      }
    };
  },
  computed: mapState({
    shopGroupDetail: state => state.shopManagement.shopGroup.shopGroupDetail,
    allShopList: state => state.shopManagement.shopGroup.allShopList
  }),
  async created () {
    const { shopGroupId } = this.$route.params;
    if (this.isEdit) {
      await this.getShopGroupDetail({ shopGroupId });
      this.form = { ...this.form, ...this.shopGroupDetail, shopGroupId };
    } else {
      this.form = { ...this.form, shopGroupId };
    }
    await this.getAllShopList();
  },
  methods: {
    ...mapActions([
      'getAllShopList',
      'getShopGroupDetail',
      'saveManageShopGroup',
      'updateManageShopGroup'
    ]),
    onChangeSelectedShop (data) {
      this.form.selectedList = data;
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;

      if (this.isEdit) {
        await this.updateManageShopGroup({ dto: this.form });
      } else {
        await this.saveManageShopGroup({ dto: this.form });
      }

      const { errorStatus } = this.$store.state.error;
      if (!errorStatus) {
        this.$router.back();
      }
    },
    onCancel () {
      this.$router.back();
    }
  }
};
</script>

<style lang="scss">
  .shop-group {
    padding: 15px;

    .company-name,
    .company-id,
    .el-form-item__label {
      font-weight: 700;
      color: #666;
      padding-right: 30px;
    }

    .sort-order {
      width: 100%;
    }
  }
</style>
