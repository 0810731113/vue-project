<template>
  <revenue-main
    :isMaintain="isMaintain"
    :fetchAllRevenue="fetchAllRevenue"
    :deleteRevenue="deleteRevenue"
    :revenueList="revenueList"
    :recordCount="recordCount"
    :pageIndex="pageIndex"
    :pageSize="pageSize">
  </revenue-main>
</template>
<script>
  import { RevenueMain } from 'views/common';
  import { mapActions, mapState } from 'vuex';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'CompanyRevenueMain',
    components: { RevenueMain },
    data () {
      return {
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: mapState({
      revenueList: state => state.business.revenue.revenueList,
      recordCount: state => state.business.revenue.recordCount,
      pageIndex: state => state.business.revenue.pageIndex,
      pageSize: state => state.business.revenue.pageSize
    }),
    methods: {
      ...mapActions([
        'fetchAllRevenue',
        'deleteRevenue'
      ])
    }
  };
</script>
