<template>
  <div class="search-wrapper">
    <el-form inline>
      <el-form-item label="菜品名称:" class="search-item">
        <el-input v-model="form.menuName" placeholder="请输入菜品名称关键字"></el-input>
      </el-form-item>
      <el-form-item label="菜品分类:" class="search-item" >
        <el-cascader
          :options="classList"
          :props="defaultProps"

          v-model="form.menuClsId">
        </el-cascader>
      </el-form-item>
      <el-form-item label="价格范围:" class="search-item">
        <input-price
          minType="minMenuUnit"
          :priceMin="form.minMenuUnit"
          maxType="maxMenuUnit"
          :priceMax="form.maxMenuUnit"
          @change-price="onChangePrice"
        />
      </el-form-item>
    </el-form>
    <div class="search-bar">
      <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
      <el-button class="btn-reset" @click="() => init()">重置</el-button>
    </div>
    <div class="division-line"></div>
  </div>
</template>

<script>
import { MENU_OPTIONS } from 'constant/dishMenu';
import { InputPrice } from 'components';
import {cloneObj} from '../../../utils/someUsefulUtil'

export default {
  name: 'SecondOrderSearch',
  components: { InputPrice },
  props: {
    classList: {
      type: Array,
      default: () => []
    },
    onSearchMenus: {
      type: Function,
      default: () => {}
    },
  },
  data () {
    return {
      MENU_OPTIONS,
      form: {
        fiSource: null
      },
      options: [],
      defaultProps: {
        value: 'menuClsId',
        label: 'menuClsName',
        children: 'children'
      }
    };
  },
  created () {
    this.init();
  },
  methods: {
    init (id) {
      this.form = {
        menuName: null,
        menuClsId: [-1],
        maxMenuUnit: null,
        minMenuUnit: null,
      };
    },
    onChangePrice (value, type) {
      this.form[type] = value;
    },
    async onClickSearch () {
      var data = cloneObj(this.form)
      data.menuClsId = ( data.menuClsId[0] == -1) ? null : data.menuClsId[0]
      //data.menuClsId = this.form.menuClsId ? null
      await this.onSearchMenus(data);
    }
  }
};
</script>

<style lang="scss">
.search-wrapper {
  .search-item {
    width: 31%;
    margin-bottom: 5px;
    display: inline-block;

    .el-form-item__content {
      width: 70%;

      .el-cascader,
      .el-select,
      &:first-child {
        width: 100%;
      }
    }

    .el-form-item__label {
      font-weight: 400;
      color: #666;
    }

    .price-wrapper {
      .price-input {
        max-width: 46% !important;
      }
    }
  }

  .search-bar {
    width: 100%;
    text-align: center;
    padding: 5px;
  }

  .division-line {
    margin-bottom: 8px;
  }

  .search-option {
    width: 100%;
    margin-bottom: 0;

    .el-form-item__label {
      font-weight: 400;
      color: #666;
    }

    .el-form-item__content {
      width: 80%;
    }

    .btn-option {
      width: 100px;
      height: 26px;
      margin: 0 10px 5px 0;

      &:focus {
        background: transparent;
        border: 1px solid rgba(153, 153, 153, 0.62);
      }

      &.selected {
        color: #F36B5F;
        border: 1px solid #F36B5F;
        border-radius: 3px;
      }
    }
  }
}
</style>
