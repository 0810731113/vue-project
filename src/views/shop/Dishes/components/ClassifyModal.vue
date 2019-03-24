<template>
  <el-dialog
    custom-class="base-modal classify-modal"
    :visible.sync="isShow"
    :close-on-click-modal="false"
  >
    <div class="modal-title" slot="title">新增菜品分类</div>
    <Classify
      v-if="isShow"
      :level="level"
      :isGuide="true"
      :isDish="true"
      @onSubmit="onSubmit"
    />
  </el-dialog>
</template>

<script>
  import { Classify } from 'views/shop/Dishes/Classify';

  export default {
    name: 'classifyModal',
    props: ['level'],
    components: {
      Classify
    },
    data () {
      return {
        isShow: false
      };
    },
    watch: {
      isShow () {

      }
    },
    methods: {
      onSubmit (data) {
        this.$emit('levelCallback', data);
        this.isShow = false;
      }
    }
  };
</script>

<style lang="scss">
  .classify-modal {
    .classify-form {
      width: 90%;
      padding: 15px 15px 15px 0;
    }
  }
</style>
