<template>
  <div class="date-picker-wrap">
    <datepicker
      inline
      language="zh"
      day-view-only
      :disabled="disabledTime"
      @selected="onSelectDate"
    />
    <el-input
      v-model="value"
      type="textarea"
      class="date-input"
      resize="none"
      @change="onChangeDate"
      :autosize="{ minRows: 13 }"
    />
  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'datePicker',
  components: { Datepicker },
  props: {
    onSelectDate: {
      type: Function,
      default: () => {}
    },
    onChangeDate: {
      type: Function,
      default: () => {}
    },
    disabled: {
      type: null,
      default: () => []
    },
    selectedDate: {
      type: String,
      default: ''
    }
  },
  watch: {
    disabled () {
      this.onChangeDate('');
    }
  },
  computed: {
    disabledTime () {
      const [to, from] = this.disabled;
      if (from) { // from 包含当前天，故 +1 天
        from.setDate(from.getDate() + 1);
      }
      return to && from ? { to, from } : {};
    },
    value () {
      return this.selectedDate;
    }
  }
};
</script>

<style lang="scss">
.date-picker-wrap {
  height: 285px;
  min-width: 610px;
  display: inline-block;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  .vdp-datepicker {
    display: inline-block;
    height: 285px;
  }

  .date-input {
    width: 300px;
    height: 100%;
    vertical-align: top;
  }
}
</style>
