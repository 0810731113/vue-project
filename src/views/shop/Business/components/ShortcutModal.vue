<template>
  <div>
    <el-dialog custom-class="base-modal shortcut-modal" v-if="isShow" :visible.sync="isShow" size="tiny" :before-close="onCancel">
      <div class="modal-title" slot="title">快捷键设置</div>
      <el-table :data="keys" border style="width: 100%">
        <el-table-column prop="shortcutKey" align="center" label="快捷键" width="150">
        </el-table-column>
        <el-table-column prop="paymentId" align="center" label="支付方式">
          <template slot-scope="scope">
            <el-select v-model="scope.row.paymentId" class="select-type">
              <el-option label="无" value=""></el-option>
              <el-option
                v-for="item in data"
                v-if="!item.isPremium && +item.status === OK"
                :key="item.paymentId"
                :label="item.paymentName"
                :value="item.paymentId">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="modal-footer">
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </span>
    </el-dialog>
    <popup ref="popup" title="操作提示" :tips="tips">
    </popup>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup } from 'components';
import { SHORTCUT_KEYS } from 'constant/payment';
import countBy from 'lodash/countBy';
import { OK } from 'constant/statusCode';

export default {
  name: 'colorModal',
  props: ['data'],
  components: {
    Popup
  },
  data () {
    return {
      OK,
      isShow: false,
      tips: '',
      keys: SHORTCUT_KEYS
    };
  },
  async created () {
    await this.fetchShortCutKeys();
    this.initData(this.shortCutKeys);
  },
  computed: mapState({
    paymentSortList: state => state.business.payment.sortList,
    shortCutKeys: state => state.business.payment.shortCutKeys
  }),
  methods: {
    ...mapActions([
      'fetchShortCutKeys',
      'updatePaymentShortCut'
    ]),
    initData (editData) {
      if (!editData) return;
      return SHORTCUT_KEYS.map(item => {
        const shortcut = editData.find(key => key.fsShortcutKey === item.shortcutKey);
        item.paymentId = shortcut ? shortcut.fsPaymentId : '';
        return item;
      });
    },
    async onSubmit () {
      const countByArr = countBy(this.keys, 'paymentId');
      const temp = [];
      for (let key in countByArr) {
        if (countByArr[key] > 1 && key !== '') {
          temp.push(key);
        }
      }
      const repeatArr = [];
      this.keys.map(item => {
        if (temp.includes(item.paymentId)) {
          repeatArr.push(item.shortcutKey);
        }
      });
      let str = '';
      repeatArr.map(item => {
        str += item + '设置重复！\n';
      });
      if (!repeatArr.length) {
        await this.updatePaymentShortCut({ dtos: this.keys });
        this.isShow = false;
        return;
      }
      this.$refs.popup.isShow = true;
      this.tips = str;
    },
    async onCancel () {
      await this.fetchShortCutKeys();
      this.initData(this.shortCutKeys);
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss">
.shortcut-modal {
  .select-type {
    input {
      height: 28px;
    }
  }
}
</style>
