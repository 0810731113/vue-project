<template>
  <div class="shop-guide">
    <div class="brief-introduction" align="center">
      <div class="start-question">开店向导有什么用？</div>
      <br>
      <div class="start-answer">
        开店向导的目的是为通过以下流程的操作引导，让门店使用者快速了解美味后台的功能，通过基本的功能设置，完成快速开店。
      </div>
    </div>
    <div class="basic-and-advance">
      <el-row>
        <el-col :span="6">
          <div class="rectangle rectangle-left" @click="handleUpdateShopData">
            <img src="./images/icon-refresh.png" class="picture"/>
            <div class="setting-button btn-advance" align="center">更新数据</div>
          </div>
          <div class="description left-description">(同步后台数据到美易点设备)</div>
        </el-col>
        <el-col :span="9">
          <div class="rectangle rectangle-basic" @click="onBasicClick">
            <img src="./images/icon_basic.png" class="picture"/>
            <div class="setting-button" align="center">
              <span>基础设置</span>
              <div class="progress" :class="{ 'visibility-hidden': !steps.length }">
                (已完成{{ (steps.length / STEP_COUNT) * 100 }}%)
              </div>
            </div>
            <img src="./images/icon_new_shop.png" class="symbol"/>
          </div>
          <div class="description basic-description">(含：门店信息设置、餐段／班别设置、打印设置、菜品设置)</div>
        </el-col>
        <el-col :span="9">
          <div class="rectangle rectangle-right" @click="onAdvanceClick">
            <img src="./images/icon_advance.png" class="picture"/>
            <div class="setting-button btn-advance" align="center">高级设置</div>
          </div>
          <div class="description right-description">(含：套餐设置、优惠设置、员工管理、付款方式设置)</div>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="6" class="unbind-btn">
        <el-button class="btn-submit" @click="onUnbind" v-if="shopInfo.unbund">解绑</el-button>
      </el-col>
    </el-row>
    <Popup
      title="门店解绑"
      :tips="WarningTips"
      :handleOk="onUnbindClick"
      ref="popup"
    />
  </div>
</template>



<script>
  import {mapActions, mapState, mapMutations} from 'vuex';
  import {STEP_COUNT} from 'constant/constants';
  import {SUCCESS} from 'constant/statusCode';
  import {Popup} from 'components';
  const WarningTips = "<div style='fontSize:24px;fontWeight: 600;padding: 12px;'>" +
    "<p>☠️☠️☠️⚡️⚡️⚡️<span style='color:red;'>！！！警告！！！</span>⚡️⚡️⚡️☠️☠️☠️</p>"+
    "<p style='color:red;'>解绑后，门店功能将无法使用，所有在线业务、会员业务、更新升级都无法进行</p>"+
    "<p style='color:red;'>请谨慎操作!</p>"+
    "</div>"
  export default {
    name: 'guidance',
    components : {
      Popup
    },
    data() {
      return {
        STEP_COUNT,
        SUCCESS,
        WarningTips,
      };
    },
    async created() {
      await this.fetchAllGuidance();
      await this.fetchShopInfo();
    },
    mounted(){
      //this.$refs.popup.isShow = true;
    },
    computed: mapState({
      steps: state => state.guidance.steps,
      shopInfo: state => state.shop.shopInfo
    }),
    methods: {
      ...mapMutations([
        'LOADING'
      ]),
      ...mapActions([
        'updateShopData',
        'uploadMenuToCloud',
        'getMenuUploadResult',
        'fetchAllGuidance',
        'fetchShopInfo',
        'unbindShop',
        'updateInfo'
      ]),

      async onUnbindClick (){
        await this.unbindShop();
        this.updateInfo({ unbund: false });
      },

      async onUnbind () {
        this.$refs.popup.isShow = true;
      },
      async handleUpdateShopData() {
        this.LOADING({loading: true, text: '数据更新中'});
        // 第一步更新数据
        const updateErr = await this.updateShopData();

        if (updateErr.err.errNo !== SUCCESS) {
          this.$toast.show({content: '更新数据失败', type: 'warning'});
          this.LOADING({loading: false});
          return;
        }
        // 第二步上传菜品
        const uploadErr = await this.uploadMenuToCloud({noShowError: true});
        if (uploadErr.err.errNo !== SUCCESS) {
          this.$toast.show({content: uploadErr.err.errException, type: 'warning'});
          this.LOADING({loading: false});
          return;
        }

        let uploadResult;
        this.interval = setInterval(async () => {
          uploadResult = await this.getMenuUploadResult();
          if (+uploadResult.err.errNo !== 0) {
            clearInterval(this.interval);
            this.LOADING({loading: false});
            this.$toast.show({content: '更新数据失败2', type: 'warning'});
          }

          if (uploadResult['menuClsMapMsg'] &&
            uploadResult['shopAreaMenuMsg'] &&
            uploadResult['msectionMsg'] &&
            uploadResult['mtableAreasMsg'] &&
            uploadResult['mtableMsg'] &&
            uploadResult['setmealMsg'] &&
            uploadResult['shopsellPlanMsg'] &&
            uploadResult['shopAreaMenuMsg']) {
            clearInterval(this.interval);
            this.LOADING({loading: false});
            this.$toast.show({content: '更新数据成功'});
          }
        }, 2000);
      },
      onBasicClick() {
        const {query} = this.$route;
        this.$router.push({path: '/myd/guidance/basicsettings', query});
      },
      onAdvanceClick() {
        const {query} = this.$route;
        this.$router.push({path: '/myd/guidance/AdvanceSettings', query});
      }
    }
  };

</script>

<style lang="scss">
  .shop-guide {
    position: relative;
    margin-top: 100px;

    .progress {
      color: #2D81E4;
      font-size: 13px;
      text-align: center;
      padding-top: 6px;
      white-space: nowrap;
    }

    .brief-introduction {
      margin-left: 20%;
      letter-spacing: 1.32px;

      .start-question {
        font-size: 20px;
        color: #393D54;
        font-weight: 700;
      }
    }

    .basic-and-advance {
      .rectangle {
        border-radius: 5px;
        background: #FFF;
        border: 1px solid #CDCDCD;
        width: 41.5%;
        height: 57.1%;
        margin-top: 4.5%;
        cursor: pointer;
        position: relative;

        .picture {
          height: 33.8%;
          width: 15.5%;
          margin: 10.44% 0 0 41.8%;
        }

        .setting-button {
          width: 38.8%;
          height: 40.94%;
          line-height: 1;
          font-size: 18px;
          color: #464646;
          margin: 6.7% 0 9.5% 30.56%;
        }

        .symbol {
          width: 20%;
          right: -8px;
          top: 13px;
          position: absolute;
        }
      }

      .rectangle-basic {
        margin: 4.5% 10% 0 38%;
      }

      .rectangle-left {
        width: 62.25%;
        margin: 6.75% auto 0;
      }
      .rectangle-right {
        margin-left: 6%;
      }
      .description {
        font-size: 14px;
        color: #777;
        width: 60%;
      }

      .left-description {
        width: 100%;
        margin-top: 3.15%;
        text-align: center;
      }

      .basic-description {
        margin: 2.1% 10% 0 32%;
      }

      .right-description {
        margin: 2.1% 0 0 0;
      }
    }

    .btn-advance {
      padding-bottom: 18px;
    }
    .unbind-btn {
      text-align: center;
      .btn-submit{
        margin-top: 40px;
      }
    }
  }
</style>
