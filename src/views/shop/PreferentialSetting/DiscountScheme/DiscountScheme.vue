<template>
  <div class="discount-scheme-container">
    <el-form class="mw-form" :model="form" ref="form" :rules="rules" label-width="180px">
      <el-form-item label="折扣名称" prop="discountName">
        <el-input v-model="form.discountName" placeholder="请输入折扣名称" :maxlength='INPUT_MAX_LENGTH' :disabled="nameDisabled && isEditScheme"/>
      </el-form-item>
      <el-form-item label="优惠方式">
        <el-radio-group v-model="form.couponId" :disabled="!isMoneyDiscount && isEditScheme">
          <el-radio v-for="item in discount_scheme" :label="item.id" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item  label="不可打折菜品是否参与折扣" v-if="(!isEdit && form.couponId===BILL_DISCOUNT) || (isEdit && form.couponId===BILL_DISCOUNT && !isMoneyDiscount)">
        <el-switch v-model="form.isDisMenu" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"/>
      </el-form-item>
      <el-form-item label="折扣率（%）" v-if="(!isEdit && form.couponId === BILL_DISCOUNT) || (isEdit && form.couponId === BILL_DISCOUNT && !isMoneyDiscount)">
        <el-input v-model="form.discountRate" placeholder="请输入折扣率" :maxlength='INPUT_MAX_LENGTH' :disabled="readOnly"/>
      </el-form-item>
      <el-form-item label="减扣金额" v-if="(!isEdit && form.couponId === BILL_REDUCE) || (isEdit && form.couponId === BILL_REDUCE && !isMoneyDiscount)">
        <el-input v-model="form.ddv" placeholder="请输入满减金额" :maxlength='INPUT_MAX_LENGTH' :disabled="readOnly"/>
      </el-form-item>
      <el-form-item v-if="!isGroupStore" label="是否会员使用限定">
        <el-radio-group v-model="form.isVIPUse">
          <el-radio v-for="item in VIP_USE_ARR" :label="item.id" :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--todo-->
      <template v-if="form.isVIPUse == 1 && !isGroupStore && (!isEdit || (isEdit && !isMoneyDiscount))">
        <el-form-item v-if="discountVips.length > 0" v-for="(item,index) in allCardsLevel" :label="item.cardName" :key="item.csId">
          <el-select v-model="discountVips[index].viplevelId"  placeholder="请选择" style="width: 100%" :disabled="readOnly">
            <el-option :value="-1" label="不限制" />
            <el-option v-for="(item2,index2) in item.vipItems" :key="index2" :value="+item2.level" :label="item2.title" />
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label="打折理由是否必选" v-if="!isEdit || (isEdit && !isMoneyDiscount)">
        <el-switch v-model="form.discReason" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" :disabled="readOnly"/>
      </el-form-item>
      <el-form-item label="有效时间" v-if="!isEdit || (isEdit && !isMoneyDiscount)">
        <el-select placeholder="请选择" style="width: 25%" v-model="form.isEffectiveDate" :disabled="readOnly">
          <el-option v-for="item in EFFECTIVE_TIME" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
        <el-date-picker
          v-if="form.isEffectiveDate !== +NO_LIMIT"
          v-model="dateRange"
          class="date-time-picker"
          type="datetimerange"
          :editable="false"
          placeholder="选择时间范围" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" :disabled="readOnly"/>
      </el-form-item>
      <el-form-item label="允许使用员工" v-if="isShop">
        <el-checkbox-group v-model="selectedUsers" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in allowedUserList" :label="item.userId" :key="item.userId">{{item.userName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit" v-if="!isChain">保存</el-button>
      </el-form-item>
    </el-form>
    <Toast
      ref='toast'
      content="请选择固定时间!"
      :timeout="2000"
      type="warning" />
  </div>
</template>

<script>
  import { Toast, Popup } from 'components';
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK } from 'constant/statusCode';
  import moment from 'moment';
  import {
    BILL_DISCOUNT,
    BILL_REDUCE,
    PART_DISH_DISCOUNT,
    DISCOUNT_SCHEME,
    INPUT_MAX_LENGTH,
    VIP_CLASSIFY,
    ON_TEXT,
    OFF_TEXT,
    EFFECTIVE_TIME,
    VIP_USE,
    NO_LIMIT,
    VIP_USE_ARR
  } from 'constant/constants';
  import { validateName } from 'utils/validateUtil';
  import { isShop, isChain, isGroupStore } from 'utils/configUtil';

  export default {
    name: 'DiscountScheme',
    components: {
      Toast,
      Popup
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        ON_TEXT,
        OFF_TEXT,
        BILL_DISCOUNT,
        BILL_REDUCE,
        PART_DISH_DISCOUNT,
        EFFECTIVE_TIME,
        VIP_CLASSIFY,
        INPUT_MAX_LENGTH,
        DISCOUNT_SCHEME,
        VIP_USE,
        NO_LIMIT,
        VIP_USE_ARR,
        batchDiscount: '',
        selectedUsers: [],
        discountRate: 0,
        dateRange: [],
        searchText: '',
        form: {
          discountId: '',
          discountName: '',
          couponId: DISCOUNT_SCHEME[0].id,
          discountRate: null,
          status: OK,
          starDate: null,
          endDate: null,
          discReason: '',
          isEffectiveDate: EFFECTIVE_TIME[0].id,
          ddv: '',
          isDisMenu:'',
          isVIPUse: 0,
        },
        discountVips: [],
        rules: {
          discountName: [
            { required: true, message: '这是必填字段', trigger: ['blur', 'change'] },
            { validator: validateName, trigger: ['blur', 'change'] }
          ]
        },
        isEdit:   this.$route.params.discountId,
        readOnly: this.$route.params.discountId === 'sysmsy2',
        isShop: isShop(),
//        isChain: isChain(),
        isChain: false,
        nameDisabled : this.$route.params.discountId === '99999' || this.$route.params.discountId === 'sysmsy2',
        isEditScheme : !!this.$route.params.discountId,
        isMoneyDiscount : this.$route.params.discountId === '99999',
        isGroupStore: isGroupStore()
      };
    },
    async created () {
      if (this.isShop) {
        await this.fetchAllowedUserList();
        await this.getAllCardsLevel();
      }else{
        await this.getCompanyAllCardsLevel();
      }
      this.discountVips = this.allCardsLevel.map(item=>{
        return {
          vipCsId: item.csId,
          vipCardType: item.bindType,
          viplevelId: -1
        }
      })
      // await this.getVIPLevels();
      if (this.isEdit) {
        const { discountId } = this.$route.params;
        await this.fetchDiscountSchemeDetail({ discountId });
        await this.init();
      } else {
        await this.fetchMaxDiscountId();
        this.form.discountId = this.discountSchemeId;
      }
    },
    watch: {
      dateRange () {
        if (this.dateRange.length && this.dateRange[0] !== null) {
          const [startDate, endDate] = this.dateRange;
          this.form.starDate = moment(startDate || new Date()).format('YYYY-MM-DD HH:mm:ss');
          this.form.endDate = moment(endDate || new Date()).format('YYYY-MM-DD HH:mm:ss');
        } else {
          this.form.starDate = null;
          this.form.endDate = null;
        }
      }
    },
    computed: {
      ...mapState({
        viplevels: state => state.preferential.viplevellist,
        allowedUserList: state => state.preferential.discountScheme.allowedUserList,
        discountSchemeId: state => state.preferential.discountScheme.discountSchemeId,
        discountSchemeDetail: state => state.preferential.discountScheme.discountSchemeDetail,
        allCardsLevel: state => state.preferential.discountScheme.allCardsLevel
      }),
      discount_scheme(){
        if(this.isEditScheme && this.isMoneyDiscount){
          let _scheme = [];
          DISCOUNT_SCHEME.forEach((item)=>{
            item.id !== BILL_REDUCE && (_scheme.push(item))
          })
          return _scheme;
        }else{
          return DISCOUNT_SCHEME;
        }

      }
    },
    methods: {
      ...mapActions([
        'getVIPLevels',
        'fetchAllowedUserList',
        'fetchDiscountSchemeDetail',
        'fetchMaxDiscountId',
        'saveDiscountSchemeItem',
        'updateDiscountSchemeItem',
        'updateDiscountStatus',
        'getAllCardsLevel',
        'getCompanyAllCardsLevel'
      ]),
      handleCheckedCitiesChange(value) {  //处理关联部门
        console.log(value)
        //console.log(this.connectDepartSelect)

      },
      async init () {
        const { isVIPUse, vipid, discountVips } = this.discountSchemeDetail;
        const arr = this.discountVips.slice();
        const discountArr = arr.map(item =>{
          for (let i of discountVips){
            if(item.vipCsId == i.vipCsId){
              item.viplevelId = i.viplevelId
              break
            }
          }
          return item
        })
        this.discountVips = discountArr
        this.form = { ...this.form, ...this.discountSchemeDetail};
        const { selectedUsers, starDate, endDate } = this.form;
        this.selectedUsers = selectedUsers.map(item => item.userId);
        this.dateRange = [starDate, endDate];
      },
      async onSubmit () {
        if (!this.validateForm()) return;
        // this.formatRequestData();
        const { selectedUsers } = this;
        const { bargainItems } = this.discountSchemeDetail;
        const data = { dto: this.form, bargainItems, selectedUsers, discountVips: this.discountVips };
        this.isEdit
          ? await this.updateDiscountSchemeItem(data)
          : await this.saveDiscountSchemeItem(data);

        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.$router.push(`/myd/preferential/discountscheme`);
        }
      },
      validateForm () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return false;

        if (this.form.isEffectiveDate !== +NO_LIMIT && !this.form.starDate) {
          this.$refs.toast.isShow = true;
          return false;
        }
        return true;
      },
      formatRequestData () {
        this.form = {
          ...this.form,
          isVIPUse: this.form.vipid === -1 ? NO_LIMIT : VIP_USE
        };
      },
      onCancel () {
        this.$router.push(`/myd/preferential/discountscheme`);
      }
    }
  };
</script>
<style lang="scss">
  .discount-scheme-container {
    .mw-form {
      width: 60%;

      .tool-bar {
        display: flex;
        justify-content: space-between;

        .el-input {
          width: auto;
        }
      }

      .el-table .el-table__body-wrapper {
        max-height: 230px;
      }

      .date-time-picker {
        margin-left: 15px;
        width: 70%;
      }

      .el-input-number {
        width: 100px;
        line-height: 45px;
      }
    }

    .modal-content {
      text-align: center;
      margin: 10px 0;
    }
  }
</style>

