<template>
  <div class="extract-setting-control">
    <div class="header-con">
      <el-button size="small" class="btn-add" icon="el-icon-plus" @click="() => editNewScheme()">新增方案</el-button>
    </div>
    <el-table
      empty-text="暂无数据"
      height="700"
      align="center"
      :data="extractSettingList"
      style="width: 100%">
      <el-table-column
        align="center"
        prop=""
        label="编号">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="bonusMenuName"
        label="方案名称">
      </el-table-column>
      <el-table-column
        align="center"
        prop="bonusMenuType"
        label="提成模式">
        <template slot-scope="scope">
          {{scope.row.bonusMenuType == 0 ? '按比例提成' : '按销售金额提成'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="status"
        label="状态">
        <template slot-scope="scope">
          {{scope.row.status == 1 ? '正常' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop=""
        width="400px"
        label="编辑">
        <template slot-scope="scope">
          <span class="oparate-btn" @click="extractSettingEdit(scope.row)">设置提成菜品</span>
          <span class="oparate-btn" @click="connectSaler(scope.row)">关联销售人员</span>
          <span class="oparate-btn" @click="disabledOrDeleteExtract(scope.row,'disable', scope.$index )">{{scope.row.status == 1 ? '禁用' : '启用'}}</span>
          <span class="oparate-btn" @click="openDeleteExtractConfirm(scope.row,'delete', scope.$index)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="no-data" v-else>暂无数据...</div>-->
    <popup
      ref="extractSetting"
      type="normal"
      size="middle"
      width="720px"
      :manualyClose=true
      :title="ifNewOrEdit.headerText"
      :handleOk="saveExtractSetting"
    >
      <div slot="content">
        <el-form label-width="120px" :model="bonusManageMenuDto" >
          <el-form-item label="提成方案名称">
            <el-input placeholder="请输入提成方案名称" v-model="bonusManageMenuDto.bonusMenuName"></el-input>
          </el-form-item>
          <el-form-item label="提成方式" prop="bonusMenuType">
            <el-select v-model="bonusManageMenuDto.bonusMenuType">
              <el-option
                v-for="item in extractType"
                :key="item.bonusMenuType"
                :label="item.label"
                :value="item.bonusMenuType"
              />
            </el-select>
            <el-button
              @click="openBatchSettingModel"
              v-if="bonusManageMenuDto.bonusMenuType == 0"
              size="small"
              type="warning"
              plain
              style="marginLeft: 12px" >
              批量设置
            </el-button>
          </el-form-item>
          <div class="info-text">
            {{bonusManageMenuDto.bonusMenuType == 0 ?'说明：该提成方式下，菜品折扣时以折后价计算提成比例' : '说明：改提成方式下，菜品折扣时，仍提成当前设置金额'}}
          </div>
        </el-form>
          <el-table
            @selection-change="handleSelectedDishes"
            style="width: 100%"
            :data="menuFoods"
            align="center"
            empty-text="暂无数据"
            height="400"
          >
            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="itemName"
              label="菜品"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="orderUint"
              label="规格"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="salePrice"
              label="价格"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="percentumPrice"
              :label="bonusManageMenuDto.bonusMenuType == 0 ? '提成比例' : '提成金额'"
              align="center"
              width="180px"
            >
              <template slot-scope="scope">
                <div class="ratio-input" v-if="bonusManageMenuDto.bonusMenuType == 0">
                  <el-input
                    placeholder="请输入提成比例"
                    v-model="scope.row.percentumPrice"
                    class="ratio-input"
                    @blur="(event) => handleExtractPercentInput(event,scope.row)"
                   >
                  </el-input>
                  <span>%</span>
                </div>
                <div class="ratio-input" v-else>
                  <el-input
                    placeholder="请输入提成金额"
                    v-model="scope.row.bonusPrice"
                    class="ratio-input"
                    @blur="(event) => handleExtractPriceInput(event, scope.row)"
                  >
                  </el-input>
                  <span>元</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
      </div>
    </popup>
    <popup
      ref="percentSetting"
      type="submit"
      size="small"
      title="菜品提成设置"
      :handleOk="batchSetPercent"
    >
      <div slot="content">
        <div class="percent-input">
          <el-input
            placeholder="请输入提成比例"
            v-model="extractPercent">
            <template slot="prepend">请输入提成比例</template>
            <template slot="append">%</template>
          </el-input>
        </div>
      </div>
    </popup>
    <popup
      ref="deleteExtractSetting"
      type="normal"
      size="small"
      title="删除提成方案"
      :handleOk="onDeleteExtractConfirm"
    >
      <div slot="content">
        <div class="delete-tip">
          删除后，当前方案已配置的员工提成设置将会清除，是否继续？
        </div>
      </div>
    </popup>
    <popup
      ref="connectSalerSetting"
      type="normal"
      size="small"
      title="关联销售人员"
      :handleOk="saveConnnectSales"
    >
      <div slot="content">
          <div class="connect-saler-text">
            方案名称: {{bonusManageMenuDto.bonusMenuName}}
          </div>
        <el-table
          ref="selConnectSalersTable"
          style="width: 100%"
          :data="salesUsers"
          align="center"
          :row-class-name="ifSalerCanSelectStyle"
          @selection-change="handleSelectedSaler"
        >
          <el-table-column
            align="center"
            type="selection"
            :selectable="ifSalerCanSelect"
            width="55">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="销售人员"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="relation"
            label="是否关联"
            align="center"
          >
            <template slot-scope="scope">
              {{scope.row.relation == 0 ? '未关联' : '已被关联'}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </popup>
    <Toast
      ref='selectEmptyDishWarn'
      :content="toastInfo.text"
      :timeout="2000"
      :type="toastInfo.type"
    />

  </div>

</template>

<script>
import { isShop } from 'utils/configUtil';
import {getAllExtractSettingList, getMarkExtractDishList, getAllDishList,newOrUpdateExtractSetting,getConnectSalesList,saveConnectSalesRelative,disableOrDeleteExtractProgramme} from 'api/dishes'
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, MwButton,Toast } from 'components';
import { OK, FORBIDDEN, UNCLASSIFIED } from 'constant/statusCode';
import { MENUCLS_KIND, ITEMKIND, FIRST_LEVEL, THIRD_LEVEL, ON_TEXT, OFF_TEXT, MENU_PRINT_TYPE } from 'constant/constants';
import {REGEX_EXTRACT_PERCENT,REGEX_EXTRACT_PRICE} from 'constant/regex'
import { validateName } from 'utils/validateUtil';
import ElOption from '../../../../../node_modules/element-ui/packages/select/src/option.vue'

export default {
  name: 'classify',
  props: ['isGuide', 'isSetMeal', 'editId', 'level', 'onClickSubmit', 'isDish'],
  components: {
    ElOption,
    Popup,
    MwButton,
    Pagination,
    Toast,
  },
  data () {
    return {
      extractSettingList: [
//        {
//          bonusMenuId:"378221321", //提成菜ID
//          bonusMenuName:"A级提成菜方案", //提成菜方案名称
//          bonusMenuType:1, //提成模式，0:按比例提成,1:按销售金额提成
//          shopGUID:25854, //门店ID
//          status:1
//        },
//        {
//          bonusMenuId: "378221322",
//          bonusMenuName: "B级提成菜方案",
//          bonusMenuType: 0,
//          shopGUID: "25854",
//          status: 9
//        }
      ],
      bonusManageMenuDto:{  //提成菜品设置项目
//        "bonusMenuId":"142511", //提成菜编号  不是必传，为空表示新增。
//        "bonusMenuName":"A级提成菜方案", //提成菜方案名称
//        "bonusMenuType":0 , //比例提成
      },
      extractIndex: -1, //方案系数
      menuFoods: [    //提成菜品列表
//        {
//          "invQty": 0,
//          "salePrice": 15,
//          "isEveryone": 0,
//          "isGift": 1,
//          "itemCd": 1444,
//          "orderUintCd": 1801300002,
//          "status": 1,
//          "askGpId": null,
//          "itemId": "201",
//          "itemName": "西北臊子面",
//          "orderUint": "份",
//          "vipprice": 0
//        },
//        {
//          "invQty": 0,
//          "salePrice": 14,
//          "isEveryone": 0,
//          "isGift": 1,
//          "itemCd": 1445,
//          "orderUintCd": 1801300003,
//          "status": 1,
//          "askGpId": null,
//          "itemId": "202",
//          "itemName": "鸡蛋臊子",
//          "orderUint": "份",
//          "vipprice": 0
//        },
      ],
      extractType:[ //提成模式
        {
          bonusMenuType: 0,
          label: '按比例提成',
        },
        {
          bonusMenuType: 1,
          label: '按销售金额提成',
        },
      ],
      extractPercent: 0,  //批量设置提成比例
      salesUsers: [   //销售人员列表
//        {
//          "staffId": "13",  //员工id
//          "userName": "awegdf", //员工名称
//          "relation": 0  //是否关联其他提成菜方案  0:未关联 1:关联
//        },
//        {
//          "staffId": "18",
//          "userName": "9988",
//          "relation": 0
//        }
      ],
      selectedSalers:[],  //被选择的销售人员列表
      loading: null,
      toastInfo:{
        text:'',  //文字
        type:'' //类型:  成功 警告  错误
      },
      selectedDishes: [], //设置提成菜选中的菜品
      ifNewOrEdit:{ //是修改或新建
        headerText: '设置提成方案',
        type: 'edit'  // new edit 新建或更新
      }
    };
  },
  mounted(){
    //this.$refs['extractSetting'].isShow = true
    //this.$refs['percentSetting'].isShow = true
    //this.$refs['deleteExtractSetting'].isShow = true
    //this.$refs['connectSalerSetting'].isShow = true
    //this.$refs['selectEmptyDishWarn'].isShow = true
    //<!--content="请选择需要批量设置提成比例的菜品!"-->
  },
  computed: mapState({

  }),
  watch: {


  },
  async created () {
//    const { id } = this.$route.params;

    this.openFullScreen()
    this.getInitData()

  },
  mounted(){
    //this.loading && this.loading.close()

  },
  methods: {
    ...mapActions([
      //'fetchAllClassify',

    ]),
    ifSalerCanSelect(row,index){ //销售人员是否可选 被关联的不可选
      //console.log(row,index)
      return row.edit == 1
    },
    ifSalerCanSelectStyle({row,index}){  //销售人员不可选的置灰
      if(row.edit == 1){
        return 'table-column-normal'
      }else{
        return 'table-column-gray'
      }
    },
    openFullScreen(text) {
      this.loading = this.$loading({
        lock: true,
        text: text || '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },

    openBatchSettingModel(){  //打开批量设置弹框
      if(!this.selectedDishes.length){
        this.toastInfo = {text:'请选择需要批量设置提成比例的菜品！' , type: 'warning'}
        this.$refs['selectEmptyDishWarn'].isShow = true
        return
      }

      this.$refs['percentSetting'].isShow = true
    },
    batchSetPercent(){  //批量设置提成比例
      if(!REGEX_EXTRACT_PERCENT.test(this.extractPercent)){
        this.toastInfo = {text:'请输入正确的提成比例' , type: 'warning'}
        this.$refs['selectEmptyDishWarn'].isShow = true
        return
      }
      this.selectedDishes = this.selectedDishes.map((item,index) => {
        item.percentumPrice = this.extractPercent
        return item
      })
      this.$refs['percentSetting'].isShow = false
    },
    async getInitData(){
      var params = {
        userRights:["dish_write","dish_read"],
      }
      var result = await getAllExtractSettingList(params);
      console.log(result)
      if(result.err.errNo == 0  && Object.prototype.toString.call(result.bonusMenuDtos) === '[object Array]'){
        this.extractSettingList = result.bonusMenuDtos
      }else{
        if(result.err && result.err.errNo == '-2'){
          this.toastInfo = {text:'暂无数据' , type: 'warning'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }else{
          this.toastInfo = {text:'加载数据失败' , type: 'warning'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }
        this.extractSettingList = []  //置空
      }
      this.loading && this.loading.close()
    },

    async editNewScheme(){  //添加新的提成方案
      var that = this
      this.openFullScreen('数据加载中...')
      that.bonusManageMenuDto = {
        "bonusMenuName":"", //提成菜方案名称
        "bonusMenuType": 0 , //比例提成
      }
      this.ifNewOrEdit = {
        headerText: '新建提成方案',
        type: 'new'  // new edit 新建或更新
      }
      var result = await getAllDishList()
      this.loading && this.loading.close()
      if(result.err.errNo == 0){
        var dishesList = (!!result.menuFoods && result.menuFoods.constructor === Array) ? result.menuFoods.map((item, index) => {
          if(!item.hasOwnProperty('percentumPrice')){
            item.percentumPrice = 0
          }
          if(!item.hasOwnProperty('bonusPrice')){
            item.bonusPrice = 0
          }
          var useful = {}
          useful.itemCd = item.itemCd
          useful.orderUintCd = item.orderUintCd
          useful.percentumPrice = item.percentumPrice
          useful.bonusPrice = item.bonusPrice
          useful.itemName = item.itemName
          useful.orderUint = item.orderUint
          useful.salePrice = item.salePrice

          return useful
        }) : []
        this.menuFoods = dishesList

      }else{
        this.menuFoods = []
      }

      this.$refs['extractSetting'].isShow = true
    },

    handleSelectedDishes(items){ //处理选中的菜品
      console.log(items)
      this.selectedDishes = items
    },
    handleSelectedSaler(items){  //处理选中的销售人员
      console.log(items)
      this.selectedSalers = items
    },

    setMarkedDish(result2){   //空数组时设置
      var markedDishA = (Object.prototype.toString.call(result2) ===  '[object Array]'
      && result2.length)
      ? result2.map((item,index) => {
        if(!item.hasOwnProperty('percentumPrice')){
          item.percentumPrice = 0
        }
        if(!item.hasOwnProperty('bonusPrice')){
          item.bonusPrice = 0
        }
        var useful = {}
        useful.itemCd = item.itemCd
        useful.orderUintCd = item.orderUintCd
        useful.percentumPrice = item.percentumPrice
        useful.bonusPrice = item.bonusPrice
        useful.itemName = item.itemName
        useful.orderUint = item.orderUint
        useful.salePrice = item.salePrice
        return useful

      }) : []
      this.menuFoods = markedDishA
    },
    cloneObj(obj){
      if(obj === undefined || obj === null) return null
      var str, newobj = obj.constructor === Array ? [] : {}
      if(typeof obj !== 'object'){
        return
      }else if(JSON){
        str = JSON.stringify(obj)
        newobj = JSON.parse(str)
      }else{
        for(var i in obj){
          newobj[i] = typeof obj[i] === 'object' ?
            cloneObj(obj[i]) : obj[i]
        }
      }
      return newobj
    },
    async extractSettingEdit(data){ // 设置提成菜
      console.log(data)
      var that = this
      that.bonusManageMenuDto = data
      this.ifNewOrEdit = {
        headerText: '设置提成方案',
        type: 'edit'  // new edit 新建或更新
      }

      var params1 = {
        bonusMenuId:data.bonusMenuId
      }
      var markedList = getMarkExtractDishList(params1)
      var allList = getAllDishList()
      this.openFullScreen('数据加载中...')
      var result = await Promise.all([markedList,allList])
      console.log(result)
      this.loading && this.loading.close()
      var result1 = result[0].bonusManageMenuDto && result[0].bonusManageMenuDto.bonusManageMenuDto || []
      var result2 = result[1].menuFoods || []
      console.log(result1)
      console.log(result2)
      console.log(Object.prototype.toString.call(result1))
      console.log(Object.prototype.toString.call(result2))


      if(result[0].err.errNo == 0 && result[1].err.errNo == 0){
        if(Object.prototype.toString.call(result1) === '[object Array]' &&
          Object.prototype.toString.call(result2) === '[object Array]'){
          if(result1.length){
            console.log(result1)
            var markKeyObj = this.cloneObj(result1).reduce((prev,next) => {
              prev[next.orderUintCd] = next
              return prev
            },{})
            //console.log(markKeyObj)
            //debugger
            var markedDish = result2.map((item,index) => {
              if(markKeyObj.hasOwnProperty(item.orderUintCd)){
                  item.percentumPrice = markKeyObj[item.orderUintCd].percentumPrice
                  item.bonusPrice = markKeyObj[item.orderUintCd].bonusPrice
              }
              if(!item.hasOwnProperty('percentumPrice')){
                item.percentumPrice = 0
              }
              if(!item.hasOwnProperty('bonusPrice')){
                item.bonusPrice = 0
              }

              var useful = {}
              useful.itemCd = item.itemCd
              useful.orderUintCd = item.orderUintCd
              useful.percentumPrice = item.percentumPrice
              useful.bonusPrice = item.bonusPrice
              useful.itemName = item.itemName
              useful.orderUint = item.orderUint
              useful.salePrice = item.salePrice
              return useful
            })
            this.menuFoods = markedDish

          }else{
            this.setMarkedDish(result2)
          }
        }else{
          this.setMarkedDish(result2)
        }
      }else{
        this.setMarkedDish(result2)
      }
      this.$refs['extractSetting'].isShow = true
    },
    handleExtractPercentInput(event,row){ //处理输入提成比例的值
      const {value} = event.target
      //row['percentumPrice'] = REGEX_EXTRACT_PERCENT.test(value) ? value : 0
//      if(!REGEX_EXTRACT_PERCENT.test(value)){
//        this.toastInfo = {text:'请输入正确的提成比例' , type: 'warning'}
//        this.$refs['selectEmptyDishWarn'].isShow = true
//        return
//      }

    },
    handleExtractPriceInput(event,row){ //处理输入金额的值
      const {value} = event.target
      //row['bonusPrice'] = REGEX_EXTRACT_PRICE.test(value) ? value : 0
//      if(!REGEX_EXTRACT_PRICE.test(value)){
//        this.toastInfo = {text:'请输入正确的提成金额' , type: 'warning'}
//        this.$refs['selectEmptyDishWarn'].isShow = true
//        return
//      }

    },
    async saveExtractSetting(){ //新建或保存提成菜设置
      var params = {}
      var baseInfo = this.bonusManageMenuDto
      if(!/^[\u4e00-\u9fa5\uf900-\ufa2d0-9a-zA-Z_\(\)\（\）]{2,20}$/.test(baseInfo.bonusMenuName)){
        this.toastInfo = {text:'请输入正确的方案名称' , type: 'warning'}
        this.$refs['selectEmptyDishWarn'].isShow = true
        return
      }

      for(let i = 0 ; i < this.menuFoods.length; i++){
        let percent =this.menuFoods[i].percentumPrice
        let price = this.menuFoods[i].bonusPrice
        let salePrice = this.menuFoods[i].salePrice
        //debugger
//        console.log(REGEX_EXTRACT_PERCENT.test(percent), percent)
//        console.log(REGEX_EXTRACT_PRICE.test(price), price)

        if(!REGEX_EXTRACT_PERCENT.test(percent)){
          this.toastInfo = {text:'请输入正确的提成比例' , type: 'warning'}
          this.$refs['selectEmptyDishWarn'].isShow = true
          return
        }
        if(!REGEX_EXTRACT_PRICE.test(price)){
          this.toastInfo = {text:'请输入正确的提成金额' , type: 'warning'}
          this.$refs['selectEmptyDishWarn'].isShow = true
          return
        }
        if(parseFloat(price) > parseFloat(salePrice)){
          this.toastInfo = {text:'提成金额不能大于菜品价格' , type: 'warning'}
          this.$refs['selectEmptyDishWarn'].isShow = true
          return
        }
      }

      params.bonusMenuName = baseInfo.bonusMenuName
      params.bonusMenuType = baseInfo.bonusMenuType
      if(this.ifNewOrEdit.type == 'edit'){
        params.bonusMenuId = baseInfo.bonusMenuId
      }else{
        params.bonusMenuId = ""
      }
      params.bonusManageMenuDto = this.menuFoods
      //params.bonusManageMenuDto = this.selectedDishes.length ? this.selectedDishes : []
      console.log(params)
      this.openFullScreen('数据保存中...')
      var result = await newOrUpdateExtractSetting(params)
      console.log(result)
      this.selectedDishes = []  //置空选择
      this.loading && this.loading.close()
      if(result.err.errNo == 0){
        this.toastInfo = {text:'保存成功' , type: 'success'}
        this.$refs['extractSetting'].isShow = false
        this.$refs['selectEmptyDishWarn'].isShow = true

        this.getInitData()  //重新拉取数据

      }else{
        this.toastInfo = {text:'保存失败' , type: 'error'}
        this.$refs['selectEmptyDishWarn'].isShow = true
      }
    },

    async connectSaler(data){ //  获取并设置关联销售人员
      //console.log(data)
      var that = this
      that.bonusManageMenuDto = data
      var params = {
        bonusMenuId: data.bonusMenuId
      }
      console.log(result)
      var result = await getConnectSalesList(params)
      console.log(result)
      if(result.err.errNo == 0){
        this.salesUsers = result.salesUsers
//          .map((item,index) => {
//          item.relation = (index % 2 == 0) ? 1  : 0
//          return item
//        })
        this.$refs['connectSalerSetting'].isShow = true
        setTimeout(() => {
          result.salesUsers.map((item,index) => {
            if(item.relation == 1){
              this.$refs["selConnectSalersTable"].toggleRowSelection(item,true)
            }
          })
        },500)


      }else{
        this.salesUsers = []
        this.toastInfo = {text:'获取销售员工失败' , type: 'error'}
        this.$refs['selectEmptyDishWarn'].isShow = true
      }
    },

    async saveConnnectSales(){  //保存关联销售人员
      this.openFullScreen('数据保存中...')
        var params = {
          bonusMenuId: this.bonusManageMenuDto.bonusMenuId
        }
        var salerIdArray = this.selectedSalers.map((item,index) => {
          return item.userId
        })
      //params.staffIds = salerIdArray.join(",")
      params.userIds = salerIdArray.join(",")
      console.log(params)
      var result = await saveConnectSalesRelative(params)
      console.log(result)
      this.loading && this.loading.close()
      if(result.err.errNo == 0){
        this.toastInfo = {text:'保存成功' , type: 'success'}
        this.$refs['selectEmptyDishWarn'].isShow = true
      }else{
        this.toastInfo = {text:'保存失败' , type: 'error'}
        this.$refs['selectEmptyDishWarn'].isShow = true
      }
    },

    async disabledOrDeleteExtract(row,type,index){  //禁用
      console.log(index)
      this.openFullScreen('请稍等...')
      var params = {
        bonusMenuId: row.bonusMenuId
      }
      if(type == 'delete'){
        params.status = 13;
      }else{
        if(row.status == 1){
          params.status = 9;
        }else{
          params.status = 1;
        }
      }
      console.log(params)

      var result = await disableOrDeleteExtractProgramme(params)
      console.log(result)
      this.loading && this.loading.close()
      if(result.err.errNo == 0){
        if(params.status == 13){
          var opResult = this.extractSettingList
          opResult.splice(index,1)
          this.extractSettingList = opResult
        }else{
          row.status = params.status
        }
        this.toastInfo = {text:'操作成功' , type: 'success'}
        this.$refs['selectEmptyDishWarn'].isShow = true
      }else{
        this.toastInfo = {text:'操作失败' , type: 'error'}
        this.$refs['selectEmptyDishWarn'].isShow = true
      }

    }, //
    async openDeleteExtractConfirm (row,type,index) { //修改或添加提成菜设置
      //console.log("保存提成菜设置")
      this.bonusManageMenuDto = row
      this.extractIndex = index
      this.$refs['deleteExtractSetting'].isShow = true

    },
    onDeleteExtractConfirm(){   //去删除提成菜方案
      this.disabledOrDeleteExtract(this.bonusManageMenuDto,'delete',this.extractIndex)
    }

  }
};
</script>

<style lang="scss">
  .extract-setting-control{
    padding: 15px 15px 0;
    .header-con{
      margin-bottom: 12px;
    }
    .oparate-btn{
      padding: 8px;
      text-decoration: underline;
      color: #409eff;
      cursor:pointer;
    }
    .info-text{
      color: red;
      padding: 0 24px;
    }
    .ratio-input{
      width: 80%;
    }
    .percent-input{
      width: 80%;
      margin: 24px auto;
    }
    .delete-tip{
      color: red;
    }
    .connect-saler-text{
      padding-bottom: 24px;
      font-size: 18px;
    }
    .no-data{
      font-size: 16px;
      text-align: center;
      padding-top: 12px;
      color: #cccccc;
    }
    .table-column-gray{
      background-color: #f4f4f5;
      color:#bcbec2;
    }
    .table-column-normal{
      background-color: #fff;
      color:#606266;
    }
  }
</style>
