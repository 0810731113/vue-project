<template>
  <div class="interface-type-container">
    <el-button class="btn-primary btn-bottom" icon="el-icon-plus" @click="onAddClick">新增</el-button>
    <el-table :data="interfaceTypeList" border>
      <el-table-column prop="apiTypeId" align="center" label="类型ID" min-width="25%"/>
      <el-table-column prop="apiTypeName" align="center" label="接口类型名称" min-width="25%">
      </el-table-column>
      <el-table-column prop="apiUpdateTime" align="center" label="最后更新时间" min-width="25%">
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
    name: 'InterfaceTypeMain',
    components: { Pagination, Popup },
    data () {
      return {
        apiTypeGuid: ''
      };
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchInterfaceTypeList({ pageIndex, pageSize });
    },
    computed: {
      ...mapState({
        interfaceTypeList: state => state.interfaceManagement.interfaceType.interfaceTypeList,
        recordCount: state => state.interfaceManagement.interfaceType.recordCount,
        pageIndex: state => state.interfaceManagement.interfaceType.pageIndex,
        pageSize: state => state.interfaceManagement.interfaceType.pageSize
      })
    },
    methods: {
      ...mapActions([
        'fetchInterfaceTypeList',
        'deleteInterfaceTypeItem'
      ]),
      onAddClick () {
        this.$router.push('/myd/interface/type/add');
      },
      async onDeleteClick (row) {
        this.apiTypeGuid = row.apiTypeGuid;
        this.$refs.deleteConformationModal.isShow = true;
      },
      onEditClick (row) {
        this.$router.push(`/myd/interface/type/edit/${row.apiTypeGuid}`);
      },
      async deleteItem () {
        const { apiTypeGuid, pageSize, pageIndex } = this;
        await this.deleteInterfaceTypeItem({ apiTypeGuid });
        await this.fetchInterfaceTypeList({ pageIndex, pageSize });
      },
      async onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        await this.fetchInterfaceTypeList({ pageIndex, pageSize });
      },
      async onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        await this.fetchInterfaceTypeList({ pageIndex, pageSize });
      }
    }
  };
</script>
<style lang="scss">
  .interface-type-container {
    padding: 20px;
  }
</style>
