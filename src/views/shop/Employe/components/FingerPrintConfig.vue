<template>
  <div class="finger-print-config">
    <div class="tip">请配置需要单独进行指纹授权的操作</div>
    <div class="notice">说明：若不配置，则默认输入密码授权。</div>
    <el-form class="configuration-list">
      <el-form-item v-for="items in configDatas" :key="items.name" :label="items.name">
        <div class="option-item">
          <el-checkbox
            v-for="item in items.children"
            v-model="item.isAuth"
            :key="item.progDtlId"
            :label="item.progDtlId"
            :true-label="1"
            :false-label="0"
            @change="onChangeVaule(item)">
            {{item.proglName}}
          </el-checkbox>
        </div>
      </el-form-item>
      <el-form-item class="btn-wrapper">
        <el-button class="btn-submit" :disabled="isMaintain" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <toast
      ref='toast'
      content="保存成功!"
      :timeout="2000"
      type="success">
    </toast>
  </div>
</template>

<script>
  import { Toast } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';

  export default {
    name: 'fingerPrintConfig',
    components: {
      Toast
    },
    props: ['datas', 'saveFingerConfig', 'errorStatus'],
    data () {
      return {
        configDatas: [],
        isMaintain: !checkMaintainRight(this)
      };
    },
    watch: {
      datas () {
        this.configDatas = this.datas;
      }
    },
    methods: {
      onChangeVaule (item) {
        this.configDatas = this.configDatas.map(item => {
          item.children.map(data => {
            if (data.progDtlId === item.progDtlId) {
              data.isAuth = +(!data.isAuth);
            }
            return data;
          });
          return item;
        });
      },
      async onSubmit () {
        const params = {};
        this.configDatas.map(item => {
          params[item.key] = item.children;
        });
        await this.saveFingerConfig(params);
        if (!this.errorStatus) {
          this.$refs.toast.isShow = true;
        }
      }
    }
  };
</script>

<style lang="scss">
  .finger-print-config {
    margin-left: 60px;

    .tip {
      font-size: 18px;
    }

    .notice {
      color: red;
      font-size: 16px;
      margin-top: 8px;
    }

    .configuration-list {
      margin-top: 30px;

      .el-form-item {
        margin-bottom: 10px;
      }

      .el-form-item__label {
        font-size: 20px;
        float: inherit;
        font-family: cursive;
        font-weight: 700;
      }

      .el-form-item__content {
        line-height: normal;
      }

      .btn-wrapper {
        margin-left: 40%;
      }

      .option-item {
        width: 80%;
        margin-top: 10px;

        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }

        .el-checkbox {
          min-width: 175px;
          line-height: 30px;
        }
      }
    }
  }
</style>
