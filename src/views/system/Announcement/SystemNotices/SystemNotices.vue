<template>
  <notices
    ref="notices"
    :isSystem="true"
    :noticesDetail="noticesDetail"
    :getNoticesDetail="getSystemNoticesDetail"
    :insertNoticesEntity= "saveSystemNotices" />
</template>

<script>
import { Notices } from 'views/common';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'systemNotices',
  components: { Notices },
  computed: mapState({
    noticesDetail: state => state.systemAnnouncement.notices.noticesDetail
  }),
  methods: {
    ...mapActions([
      'getSystemNoticesDetail',
      'saveSystemNotices'
    ])
  }
};
</script>
