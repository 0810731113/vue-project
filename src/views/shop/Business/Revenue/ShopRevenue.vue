<template>
  <revenue
    :lastId="lastId"
    :revenueGroupList="revenueGroupList"
    :revenueDetail="revenueDetail"
    :saveRevenue="saveRevenue"
    :updateRevenue="updateRevenue"
    :getRevenueGroupList="getRevenueGroupList"
    :fetchRevenueDetail="fetchRevenueDetail"
    :getRevenueLastId="getRevenueLastId">
  </revenue>
</template>
<script>
  import { Revenue } from 'views/common';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'CompanyRevenue',
    components: { Revenue },
    computed: mapState({
      revenueGroupList: state => state.business.revenue.revenueGroupList,
      revenueDetail: state => state.business.revenue.revenueDetail,
      lastId: state => state.business.revenue.lastId
    }),
    methods: {
      ...mapActions([
        'saveRevenue',
        'updateRevenue',
        'fetchRevenueDetail',
        'getRevenueGroupList',
        'getRevenueLastId'
      ])
    }
  };
</script>
