<template>
  <revenue
    :lastId="lastId"
    :revenueDetail="revenueDetail"
    :saveRevenue="saveCompanyRevenue"
    :updateRevenue="updateCompanyRevenue"
    :fetchRevenueDetail="fetchCompanyRevenueDetail"
    :getRevenueGroupList="getRevenueGroupList"
    :revenueGroupList="revenueGroupList"
    :getRevenueLastId="getCompanyRevenueLastId">
  </revenue>
</template>
<script>
  import { Revenue } from 'views/common';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'CompanyRevenue',
    components: { Revenue },
    computed: mapState({
      revenueDetail: state => state.companyBusiness.revenue.revenueDetail,
      revenueGroupList: state => state.business.revenue.revenueGroupList,
      lastId: state => state.companyBusiness.revenue.lastId
    }),
    methods: {
      ...mapActions([
        'saveCompanyRevenue',
        'updateCompanyRevenue',
        'fetchCompanyRevenueDetail',
        'getCompanyRevenueLastId',
        'getRevenueGroupList'
      ])
    }
  };
</script>
