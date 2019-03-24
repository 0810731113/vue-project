<template>
  <div class="menu-make" style="marginLeft:0">
    <table class="el-table menu-make-table el-table__header el-table--border">
      <thead>
        <tr>
          <th>做法</th>
          <th>加价</th>
          <th class="radio">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in value" :key="item.addPrice">
          <td class="input-wrap">
            <el-input
              placeholder="请输入菜品做法名称, 例如: 红烧, 清蒸"
              v-model="item.askName"
              @blur="(event) => onBlurName(event, index)"
            />
          </td>
          <td class="input-wrap">
            <el-input-number
              :controls="false"
              placeholder="请输入需加价金额"
              class="el-input el-input__inner width-full"
              v-model="item.addPrice"
              :min="0"
              :max="9999" />
          </td>
          <td><mw-button class="btn-delete" content="删除" @click="onDeleteItem(index)"></mw-button></td>
        </tr>
      </tbody>
    </table>
    <el-button size="small" class="btn-add-method" icon="el-icon-plus" @click="onClickAddMake" v-if="!readOnly">添加做法</el-button>
    <div v-if="hasError" class="error-wrapper">*做法不能为空</div>
  </div>
</template>

<script>
import { REGEX_GENERAL_NAME } from 'constant/regex';
import { MwButton } from 'components';

export default {
  name: 'menuMakeTable',
  components: {
    MwButton },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hasError: false
    };
  },
  watch: {
    value () {
//      console.log(this.value);
    }
  },
  methods: {
    onBlurName (event, index) {
      const { value } = event.target;
      const { name } = this.value[index];
      if (REGEX_GENERAL_NAME.test(value)) {
        this.value[index].name = value;
      } else {
        this.value[index].askName = name;
      }
      this.checkEmpty();
      this.$emit('input', this.value);
    },
    onDeleteItem (index) {
      this.value.splice(index, 1);
      this.$emit('input', this.value);
    },
    onClickAddMake () {
      if (this.checkEmpty()) return;
      this.value.push({
        askName: '',
        addPrice: '',
        name: ''
      });
      this.$emit('input', this.value);
    },
    checkEmpty () {
      const hasError = this.value.findIndex(item => !item.askName) >= 0;
      this.hasError = hasError;
      return hasError;
    }
  }
};
</script>

<style lang="scss">
.menu-make {
  width: calc(100% - 100px);
  display: inline-block;
  margin-left: 0;
  .menu-make-table {
    border-collapse: collapse;

    tbody > tr > td,
    thead > tr > th {
      border-left: 1px solid #ddd;
      text-align: center;
      height: 40px;
    }
  }

  .input-wrap {
    .el-input .el-input__inner {
      border: none;
      text-align: center;
      background: #fff;
    }
  }

  .btn-add-method {
    width: 100%;
    margin-top: -2px;
    border-radius: 0;
    border-color: #ddd;
  }

  .error-wrapper {
    margin-top: 5px;
    color: #ff4949;
  }
}
</style>
