<template>
  <Popup
    class="choose-shop-modal"
    ref="popup"
    type="submit"
    title="选取门店"
    okText="保存"
    :handleOk="onSave"
    :handleClose="onClose">
    <el-row slot="content">
      <el-col :span="10">
        <div>
          <el-input
            @change="onSearchCompany"
            placeholder="请输入公司名称">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <mw-list
            ref="companyList"
            keyId="companyGUID"
            keyName="companyName"
            v-model="selectedCompany"
            class="company-list"
            :dataSource="companyResults">
          </mw-list>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="shop-group">门店分组</div>
        <mw-list
          ref="shopGroup"
          keyId="shopGroupId"
          keyName="shopGroupName"
          v-model="selectedShopGroup"
          :dataSource="shopGroupList">
        </mw-list>
      </el-col>
      <el-col :span="10">
        <div>
          <el-input
            @change="onSearchShop"
            placeholder="请输入餐厅名称"
            icon="search">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
          <el-checkbox-group v-model="selectedShop" class="shopList" @change="onShopSelectionChange" ref="shopList">
            <el-checkbox
              class="shop-item"
              v-for="item in shopResults"
              :ref="item.shopGUID"
              :label="item.shopGUID"
              :key="item.shopGUID">
              {{item.shopName}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-col>
    </el-row>
    <div slot="errorMessage" class="error-wrapper" v-if="showError">
      <div>
        <i class="el-icon-circle-cross"></i>
        {{ errorMessage }}
      </div>
    </div>
  </Popup>
</template>
<script>
  import { Popup } from 'components';
  import MwList from '../Components/List';
  import { ALL } from 'constant/statusCode';
  import { mapActions, mapState } from 'vuex';
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    name: 'ChooseShopModal',
    props: {
      value: {
        type: Array
      },
      onSubmit: {
        type: Function,
        default: () => {}
      },
      multiple: {
        type: Boolean,
        default: true
      },
      isUpgrade: {
        type: Boolean,
        default: false
      },
      errorMessage: {
        type: String
      },
      // 选取了的门店列表
      selectShopList: {
        type: Array
      }
    },
    components: {
      Popup,
      MwList
    },
    data () {
      return {
        ALL,
        isShow: false,
        selectedShop: [],
        selectedCompany: '',
        selectedShopGroup: '',
        companyResults: [],
        shopResults: [],
        upgradeList: [],
        showError: false
      };
    },
    watch: {
      async isShow () {
        this.$refs['popup'].isShow = this.isShow;
        if (this.isShow) {
          await this.init();
          const copySelectShopList = cloneDeep(this.selectShopList);
          this.selectedShop = copySelectShopList.map(shop => {
            return shop.fsshopguid;
          });
          this.upgradeList = copySelectShopList;
        }
      },
      async selectedCompany () {
        await this.fetchShopGroupList({ companyGUID: this.selectedCompany });
        await this.fetchShopList({ companyGUID: this.selectedCompany, shopType: ALL, shopGroupId: null });
        this.shopResults = this.shopList;
      },
      async selectedShopGroup () {
        const requestData = { companyGUID: this.selectedCompany };
        if (this.selectedShopGroup === ALL) {
          requestData.shopType = ALL;
          requestData.shopGroupId = null;
          await this.fetchShopList(requestData);
        } else {
          requestData.shopType = 0;
          requestData.shopGroupId = this.selectedShopGroup;
          await this.fetchShopList(requestData);
        }
        this.shopResults = this.shopList;
      }
    },
    computed: {
      ...mapState({
        companyList: state => state.release.functionDetection.companyList,
        shopGroupList: state => state.release.functionDetection.shopGroupList,
        shopList: state => state.release.functionDetection.shopList
      })
    },
    methods: {
      ...mapActions([
        'fetchCompanyList',
        'fetchShopGroupList',
        'fetchShopList'
      ]),
      async init () {
        this.selectedShop = [];
        this.showError = false;
        await this.fetchCompanyList();
        await this.fetchShopGroupList({ companyGUID: this.selectedCompany });
        if (this.companyList) {
          this.selectedCompany = this.companyList[0].companyGUID;
          this.selectedShopGroup = this.shopGroupList[0].shopGroupId;
          this.companyResults = this.companyList;
        }
        await this.fetchShopList({ companyGUID: this.selectedCompany, shopType: ALL, shopGroupId: null });
      },
      async onSearchCompany (value) {
        this.companyResults = this.companyList.filter(item => item.companyName.includes(value));
        // scroll the selected Item into view after clearing search text
        if (!value && this.$refs['companyList'].$refs[this.selectedCompany]) {
          this.$nextTick(() => {
            this.$refs['companyList'].$refs[this.selectedCompany][0].scrollIntoView();
          });
        }
      },
      async onSearchShop (value) {
        this.shopResults = this.shopList.filter(item => item.shopName.includes(value));
        if (this.selectedShop.length && !value && this.$refs[this.selectedShop[0].shopGUID]) {
          this.$nextTick(() => {
            this.$refs[this.selectedShop[0].shopGUID][0].$el.scrollIntoView();
          });
        }
      },
      onShopSelectionChange (value) {
        if (this.isUpgrade) {
          const company = this.companyList.find(item => item.companyGUID === this.selectedCompany);
          const shop = this.shopList.find(item => item.shopGUID === value[value.length - 1]);
          if (shop) {
            this.upgradeList.push({
              companyid: company.companyGUID,
              companyname: company.companyName,
              fsshopguid: shop.shopGUID,
              shopname: shop.shopName
            });
          } else {
            this.upgradeList = this.upgradeList.filter(item => value.includes(item.fsshopguid));
          }
          return;
        }
        if (this.selectedShop) this.showError = false;
        if (!this.multiple && value.length) {
          this.selectedShop = [value.pop()];
        } else {
          this.$emit('input', this.selectedShop);
        }
      },
      onClose () {
        this.isShow = false;
        this.upgradeList = cloneDeep(this.selectShopList);
      },
      onSave () {
        if (!this.selectedShop.length) {
          this.showError = true;
          return;
        }
        // 单选时， 需要shopname和shopid, 所以需要传出shop对象
        if (!this.multiple) {
          this.shopList.map(item => {
            if (item.shopGUID === this.selectedShop[0]) {
              this.$emit('input', [item]);
            }
          });
        }

        this.onSubmit(this.isUpgrade ? this.upgradeList : this.selectedShop);
        this.onClose();
      }
    }
  };
</script>
<style lang="scss">
  .choose-shop-modal {
    .el-dialog {
      padding: 20px;
    }

    .company-list {
      margin-top: 10px;
      height: 200px;
      border: 1px solid #C2CDD3;
      overflow: auto;
    }

    .shopList {
      margin-top: 10px;
      height: 200px;
      border: 1px solid #C2CDD3;
      overflow: auto;
      padding: 10px;

      .shop-item {
        height: 30px;
        margin-left: 10px;
        display: block;
      }
    }

    .shop-group {
      line-height: 35px;
      height: 35px;
      text-align: center;
      font-weight: 700;
    }

    .error-wrapper {
      margin-top: 5px;
      margin-bottom: 0;
      color: #ff4949;
    }
  }
</style>
