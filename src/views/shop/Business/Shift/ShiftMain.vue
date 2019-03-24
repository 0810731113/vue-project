<template>
  <div class="business-shift">
    <div class="add-shift-tips">
      <el-button size="small" ref="btnAdd" class="btn-add" icon="el-icon-plus" :disabled="isMaintain" @click="onClickAdd">添加餐段</el-button>
      <show-error-tip ref="showErrorTip" class="shift-error-tip" :showError="!shiftList.length && guidance && tipVisibility" errorText="请添加餐段" />
    </div>
    <el-table :data="shiftList" border class="mw-table">
      <el-table-column prop="msectionName" class-name="table-auto" align="center" label="餐段名称" />
      <el-table-column prop="beginTime" align="center" label="开始时间" />
      <el-table-column prop="endTime" align="center" label="结束时间" />
      <el-table-column align="center" label="状态" :formatter="getStatusText" v-if="!guidance" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="onClickEdit(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="!guidance"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount" />
    <popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup" />
  </div>
</template>

<script>
import { OK } from 'constant/statusCode';
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton, ShowErrorTip } from 'components';
import { BUSINESS_SHIFT_POPUP_REF } from 'constant/constants';
import { checkMaintainRight } from 'utils/permissionUtil';

export default {
  name: 'ShiftMain',
  props: {
    guidance: {
      type: Boolean,
      default: false
    },
    showShiftModal: {
      type: Function,
      default: () => {}
    },
    tipVisibility: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Popup,
    MwButton,
    Pagination,
    ShowErrorTip
  },
  data () {
    return {
      OK,
      editId: '',
      isMaintain: !checkMaintainRight(this)
    };
  },
  computed: {
    ...mapState({
      shiftList: state => state.business.shift.shiftList,
      recordCount: state => state.business.shift.recordCount,
      pageIndex: state => state.business.shift.pageIndex,
      pageSize: state => state.business.shift.pageSize
    })
  },
  async created () {
    const { pageIndex, pageSize } = this;
    this.guidance
      ? await this.fetchAllShift()
      : await this.fetchAllShift({ pageIndex, pageSize });
  },
  methods: {
    ...mapActions([
      'fetchAllShift',
      'deleteShift'
    ]),
    async onChangeCurrent (pageIndex) {
      await this.fetchAllShift({ pageIndex, pageSize: this.pageSize });
    },
    onClickAdd () {
      this.guidance
        ? this.showShiftModal(BUSINESS_SHIFT_POPUP_REF)
        : this.$router.push('/myd/business/shift/add');
    },
    onClickEdit (row) {
      this.guidance
        ? this.showShiftModal(BUSINESS_SHIFT_POPUP_REF, row.msectionId)
        : this.$router.push(`/myd/business/shift/edit/${row.msectionId}`);
    },
    async onClickDelete () {
      await this.deleteShift(this.editId);
      this.editId = '';
    },
    onShowPopup (row) {
      this.$refs.popup.isShow = true;
      this.editId = row.msectionId;
    }
  }
};
</script>

<style lang="scss">
.business-shift {
  padding: 15px;

  .add-shift-tips {
    position: relative;

    .shift-error-tip {
      width: 6.7%;
      top: 6px;
      left: 104px;
    }
  }

  .test-column {
    width: 15%;
  }

  .pagination-wrapper {
    margin: 15px 0;
    display: inline;
  }
}
</style>

