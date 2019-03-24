<template>
  <base-main
    :list="list"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :recordCount="recordCount"
    type="discountreason"
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
  name: 'DiscountReason',
  components: {
    BaseMain
  },
  computed: mapState({
    list: state => state.businessSetting.discountReason.list,
    recordCount: state => state.businessSetting.discountReason.recordCount,
    pageIndex: state => state.businessSetting.discountReason.pageIndex,
    pageSize: state => state.businessSetting.discountReason.pageSize
  }),
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllDiscountReason({ pageIndex, pageSize });
  },
  methods: {
    ...mapActions([
      'fetchAllDiscountReason',
      'deleteDiscountReason'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchAllDiscountReason({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllDiscountReason({ pageIndex, pageSize: this.pageSize });
    },
    async onClickDelete (id) {
      const { pageIndex, pageSize } = this;
      await this.deleteDiscountReason(id);
      await this.fetchAllDiscountReason({ pageIndex, pageSize });
    }
  }
};
</script>
