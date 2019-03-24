<template>
  <div class="set-meal-cls-main">
    <el-button class="btn-primary" icon="el-icon-plus" :disabled="isMaintain" @click="goRoute()">新增</el-button>
    <el-table :data="classList" border ref="comboTable" height="640" class="mw-table">
      <el-table-column prop="menuClsId" align="center" label="分类编号" min-width="12.5%" />
      <el-table-column prop="menuClsName" align="center" label="分类名称" min-width="12.5%" />
      <el-table-column prop="expClsName" align="center" label="销售归属" min-width="12.5%" />
      <el-table-column prop="revenueTypeName" align="center" label="收入归属" min-width="12.5%" />
      <el-table-column prop="status" align="center" label="状态" min-width="12.5%" />
      <el-table-column align="center" label="操作" min-width="12.5%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="编辑" :disabled="isMaintain" @click="goRoute(scope.row)" />
          <mw-button class="btn-delete" content="删除" :disabled="isMaintain" @click="onShowPopup(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <Popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onClickDelete"
      ref="popup"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { ITEMKIND } from 'constant/constants';
import { OK, TRUE, FORBIDDEN } from 'constant/statusCode';
import { checkMaintainRight } from 'utils/permissionUtil';
import { Popup, MwButton } from 'components';

export default {
  name: 'setMealClsMain',
  components: {
    Popup,
    MwButton
  },
  data () {
    return {
      OK,
      TRUE,
      FORBIDDEN,
      editItem: {},
      isMaintain: !checkMaintainRight(this)
    };
  },
  async created () {
    await this.fetchSetMealTrees({ type: ITEMKIND.SETMEAL });
  },
  computed: mapState({
    classList: state => {
      const { trees } = state.dishes.setMeal;
      return trees[0] && trees[0].children || [];
    }
  }),
  methods: {
    ...mapActions([
      'fetchSetMealTrees',
      'deleteClassify'
    ]),
    goRoute (row) {
      const route = row ? `edit/${row.menuClsId}` : 'add';
      this.$router.push(`/myd/dishes/setmeal/classify/${route}`);
    },
    onShowPopup (row) {
      this.editItem = row;
      this.$refs.popup.isShow = true;
    },
    async onClickDelete () {
      await this.deleteClassify(this.editItem.menuClsId);
      await this.fetchSetMealTrees({ type: ITEMKIND.SETMEAL });
      this.editItem = {};
    }
  }
};
</script>

<style>
.set-meal-cls-main {
  padding: 15px;
}
</style>
