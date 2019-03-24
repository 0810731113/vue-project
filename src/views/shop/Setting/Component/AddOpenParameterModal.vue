<template>
  <Popup
    class="add-open-parameter-container"
    ref="popup"
    type="submit"
    title="添加开台参数"
    okText="保存"
    :handleOk="onSubmit"
    :handleClose="onClose"
    width="40%"
    :errorMsg="errorMsg">
    <el-form slot="content" :model="form" ref="form" :rules="rules" label-width="140px">
      <el-form-item label="区域" prop="mareaId">
        <el-select v-model="form.mareaId" placeholder="请选择区域" class="width-full">
          <el-option
            filterable
            v-for="item in areaList"
            :key="item.mareaId"
            :label="item.mareaName"
            :value="item.mareaId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品" prop="menuItemCd">
        <el-select v-model="form.menuItemCd" filterable placeholder="请选择菜品" @change="onMenuChange" class="width-full">
          <el-option
            v-for="item in menuList"
            :key="item.menuItemName"
            :label="item.menuItemName + '_' + item.menuOrderUint"
            :value="item.menuItemCd"/>
        </el-select>
      </el-form-item>
      <div>
        <el-form-item label="数量" prop="saleQty">
          <el-radio-group v-model="form.numberType">
            <el-radio :label="1">固定菜品</el-radio>
            <el-input-number :controls="false" class="dish-input" :min="0" v-model="form.saleQty" size="small" />
            <el-radio :label="0">按人数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="原价">{{form.salePrice}}
        </el-form-item>
        <el-form-item label="是否自动打印小票">
          <el-switch
            v-model="form.isPrintTicket"
            :active-value="0"
            :inactive-value="1"
            active-text="是" inactive-text="否" />
        </el-form-item>
        <el-form-item label="赠送">
          <el-switch
            v-model="form.isGift"
            :active-value="TRUE"
            :inactive-value="FALSE"
            :active-text="ON_TEXT" :inactive-text="OFF_TEXT" />
        </el-form-item>
      </div>
    </el-form>
  </popup>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Popup } from 'components';
  import { ON_TEXT, OFF_TEXT } from 'constant/constants';
  import { TRUE, FALSE } from 'constant/statusCode';
  import { validateNumber } from 'utils/validateUtil';

  export default {
    name: 'AddOpenParameterModal',
    components: {
      Popup
    },
    data () {
      return {
        TRUE,
        FALSE,
        ON_TEXT,
        OFF_TEXT,
        isShow: false,
        errorMsg: '',
        isGift: true,
        form: {
          saleQty: 1,
          isGift: 0,
          mareaId: '',
          menuItemCd: '',
          numberType: 1,
          salePrice: '',
          menuOrderUintCd: '',
          isPrintTicket: 0
        },
        rules: {
          mareaId: [{ required: true, message: '请选择区域', trigger: 'blur' }],
          menuItemCd: [{ required: true, message: '请选择菜品', trigger: 'blur' }],
          saleQty: [{ validator: validateNumber, trigger: ['blur', 'change'] }]
        }
      };
    },
    watch: {
      async isShow () {
        await this.init();
        this.$refs['popup'].isShow = this.isShow;
        this.$refs.form ? this.$refs.form.resetFields() : null;
      }
    },
    computed: {
      ...mapState({
        areaList: state => state.setting.systemOptions.areaList,
        menuList: state => state.setting.systemOptions.menuList
      })
    },
    methods: {
      ...mapActions([
        'fetchAreaListForOpenParams',
        'fetchMenuListForOpenParams',
        'saveOpenParameterItem'
      ]),
      async init () {
        await this.fetchAreaListForOpenParams();
        await this.fetchMenuListForOpenParams();
        this.form = {
          ...this.form,
          saleQty: 1,
          isGift: 0,
          mareaId: '',
          menuItemCd: '',
          numberType: 1,
          salePrice: ''
        };
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.saveOpenParameterItem(this.form);
        const { errorStatus, errorMsg } = this.$store.state.error;
        errorStatus ? this.errorMsg = errorMsg : this.isShow = false;
      },
      onClose () {
        this.errorMsg = '';
        this.isShow = false;
      },
      onMenuChange (value) {
        const selected = this.menuList.find(item => item.menuItemCd === value);
        selected ? this.isGift = !+selected.isGift : null;

        this.menuList.map(item => {
          if (item.menuItemCd === value) {
            const { isGift, isEveryone, salePrice, menuOrderUintCd } = item;
            this.form = {
              ...this.form,
              isGift: +isGift,
              salePrice: salePrice || 0,
              menuOrderUintCd,
              numberType: isEveryone === '0' ? 0 : 1
            };
          }
        });
      }
    }
  };

</script>
<style lang="scss">
  .add-open-parameter-container {
    .el-form-item {
      margin-bottom: 22px !important;
    }

    .dish-input {
      width: 100px;
      margin: 0 10px;
    }
  }
</style>
