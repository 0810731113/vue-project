<template>
  <el-dialog custom-class="base-modal sort-modal" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">顺序调整</div>
    <div class="tools-btns">
      <el-button v-if="false" @click="handleMove('top')">置顶</el-button>
      <el-button v-if="false" @click="handleMove('up')">上移</el-button>
      <el-button v-if="false" @click="handleMove('down')">下移</el-button>
      <el-button v-if="false" @click="handleMove('bottom')">置底</el-button>
      <slot name="filter"></slot>
      <div class="sort-tips">* 操作拖动即可变更位置</div>
    </div>
    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
      <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
          <thead>
            <tr class="table-row is-center">
              <th v-for="key in headerKey" :key="key" colspan="1" rowspan="1" class="is-center">
                <div class="cell">{{ key }}</div>
              </th>
              <th colspan="1" rowspan="1" class="operation-column is-center" />
            </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper table-body">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body">
          <draggable element="tbody" :list="sortList" @start="handleStart" @end="drag=false">
            <!--:key="item[idKey]"-->
            <tr
              v-for="(item ,index) in sortList"
              :key="index"
              class="table-column el-table__row"
              :class="{ selected: selectedId === item[idKey] }"
              @click="selectedId = item[idKey]"
            >
              <td class="is-center" v-for="key in sortKey" :key="key">
                <div class="cell">{{ item[key] }}</div>
              </td>
              <td class="operation-column">
                <img src="./images/icon_shape.png" />
              </td>
            </tr>
          </draggable>
        </table>
      </div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button class="btn-submit" @click="handleSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import draggable from 'vuedraggable';

export default {
  name: 'Sortable',
  props: ['sortList', 'handleOK', 'headerKey', 'sortKey'],
  components: {
    draggable
  },
  data () {
    return {
      isShow: false,
      selectedId: null,
      idKey: this.sortKey[0]
    };
  },
  methods: {
    handleStart (element) {
      const { oldIndex } = element;
      const selectedItem = this.sortList.find((item, index) => {
        return index === oldIndex;
      });
      this.selectedId = selectedItem[this.idKey];
    },
    handleMove (type) {
      const { selectedId, sortList } = this;
      const selectedItem = sortList.find(item => item[this.idKey] === selectedId);
      const selectedIndex = sortList.findIndex(item => item[this.idKey] === selectedId);

      switch (type) {
        case 'top':
          sortList.splice(selectedIndex, 1);
          sortList.splice(0, 0, selectedItem);
          break;
        case 'up':
          if (selectedIndex < 1) break;
          sortList.splice(selectedIndex, 1);
          sortList.splice(selectedIndex - 1, 0, selectedItem);
          break;
        case 'down':
          sortList.splice(selectedIndex, 1);
          sortList.splice(selectedIndex + 1, 0, selectedItem);
          break;
        case 'bottom':
          sortList.splice(selectedIndex, 1);
          sortList.splice(sortList.length, 0, selectedItem);
          break;
        default:
          break;
      }
    },
    handleSubmit () {
      this.handleOK(this.sortList);
      this.isShow = !this.isShow;
      this.selectedId = null;
    }
  }
};
</script>

<style lang='scss'>
.sort-modal {
  .el-dialog__body {
    padding: 10px 20px;
  }

  .tools-btns {
    margin-bottom: 15px;

    .sort-tips {
      font-size: 14px;
      color: #676767;
      display: inline-block;
    }
  }

  .table-body {
    height: 500px;
  }

  .table-row {
    th {
      border-right: none;
    }
  }

  .table-column {
    .is-center {
      border-right: none;
    }
  }

  .operation-column {
    width: 50px;
    text-align: center;
  }

  .el-table__header,
  .el-table__body {
    width: 100%;
  }
}
</style>
