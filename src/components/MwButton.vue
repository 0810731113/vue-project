<template>
  <el-tooltip :content="content" :effect="effect" :placement="placement">
    <el-button :size="size" :type="type" :class="className" :disabled="disabled" :native-type='nativeType' @click="onClickButton" />
  </el-tooltip>
</template>

<script>
export default {
  name: 'mwButton',
  props: {
    className: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    effect: {
      type: String,
      default: 'dark'
    },
    placement: {
      type: String,
      default: 'bottom'
    },
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    nativeType: {
      type: String,
      default: 'button'
    }
  },
  methods: {
    onClickButton (event) {
      this.$emit('click', event);
    }
  }
};
</script>
