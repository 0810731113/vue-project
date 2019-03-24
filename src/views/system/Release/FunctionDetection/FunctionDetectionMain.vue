<template>
  <div class="function-detection-container">
    <div class="tool-bar">
      <el-button class="shop-name" @click="onChooseShopClick">选择门店</el-button>
      <el-input v-model="selectedShopName"></el-input>
      <el-button class="btn-detect" @click="onShopDetectionClick">检测</el-button>
    </div>
    <el-form label-width="120px">
      <el-form-item label="中控权限状态">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th>功能名称</th>
            <th>开通状态</th>
          </tr>
          <tr v-if="!shopCentral.length">
            <td colspan="2">暂无数据</td>
          </tr>
          <tr v-else v-for="item in shopCentral" :key="item.functionName">
            <td>{{ item.functionName }}</td>
            <td>{{ item.status }}</td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item label="客户端版本">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>版本类型</td>
            <td>版本号</td>
          </tr>
          <tr v-if="!shopVersion.length">
            <td colspan="2">暂无数据</td>
          </tr>
          <tr v-else>
            <td>{{ shopVersion.clientType}}</td>
            <td>{{ shopVersion.softVersion }}</td>
          </tr>
        </table>
      </el-form-item>
      <el-form-item label="网络状态">
        <label>暂无数据</label>
      </el-form-item>
      <el-form-item label="硬件状态">
        <label>暂无数据</label>
      </el-form-item>
    </el-form>
    <ChooseShopModal
      v-model="selectedShops"
      errorMessage="请选择需要检测的门店"
      ref="chooseShopModal"
      :multiple="false">
    </ChooseShopModal>
    <Toast
      ref='toast'
      content="请选择门店!"
      :timeout="2000"
      type="warning">
    </Toast>
  </div>
</template>
<script>
  import { Toast, Loading } from 'components';
  import { mapActions, mapState } from 'vuex';
  import ChooseShopModal from '../../Components/ChooseShopModal';

  export default {
    name: 'FunctionDetectionMain',
    components: {
      Toast,
      Loading,
      ChooseShopModal
    },
    data () {
      return {
        selectedShops: [],
        selectedShopName: '',
        selectedShopGuid: '',
        pollingEvent: null,
        pollingCount: 0
      };
    },
    computed: {
      ...mapState({
        shopDetectionToken: state => state.release.functionDetection.shopDetectionToken,
        shopDetectionResult: state => state.release.functionDetection.shopDetectionResult,
        shopVersion: state => state.release.functionDetection.shopVersion,
        shopCentral: state => state.release.functionDetection.shopCentral
      })
    },
    watch: {
      selectedShops () {
        if (this.selectedShops && this.selectedShops.length) {
          this.selectedShopName = this.selectedShops[0].shopName;
          this.selectedShopGuid = this.selectedShops[0].shopGUID;
        }
      },
      pollingCount () {
        if (this.pollingCount === 1) {
          clearInterval(this.pollingEvent);
        }
      },
      shopDetectionResult () {
        if (this.shopDetectionResult) {
          // todo get data from remote server
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchShopDetectionToken',
        'fetchShopDetectionResult',
        'fetchShopCentral'
      ]),
      onChooseShopClick () {
        this.$refs.chooseShopModal.isShow = true;
      },
      async onShopDetectionClick () {
        if (!this.selectedShopName) {
          this.$refs.toast.isShow = true;
          return;
        }
        await this.fetchShopCentral({ shopGuid: this.selectedShopGuid });
        // todo get data from remote server
        // await this.onFetchShopStatus();
      },
      async onFetchShopStatus () {
        await this.fetchShopDetectionToken({ shopGuid: this.selectedShopGuid });
        this.pollingEvent = setInterval(async () => {
          await this.fetchShopDetectionResult({ shopCheckUUID: this.shopDetectionToken, shopGuid: this.selectedShopGuid });
          this.pollingCount++;
        }, 3000);
      }
    }
  };
</script>
<style lang="scss">
  .function-detection-container {
    padding: 40px;
    width: 60%;
    margin: auto;

    .tool-bar {
      display: flex;
      flex-direction: row;
      width: 50%;
      margin: auto;

      .shop-name {
        width: 100px;
        margin-right: 20px;
      }

      .el-button {
        width: 150px;
      }

      .btn-detect {
        margin-left: 15px;
      }
    }

    .el-form {
      width: 80%;
      margin: 20px auto;

      table {
        text-align: center;
        border: 1px solid #dfe6ec;

        td,
        th {
          border: 1px solid #dfe6ec;
          width: 100px;
          padding: 0 10px;
        }
      }
    }
  }
</style>
