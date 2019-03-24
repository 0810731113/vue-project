<template>
  <div class="input-price">
    <div class="el-input el-input-group el-input-group--append el-input-group--prepend">
      <div class="low-wrapper">
        <el-input
          :controls="false"
          v-model="lowPrice"
          :placeholder="placeholderMin"
          @change="onChangeValue($event, true)"
        />
      </div>
      <div class="el-input-group__append append-character">-</div>
      <div class="high-wrapper">
        <el-input
          :controls="false"
          v-model="highPrice"
          :placeholder="placeholderMax"
          @change="onChangeValue($event, false)"
        />
        </div>
    </div>
  </div>
</template>

<script>
import { REGEX_SEARCH_PRICE } from 'constant/regex';

export default {
  name: 'inputPrice',
  props: {
    minType: {
      type: String,
      default: ''
    },
    maxType: {
      type: String,
      default: ''
    },
    priceMin: {
      type: [String, Number],
      default: ''
    },
    placeholderMin: {
      type: String,
      default: '最低价(元)'
    },
    priceMax: {
      type: [String, Number],
      default: ''
    },
    placeholderMax: {
      type: String,
      default: '最高价(元)'
    }
  },
  data () {
    return {
      lowPrice: '',
      highPrice: ''
    };
  },
  watch: {
    priceMin () {
      this.lowPrice = this.priceMin;
    },
    priceMax () {
      this.highPrice = this.priceMax;
    }
  },
  methods: {
    onChangeValue (value, isMin = true) {
      const { minType, maxType } = this;
      value = REGEX_SEARCH_PRICE.test(value) ? value : '';
      isMin ? this.lowPrice = value : this.highPrice = value;
      this.$emit('change-price', value, isMin ? minType : maxType);
    }
  }
};
</script>

<style lang="scss">
.input-price {
  width: 100%;
  display: inline-block;

  .append-character {
    border-radius: 0;
    border-right: 0;
  }

  .low-wrapper,
  .high-wrapper {
    width: 100%;
    display: inline-block;
  }

  .low-price {
    width: 100%;
    border-radius: 4px 0 0 4px;
  }

  .high-price {
    width: 100%;
    border-radius: 0 4px 4px 0;
  }
}
</style>
