<template>
  <div class="module-padding">
    <el-button size="small" class="btn-add btn-bottom" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    <el-table :data="list" border>
      <el-table-column prop="printerType" align="center" label="打印机类型" min-width="15%" >
        <template slot-scope="scope">
          {{SYSTEM_PRINTER_TYPE_LIST[+scope.row.printerType - 1].name}}
        </template>
      </el-table-column>
      <el-table-column prop="printerBrand" align="center" label="打印机品牌" min-width="15%" />
      <el-table-column prop="printerNum" align="center" label="打印机型号" min-width="15%" />
      <el-table-column prop="suitableProd" align="center" :formatter="getSuitableProd" label="适用产品" min-width="15%" />
      <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" min-width="15%" />
      <el-table-column align="center" label="操作" min-width="20%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" @click="handleEdit(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeCurrent="onChangeCurrent" />
  </div>
</template>
<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, MwButton } from 'components';
  import { SYSTEM_PRINTER_TYPE_LIST } from 'constant/constants';

  export default {
    name: 'printerListMain',
    components: {
      Pagination,
      MwButton
    },
    data () {
      return {
        SYSTEM_PRINTER_TYPE_LIST
      };
    },
    computed: {
      ...mapState({
        list: state => state.tool.printerList.list,
        recordCount: state => state.tool.printerList.recordCount,
        pageIndex: state => state.tool.printerList.pageIndex,
        pageSize: state => state.tool.printerList.pageSize
      })
    },
    async created () {
      const { pageIndex, pageSize } = this;
      await this.fetchSystemPrinterList({ pageIndex, pageSize });
    },
    methods: {
      ...mapActions([
        'fetchSystemPrinterList'
      ]),
      onChangeCurrent (pageIndex) {
        this.fetchSystemPrinterList({ pageIndex, pageSize: this.pageSize });
      },
      handleAdd () {
        this.$router.push('/myd/tool/printerlist/add');
      },
      handleEdit (row) {
        this.$router.push(`/myd/tool/printerlist/edit/${row.guid}`);
      },
      getSuitableProd (params = {}) {
        const { suitableProd } = params;
        let str = [];
        suitableProd.split(',').map(item => {
          if (+item === 1) {
            str.push('美小易');
          } else if (+item === 2) {
            str.push('美收银');
          } else if (+item === 3) {
            str.push('美易点Android');
          } else if (+item === 4) {
            str.push('美易点Windows');
          }
        });

        return str.toString();
      }
    }
  };

</script>
