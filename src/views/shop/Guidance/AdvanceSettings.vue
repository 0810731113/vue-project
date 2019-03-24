<template>
  <div class="advance-setting-container" align="center">
      <div
        v-for="(item, index) in STEP_ADVANCE_SETTING"
        :key="item.title"
        :active="active"
        class="square"
        @click="onClickItem(index)"
      >
        <img :src="getIconUrl(item)" class="symbol" />
        <div class="title">{{item.title}}</div>
        <div class="icon-triangle" v-show="index === active"></div>
      </div>
      <div class="content-container">
        <div class="des-label">{{STEP_ADVANCE_SETTING[active].description}}</div>
        <el-button class="setting-button" @click="onClickGoRoute">立即设置</el-button>
        <div class="different-view" :class="`img-bg-${this.active}`">
        </div>
      </div>
  </div>
</template>

<script>
  import { STEP_ADVANCE_SETTING, IFRAME_ROUTE } from 'constant/constants';

  export default {
    name: 'AdvanceSettings',
    data () {
      return {
        STEP_ADVANCE_SETTING,
        active: 0
      };
    },
    methods: {
      getIconUrl (item) {
        if (!item.src) return;
        const images = require.context('./images/', false, /\.png$/);
        return images('./' + item.src + '.png');
      },
      onClickItem (index) {
        this.active = index;
      },
      onClickGoRoute () {
        const route = IFRAME_ROUTE[this.active];
        if (sessionStorage.getItem('isIframe') === 'true') {
          window.parent.Navigation(route.parent, route.children);
        } else {
          this.$router.push(IFRAME_ROUTE[this.active].route || '');
        }
      }
    }
  };
</script>

<style lang="scss">
.advance-setting-container {
  margin: auto;
  padding: 46px 0 0;
  font-size: 14px;

  .square {
    width: 140px;
    margin-right: 66px;
    display: inline-block;
    background-color: white;
    position: relative;
    cursor: pointer;

    .symbol {
      height: 58px;
      width: 58px;
      margin: 0 auto;
      border-radius: 10px;
    }

    .title {
      font-size: 18px;
      color: #464646;
      margin: 16px auto;
    }

    .icon-triangle {
      height: 20px;
      width: 140px;
      position: absolute;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url('./images/icon_arrow.png');
      bottom: -11px;
    }
  }

  .content-container {
    width: 75.9%;
    height: 76.5%;
    background: #FFF;
    border: 1px solid #CDCDCD;
    border-radius: 5px;
    margin-top: 10px;

    .des-label {
      font-size: 16px;
      color: #464646;
      margin: 30px 6.8% 0 7.5%;
    }

    .setting-button {
      width: 210px;
      height: 46px;
      background: #FFB40D;
      border-color: #FFB40D;
      border-radius: 23px;
      font-size: 20px;
      color: #FFF;
      letter-spacing: 4px;
      padding: 6px 12px;
      margin: 32px 0 0;

      &:hover {
        border-color: #FFB40D;
      }
    }

    @for $i from 0 through 3 {
      .img-bg-#{$i} {
        background-image: url('/myd/static/images/img_advance_' + $i + '.jpg');
      }
    }

    .different-view {
      height: 730px;
      width: 95%;
      border: 1px solid #CDCDCD;
      border-radius: 5px;
      margin: 15px 0 25px;
      background-repeat: round;
    }
  }
}
</style>
