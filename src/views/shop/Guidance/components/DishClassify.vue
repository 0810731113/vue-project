<template>
  <div class="mw-tab-panel dish-classify">
    <div class="tip-wrapper">
      <el-button icon="el-icon-plus" class="btn-base btn-bottom" @click="onClickAdd">添加菜品分类</el-button>
      <show-error-tip ref="showErrorTip" class="classify-error-tip" :showError="showError" errorText="请添加菜品分类" />
    </div>
    <classify-main
      class="classify-list"
      :isGuide="true"
      :onClickEditItem="onClickEdit"
      :onClickAddSubClassify="onClickAddSubClassify"
    />
    <el-dialog custom-class="base-modal dish-classify-modal" :visible.sync="isShow" size="small">
      <div class="modal-title" slot="title">{{ editId ? '编辑菜品分类' : '新增菜品分类' }}</div>
      <classify
        v-if="isShow"
        :isGuide="true"
        :editId="editId"
        :level="level"
        :onClickSubmit="onClickSubmit"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Classify, ClassifyMain } from '../../Dishes/Classify';
import { ShowErrorTip } from 'components';

export default {
  name: 'dishClassify',
  props: ['showError'],
  components: {
    Classify,
    ClassifyMain,
    ShowErrorTip
  },
  data () {
    return {
      isShow: false,
      editId: null,
      level: null
    };
  },
  computed: mapState({
    error: state => state.error.errorStatus,
    pageIndex: state => state.dishes.explain.pageIndex,
    pageSize: state => state.dishes.explain.pageSize
  }),
  methods: {
    ...mapActions([
      'fetchClassifyByPage',
      'fetchClassifyDetail'
    ]),
    onClickAdd () {
      this.editId = '';
      this.level = null;
      this.onShowOrHideModal();
    },
    async onClickSubmit () {
      if (!this.error) {
        const { pageIndex, pageSize } = this;
        await this.fetchClassifyByPage({ pageIndex, pageSize });
        this.onShowOrHideModal();
      }
    },
    async onClickEdit (menuClsId) {
      await this.fetchClassifyDetail(menuClsId);
      this.onShowOrHideModal();
      this.editId = menuClsId;
    },
    async onClickAddSubClassify (level) {
      this.editId = null;
      this.onShowOrHideModal();
      this.level = level;
    },
    onShowOrHideModal () {
      this.isShow = !this.isShow;
    }
  }
};
</script>

<style lang="scss">
.dish-classify {
  .classify-list {
    padding: 0;
  }

  .tip-wrapper {
    width: 320px;
    position: relative;
    line-height: 1;

    .classify-error-tip {
      right: 80px;
      top: 6px;
    }

    .btn-add {
      width: 125px;
    }

    .mw-tooltip {
      right: 0;
      top: 9px;
      z-index: 0 !important;
    }
  }

  .dish-classify-modal {
    width: 40%;

    .el-dialog__body {
      .mw-form {
        width: 90%;
      }
    }

    .btn-wrapper {
      .el-form-item__content {
        margin-left: 0 !important;
        text-align: center;
      }
    }
  }
}
</style>
