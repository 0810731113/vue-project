<template>
  <base-main
    :list="list"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :recordCount="recordCount"
    type="orderuint"
    :onChangeSize="onChangeSize"
    :onChangeCurrent="onChangeCurrent"
    :onClickDelete="onClickDelete"
  >
  </base-main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BaseMain } from '../components';
import { DEFAULT_PAGE } from 'constant/pagination';

export default {
  name: 'OrderUint',
  components: {
    BaseMain
  },
  computed: mapState({
    list: state => state.businessSetting.orderUint.list,
    recordCount: state => state.businessSetting.orderUint.recordCount,
    pageIndex: state => state.businessSetting.orderUint.pageIndex,
    pageSize: state => state.businessSetting.orderUint.pageSize
  }),
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllOrderUint({ pageIndex, pageSize });
  },
  methods: {
    ...mapActions([
      'fetchAllOrderUint',
      'deleteOrderUint'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchAllOrderUint({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllOrderUint({ pageIndex, pageSize: this.pageSize });
    },
    async onClickDelete (id) {
      const { pageIndex, pageSize } = this;
      await this.deleteOrderUint(id);
      await this.fetchAllOrderUint({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.back-reason {
  padding: 15px;
}
</style>
