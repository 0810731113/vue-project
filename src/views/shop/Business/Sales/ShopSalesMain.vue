<template>
  <sales-main
    :isMaintain="isMaintain"
    :salesList="salesList"
    :recordCount="recordCount"
    :pageIndex="pageIndex"
    :pageSize="pageSize"
    :fetchAllSales="fetchAllSales"
    :deleteSales="deleteSales">
  </sales-main>
</template>
<script>
  import { SalesMain } from 'views/common';
  import { mapActions, mapState } from 'vuex';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'ShopSalesMain',
    components: {
      SalesMain
    },
    data () {
      return {
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: mapState({
      salesList: state => state.business.sales.salesList,
      recordCount: state => state.business.sales.recordCount,
      pageIndex: state => state.business.sales.pageIndex,
      pageSize: state => state.business.sales.pageSize
    }),
    methods: {
      ...mapActions([
        'fetchAllSales',
        'deleteSales'
      ])
    }
  };
</script>
