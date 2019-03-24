<template>
  <div>
    <base-main
      :list="list"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      :recordCount="recordCount"
      type="backreason"
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :onClickDelete="onClickDelete"
    >
      <el-button
        slot="sort-button"
        size="small"
        class="btn-add"
        :disabled="isMaintain"
        @click="onShowSortable"
      >排序
      </el-button>
      <Sortable
        slot="sortable"
        :handleOK="onUpdateSortList"
        :sortList="sortDataSource"
        :headerKey="['内容']"
        :sortKey="['word']"
        ref="sortable"
      />
    </base-main>
  </div>
</template>

<script>
  import { Sortable } from 'components';
  import { BaseMain } from '../components';
  import { mapActions, mapState } from 'vuex';
  import { DEFAULT_PAGE } from 'constant/pagination';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'BackReason',
    components: {
      BaseMain,
      Sortable
    },
    data () {
      return {
        isMaintain: !checkMaintainRight(this),
        sortDataSource: []
      };
    },
    computed: mapState({
      list: state => state.businessSetting.backReason.list,
      listWithoutPage: state => state.businessSetting.backReason.listWithoutPage,
      recordCount: state => state.businessSetting.backReason.recordCount,
      pageIndex: state => state.businessSetting.backReason.pageIndex,
      pageSize: state => state.businessSetting.backReason.pageSize,
      errorStatus: state => state.error.errorStatus

    }),
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchAllBackReason({ pageIndex, pageSize });
    },
    watch: {
      listWithoutPage () {
        this.sortDataSource = this.listWithoutPage.slice();
      }
    },
    methods: {
      ...mapActions([
        'fetchAllBackReason',
        'deleteBackReason',
        'fetchAllBackReasonWithoutPage',
        'updateSortBackReasonList'
      ]),
      async onChangeSize (pageSize) {
        await this.fetchAllBackReason({ pageIndex: DEFAULT_PAGE, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        await this.fetchAllBackReason({ pageIndex, pageSize: this.pageSize });
      },
      async onClickDelete (id) {
        const { pageIndex, pageSize } = this;
        await this.deleteBackReason(id);
        if (!this.errorStatus) {
          this.$toast.show({ content: '删除成功' });
        }
        await this.fetchAllBackReason({ pageIndex, pageSize });
      },
      async onShowSortable () {
        await this.fetchAllBackReasonWithoutPage();
        this.$refs.sortable.isShow = true;
      },
      async onUpdateSortList (value) {
        let list = [];
        value.map((item, index) => {
          list.push({ id: item.id, sortOrder: index });
        });
        await this.updateSortBackReasonList({ list });
        if (!this.errorStatus) {
          this.$toast.show({ content: '保存成功' });
        }
        const { pageIndex, pageSize } = this;
        await this.fetchAllBackReason({ pageIndex, pageSize });
      }
    }
  };
</script>

<style lang="scss">
  .back-reason {
    padding: 15px;
  }
</style>
