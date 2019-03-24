<template>
  <sales
    :saveSales="saveSales"
    :updateSales="updateSales"
    :getSalesLastId="getSalesLastId"
    :fetchSalesDetail="fetchSalesDetail"
    :saleDetail="saleDetail"
    :lastId="lastId">
  </sales>
</template>
<script>
  import { Sales } from 'views/common';
  import { mapActions, mapState } from 'vuex';

  export default {
    components: { Sales },
    name: 'ShopSales',

    computed: mapState({
      saleDetail: state => state.business.sales.saleDetail,
      lastId: state => state.business.sales.lastId
    }),
    methods: {
      ...mapActions([
        'saveSales',
        'updateSales',
        'getSalesLastId',
        'fetchSalesDetail'
      ])
    }
  };

</script>
