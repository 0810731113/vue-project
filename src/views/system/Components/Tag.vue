<template>
  <span class="mw-tag">
    <div class="tag-tool-bar">
      <el-button icon="edit" size="mini" @click="editTag"></el-button>
      <el-button icon="circle-cross" size="mini" @click="deleteTag"></el-button>
    </div>
    <slot></slot>
  </span>
</template>
<script>
  export default {
    name: 'MwTag',
    methods: {
      deleteTag (event) {
        this.$emit('deleteTag', event);
      },
      editTag (event) {
        this.$emit('editTag', event);
      }
    }
  };
</script>
<style lang="scss">
  .mw-tag {
    position: relative;
    background-color: #FCC;
    border: 1px solid #ddd;
    padding: 4px;
    min-width: 50px;
    text-align: center;
    display: inline-block;
    border-radius: 5px;
    line-height: 20px;
    margin: 2px;

    &:hover {
      .tag-tool-bar {
        display: block;
      }
    }

    .tag-tool-bar {
      display: none;
      position: absolute;
      top: -21px;
      right: 0;

      .el-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
      }
    }
  }

</style>
