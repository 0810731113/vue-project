<template>
  <notices
    ref="notices"
    :isSystem="false"
    :noticesDetail="noticesDetail"
    :getNoticesDetail="getNoticesDetail"
    :insertNoticesEntity="insertNoticesEntity" />
</template>

<script>
import { Notices } from 'views/common';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'companyNotices',
  components: { Notices },
  computed: mapState({
    noticesDetail: state => state.companyAnnouncement.notices.noticesDetail
  }),
  methods: {
    ...mapActions([
      'getNoticesDetail',
      'insertNoticesEntity'
    ])
  }
};
</script>
