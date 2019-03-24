<template>
  <div class="mw-form takeout-setting-main">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item prop="" label="开启状态:">
        <el-switch v-model="form.onOff" active-text="开启" inactive-text="关闭" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="开始时间:" prop="beginTime">
      <el-time-select
        placeholder="开始时间"
        v-model="form.beginTime"
        :editable="false"
        :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:00',
          maxTime: form.endTime
        }" />
    </el-form-item>
    <el-form-item label="结束时间:" prop="endTime">
      <el-time-select
        placeholder="结束时间"
        v-model="form.endTime"
        :editable="false"
        :picker-options="{
          start: '00:00',
          step: '00:30',
          end: '23:59',
          minTime: form.beginTime
        }" />
    </el-form-item>
      <el-form-item prop="" label="配送费:">
        <el-input-number v-model="form.startingFee" :controls="false" :min="0" :max="999" />元起送
        配送费<el-input-number v-model="form.rmb" :controls="false" :min="0" :max="999" />元
      </el-form-item>
      <el-form-item>
        <div class="order-table" v-for="(item, index) in orders">
          <span :class="{ 'visibility': index }">
            <el-checkbox v-model="form.over" :true-label="TRUE" :false-label="FALSE" />
          </span>
          满<el-input-number v-model="item.orderMoney" size="small" :controls="false" :min="+form.startingFee + 1" />元
          配送费<el-input-number v-model="item.deliverFee" size="small" :controls="false" :min="0" :max="999" />元
          <el-button class="btn-add" :icon="index ? 'el-icon-delete' : 'el-icon-plus'" @click="onClickAdd(index)" />
        </div>
      </el-form-item>
      <el-form-item label="配送距离(km)">
        <el-input-number v-model="form.distance" :controls="false" :min="0" :max="999" placeholder="请输入配送距离" />
      </el-form-item>
      <el-form-item>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <toast ref='toast' :content="toastContent" :type="toastType" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { OK, FORBIDDEN, TRUE, FALSE } from 'constant/statusCode';
import { ON_TEXT, OFF_TEXT } from 'constant/constants';

import { Toast } from 'components';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'takeOut',
  components: { Toast },
  data () {
    return {
      OK,
      TRUE,
      FALSE,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      form: {
        onOff: OK,
        beginTime: '',
        endTime: '',
        startingFee: '',
        rmb: '',
        over: 0,
        distance: 0
      },
      orders: [{
        orderMoney: '',
        deliverFee: ''
      }],
      toastContent: '保存成功!',
      toastType: 'success'
    };
  },
  async created () {
    await this.fetchTakeoutDetail();
    this.init(this.detail, this.conlists);
  },
  computed: mapState({
    detail: state => state.business.takeout.info,
    conlists: state => state.business.takeout.conlists,
    errorStatus: state => state.error.errorStatus
  }),
  methods: {
    ...mapActions([
      'fetchTakeoutDetail',
      'updateTakeout'
    ]),
    init (data = {}, list = []) {
      this.form = { ...data };
      this.orders = list.length ? cloneDeep(list) : [{ orderMoney: '', deliverFee: '' }];
    },
    onClickAdd (index) {
      if (!index) {
        this.orders.push({
          orderMoney: '',
          deliverFee: ''
        });
      } else {
        this.orders.splice(index, 1);
      }
    },
    async onSubmit () {
      const { over } = this.form;
      const data = { ...this.form, conlists: over === 0 ? [] : this.orders };
      await this.updateTakeout(data);
      if (this.errorStatus) {
        this.toastType = 'warning';
        this.toastContent = '保存失败';
      }
      this.$refs.toast.isShow = true;
    }
  }
};
</script>

<style lang="scss">
.takeout-setting-main {
  .order-table {
    .el-input-number {
      line-height: 45px;
    }

    .visibility {
      visibility: hidden;
    }

    .btn-add {
      border: none;
      width: initial;
    }
  }
}
</style>
