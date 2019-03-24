<template>
  <sales
    :saveSales="saveCompanySales"
    :updateSales="updateCompanySales"
    :getSalesLastId="getCompanySalesLastId"
    :fetchSalesDetail="fetchCompanySalesDetail"
    :saleDetail="saleDetail"
    :lastId="lastId">
  </sales>
</template>
<script>
  import { Sales } from 'views/common';
  import { mapActions, mapState } from 'vuex';

  export default {
    components: { Sales },
    name: 'CompanySales',

    computed: mapState({
      saleDetail: state => state.companyBusiness.sales.saleDetail,
      lastId: state => state.companyBusiness.sales.lastId
    }),
    created () {

    },
    methods: {
      ...mapActions([
        'saveCompanySales',
        'updateCompanySales',
        'getCompanySalesLastId',
        'fetchCompanySalesDetail'
      ])
    }
  };

</script>
