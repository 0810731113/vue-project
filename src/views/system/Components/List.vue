<template>
  <div class="list-container">
    <div
      class="list-item"
      v-for="item in dataSource"
      :ref="item[keyId]"
      :key="item[keyId]"
      :class="{selected: selectedItem === item[keyId]}"
      @click="() => onSelectionChange(item[keyId])">
      {{item[keyName]}}
    </div>
  </div>
</template>
<script>
  export default {
    name: 'MwList',
    props: ['value', 'dataSource', 'keyId', 'keyName'],
    data () {
      return {
        selectedItem: this.value
      };
    },
    watch: {
      value () {
        this.selectedItem = this.value;
      }
    },
    methods: {
      onSelectionChange (value) {
        this.selectedItem = value;
        this.$emit('input', value);
      }
    }
  };
</script>
<style lang="scss">
  .list-container {
    padding: 10px;

    .list-item {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover {
        background: #E2E8EB;
      }

      &.selected {
        background: #DDD;
      }
    }
  }
</style>
