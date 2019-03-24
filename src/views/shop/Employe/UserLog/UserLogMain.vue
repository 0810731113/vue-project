<template>
  <div class="user-log-main">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="查询范围:">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          align="right"
          placeholder="选择起止日期"
          :editable="false"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="操作人:">
        <el-select v-model="searchForm.createUser" placeholder="请选择">
          <el-option :value="null" label="全部"></el-option>
          <el-option v-for="item in operateUserlist" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作对象类型:">
        <el-select v-model="searchForm.targetType" placeholder="请选择">
          <el-option :value="null" label="全部"></el-option>
          <el-option v-for="item in operateTypeList" :key="item" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作对象名称:">
        <el-input placeholder="操作对象名称" v-model="searchForm.targetName"></el-input>
      </el-form-item>
      <div class="button-bar">
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </div>
      <div class="division-line"></div>
    </el-form>
    <el-table :data="logList" border>
      <el-table-column prop="createTime" align="center" label="操作时间" min-width="12%">
      </el-table-column>
      <el-table-column prop="targetType" align="center" label="操作对象类型" min-width="12%">
      </el-table-column>
      <el-table-column prop="createUser" align="center" label="操作用户" min-width="8%">
      </el-table-column>
      <el-table-column prop="type" align="center" label="操作类型" min-width="8%">
      </el-table-column>
      <el-table-column prop="targetName" align="center" label="操作对象名称" min-width="60%">
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :totalCount="recordCount">
    </pagination>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Pagination } from 'components';
import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
import fecha from 'fecha';

export default {
  name: 'UserLog',
  components: {
    Pagination
  },
  data () {
    return {
      DEFAULT_PAGE,
      DEFAULT_PAGES,
      searchForm: {
        date: [new Date(), new Date()],
        createUser: null,
        targetType: null,
        targetName: null
      },
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const dateTime = new Date();
            dateTime.setTime(dateTime.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [dateTime, dateTime]);
          }
        }, {
          text: '近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    };
  },
  async created () {
    const params = this.getFormParams();
    await this.fetchUserLogList(params);
    await this.fetchUserOperationList();
  },
  computed: mapState({
    logList: state => state.employe.userLog.list,
    operateUserlist: state => state.employe.userLog.operateUserlist,
    operateTypeList: state => state.employe.userLog.operateTypeList,
    recordCount: state => state.employe.userLog.recordCount,
    pageIndex: state => state.employe.userLog.pageIndex,
    pageSize: state => state.employe.userLog.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchUserLogList',
      'fetchUserOperationList'
    ]),
    async onChangeSize (pageSize) {
      const params = this.getFormParams();
      await this.fetchUserLogList({ ...params, pageIndex: DEFAULT_PAGE, pageSize });
    },
    async onChangeCurrent (pageIndex) {
      const params = this.getFormParams();
      await this.fetchUserLogList({ ...params, pageIndex, pageSize: this.pageSize });
    },
    async onClickSearch () {
      const params = this.getFormParams();
      await this.fetchUserLogList(params);
    },
    onClickReset () {
      this.searchForm = {
        date: [new Date(), new Date()],
        createUser: null,
        targetType: null,
        targetName: null
      };
    },
    getFormParams () {
      const { pageIndex, pageSize } = this;
      const { date, targetName, targetType, createUser } = this.searchForm;
      const [startDate, endDate] = date;
      const beginTime = fecha.format(startDate || new Date(), 'YYYY-MM-DD');
      const endTime = fecha.format(endDate || new Date(), 'YYYY-MM-DD');
      return { beginTime, endTime, targetName, targetType, createUser, pageIndex, pageSize };
    }
  }
};
</script>

<style lang="scss">
.user-log-main {
  padding: 15px;

  .button-bar {
    text-align: center;
  }
}
</style>
