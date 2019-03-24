<template>
  <div class="search-wrapper">
    <el-form inline>
      <el-form-item label="菜品名称:" class="search-item">
        <el-input v-model="form.menuName" placeholder="请输入菜品名称关键字"></el-input>
      </el-form-item>
      <el-form-item label="菜品分类:" class="search-item" v-if="isShop">
        <el-cascader
          :options="classList"
          :props="defaultProps"
          v-model="form.fsMenuClsId">
        </el-cascader>
      </el-form-item>
      <el-form-item label="价格范围:" class="search-item">
        <input-price
          minType="menuPriceMin"
          :priceMin="form.menuPriceMin"
          maxType="menuPriceMax"
          :priceMax="form.menuPriceMax"
          @change-price="onChangePrice"
        />
      </el-form-item>
      <el-form-item label="后厨打印:" class="search-item" v-if="isShop">
        <el-select v-model="form.print">
          <el-option label="全部" :value="null"></el-option>
          <el-option v-for="item in printList" :key="item.deptId" :label="item.deptName" :value="item.deptId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜品图片:" class="search-item" v-if="isShop">
        <el-select v-model="form.isImage">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="已添加图片" value="0"></el-option>
          <el-option label="未添加图片" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShop" label="菜品来源:">
        <el-select v-model="form.fiSource">
          <el-option label="全部" :value="null" />
          <el-option label="集团菜" :value="1" />
          <el-option label="自定义菜" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="菜品选项:" class="search-option">
        <el-button
          v-for="item in MENU_OPTIONS"
          :key="item.tips"
          :class="{ 'selected': options.includes(item.key) }"
          class="btn-base btn-option"
          v-model="form[item.key]"
          v-if="item.isMenu"
          @click="onClickOption(item.key)"
        >
          {{ item.tips }}
        </el-button>
      </el-form-item>
    </el-form>
    <div class="search-bar">
      <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
      <el-button class="btn-reset" @click="init">重置</el-button>
    </div>
    <div class="division-line"></div>
  </div>
</template>

<script>
import { MENU_OPTIONS } from 'constant/dishMenu';
import { InputPrice } from 'components';

export default {
  name: 'menuSearch',
  components: { InputPrice },
  props: {
    printList: {
      type: Array,
      default: () => []
    },
    classList: {
      type: Array,
      default: () => []
    },
    isShop: {
      type: Boolean,
      defalut: true
    },
    onSearchMenus: {
      type: Function,
      default: () => {}
    },
    menuClsId: {
      type: null,
      default: ''
    }
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
    if (this.menuClsId) {
      const fsMenuClsId = this.menuClsId.split(',') || [-1];
      this.form.fsMenuClsId = fsMenuClsId;
    }
  },
  methods: {
    onClickOption (key) {
      const index = this.options.indexOf(key);
      if (index > -1) {
        this.options.splice(index, 1);
      } else {
        this.options.push(key);
      }
      this.form[key] = index > -1 ? null : 1;
    },
    init () {
      this.form = {
        isImage: null,
        menuName: null,
        menuPriceMin: null,
        menuPriceMax: null,
        print: null,
        fsMenuClsId: this.isShop ? [-1] : null
      };
      this.options = [];
    },
    onChangePrice (value, type) {
      this.form[type] = value;
    },
    async onClickSearch () {
      let { fsMenuClsId } = this.form;
      fsMenuClsId = fsMenuClsId ? fsMenuClsId[fsMenuClsId.length - 1] : null;
      const data = { ...this.form, fsMenuClsId: +fsMenuClsId > 0 ? fsMenuClsId : null };
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
