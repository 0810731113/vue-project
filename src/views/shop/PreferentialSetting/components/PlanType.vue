<template>
  <div class="plan-type-wrap">
    <el-radio-group :value="value" @input="onChange">
      <el-radio v-for="item in planTypeList" :key="item.planTypeId" :label="item.planTypeId">
        {{item.planTypeName}}
      </el-radio>
    </el-radio-group>
    <el-checkbox-group v-model="weeks" v-if="value === 2">
      <el-checkbox v-for="item in dayOfWeek" :key="item.dayId" :label="item.dayId">
        {{item.dayName}}
      </el-checkbox>
    </el-checkbox-group>
    <div class="valuable-day" v-if="value === 3">
      <date-picker-and-text
        :disabled="disabled"
        :onSelectDate="onSelectDate"
        :onChangeDate="onChangeDate"
        :selectedDate="selectedDate"
      />
    </div>
  </div>
</template>

<script>
  import { DatePickerAndText } from '../components';

  export default {
    name: 'planType',
    components: {
      DatePickerAndText
    },
    props: {
      value: {
        type: Number
      },
      onSelectDate: {
        type: Function,
        default: () => {}
      },
      onChangeDate: {
        type: Function,
        default: () => {}
      },
      selectedDate: {
        type: String,
        default: ''
      },
      planTypeList: {
        type: Array,
        default: () => [
          { planTypeId: 2, planTypeName: '星期' },
          { planTypeId: 3, planTypeName: '可用日期' }
        ]
      },
      disabled: {
        type: null,
        default: () => []
      },
      selectedWeekDay: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        weeks: [],
        dayOfWeek: [
          { dayId: '1', dayName: '星期一' },
          { dayId: '2', dayName: '星期二' },
          { dayId: '3', dayName: '星期三' },
          { dayId: '4', dayName: '星期四' },
          { dayId: '5', dayName: '星期五' },
          { dayId: '6', dayName: '星期六' },
          { dayId: '7', dayName: '星期日' }
        ]
      };
    },
    watch: {
      selectedWeekDay () {
        const { selectedWeekDay } = this;
        this.weeks = selectedWeekDay ? selectedWeekDay.split(',') : [];
      },
      weeks () {
        this.$emit('changeWeek', this.weeks);
      }
    },
    methods: {
      onChange (value) {
        this.$emit('input', value);
      }
    }
  };
</script>

<style lang="scss">
  .plan-type-wrap {
    .el-checkbox {
      margin-right: 30px;
    }

    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
  }
</style>
