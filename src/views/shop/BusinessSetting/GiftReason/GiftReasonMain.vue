<template>
  <base-main
    :list="list"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :recordCount="recordCount"
    type="giftreason"
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
  name: 'GiftReason',
  components: {
    BaseMain
  },
  computed: mapState({
    list: state => state.businessSetting.giftReason.list,
    recordCount: state => state.businessSetting.giftReason.recordCount,
    pageIndex: state => state.businessSetting.giftReason.pageIndex,
    pageSize: state => state.businessSetting.giftReason.pageSize
  }),
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllGiftReason({ pageIndex, pageSize });
  },
  methods: {
    ...mapActions([
      'fetchAllGiftReason',
      'deleteGiftReason'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchAllGiftReason({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllGiftReason({ pageIndex, pageSize: this.pageSize });
    },
    async onClickDelete (id) {
      const { pageIndex, pageSize } = this;
      await this.deleteGiftReason(id);
      await this.fetchAllGiftReason({ pageIndex, pageSize });
    }
  }
};
</script>
