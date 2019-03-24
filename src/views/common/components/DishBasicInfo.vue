<template>
  <el-dialog custom-class="base-modal menu-setting" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">批量设置</div>
    <div class="select-count">已选择{{ data.length }}个菜品</div>

    <div class="modify-margin-left">
      <div v-for="option in menuOptions" :key="option.name" class="option-menu-btns">
        <label class="option-menu-tips" style="width: 20%;">{{ option.name }}</label>
        <div v-for="item in option.items" :key="item.tips" style="display: inline-block">
          <el-button
            :class="{ 'selected': item.isSelect }"
            class="btn-base btn-option"
            @click="onSelectOption(item)"
          >
            {{ item.tips }}
          </el-button>
          <Tips v-if="item.key === 'isTemporaryMenu'" content="版本支持：<br/>Android：2.7及其以上<br/>Windows：2610及以上<br/>若使用其它版本，客户端结账会有损失，请注意此风险"></Tips>
        </div>
      </div>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">确认</el-button>
    </span>
    <toast
      ref='toast'
      :timeout="4000"
      content="称重菜、时价菜、手机点菜、只属套餐不能与临时菜同时选择"
      type="warning" />
  </el-dialog>
</template>

<script>
  import { Toast, Tips } from 'components';
import { SETMEAL_SETTING } from 'constant/dishMenu';
import cloneDeep from 'lodash/cloneDeep';
import { MENU_OPTIONS_BY_CLASS } from 'constant/dishMenu';

export default {
  name: 'DishBasicInfo',
  props: ['data', 'onUpdateBasicInfo'],
  components:{
    Tips,
    Toast,
  },
  data () {
    return {
      isShow: false,
      setting: [],
      options: [],
      selectType: '',
      selectValue: '',
      menuOptions: cloneDeep(MENU_OPTIONS_BY_CLASS),
    };
  },
  watch: {
    isShow () {
      if (this.isShow) {
        this.initData();
      }
    }
  },
  methods: {
    initData () {},
    onSelectOption (item) {
      this.menuOptions = this.menuOptions.map((options) => {
        options.items.map(option => {
          if (option.key === item.key) {
            option.isSelect = !item.isSelect;
          }
          return option;
        });
        return options;
      });

      // 称重菜和时价菜不能与临时菜同时被选中
      if ((this.menuOptions[1].items[0].isSelect || this.menuOptions[1].items[1].isSelect) && this.menuOptions[1].items[5].isSelect ||
        (this.menuOptions[3].items[0].isSelect || this.menuOptions[3].items[1].isSelect) && this.menuOptions[1].items[5].isSelect) {
        this.$refs.toast.isShow = true;
        this.menuOptions = this.menuOptions.map((options) => {
          options.items.map(option => {
            if (option.key === item.key) {
              option.isSelect = !item.isSelect;
            }
            return option;
          });
          return options;
        });
      }
    },
    async onSubmit () {
      const { menuOptions } = this;

      var info = {}
        menuOptions.map(options => {
        options.items.map(item => {
          info[item.key] = item.isSelect ? 1 : 0;
        });
      });
      console.log(info)

      await this.onUpdateBasicInfo(info);
      this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.isShow = false;
      this.initData();
    }
  }
};
</script>

<style lang="scss">
.menu-setting {
  width: 60%;
  /*white-space: nowrap;*/
  white-space: pre-wrap;
  .select-count {
    padding-bottom: 30px;
    margin-left: 30px;
    font-size: 16px;
  }

  .mw-form-item {
    width: 85%;
    margin: 0 auto;
    margin-bottom: 15px;

    .menu-make,
    .menu-price {
      width: calc(100% - 300px);
    }

    .menu-make {
      margin-left: 0;
    }

    .menu-option-title {
      float: inherit;
    }
    .modify-margin-left{
      margin-left: 30px;
    }
    .el-form-item__label {
      font-size: 16px;
    }
  }

  .menu-option {
    margin: 0 0 25px 0;
  }

  .menu-options {
    margin-bottom: 0;
  }

  .option-menu-btns {
    margin-left: 30px;
    margin-bottom: 10px;

    .option-menu-tips {
      font-size: 11pt;
      font-weight: 500;
      color: #999;
      margin-right: 10px;
    }
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
  .tips-wrapper {
    margin-left: -40px !important;
  }
}
</style>
