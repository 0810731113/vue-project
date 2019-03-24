<template>
  <div class="third-party-container">
    <el-button class="btn-primary btn-bottom" icon="el-icon-plus" @click="onAddClick">新增</el-button>
    <el-table :data="thirdPartyInterfaceList" border>
      <el-table-column prop="apiName" align="center" label="第三方名称" min-width="25%"/>
      <el-table-column prop="apiTypeName" align="center" label="接口协议" min-width="25%">
      </el-table-column>
      <el-table-column prop="shopName" align="center" label="数据源门店名称" min-width="25%">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="25%">
        <template slot-scope="scope">
          <el-button class="btn-edit" @click="onEditClick(scope.row)"></el-button>
          <el-button class="btn-delete" @click="onDeleteClick(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent= "onChangeCurrent"
    />
    <Popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="deleteItem"
      ref="deleteConformationModal"/>
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup } from 'components';

  export default {
    name: 'ThirdPartyInterfaceMain',
    components: { Pagination, Popup },
    data () {
      return {
        apiGuid: ''
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchThirdPartyInterfaceList({ pageIndex, pageSize });
    },
    computed: {
      ...mapState({
        thirdPartyInterfaceList: state => state.interfaceManagement.thirdPartyInterface.thirdPartyInterfaceList,
        recordCount: state => state.interfaceManagement.thirdPartyInterface.recordCount,
        pageIndex: state => state.interfaceManagement.thirdPartyInterface.pageIndex,
        pageSize: state => state.interfaceManagement.thirdPartyInterface.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchThirdPartyInterfaceList',
        'deleteThirdPartyInterfaceItem'
      ]),
      onAddClick () {
        this.$router.push('/myd/interface/thirdparty/add');
      },
      async onDeleteClick (row) {
        this.apiGuid = row.apiGuid;
        this.$refs.deleteConformationModal.isShow = true;
      },
      onEditClick (row) {
        this.$router.push(`/myd/interface/thirdparty/edit/${row.apiGuid}`);
      },
      async deleteItem () {
        const { apiGuid, pageSize, pageIndex } = this;
        await this.deleteThirdPartyInterfaceItem({ apiGuid });
        await this.fetchThirdPartyInterfaceList({ pageIndex, pageSize });
      },
      async onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        await this.fetchThirdPartyInterfaceList({ pageIndex, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        await this.fetchThirdPartyInterfaceList({ pageIndex, pageSize });
      }
    }
  };
</script>
<style lang="scss">
  .third-party-container {
    padding: 20px;
  }
</style>
