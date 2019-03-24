<template>
  <el-dialog custom-class="base-modal menu-setting" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">操作提示</div>
    <div class="select-count">已选择{{ data.length }}个菜品</div>
    <div class="tips">
      <span class="padding-l-r">将</span>
      <el-select v-model="selectType" placeholder="请选择">
        <el-option
          v-for="item in setting"
          :key="item.value"
          :label="item.text"
          :value="item.value" />
      </el-select>
      <span class="padding-l-r">设置为</span>
      <el-select v-model="selectValue" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.text"
          :value="item.value" />
      </el-select>
    </div>
    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { SETMEAL_SETTING } from 'constant/dishMenu';

export default {
  name: 'MenuSetting',
  props: ['data', 'onUpdateSettings', 'settingList'],
  data () {
    return {
      isShow: false,
      setting: [],
      options: [],
      selectType: '',
      selectValue: ''
    };
  },
  watch: {
    selectType () {
      const datas = this.setting.find(setting => this.selectType === setting.value);
      this.options = datas.items;
      this.selectValue = this.options[0].value;
    },
    isShow () {
      if (this.isShow) {
        this.initData();
      }
    }
  },
  methods: {
    initData () {
      this.setting = this.settingList && this.settingList.length ? this.settingList : SETMEAL_SETTING;
      const { value, items } = this.setting[0];
      this.selectType = value;
      this.selectValue = items[0].value;
      this.options = items;
    },
    async onSubmit () {
      const { selectType, selectValue } = this;
      await this.onUpdateSettings({ selectType, selectValue });
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
  width: 50%;
  white-space: nowrap;

  .select-count {
    padding-bottom: 15px;
    margin-left: 30px;
    font-size: 16px;
  }

  .tips {
    /*margin-left: 110px;*/
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    .padding-l-r{
      padding:8px;
    }
  }
}
</style>
