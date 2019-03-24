<template>
	<div class='date_picker clear'>
		<div class='date_picker_title'>
			<i class='year_sub' @click="changeYear(-1)">年减少一</i>
			<span class='month_sub' @click="changeMonth(-1)">月减少一</span>
			{{ `${ year }年${ month < 10 ? `0${ month }` : month }月` }}
			<span class='month_add' @click="changeMonth(1)">月增加一</span>
			<i class='year_add' @click="changeYear(1)">年增加一</i>
		</div>
		<span class='blur_date date_picker_item date_picker_head fl'><span>日</span></span>
		<span class='date_picker_item date_picker_head fl'><span>一</span></span>
		<span class='date_picker_item date_picker_head fl'><span>二</span></span>
		<span class='date_picker_item date_picker_head fl'><span>三</span></span>
		<span class='date_picker_item date_picker_head fl'><span>四</span></span>
		<span class='date_picker_item date_picker_head fl'><span>五</span></span>
		<span class='blur_date date_picker_item date_picker_head fl'><span>六</span></span>
		<span
			@click="changeSelectDate(item)"
			class='date_picker_item fl'
			:class='{
        focus: item === date,
        disabled: moment().isAfter(item)
      }'
			v-for="item in dateData"
			:key="item">
			<span>{{ +item.split('-')[2] }}</span>
		</span>
	</div>
</template>

<script>
import moment from 'moment';

export default {
  props: ['date', 'changeDate'],
  data () {
    const month = moment().month() + 1;
    const year = moment().year();
    const dateData = this.getDatePickerData(year, month);

    return {
      dateData,
      month,
      year
    };
  },
  methods: {
    getDatePickerData (year, month) {
      const dateData = [];
      /**
       * @param { year } 年份
       * @param { month } 月份
       * @return { days } 对应月份拥有的天数
       */
      const getDaysOfMonth = (year, month) => {
        let _daysOfMonth = null;
        if (/^1|3|5|7|8|10|12$/.test(month)) {
          _daysOfMonth = 31;
        } else {
          if (month === 2) {
            if (year % 5 === 0) {
              _daysOfMonth = 29;
            } else {
              _daysOfMonth = 28;
            }
          } else {
            _daysOfMonth = 30;
          }
        }
        return _daysOfMonth;
      };

      let daysOfMonth = getDaysOfMonth(year, month);
      let currentDay = moment(`${year}-${month}-01`).day() || 7; // 传入的对应的年份和月份的1号对应的星期,若为周日则改为7 2018-06-01:星期5

      let prevYear = year;
      let prevMonth = null;
      if (month - 1 > 0) {
        prevMonth = month - 1;
      } else {
        prevMonth = 12;
        prevYear = year - 1;
      }
      let prevMonthDays = getDaysOfMonth(prevYear, prevMonth); // 上一个月份对应的天数
      // dateData在当月1号开始的前几条数据用上一个月的结尾时间填充
      for (let i = currentDay; i > 0; i--) {
        dateData[i - 1] = `${prevYear}-${
          prevMonth >= 10 ? prevMonth : `0${prevMonth}`
        }-${prevMonthDays--}`;
      }

      dateData[currentDay] = `${year}-${month >= 10 ? month : `0${month}`}-1`;
      // 1号的数据已插入,numberOfDay从2开始，对应时间的日
      let numberOfDay = 2;
      while (dateData.length < 42) {
        dateData.push(
          `${year}-${month >= 10 ? month : `0${month}`}-${
            numberOfDay >= 10 ? numberOfDay : `0${numberOfDay}`
          }`
        );
        if (numberOfDay === daysOfMonth) {
          numberOfDay = 1;
          if (month + 1 > 12) {
            month = 1;
            year++;
          } else {
            month++;
          }
        } else {
          numberOfDay++;
        }
      }
      return dateData;
    },
    // 修改选择的时间数据
    changeSelectDate (date) {
      date = date.split('-');
      if (date[2].length === 1) {
        date[2] = '0' + date[2];
      }
      date = date.join('-');
      const res = this.moment().isAfter(date);
      if (res) return null;
      this.changeDate(date);
    },
    // 修改月份
    changeMonth (type) {
      if (type === -1) {
        if (this.month - 1 > 0) {
          this.month--;
        } else {
          this.month = 12;
          this.year--;
        }
      } else {
        if (this.month + 1 <= 12) {
          this.month++;
        } else {
          this.month = 1;
          this.year++;
        }
      }
      this.dateData = this.getDatePickerData(this.year, this.month);
    },
    changeYear (type) {
      if (type === -1) {
        this.year--;
      } else {
        this.year++;
      }
      this.dateData = this.getDatePickerData(this.year, this.month);
    }
  }
};
</script>

<style lang="scss" scoped>
.date_picker {
  overflow: hidden;

  .blur_date.date_picker_item.date_picker_head {
    color: #999;

    &:hover {
      color: #999;
    }
  }

  .date_picker_title {
    text-align: center;
    height: 70px;
    line-height: 70px;
    text-indent: 1em;
    position: relative;

    i,
    span {
      text-indent: -999em;
      cursor: pointer;

      &:hover {
        filter: brightness(1.3);
      }
    }

    i {
      border: 6px solid transparent;
      position: absolute;
      left: 7%;
      top: 50%;
      display: block;
      width: 0;
      height: 0;
      margin-top: -5px;

      &.year_sub {
        border-right: 6px solid #373d40;
      }

      &.year_add {
        border-left: 6px solid #373d40;
        left: auto;
        right: 7%;
      }
    }

    span {
      position: absolute;
      display: block;
      width: 6px;
      height: 6px;
      left: 14%;
      top: 50%;
      margin-top: -3px;
      border-right: 1px solid #373d40;
      border-bottom: 1px solid #373d40;

      &.month_sub {
        transform: rotate(135deg);
      }

      &.month_add {
        left: auto;
        right: 14%;
        transform: rotate(-45deg);
      }
    }
  }

  .date_picker_item {
    width: 14.2%;
    height: 35px;
    text-align: center;
    cursor: pointer;

    &:hover.date_picker_head {
      color: #333;
      cursor: default;

      span {
        background-color: #fff;
      }
    }

    &:hover,
    &.focus {
      color: #fefefe;

      span {
        border-radius: 50%;
        background-color: #f40;
      }
    }

    &.disabled {
      span {
        background-color: #ccc;
      }
    }

    span {
      display: inline-block;
      width: 28px;
      height: 28px;
      line-height: 27px;
      margin-top: 3px;
      background-color: #fff;
      border-radius: 50%;
    }
  }
}
</style>
