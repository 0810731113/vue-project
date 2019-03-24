<template>
  <el-dialog custom-class="base-modal ingredient-moving-modal" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">移动到</div>
    <div class="ids-wrapper">
      <span class="ingredient-id">将{{ names[0] }}</span>
      等 {{ names.length }} 个配菜
    </div>
    <div class="settinng-wrapper">
      <span>移动到分组</span>
      <el-select v-model="menuClsId" class="select-type">
        <el-option label="所有分组" :value="null"></el-option>
        <el-option
          v-for="item in ingredGroupsList"
          :key="item.menuClsId"
          :label="item.menuClsName"
          :value="item.menuClsId">
        </el-option>
      </el-select>
      <div v-show="errorMsg.length" class="error-wrapper">{{ errorMsg }}</div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isShop } from 'utils/configUtil';

export default {
  name: 'ingredientMoving',
  props: ['names', 'ingredGroupsList', 'moveIngredientGroup', 'itemCds', 'fetchAllIngredientList', 'pageIndex', 'pageSize'],
  data () {
    return {
      isShow: false,
      menuClsId: null,
      errorMsg: ''
    };
  },
  watch: {
    menuClsId () {
      this.errorMsg = '';
    }
  },
  methods: {
    async onSubmit () {
      const { menuClsId, itemCds, pageIndex, pageSize } = this;
      if (!menuClsId) {
        this.errorMsg = '请选择正确的分组';
        return;
      }

      if (isShop()) {
        await this.moveIngredientGroup({ menuClsId, itemCds });
      } else {
        await this.moveIngredientGroup({ menuClsId, itemCds });
      }
      await this.fetchAllIngredientList({ pageIndex, pageSize });
      this.isShow = false;
      this.menuClsId = null;
    }
  }
};
</script>

<style lang='scss'>
.ingredient-moving-modal {
  .ids-wrapper {
    font-size: 14px;
    width: 35%;
    word-wrap: break-word;
    margin: 0 0 20px 10px;
  }

  .settinng-wrapper {
    width: 60%;
    font-size: 14px;
    margin-left: 40px;
    text-align: center;
  }

  .select-type {
    width: 45%;
  }
}
</style>
