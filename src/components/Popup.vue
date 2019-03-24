<template>
  <el-dialog class='base-modal' :class="popUpClass" :visible.sync="isShow" v-if="isShow" :size="size" :before-close="handleClose" :width="width">
    <div v-show="title" slot="title">{{ title }}</div>
    <div class="content" v-html="tips">
    </div>
    <span slot="footer" v-if="type !== 'other'">
      <el-button class="btn-cancel-modal" v-if="this.type === 'normal'" @click="handleShowOrHideModal">{{ cancelText }}</el-button>
      <el-button :class="this.type === 'submit'? 'btn-submit' :'btn-confirm'" :type="btnType" @click="handleSubmit">{{ okText }}</el-button>
      <slot name="errorMessage"></slot>
      <div slot="errorMsg" class="error-wrapper" v-if="!!errorMsg">
        <div>
          <i class="el-icon-circle-cross"></i>
          {{ errorMsg }}
        </div>
      </div>
    </span>
    <slot name="content"></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'baseModal',
  props: {
    title: String,
    size: {
      type: String,
      default: '50%'
    },
    width: {
      type: String,
      default: '40%'
    },
    tips: String,
    okText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '关闭'
    },
    type: {
      type: String,
      default: 'normal'
    },
    errorMsg: {
      type: String,
      default: ''
    },
    handleOk: Function,
    handleClose: Function,
    manualyClose:{    //是否手动关闭
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isShow: false
    };
  },
  computed: {
    popUpClass () {
      return {
        'warning-modal': this.type === 'warning',
        'submit-modal': this.type === 'submit'
      };
    },
    btnType () {
      if (this.type === 'normal') {
        return 'primary';
      }
    }
  },
  methods: {
    handleSubmit () {
      if (this.handleOk) {
        this.handleOk();
      }

      if (this.type !== 'submit') {
        if(this.manualyClose){
          //手动关闭
        }else{
          this.handleShowOrHideModal();
        }
      }
    },
    handleShowOrHideModal () {
      this.isShow = !this.isShow;
      if (this.handleClose) {
        this.handleClose();
      }
    }
  }
};
</script>

<style lang="scss">
  .base-modal {
    .content {
      text-align: center;
    }

    .btn-confirm {
      height: 26px;
      width: 100px;
      color: white;
      background: #F36B5F;
      border-radius: 3px;

      &:hover {
        background: #F36B5F;
        box-shadow: 0 0 4px 2px rgba(254, 67, 67, 0.5);
        border-radius: 3px;
        color: white;
      }

      &:focus {
        background: #DD4D40;
        border-radius: 3px;
        color: white;
      }
    }

    .btn-cancel-modal {
      color: #FFF;
      height: 26px;
      width: 100px;
      background: #CCC;
      border: none;

      &:hover {
        color: #FFF;
        background: #A7A7A7;
        box-shadow: 0 0 4px 2px #CECECE;
        border-radius: 3px;
      }

      &:focus {
        color: #FFF;
        background: #A7A7A7;
        border-radius: 3px;
      }
    }

    .btn-submit {
      width: 150px;
      height: 40px;
    }
  }

</style>
