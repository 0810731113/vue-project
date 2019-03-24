<template>
  <el-dialog custom-class="base-modal classify-sortable" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">顺序调整</div>
    <div class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
      <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header">
          <thead>
            <tr class="table-row is-center">
              <th colspan="1" rowspan="1" class="is-center">
                <div class="cell">品类名称</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper table-body">
        <draggable class="el-table__body" element="table" cellspacing="0" cellpadding="0" border="0" :list="data" @start="handleStart" @end="drag=false">
          <tbody
            v-for="item in data"
            :key="item.id"
            @click='onSelecedItem(item)'>
            <tr class="first-level el-table__row">
              <td>
                <i
                  :class="{
                    'el-icon-caret-right icon-caret': item.children && !showExpand(item),
                    'el-icon-caret-bottom icon-caret': showExpand(item),
                    'icon-empty': !item.children,
                  }"
                  @click="() => onShowOrHiddenChildren(item)"
                />
                <span>{{ item.menuClsName }}</span>
                <img class="icon-shape" src="./images/icon_shape.png" />
              </td>
            </tr>
            <draggable :list="item.children" @end="drag=false" v-show="showExpand(item)">
              <div v-for="item in item.children" :key="item.id">
                <div class="second-level">
                  <i class="icon-level" />
                  <span>{{ item.menuClsName }}</span>
                  <img class="icon-shape" src="./images/icon_shape.png" />
                </div>
                <draggable :list="item.children" @end="drag=false">
                  <div v-for="item in item.children" :key="item.id">
                    <div class="third-level">
                      <i class="icon-level" />
                      <span>{{ item.menuClsName }}</span>
                      <img class="icon-shape" src="./images/icon_shape.png" />
                    </div>
                  </div>
                </draggable>
              </div>
            </draggable>
          </tbody>
        </draggable>
      </div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button class="btn-submit" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'classifySortable',
  props: ['data', 'updateClassifySort'],
  components: {
    draggable
  },
  data () {
    return {
      isShow: false,
      selectedId: null,
      expandIds: []
    };
  },
  methods: {
    async onSubmit () {
      let menuClsSorts = [];
      let index = 0;
      this.data.map(item => {
        const { menuClsId, children } = item;
        menuClsSorts.push({ menuClsId, sortOrder: index++ });

        if (children) {
          children.map(subItem => {
            const { menuClsId, children } = subItem;
            menuClsSorts.push({ menuClsId, sortOrder: index++ });
            if (children) {
              children.map(subItem => {
                menuClsSorts.push({ menuClsId, sortOrder: index++ });
              });
            }
          });
        }
      });
      await this.updateClassifySort({ menuClsSorts });
      this.isShow = false;
    },
    showExpand (item) {
      return this.expandIds.includes(item.menuClsId);
    },
    onSelecedItem (item) {
      this.selectedId = item.menuClsId;
    },
    handleStart (element) {
      const { oldIndex } = element;
      const selectedItem = this.data.find((item, index) => {
        return index === oldIndex;
      });
      this.selectedId = selectedItem.menuClsId;
    },
    onShowOrHiddenChildren (item) {
      const index = this.expandIds.findIndex(id => id === item.menuClsId);

      if (index >= 0) {
        this.expandIds.splice(index, 1);
      } else {
        this.expandIds.push(item.menuClsId);
      }
    }
  }
};
</script>

<style lang='scss'>
.classify-sortable {
  .modal-title {
    font-size: 18px;
  }

  .el-dialog__body {
    padding: 10px 20px;
    max-height: 500px;
    overflow: auto;
  }

  .icon-shape {
    float: right;
    margin-top: 12px;
    margin-right: 20px;
  }

  .el-table__header,
  .el-table__body {
    width: 100%;
  }

  .first-level,
  .second-level,
  .third-level {
    width: 98%;
    height: 40px;
    line-height: 40px;
    padding-left: 2%;
    border-bottom: 1px solid #ccc;
  }

  .second-level {
    width: 96%;
    padding-left: 4%;
  }

  .third-level {
    width: 94%;
    padding-left: 6%;
  }

  .icon-empty {
    width: 14px;
    display: inline-block;
  }

  .icon-level {
    width: 12px;
    height: 12px;
    display: inline-block;
    border-left: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    margin-right: 5px;
  }
}
</style>
