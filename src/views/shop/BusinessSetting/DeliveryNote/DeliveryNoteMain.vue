<template>
  <base-main
    :list="list"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :recordCount="recordCount"
    type="deliverynote"
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
  name: 'DeliveryNote',
  components: {
    BaseMain
  },
  computed: mapState({
    list: state => state.businessSetting.deliveryNote.list,
    recordCount: state => state.businessSetting.deliveryNote.recordCount,
    pageIndex: state => state.businessSetting.deliveryNote.pageIndex,
    pageSize: state => state.businessSetting.deliveryNote.pageSize
  }),
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllDeliveryNote({ pageIndex, pageSize });
  },
  methods: {
    ...mapActions([
      'fetchAllDeliveryNote',
      'deleteDeliveryNote'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchAllDeliveryNote({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllDeliveryNote({ pageIndex, pageSize: this.pageSize });
    },
    async onClickDelete (id) {
      const { pageIndex, pageSize } = this;
      await this.deleteDeliveryNote(id);
      await this.fetchAllDeliveryNote({ pageIndex, pageSize });
    }
  }
};
</script>

<style lang="scss">
.back-reason {
  padding: 15px;
}
</style>
