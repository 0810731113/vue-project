<template>
  <notices-main
    :isSystem="true"
    :isMaintain="isMaintain"
    :fetchNoticesList="fetchSystemNoticesList"
    :getNoticesDetail="getSystemNoticesDetail"
    :deleteNoticesById="deleteSystemNotices"
    :noticesDetail="noticesDetail"
    :noticesList="noticesList"
    :recordCount="recordCount"
    :pageIndex="pageIndex"
    :pageSize="pageSize" />
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { NoticesMain } from 'views/common';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'systemNoticesMain',
  components: { NoticesMain },
  data () {
    return {
      isMaintain: !checkMaintainRight(this)
    };
  },
  computed: mapState({
    noticesDetail: state => state.systemAnnouncement.notices.noticesDetail,
    noticesList: state => state.systemAnnouncement.notices.noticesList,
    recordCount: state => state.systemAnnouncement.notices.recordCount,
    pageIndex: state => state.systemAnnouncement.notices.pageIndex,
    pageSize: state => state.systemAnnouncement.notices.pageSize
  }),
  methods: {
    ...mapActions([
      'getSystemNoticesDetail',
      'fetchSystemNoticesList',
      'deleteSystemNotices'
    ])
  }
};
</script>
