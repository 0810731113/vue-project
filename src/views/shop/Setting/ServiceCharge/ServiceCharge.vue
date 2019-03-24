<template>
  <div class="service-change-main">
    <el-form ref="form" label-width="120px" :rules="rules" :model="form">
      <el-form-item label="服务费收取方式:">
        <el-select v-model="paramValue" class="input-wrapper" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="设置服务费比例:" prop="fiInt" v-if="paramValue === PARAMVALUE.DISHES">
        <el-input-number :controls="false" :min="0" :max="100" class="input-wrapper" v-model="form.fiInt" />
        <span class="error-wrapper">(请输入0~100的整数)</span>
      </el-form-item>
      <el-form-item label="服务费金额设置:" class="service-area" v-if="paramValue === PARAMVALUE.TABLEAREA" />
      <el-form-item class="area-table" v-if="paramValue === PARAMVALUE.TABLEAREA">
        <el-table border :data="areaList" height="550">
          <el-table-column align="center" prop="mareaName" label="餐区" />
          <el-table-column align="center" prop="serviceType" label="服务费方式">
            <template slot-scope="scope">
              {{ getServiceType(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="serviceRate" label="百分比">
            <template slot-scope="scope">
              {{ getServiceRate(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="serviceAmt" label="固定金额">
            <template slot-scope="scope">
              {{ getServiceAmt(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <mw-button class="btn-manage" content="设置" :disabled="isMaintain" @click="onShowSetting(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-submit" v-if="paramValue !== PARAMVALUE.TABLEAREA" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <toast
      ref='toast'
      content="保存成功!"
      :timeout="2000"
      type="success" />
    <popup
      ref="serviceSetting"
      :title="`设置服务费金额-${editItem.mareaName}`"
      size="small"
      type="submit"
      okText="保存"
      :errorMsg="errorMsg"
      :handleOk="onSubmitSetting">
      <div slot="content">
        <el-form ref="form" label-width="120px" :rules="rules" :model="editItem">
          <el-form-item label="收取形式:">
            <el-select v-model="serviceType" class="input-wrapper" placeholder="请选择">
              <el-option
                v-for="item in modalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="金额比例:"
            prop="serviceRate"
            v-if="serviceType !== AREA_PARAM.NOCHARGE && serviceType !== AREA_PARAM.FIXEDSUM">
            <el-input-number :controls="false" :min="0" :max="100" class="input-wrapper" v-model="editItem.serviceRate" />
            <span class="error-wrapper">(请输入0~100的整数)</span>
          </el-form-item>
          <el-form-item label="固定金额:" v-if="serviceType === AREA_PARAM.FIXEDSUM">
            <el-input-number :controls="false" :min="0" :max="9999" class="input-wrapper" v-model="editItem.serviceAmt" />
          </el-form-item>
        </el-form>
      </div>
    </popup>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Toast, MwButton } from 'components';
import { checkMaintainRight } from 'utils/permissionUtil';
import { validateNumber } from 'utils/validateUtil';
import { PARAMVALUE, AREA_PARAM, SERVICE_CHARGE, SERVICE_TYPE } from 'constant/constants';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'ServiceCharge',
  components: {
    MwButton,
    Popup,
    Toast
  },
  data () {
    return {
      PARAMVALUE,
      AREA_PARAM,
      serviceType: '',
      paramValue: null,
      form: {
        fiInt: 0
      },
      editItem: {},
      isMaintain: !checkMaintainRight(this),
      options: SERVICE_CHARGE,
      modalOptions: SERVICE_TYPE,
      rules: {
        fiInt: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        serviceRate: [
          { validator: validateNumber, trigger: 'blur' }
        ]
      }
    };
  },
  async created () {
    await this.fetchServiceItems();
    await this.fetchServiceAreaList();
    const { fiInt, paramValue } = this.paramItems;
    this.paramValue = paramValue;
    this.form = { fiInt };
  },
  computed: mapState({
    paramItems: state => state.setting.serviceCharge.paramItems,
    errorStatus: state => state.error.errorStatus,
    errorMsg: state => state.error.errorMsg,
    areaList: state => {
      return cloneDeep(state.setting.serviceCharge.areaList);
    }
  }),
  methods: {
    ...mapActions([
      'fetchServiceItems',
      'fetchServiceAreaList',
      'saveServiceCharge',
      'updateAreaService'
    ]),
    onShowSetting (row) {
      this.editItem = row;
      this.serviceType = row.serviceType;
      this.$refs.serviceSetting.isShow = true;
    },
    getServiceType (row) {
      const service = SERVICE_TYPE.find(item => item.value === row.serviceType);
      return service && service.label;
    },
    getServiceRate (row) {
      const { serviceType, serviceRate } = row;
      if (serviceType === AREA_PARAM.FIXEDSUM || serviceType === AREA_PARAM.NOCHARGE) {
        return '-';
      }
      return `${serviceRate}%`;
    },
    getServiceAmt (row) {
      const { serviceType, serviceAmt } = row;
      if (serviceType === AREA_PARAM.FIXEDSUM) {
        return (+serviceAmt).toFixed(2);
      }
      return '-';
    },
    validateForm () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      return !validForm;
    },
    async onSubmit () {
      if (this.validateForm()) return;
      const { paramValue, form } = this;
      const feeRatio = paramValue === PARAMVALUE.DISHES ? form.fiInt : 0;
      await this.saveServiceCharge({ serviceType: paramValue, feeRatio });

      if (!this.errorStatus) {
        this.$refs.toast.isShow = true;
      }
    },
    async onSubmitSetting () {
      if (this.validateForm()) return;
      this.editItem.serviceType = this.serviceType;
      const { mareaId, serviceType, serviceAmt, serviceRate } = this.editItem;
      await this.updateAreaService({
        fixed: serviceAmt,
        feeRatio: serviceRate,
        paserviceType: PARAMVALUE.TABLEAREA,
        mareaId, serviceType,
        noShowError: true
      });

      if (!this.errorStatus) {
        this.$refs.serviceSetting.isShow = false;
      }
    }
  }
};
</script>

<style lang="scss">
.service-change-main {
  width: 70%;
  padding: 15px;
  margin: 0 15%;
  display: inline-block;

  .el-form {
    margin: auto;
    width: 50%;
  }

  .service-area {
    margin-bottom: 0;
  }

  .input-wrapper {
    width: 240px;
  }

  .area-table {
    .el-form-item__content {
      margin-left: 20px !important;
    }
  }

  @media screen and (max-width: 1400px) {
    .area-table {
      .el-table {
        max-height: 320px !important;
      }
    }
  }
}
</style>
