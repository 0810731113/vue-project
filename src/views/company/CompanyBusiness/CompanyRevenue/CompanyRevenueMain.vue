<template>
    <revenue-main
      :isMaintain="isMaintain"
      :fetchAllRevenue="fetchAllCompanyRevenue"
      :deleteRevenue="deleteCompanyRevenue"
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
      revenueList: state => state.companyBusiness.revenue.revenueList,
      recordCount: state => state.companyBusiness.revenue.recordCount,
      pageIndex: state => state.companyBusiness.revenue.pageIndex,
      pageSize: state => state.companyBusiness.revenue.pageSize
    }),
    methods: {
      ...mapActions([
        'fetchAllCompanyRevenue',
        'deleteCompanyRevenue'
      ])
    }
  };
</script>
