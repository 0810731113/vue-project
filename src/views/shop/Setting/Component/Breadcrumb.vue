<template>
    <div class="bread-crumb">
      <div v-for="(item, index) in dataSource" :key="item" class="bread-crumb-item">
        <el-button v-bind:class="{ selected: selectedItem === item }" @click="() => onClickCrumbItem(item, index)">{{item}}</el-button>
        <span class="split" v-if="index !== (dataSource.length - 1)">&gt;</span>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'MwBreadCrumb',
    props: {
      dataSource: {
        type: Array,
        default: []
      },
      onSelectionChange: {
        type: Function,
        default: () => {}
      }
    },
    data () {
      return {
        selectedItem: this.dataSource[0]
      };
    },
    methods: {
      onClickCrumbItem (item, index) {
        this.selectedItem = item;
        this.onSelectionChange(index);
      }
    }
  };
</script>
<style lang="scss">
  .bread-crumb {
    text-align: center;
    padding: 15px 0;

    .bread-crumb-item {
      display: inline-block;

      .el-button {
        border-radius: 15px;
        height: 24px;
        color: #000;
        padding: 2px 10px;
        border: 2px solid #b44;
        text-decoration: none;

        &.selected {
          background: #fcc;
        }
      }
    }

    .split {
      padding: 0 5px;
    }
  }
</style>
