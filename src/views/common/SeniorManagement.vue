<template>
  <div class="senior-management">
    <el-table ref="senior" class="senior-table" :data="superFingerList" border>
      <el-table-column prop="userId" align="center" class-name="table-auto" label="高层编号">
      </el-table-column>
      <el-table-column prop="userName" align="center" class-name="table-auto" label="高层姓名">
      </el-table-column>
      <el-table-column prop="identitys" align="center" label="高层身份" >
      </el-table-column>
      <el-table-column prop="fingerPrint" align="center" label="指纹状态" >
        <template slot-scope="scope">
          {{ +scope.row.fingerPrint === TRUE ? '已录入' : '未录入' }}
        </template>
      </el-table-column>
      <el-table-column prop="fingerPrintStatus" align="center" label="指纹授权状态">
        <template slot-scope="scope">
          {{ scope.row.fingerPrintStatus === OK ? '启用' : '禁用' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" v-if="isManageShop">
        <template slot-scope="scope">
          <mw-button
            :class="scope.row.fingerPrintStatus == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
            :content="scope.row.fingerPrintStatus == FORBIDDEN ? '启用' : '禁用'"
            @click="onClickChangeStatus(scope.row)" />
          <mw-button class="btn-delete" content="删除" @click="onShowDeleteModal(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount">
    </pagination>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onDeleteClick"
      ref="popup">
    </popup>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { OK, TRUE, FORBIDDEN } from 'constant/statusCode';
  import { Popup, Pagination, MwButton } from 'components';

  export default {
    name: 'seniorManagement',
    components: {
      Popup,
      MwButton,
      Pagination
    },
    props: {
      superUserType: {
        type: String,
        default: '0'
      },
      isManageShop: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        OK,
        TRUE,
        FORBIDDEN,
        editItem: ''
      };
    },
    async created () {
      await this.fetchSeniorManagementList();
    },
    computed: mapState({
      superFingerList: state => state.employe.fingerPrintConfig.superFingerList,
      pageIndex: state => state.employe.fingerPrintConfig.pageIndex,
      pageSize: state => state.employe.fingerPrintConfig.pageSize,
      recordCount: state => state.employe.fingerPrintConfig.recordCount
    }),
    methods: {
      ...mapActions([
        'getShopSuperFingerList',
        'getManagersFingerList',
        'updateSeniorManagementStatus',
        'deleteSeniorManagementItem'
      ]),
      async fetchSeniorManagementList () {
        const { superUserType, pageIndex, pageSize } = this;
        await this.selectCompanyOrShop(superUserType, pageIndex, pageSize);
      },
      async onChangeSize (pageSize) {
        const { superUserType, pageIndex } = this;
        await this.selectCompanyOrShop(superUserType, pageIndex, pageSize);
      },
      async onChangeCurrent (pageIndex) {
        const { superUserType, pageSize } = this;
        await this.selectCompanyOrShop(superUserType, pageIndex, pageSize);
      },
      async selectCompanyOrShop (superUserType, pageIndex, pageSize) {
        if (+superUserType) {
          await this.getShopSuperFingerList({ superUserType, pageIndex, pageSize });
        } else {
          await this.getManagersFingerList({ superUserType, pageIndex, pageSize });
        }
      },
      async onClickChangeStatus (row) {
        const { userId, userGuid } = row;
        const fingerPrintStatus = +row.fingerPrintStatus === OK ? FORBIDDEN : OK;
        await this.updateSeniorManagementStatus({ userGuid, fingerPrintStatus, suserId: userId });
        await this.fetchSeniorManagementList();
      },
      async onShowDeleteModal (row) {
        this.editItem = row;
        this.$refs.popup.isShow = true;
      },
      async onDeleteClick () {
        const { userId, userGuid } = this.editItem;
        await this.deleteSeniorManagementItem({ userGuid, suserId: userId });
        await this.fetchSeniorManagementList();
      }
    }
  };
</script>

<style lang="scss">
  .senior-management {
    padding: 0;
  }
</style>
