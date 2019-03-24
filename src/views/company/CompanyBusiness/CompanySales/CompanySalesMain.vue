<template>
  <sales-main
    :isMaintain="isMaintain"
    :salesList="salesList"
    :recordCount="recordCount"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :fetchAllSales="fetchAllCompanySales"
    :deleteSales="deleteCompanySales">
  </sales-main>
</template>
<script>
  import { SalesMain } from 'views/common';
  import { mapActions, mapState } from 'vuex';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'CompanySalesMain',
    components: {
      SalesMain
    },
    data () {
      return {
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: mapState({
      salesList: state => state.companyBusiness.sales.salesList,
      recordCount: state => state.companyBusiness.sales.recordCount,
      pageIndex: state => state.companyBusiness.sales.pageIndex,
      pageSize: state => state.companyBusiness.sales.pageSize
    }),
    methods: {
      ...mapActions([
        'fetchAllCompanySales',
        'deleteCompanySales'
      ])
    }
  };
</script>
