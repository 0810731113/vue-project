<template>
  <div class="module-padding open-parameter-container">
    <el-button size="small" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="() => showModal('addOpenParameterModal')">新增</el-button>
    <el-table :data="openParameterList" border>
      <el-table-column prop="fiId" align="center" label="序号" min-width="15%" />
      <el-table-column prop="mareaName" align="center" label="区域" min-width="15%" />
      <el-table-column prop="menuItemName" class-name="table-auto" align="center" label="菜品" min-width="15%">
        <template slot-scope="scope">
          {{ `${scope.row.menuItemName} - ${scope.row.orderUint}` }}
        </template>
      </el-table-column>
      <el-table-column prop="numberType" align="center" label="数量" min-width="25%">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.numberType">
            <el-radio disabled label="1">固定</el-radio>
            <input disabled class="dish-input" :value="+scope.row.numberType ? scope.row.saleQty : ''" size="small" />
            <el-radio disabled label="0">按人数</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column prop="salePrice" align="center" label="原价" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.salePrice || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="isGift" align="center" label="赠送" min-width="15%">
        <template slot-scope="scope">
          {{ scope.row.isGift === '1' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="isPrintTicket" align="center" label="是否自动打印小票" min-width="15%">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%">
        <template slot-scope="scope">
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="showModal('deleteModal', scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent">
    </Pagination>
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="deleteModal"/>
    <AddOpenParameterModal ref="addOpenParameterModal" />
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Popup, Pagination, MwButton } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import AddOpenParameterModal from '../Component/AddOpenParameterModal';

  export default {
    name: 'OpenParametersMain',
    components: {
      Pagination,
      Popup,
      MwButton,
      AddOpenParameterModal
    },
    data () {
      return {
        openId: '',
        isMaintain: !checkMaintainRight(this)
      };
    },
    computed: {
      ...mapState({
        openParameterList: state => state.setting.systemOptions.openParameterList,
        pageIndex: state => state.setting.systemOptions.pageIndex,
        pageSize: state => state.setting.systemOptions.pageSize,
        recordCount: state => state.setting.systemOptions.recordCount
      })
    },
    methods: {
      ...mapActions([
        'fetchOpenParameterList',
        'deleteOpenParameterItem'
      ]),
      onClickDelete () {
        const { openId } = this;
        this.deleteOpenParameterItem({ openId });
      },
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        this.fetchOpenParameterList({ pageSize, pageIndex });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchOpenParameterList({ pageSize, pageIndex });
      },
      showModal (ref, row) {
        this.$refs[ref].isShow = true;
        if (row) {
          this.openId = row.fiId;
        }
      }
    },
    async created () {
      const { pageSize, pageIndex } = this;
      await this.fetchOpenParameterList({ pageSize, pageIndex });
    }
  };
</script>
<style lang="scss">
.open-parameter-container {
  .btn-add {
    margin-bottom: 10px;
  }

  .dish-input {
    width: 40px;
    height: 23px;
    margin: 8px 18px 0 2px;
    cursor: not-allowed;
    text-align: center;
  }
}
</style>
