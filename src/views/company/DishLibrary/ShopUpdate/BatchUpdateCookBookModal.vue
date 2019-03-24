<template>
  <Popup
    type="submit"
    size="small"
    title="批量更新操作"
    :handleClose="onClose"
    :handleOk="onSubmit"
    ref="popup">
    <div slot="content" class="update-cook-book-modal">
      <title>您希望对选中的{{ count }}家门店的菜单进行</title>
      <div>
        <el-radio v-model="immediate" :label="true" style="display: block">立即更新</el-radio>
        <el-radio v-model="immediate" :label="false">定时更新</el-radio>
        <el-date-picker
          class="date-picker"
          v-model="time"
          type="datetime"
          :errorMsg="errorMessage"
          placeholder="选择日期时间">
        </el-date-picker>
      </div>
    </div>
  </Popup>
</template>
<script>
  import { Popup } from 'components';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'BatchUpdateCookBookModal',
    components: { Popup },
    props: ['update', 'timedUpdate', 'count'],
    data () {
      return {
        immediate: true,
        time: Date.now(),
        isShow: false,
        errorMessage: ''
      };
    },
    computed: {
      ...mapState({
        pageIndex: state => state.dishLibrary.shopUpdate.pageIndex,
        pageSize: state => state.dishLibrary.shopUpdate.pageSize
      })
    },
    watch: {
      isShow () {
        this.$refs.popup.isShow = this.isShow;
        this.immediate = true;
        this.time = Date.now();
        this.errorMessage = '';
      }
    },
    methods: {
      ...mapActions([
        'fetchShopUpdateList'
      ]),
      async onSubmit () {
        if (this.immediate) {
          this.update();
        } else {
          await this.timedUpdate(this.time);
          const { errorStatus, errorMsg } = this.$store.state.error;
          if (errorStatus) {
            this.errorMessage = errorMsg;
          } else {
            const { pageIndex, pageSize } = this;
            await this.fetchShopUpdateList({ pageIndex, pageSize, fsShopGUID: null, fsShopName: null });
          }
        }
        this.onClose();
      },
      onClose () {
        this.isShow = false;
      }
    }
  };

</script>
<style lang="scss">
  .update-cook-book-modal {
    .el-radio + .el-radio {
      margin-left: 30%;
    }

    .el-radio {
      margin-left: 30%;
    }

    .date-picker {
      margin-left: 10px;
    }

    .error-wrapper {
      text-align: center;
    }
  }
</style>
