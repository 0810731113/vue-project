<template>
  <div class="update-container" @click="closeSelect">
    <div class="business-title">
      <h3>
        <span class='red_tip'>*</span> 第一步 选择下发业务内容
        <el-button><span class="tip-mark" @click="showDownStaticContent">?</span></el-button>
      </h3>
      <span class="business-type">
        <span class="business-tip">业务类型</span>
        <span class='mw_select' ref="typeSelect">
          {{ dishTypeOptions.find(item => item.value === dishType)['label'] }}
          <i :class='selectType ? "select" : ""' />
          <ul :class='selectType ? "select" : ""'>
            <li
              :class=' item.value === dishType ? "active" : "" '
              @click="changeDishType(item.value)"
              v-for="item in dishTypeOptions"
              :key="item.value">
              {{ item.label }}
            </li>
          </ul>
        </span>
      </span>
      <span class="business-cont" v-show='dishType !== 2'>
        <span class="business-tip">业务内容</span>
        <span class='mw_select' ref="contSelect">
          {{ currentTypeContent.length !== 0 ? currentTypeContent.find(item => item.contentCode === dishContent)['contentName'] : '无数据' }}
          <i :class='selectType ? "select" : ""' />
          <ul v-if='currentTypeContent.length !== 0' :class='selectContent ? "select" : ""'>
            <li
              :class=' item.contentCode === dishContent ? "active" : "" '
              @click="changeDishContent(item.contentCode)"
              v-for="item in currentTypeContent"
              :key="item.contentCode">
              {{ item.contentName }}
            </li>
          </ul>
        </span>
      </span>
      <div class="select-item-block">
        <div class="update-type-wrapper">
          <span class="business-tip">下发时间设置</span>
          <el-select v-model="sendMode" class="" @change="sendModeChange">
            <el-option v-for="option in sendModeOption" :label="option.label" :key="option.value" :value="option.value"></el-option>
          </el-select>
        </div>
        <div class="update-type-wrapper">
          <span class="business-tip">门店菜品处理方式</span>
          <el-select v-model="sendType" class="" >
            <el-option v-for="option in sendTypeOption" :label="option.label" :key="option.value" :value="option.value"></el-option>
          </el-select>
        </div>
        <div class="update-type-wrapper">
          <Tips
            :content='DIST_HAND_TYPE_TIP_CONTENT'>
          </Tips>
        </div>
      </div>
    </div>
    <div class="food-list-data">
      <!-- 集团菜单 -->
      <el-table v-show='dishType === 1' style="width: 100%" :data="companyDishMenuList" max-height="470" border>
        <el-table-column prop="itemName" label="菜品" align="center" />
        <el-table-column prop="orderUint" label="规格" align="center" />
        <el-table-column prop="salePrice" label="标准价" align="center" />
        <el-table-column prop="cbSalePrice" label="售价" align="center" />
      </el-table>
      <!-- 付款方式 -->
      <el-table v-show='dishType === 2' style="width: 100%" :data="paymentList" max-height="470" border>
        <el-table-column prop="paymentName" class-name="table-auto" align="center" label="付款方式" min-width="15%" />
        <el-table-column prop="paymentTypeName" class-name="table-auto" align="center" label="付款类型" min-width="12%" />
        <el-table-column prop="isPremium" :formatter="getBoolText" align="center" label="是否隐藏" min-width="12%" />
        <el-table-column prop="isCalcPaid" :formatter="getBoolText" align="center" label="是否进入实收" min-width="12%" />
        <el-table-column prop="color" align="center" label="按钮颜色" min-width="15%">
          <template slot-scope="scope">
            <div class="btn-color" :style="{ backgroundColor: scope.row.color, textIndent: '-999em', width: '80px' }" @click="onShowModalWithType('colorModal', scope.row)">选择颜色</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" :formatter="getStatusText" min-width="10%" />
      </el-table>
      <!-- 折扣方案 -->
      <el-table v-show='dishType === 3' style="width: 100%" :data="discountSchemeList.filter(item => +item.discountId === +dishContent)" max-height="470" border>
        <el-table-column prop="discountName" align="center" label="折扣名称" min-width="20%" />
        <el-table-column prop="couponId" :formatter="getDiscount" align="center" label="方案类型" min-width="20%" />
        <el-table-column prop="isVIPUse" align="center" label="会员使用" min-width="15%">
          <template slot-scope="scope">
            {{ scope.row.isVIPUse ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column prop="menuCount" align="center" label="菜品数量" min-width="10%" />
        <el-table-column :formatter="getStatusText" align="center" label="状态" min-width="10%" />
      </el-table>
      <!-- 菜品特价 -->
      <el-table v-show='dishType === 4' style="width: 100%" :data="bargainSaleList.filter(item => +item.bargainId === +dishContent)" max-height="470" border>
        <el-table-column prop="bargainName" class-name="table-auto" align="center" label="菜品特价方案名称" />
        <el-table-column prop="beginTime" align="center" label="开始时间" />
        <el-table-column prop="endTime" align="center" label="结束时间" />
        <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" />
      </el-table>
      <el-table v-show='dishType === 5' style="width: 100%" :data="list.filter(item => +item.bargainId === +dishContent)" max-height="470" border>
        <el-table-column prop="bargainName" class-name="table-auto" label="优惠计划名称" align="center" />
        <el-table-column prop="beginTime" label="开始时间" align="center" />
        <el-table-column prop="endTime" label="结束日期" align="center" />
        <el-table-column prop="status" :formatter="getStatusText" label="状态" align="center" />
      </el-table>
      <el-table v-show='dishType === 6' style="width: 100%" :data="bargainFullList.filter(item => +item.bargainId === +dishContent)" max-height="470" border>
        <el-table-column prop="bargainName" class-name="table-auto" align="center" label="优惠计划名称" />
        <el-table-column prop="beginTime" align="center" label="开始时间" />
        <el-table-column prop="endTime" align="center" label="结束时间" />
        <el-table-column prop="menuCount" align="center" label="菜品数量" />
        <el-table-column prop="status" :formatter="getStatusText" align="center" label="状态" />
      </el-table>
    </div>
    <div class='clear'>
      <!-- 选择下发门店 -->
      <div class='secondStep fl'>
        <h3><span class='red_tip'>*</span> 第二步 选择下发门店</h3>
        <div v-if="treeDataSourceOptimise.length === 0">
          暂无数据
        </div>
        <div v-else style="min-height: 100px;">
          <el-tree
            @check-change="treeNodeCheckedChange"
            ref='downTree'
            :data="treeDataSourceOptimise"
            :default-checked-keys="checkedKeys"
            show-checkbox
            node-key="itemId"
            :default-expand-all="true"
            :props="treeProps" />
        </div>
      </div>
      <!-- 选择下发时间 -->
      <div class="thirdStep grant-time fr" v-if="sendMode == 'schedule'">
        <h3>
          <span class='red_tip'>*</span> 第三步 选择下发时间
          <el-button><span class="tip-mark" @click="showDownRule">?</span></el-button>
        </h3>
        <div>
          <span class="business-tip">选择下发时间</span>
          <img src='../../../common/images/downSendDate.png' class="down_send_icon" />
          <span>{{ grantTime || '请选择' }}</span>
          <date-picker :date="grantTime" :changeDate="changeGrantTime" />
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <el-button round class="btn-cancel" @click="goBack">取消</el-button>
      <el-button class="btn-submit" @click="confirm">确定下发</el-button>
    </div>
    <popup
      title="下发操作"
      :tips="confirmContent"
      :handleOk="confirmDownSend"
      ref="popup" />
    <down-static-content ref='downStaticContent' />
    <down-rules ref='downRules' />
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { Pagination, Popup,Tips } from 'components';
  import { DISCOUNT_SCHEME } from 'constant/constants';
  import DownStaticContent from './DownStaticContents';
  import DownRules from './DownRules.vue';
  import DatePicker from './DatePicker.vue';
  import localStorage from 'utils/localstorageUtil';


  const SCHEDULE_CONFIRM_CONTENT = "<div style='text-align: left'>" +
      "<p>下发规则说明：</p>"+
      "此处的业务数据下发，完成的是从“总部云端数据”向“门店云端数据”的同步"+
      "什么时间下发业务数据完成？"+
      "<p>1：在所选的下发日期的上午8点开始下发，预计1小时完成完成下发后，美易点设备怎样能看到新的业务数据？</p>"+
      "<p>2：美易点Android设备，需要在登录界面点击“同步云端数据”按钮，才能在设备上同步最新的业务数据。不点击就不同步，也就不影响营业</p>"+
      "<p>3：美易点Windows设备，每次打开客户端都自动检测云端数据，并同步到设备端</p>"+
      "所选业务将在指定时间下发，切将会覆盖指定范围门店的数据，不可回复，是否继续？</div>";


  const IMMEDIATE_CONFIRM_CONTENT = "<div>" +
                                          "<p style='text-align: left'>1：指定数据会在预计10分钟以后开始下发到所选门店，一旦开始数据下发，将会覆盖指定范围门店的数据，且不可恢复。</p>"+
                                          "<p style='text-align: left'>2：如果此时正在营业，会造成营业数据不准确</p>" +
                                          "是否继续？" +
                                    "</div>"
  const DIST_HAND_TYPE_TIP_CONTENT = "<div><p>保留门店自定义菜，同名、同编码菜品覆盖：下发菜品时，如果集团菜与门店菜的名称、编码重复，则用集团菜覆盖门店菜品，保留门店自定义菜</p>" +
    "<p>清除门店当前所有菜品，下发集团菜品：下发集团菜品之前，清空门店全部菜品，菜单完全与集团菜单一样</p>" +
    "</div>"


  export default {
    name: 'ShopUpdate',
    components: { Pagination, DownStaticContent, DownRules, Popup, DatePicker,Tips },
    data () {
      return {
        sendModeOption : [
          {
            value : 'schedule',
            label : '定时下发'
          },
          {
            value : 'immediate',
            label : '立即下发'
          }
        ],
        sendTypeOption : [
          {
            value : 0,
            label : '保留门店自定义菜，同名、同编码菜品覆盖'
          },
          {
            value : 1,
            label : '清除门店当前所有菜品，下发集团菜品'
          }
        ],
        sendMode : 'schedule',
        sendType : 0, //菜品下发类型
        confirmContent : SCHEDULE_CONFIRM_CONTENT,
        selectType: false,
        selectContent: false,
        dishType: 1,                  // 业务类型
        dishContent: '',              // 业务内容绑定的数据
        pageIndex: 1,
        pageSize: 100,                // 只取前100条数据，这里不做分页
        currentTypeContent: [],       // 业务内容对应的列表数据
        dishTypeOptions: [            // 业务类型（死数据）
          {
            label: '集团菜单',
            value: 1
          },
          {
            label: '付款方式',
            value: 2
          },
          {
            label: '折扣方案',
            value: 3
          },
          {
            label: '菜品特价',
            value: 4
          },
          {
            label: '菜品买减',
            value: 5
          },
          {
            label: '金额满减',
            value: 6
          }
        ],
        grantTime: '',
        checkedKeys: [],
        treeProps: {
          children: 'children',
          //label: 'itemName',
          label: 'nodeName'
        },
//        treeDataSourceOptimise: [], //处理过的
        fsShopGuid: []  ,              // 所选下发门店id集合
        DIST_HAND_TYPE_TIP_CONTENT,
      };
    },
    computed: {
      ...mapState({
        error: state => state.error,
        dishContentTypes: state => state.dishLibrary.shopUpdate.dishContentTypes,
        companyDishMenuList: state => state.dishLibrary.shopUpdate.companyDishMenuList,
        treeDataSource: state => state.shopManagement.shopList.treeDataSource,
        treeDataSourceOptimise(){
          //return this.initShopTree(this.treeDataSource)
          var data = this.$store.state.shopManagement.shopList.treeDataSource
          console.log(data)
          var result = {}
          var systemInfo = localStorage.getInstance().getItem('MW_BM_SHOPINFO')
          var brandShop = systemInfo.shop_info
          brandShop.nodeName = brandShop.shopname
          result = brandShop
          console.log(result)
          result.children = (data && data.constructor === Array) ? data.filter((item) => {
            return item.nodeType == 50
          }) : []
          result.children = (!!data && data.length) ? data.map((item,index) => {
            item.itemId = (item.bindItems && item.bindItems.constructor === Array && item.bindItems.length) ? item.bindItems[0].itemId : null
            return item
          }) : []
          return [result]

        },
        paymentList: state => state.business.payment.paymentList,                           // 支付方案
        discountSchemeList: state => state.preferential.discountScheme.discountSchemeList,  // 折扣方案
        bargainSaleList: state => state.preferential.bargainSale.bargainSaleList,           // 菜品特价
        list: state => state.preferential.buyGift.list,
        bargainFullList: state => state.preferential.bargainFull.bargainFullList
      })

    },
    watch: {
      // 获取业务类型对应的业务内容
      async dishContent () {
        const { pageIndex, pageSize } = this;
        this.dishType !== 2 && this.fetchHistoryShop({ businessCode: this.dishType, contentCode: this.dishContent }).then(data => {
          this.checkedKeys = data.shopList || [];
          this.fsShopGuid = data.shopList || [];
          this.$refs.downTree && this.$refs.downTree.setCheckedNodes(
            (data.shopList || []).map(item => ({ itemId: item }))
          );
        });
        switch (this.dishType) {
          case 1:
            this.fetchContentTypesData();
            break;
          case 3:
            this.fetchDiscountSchemeList({ pageIndex, pageSize });
            break;
          case 4:
            this.fetchBargainSaleList({ pageIndex, pageSize, bargainCls: 1 });
            break;
          case 5:
            this.fetchBuyGiftList({ pageIndex, pageSize, bargainCls: 2 });
            break;
          case 6:
            this.fetchBargainFullList({ pageIndex, pageSize, bargainCls: 18003 });
            break;
        }
      },
      dishType () {
        this.getCurrentTypeContent();
        const { dishType, pageIndex, pageSize } = this;
        if (dishType === 2) {
          this.fetchAllPayment({ pageIndex, pageSize });
          this.dishContent = null;
          this.checkedKeys.length = 0;
          this.fsShopGuid.length = 0;
          this.$refs.downTree && this.$refs.downTree.setCheckedNodes(this.checkedKeys);
        }
      },

      sendMode (){
        console.log(this);
        let {sendMode} = this;
        if(sendMode == 'immediate'){
          this.confirmContent =  IMMEDIATE_CONFIRM_CONTENT;
        }else{
          this.confirmContent = SCHEDULE_CONFIRM_CONTENT;
        }
      }
    },
    methods: {
      ...mapActions([
        'fetchContentTypes',
        'fetchCompanyDishMenuList',
        'fetchShopTreeDataSource',
        'sendCompanyData',
        'sendImmediateCompanyData',
        'fetchHistoryShop',
        'fetchAllPayment',
        'fetchDiscountSchemeList',
        'fetchBargainSaleList',
        'fetchBuyGiftList',
        'fetchBargainFullList'
      ]),
      getDiscount (row) {
        return DISCOUNT_SCHEME[row.couponId].name;
      },
      getBoolText (row, column) {
        return row[column.property] ? '是' : '否';
      },
      getCurrentTypeContent () {
        let res = [];
        for (let i = 0; i < this.dishContentTypes.length; i++) {
          if (this.dishType === this.dishContentTypes[i].businessCode) {
            res = this.dishContentTypes[i].contentList;
            break;
          }
        }
        if (res.length !== 0) {
          this.dishContent = res[0].contentCode;
        }

        this.currentTypeContent = res;
      },
      fetchContentTypesData () {
        const { dishContent, pageIndex, pageSize } = this;
        this.fetchCompanyDishMenuList({
          cookGuid: dishContent,
          pageIndex,
          pageSize
        });
      },
      //格式化店铺结构
      initShopTree(data){
        var result = {}
        var systemInfo = localStorage.getInstance().getItem('MW_BM_SHOPINFO')
        var brandShop = systemInfo.shop_info
        brandShop.nodeName = brandShop.shopname
        result = brandShop
        result.children = (!!data && data.length) ? data.map((item,index) => {
          item.itemId = item.bindItems[0].itemId
          return item
        }) : []
        return result
      },
      // 树节点选择状态变化
      treeNodeCheckedChange (data, checked, indeterminate) {
        console.log(data,checked,indeterminate)
        const fsShopGuid = [];
        const checkedNodes = this.$refs.downTree.getCheckedNodes();
        checkedNodes.forEach(item => {
          //if (item.itemType === 10) {
          if (item.nodeType === 50) {
            fsShopGuid.push(item.itemId.toString());
          }
        });
        this.fsShopGuid = fsShopGuid;
      },
      goBack () {
        this.$router.go(-1);
      },
      // 点击业务类型和业务内容下路选择框之外都收起下拉框
      closeSelect (e) {
        if (this.$refs.typeSelect.contains(e.target)) {
          this.selectType = !this.selectType;
        } else {
          this.selectType = false;
        }
        if (this.$refs.contSelect.contains(e.target)) {
          this.selectContent = !this.selectContent;
        } else {
          this.selectContent = false;
        }
      },
      // 选择业务类型
      changeDishType (value) {
        this.dishType = value;
      },
      // 选择业务内容
      changeDishContent (value) {
        this.dishContent = value;
      },
      // 确认下发
      confirm () {
        let { fsShopGuid, grantTime, dishType , sendMode } = this;
        if (dishType === 1) {
          if (this.companyDishMenuList.length === 0) {
            this.$toast.show({ content: '下发内容为空不能下发', type: 'warning' });
            return;
          }
        } else if (dishType === 2) {
          if (this.paymentList.length === 0) {
            this.$toast.show({ content: '下发内容为空不能下发', type: 'warning' });
            return;
          }
        }

        if(sendMode == 'schedule'){
          if (!grantTime) {
            this.$toast.show({ content: '下发时间不能为空', type: 'warning' });
            return;
          }
          const now = this.moment().format('YYYY-MM-DD');
          if (!this.moment(grantTime).isAfter(now)) {
            this.$toast.show({ content: '下发时间必须晚于今天', type: 'warning' });
            return;
          }
        }
        if (!fsShopGuid || fsShopGuid.length === 0) {
          this.$toast.show({ content: '请选择门店', type: 'warning' });
          return;
        }
        this.$refs.popup.isShow = true;
      },
      async confirmDownSend () {
        let { dishContent, fsShopGuid, grantTime, dishType , sendMode,sendType } = this;
        let params = {
          fsGuid: dishContent,
          fsShopGuid,
          fsJobTime: grantTime,
          fsContent: dishType,
          sendType,
        }

        let sendAPI = sendMode === 'immediate' ? this.sendImmediateCompanyData : this.sendCompanyData;
        sendMode === 'immediate' && (delete params.fsJobTime);
        await sendAPI(params);
        const { errorStatus, errorMsg } = this.error;
        if (errorStatus) {
          this.$toast.show({ content: errorMsg, type: 'error' });
        } else {
          this.$toast.show({ content:
            '下发成功',
            type: 'success',
            noShowError: true
          });
        }
      },
      // 展示下发业务内容规则
      showDownStaticContent () {
        this.$refs.downStaticContent.isShow = true;
      },
      showDownRule () {
        this.$refs.downRules.isShow = true;
      },
      changeGrantTime (date) {
        this.grantTime = date;
      },
      sendModeChange (value){

      }
    },
    async created () {
      // 调用获取业务内容接口
//      var shopInfo = localStorage.getInstance().getItem('MW_BM_SHOPINFO')
//      console.log(shopInfo)

      await this.fetchContentTypes();
      this.getCurrentTypeContent();
      this.fetchShopTreeDataSource({ treeType: 10, shopStatusList: [2, 3] });
    }
  };
</script>

<style lang="scss" scoped>
  .update-container {
    padding: 0 15px;

  }
  .select-item-block{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .update-type-wrapper{
    margin:10px 10px;
    float: left;
    input{
      background-color: #F5FDFF;
      opacity: 1;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    text-indent: 0;
  }

  li {
    list-style: none;

    &.break-content {
      margin-bottom: 15px;
    }
  }

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    padding: 9px 0;
    text-indent: 1em;
    border-bottom: 1px solid #ccc;
    background: #EDEDED;

    .red_tip {
      color: red;
      vertical-align: middle;
    }

    .el-button {
      padding: 0;
      border: 0 none;
      background-color: #EDEDED;

      &:hover {
        background-color: #EDEDED;

        .tip-mark {
          background-color: #F5796F;
        }
      }
    }
  }

  .business-type {
    margin-right: 60px;
    padding-left: 1em;
  }

  .down_send_icon {
    position: relative;
    top: 2px;
    margin-right: 10px;
  }

  .business-tip {
    display: inline-block;
    margin-right: 5px;
    padding-left: 1em;
  }

  @keyframes slideDown {
    0% {
      height: 0px;
      border: 1px solid #ccc;
    }
    to {
      height: 240px;
      border: 1px solid #ccc;
    }
  }

  .mw_select {
    position: relative;
    display: inline-block;
    width: 270px;
    height: 40px;
    margin-left: 15px;
    line-height: 40px;
    text-indent: 1em;
    border: 1px solid #ccc;
    background-color: #F5FDFF;
    border-radius: 4px;
    cursor: pointer;

    i {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -4px;
      display: inline-block;
      width: 5px;
      height: 5px;
      border-left: 1px solid #B3B3B3;
      border-bottom: 1px solid #B3B3B3;
      transform-origin: center center;
      transform: rotate(-45deg);
      transition: transform .3s;

      &.select {
        transform: rotate(-135deg);
        transition: transform .3s;
      }
    }

    ul {
      position: absolute;
      left: -1px;
      top: 40px;
      border-radius: 4px;
      display: block;
      border: 0 none;
      width: 100%;
      height: 0;
      text-indent: 1em;
      background-color: #fff;
      z-index: 9999;
      overflow: auto;

      &.select {
        height: 160px;
        border: 1px solid #ccc;
        transition: height .3s;
      }

      li {
        border-bottom: 1px solid #ccc;
      }

      li.active {
        background-color: #f0f0f0;
      }

      li:last-child {
        border-bottom: 0 none;
      }

      li:hover {
        background-color: #f0f0f0;
      }
    }
  }

  .business-cont {
    ul.select {
      height: auto;
      max-height: 160px;
    }
  }

  .tip-mark {
    color: #fff;
    display: inline-block;
    width: 17px;
    height: 17px;
    margin-right: 5px;
    line-height: 16px;
    border-radius: 50%;
    text-align: center;
    vertical-align: middle;
    background-color: #F5796F;
    position: relative;
    top: -2px;
  }

  .secondStep {
    width: 49%;
    height: 415px;
    overflow: auto;
    margin-top: 20px;
    border: 1px solid rgba(153,153,153,0.62);

    h3 {
      height: 40px;
      line-height: 40px;
    }
  }

  .thirdStep {
    width: 49%;
    margin-top: 20px;
    border: 1px solid rgba(153,153,153,0.62);
  }

  .food-list-data {
    margin-top: 15px;
  }

  .modal-footer {
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
  }
</style>
