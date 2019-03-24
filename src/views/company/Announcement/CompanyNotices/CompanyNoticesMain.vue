<template>
  <notices-main
    :isSystem="false"
    :isMaintain="isMaintain"
    :fetchNoticesList="fetchNoticesList"
    :getNoticesDetail="getNoticesDetail"
    :deleteNoticesById="deleteNoticesById"
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
  name: 'companyNoticesMain',
  components: { NoticesMain },
  data () {
    return {
      isMaintain: !checkMaintainRight(this)
    };
  },
  computed: mapState({
    noticesDetail: state => state.companyAnnouncement.notices.noticesDetail,
    noticesList: state => state.companyAnnouncement.notices.noticesList,
    recordCount: state => state.companyAnnouncement.notices.recordCount,
    pageIndex: state => state.companyAnnouncement.notices.pageIndex,
    pageSize: state => state.companyAnnouncement.notices.pageSize
  }),
  methods: {
    ...mapActions([
      'getNoticesDetail',
      'fetchNoticesList',
      'deleteNoticesById'
    ])
  }
};
</script>
