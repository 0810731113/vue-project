<template>
  <base-main
    :list="list"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :recordCount="recordCount"
    type="rechecreason"
    :onChangeSize="onChangeSize"
    :onChangeCurrent="onChangeCurrent"
    :onClickDelete="deleteRechecReason"
  >
  </base-main>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { BaseMain } from '../components';

export default {
  name: 'RechecReason',
  components: {
    BaseMain
  },
  computed: mapState({
    list: state => state.businessSetting.rechecReason.list,
    recordCount: state => state.businessSetting.rechecReason.recordCount,
    pageIndex: state => state.businessSetting.rechecReason.pageIndex,
    pageSize: state => state.businessSetting.rechecReason.pageSize
  }),
  async created () {
    const { pageIndex, pageSize } = this;
    await this.fetchAllRechecReason({ pageIndex, pageSize });
  },
  methods: {
    ...mapActions([
      'fetchAllRechecReason',
      'deleteRechecReason'
    ]),
    async onChangeSize (pageSize) {
      await this.fetchAllRechecReason({ pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      await this.fetchAllRechecReason({ pageIndex, pageSize: this.pageSize });
    }
  }
};
</script>

<style lang="scss">
.back-reason {
  padding: 15px;
}
</style>
