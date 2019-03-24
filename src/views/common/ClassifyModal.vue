<template>
  <el-dialog
    custom-class="base-modal classify-modal"
    :visible.sync="isShow"
    size="small">
    <el-tree
      class="classify-tree"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="menuClsId"
      ref="tree"
      highlight-current
      :props="defaultProps"
    />
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { RELATIONTYPE } from 'constant/constants';

export default {
  name: 'classifyModal',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    selectedClass: {
      type: Array,
      default: () => []
    },
    item: {
      type: Object,
      default: () => {}
    },
    saveExplainMenuCls: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    data () {
      this.data[0].menuClsId = '-1';
    }
  },
  updated () {
    if (this.$refs.tree) {
      const ids = [];
      this.selectedClass.forEach(item => {
        const { relationtype, menuClsId } = item;
        ids.push(relationtype === RELATIONTYPE.ALL ? '-1' : menuClsId);
      });
      this.$refs.tree.setCheckedKeys(ids);
    }
  },
  data () {
    return {
      isShow: false,
      defaultProps: {
        children: 'children',
        label: 'menuClsName'
      }
    };
  },
  methods: {
    async onSubmit () {
      const menuClsIds = this.$refs.tree.getCheckedKeys();
      let askGpMenuClsDtos = [];
      const { askGpId } = this.item;
      if (menuClsIds.includes('-1')) {
        askGpMenuClsDtos = [{ menuClsId: '0', relationtype: RELATIONTYPE.ALL }];
      } else {
        const menuClsItems = this.$refs.tree.getCheckedNodes();
        menuClsItems.map(item => {
          if (!menuClsIds.includes(item.menuClsId_P)) {
            askGpMenuClsDtos.push({ menuClsId: item.menuClsId, relationtype: RELATIONTYPE.NOTALL });
          }
        });
      }
      await this.saveExplainMenuCls({ askGpId, askGpMenuClsDtos });
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss">
.classify-modal {
  width: 35%;

  .classify-tree {
    height: 450px;
    overflow: auto;
  }
}
</style>
