<template>
  <div class="mw-tab-panel dish-explain">
    <el-button type="primary" size="small" icon="el-icon-plus" @click="onClickAdd">添加菜品要求</el-button>
    <explain-main :isGuide="true" :onClickEditItem="onClickEdit" class="explain-list"></explain-main>
    <el-dialog custom-class="base-modal add-explain-modal" :visible.sync="isShow" size="tiny">
      <div class="modal-title" slot="title">添加菜品要求</div>
      <explain
        v-if="isShow"
        ref="explain"
        :isGuide="true"
        :newId="lalastId"
        :editId="editId"
        :onClickSubmit="onShowOrHideModal"
      >
      </explain>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Explain, ExplainMain } from '../../Dishes/Explain';
export default {
  name: 'dishExplain',
  components: {
    Explain,
    ExplainMain
  },
  data () {
    return {
      isShow: false,
      editId: null
    };
  },
  computed: mapState({
    lalastId: state => state.dishes.explain.lastId,
    detail: state => state.dishes.explain.detail
  }),
  methods: {
    ...mapActions([
      'getExplainNewId',
      'fetchExplainDetail'
    ]),
    async onClickAdd () {
      await this.getExplainNewId();
      this.onShowOrHideModal();
    },
    async onClickEdit (askGpId) {
      await this.fetchExplainDetail({ askGpId });
      this.onShowOrHideModal();
      this.editId = askGpId;
    },
    onShowOrHideModal () {
      this.isShow = !this.isShow;
      this.editId = null;
    }
  }
};
</script>

<style lang="scss">
.dish-explain {
  .add-explain-modal {
    width: 40%;

    .el-dialog__body {
      .mw-form {
        width: 90% !important;
      }
    }
  }

  .explain-list {
    padding: 0;
    margin-top: 15px;
  }
}
</style>
