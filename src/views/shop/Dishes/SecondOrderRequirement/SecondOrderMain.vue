<template>
  <div class="second-point">
    <second-order-search
      :classList="classListWithAll"
      :isShop="true"
      :onSearchMenus="onSearchMenus"
    />
    <div class="btn-wrapper btn-wrapper-flex">

      <!--<el-tooltip class="item" effect="dark" content="当前门店只对灰度门店生效" placement="top-start">-->
       <div class="alignCenter">
         <el-button class="btn-primary" style="marginRight:6px;" @click="getBatchDishRequire">批量设置</el-button>
         <Tips content="当前功能只对灰度门店生效"></Tips>
       </div>
      <!--</el-tooltip>-->
      <el-button class="btn-primary" :disabled="batchUploadingStatus == 2" @click="getBatchUploadDishRequire">批量上传</el-button>
    </div>
    <el-table ref="multipleTable" :data="list" border @selection-change="onChangeSelection" max-height="600">
      <el-table-column type='selection'/>
      <el-table-column prop="menuClsName" align="center" label="菜品分类" min-width="10%" />
      <el-table-column prop="itemName" align="center" label="菜品名称" min-width="10%" />
      <el-table-column prop="menuSalePrice" align="center" label="菜品价格" min-width="10%" />
      <el-table-column align="center" label="操作" min-width="10%">
        <template slot-scope="scope">
          <mw-button class="btn-edit" content="设置" @click="onClickEdit(scope.row)" />
          <!--<mw-button v-if="+scope.row.fiSource !== 1" class="btn-delete" content="删除" :disabled="isDelete" @click="onShowDeletePopup(scope.row)" />-->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :onChangeSize="onChangeSize"
      :onChangeCurrent="onChangeCurrent"
      :pageSize="pageSize"
      :currentPage="pageIndex"
      :totalCount="recordCount"
      layout="slot, ->, prev, pager, next, sizes"
    />
    <second-order-batch
      ref="secondOrderBatch"
      :data="singleOrBatchEdit == 'batch' ? selectedIds : selectSingleId"
      :singleOrBatchEdit="singleOrBatchEdit"
      :dishRequireDetail="dishRequireDetail"
      :onUpdateDishRequire="onUpdateDishRequire"
    />
    <toast
      ref='selectBelong'
      :content="belongToast.text"
      :timeout="2000"
      :type="belongToast.type"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Popup, Pagination, Toast, MwButton,Tips } from 'components';
import { MenuOptions, SecondOrderBatch, SecondOrderSearch } from 'common/components';
import { DEFAULT_PAGE } from 'constant/pagination';
import { API_EXPROT_MENU_LIST } from 'constant/API';

import {batchUpdateDishPropertirs,batchUpdateDishIncomeSaleBelong,
  fetchDishRequireGroup,fetchDishRequireBatchDetail,fetchDishRequireSingleDetail,
  saveSingleDishRequire,saveBatchDishRequire,saveBatchSyncUploadDishRequest} from 'api/dishes'
import {cloneObj,trim} from '../../../../utils/someUsefulUtil'
export default {
  name: 'SecondOrderMain',
  props: {

  },
  components: {
    SecondOrderBatch,
    SecondOrderSearch,
    Pagination,
    MwButton,
    Popup,
    Toast,
    Tips,
  },
  data () {
    return {
      searchParams: {
        "menuName":null, //菜品名称 默认null
        "menuClsId":null,//菜品分类ID 默认null
        "maxMenuUnit":null, // 菜品 最小价格  默认null
        "minMenuUnit":null, // 最高价格  默认null
        "pageIndex":1,
        "pageSize":10,
      },
      belongToast:{
        text:'请选择',
        type:'warning',
      },
      selectedIds:[], //选择的表格id
      selectSingleId : [],  //单个选择的菜品
      dishRequireDetail:{},  //批量编辑时第一个分组详情
      singleOrBatchEdit:'batch',  //是批量修改还是单独编辑
      publicDishRequire:null, //公共的要求详细，避免拉取多次
      batchUploadingStatus: 1, //批量更新请求状态 1 未请求 2 请求中
    };
  },
  async created () {
    const { pageIndex, pageSize ,searchParams} = this;
    this.fetchSecondpointList(searchParams)
    this.fetchAllClassifySP()
    this.fetchDishRequireGroupListSP()
  },
  mounted(){
    //this.$refs["secondOrderBatch"].isShow = true;
//    this.fetchSingleDishRequireSP()
//    this.fetchBatchDishRequireSP()
  },
  watch: {

  },
  computed: mapState({
    list: state => state.dishes.secondpoint.list,
//    selectedIds: state => state.dishes.secondpoint.selectedIds,
    allClassify: state => state.dishes.secondpoint.allClassify,
    pageIndex: state => state.dishes.secondpoint.pageIndex,
    pageSize: state => state.dishes.secondpoint.pageSize,
    recordCount: state => state.dishes.secondpoint.recordCount,
    dishRequireGroup: state => state.dishes.secondpoint.dishRequireGroup,
    dishRequireBatch: state => state.dishes.secondpoint.dishRequireBatch,
    dishRequireSingle: state => state.dishes.secondpoint.dishRequireSingle,
    classListWithAll () {
      const classListWithAll = this.allClassify ? this.allClassify.slice() : [];
      classListWithAll.unshift({ menuClsId: [-1], menuClsName: '全部分类', children: null });
      return classListWithAll;
    }
  }),
  methods: {
    ...mapActions([
      'fetchSecondpointList',
      'fetchAllClassifySP',
      'fetchDishRequireGroupListSP',
      'fetchSingleDishRequireSP',
      'fetchBatchDishRequireSP',
    ]),
    async onChangeSize(pageSize){
      console.log(pageSize)
      await this.fetchSecondpointList({...this.searchParams,DEFAULT_PAGE,pageSize,loading: true})

    },
    async onChangeCurrent(pageIndex){
      //console.log('改变当前页码')
      await this.fetchSecondpointList({...this.searchParams,DEFAULT_PAGE,pageIndex,pageSize:this.pageSize,loading: true})
    },
    //检验查询参数
    checkSearchArgs(data){
      if(trim(data.menuName)){
        if(!/^[\u4e00-\u9fa5\uf900-\ufa2d0-9a-zA-Z]{1,20}$/.test(trim(data.menuName))){
          this.belongToast = {type: 'warning',text:'请输入正确的菜品名称'}
          this.$refs['selectBelong'].isShow = true
          return false
        }
      }
      if(data.minMenuUnit || data.minMenuUnit === 0){
        if(!/\d+|\d+\.\d{1,2}/.test(data.minMenuUnit)){
          this.belongToast = {type: 'warning',text:'请输入正确的最低价格'}
          this.$refs['selectBelong'].isShow = true
          return false
        }
      }
      if(data.maxMenuUnit || data.maxMenuUnit === 0){
        if(!/\d+|\d+\.\d{1,2}/.test(data.maxMenuUnit)){
          this.belongToast = {type: 'warning',text:'请输入正确的最高价格'}
          this.$refs['selectBelong'].isShow = true
          return false
        }
      }

      if((data.minMenuUnit || data.minMenuUnit === 0)  && (data.maxMenuUnit || data.maxMenuUnit === 0)){
        if(data.maxMenuUnit < data.minMenuUnit){
          this.belongToast = {type: 'warning',text:'最高价格不能小于最低价格'}
          this.$refs['selectBelong'].isShow = true
          return false
        }
      }

      return true
    },
    async onSearchMenus(data){
      console.log(data)
      var check= this.checkSearchArgs(data)
      if(!check){
        return
      }
      this.searchParam = {...this.searchParam,...data}
      await this.fetchSecondpointList({...data,pageIndex:DEFAULT_PAGE,pageSize:this.pageSize,loading: true})
      if(this.searchParam){

      }
    },
    //去掉没选择的内容
    formatSelectedDetail(data){
      console.log(data)
      var result = []
      var clone = cloneObj(data)
      for(var key in clone){
        var obj = clone[key]
        if(obj.askInfs && obj.askInfs.length){
          obj.askInfs = obj.askInfs.filter((item) => {
            return item.selected == true
          })
        }
        if(obj.askInfs.length){
          obj.menuAsk = obj.askConfigInfos
        }else{
          obj.menuAsk = { "askMin": null,"askMax": null}
        }
        obj.askGpId = key
        delete obj.askConfigInfos
        result.push(obj)
      }
      return result
    },
    //检验菜品要求输入的参数是否合法
    checkRequireArgs(data){
      for(var i = 0 ; i < data.length; i++){
        var askInfs = data[i].askInfs
        var menuAsk = data[i].menuAsk
        if(askInfs){
          for(var j = 0 ; j < askInfs.length; j++){
            if(!/\d+|\d+\.\d{1}/.test(askInfs[j].askPrice)){
              this.belongToast = {type: 'warning',text:'请输入正确的加价价格,仅支持整数和一位小数'}
              this.$refs['selectBelong'].isShow = true
              return false
            }
          }
        }
        if(menuAsk && askInfs.length){
          if(!/^\d+$/.test(menuAsk.askMin)){
            this.belongToast = {type: 'warning',text:'请输入正确的菜品做法最低选择数量,仅支持正整数'}
            this.$refs['selectBelong'].isShow = true
            return false
          }
          if(!/^\d+$/.test(menuAsk.askMax)){
            this.belongToast = {type: 'warning',text:'请输入正确的菜品做法最高选择数量,仅支持正整数'}
            this.$refs['selectBelong'].isShow = true
            return false
          }
          if(menuAsk.askMin > menuAsk.askMax){
            this.belongToast = {type: 'warning',text:'菜品做法做法最高选择数量不能低于最低选择数量'}
            this.$refs['selectBelong'].isShow = true
            return false
          }
        }
      }
      return true
    },
    //保存菜品要求
    async onUpdateDishRequire(data){
      console.log(data)
      var params = {}
      params.menuAskGp = this.formatSelectedDetail(data)
      var check = this.checkRequireArgs(params.menuAskGp)
      if(!check){
        return
      }
      console.log(params.menuAskGp)
      var result = {}
      if(this.singleOrBatchEdit == 'batch'){
        params.itemCds = this.selectedIds
        result = await saveBatchDishRequire(params)
        console.log(result)
      }else{
        params.itemCd = this.selectSingleId[0].itemCd
        result = await saveSingleDishRequire(params)
        console.log(result)
      }
      if(result.err.errNo == 0){
        this.belongToast = {type: 'success',text:'修改成功'}
        this.$refs['selectBelong'].isShow = true
      }else{
        this.belongToast = {type: 'error',text:'修改失败'}
        this.$refs['selectBelong'].isShow = true
      }
      this.$refs["secondOrderBatch"].isShow = false;
      this.$refs.multipleTable.clearSelection();
    },

    //批量上传菜品信息
    async getBatchUploadDishRequire(){
      if(this.batchUploadingStatus == 2){
        return
      }
      this.batchUploadingStatus = 2
      var result = await saveBatchSyncUploadDishRequest({})
      if(result.err.errNo == 0){
        this.belongToast = {type: 'success',text:'批量上传成功'}
        this.$refs['selectBelong'].isShow = true
      }else{
        this.belongToast = {type: 'error',text:'批量上传失败'}
        this.$refs['selectBelong'].isShow = true
      }
      this.batchUploadingStatus = 1
    },

    //获取批量菜品要求详细
    async getBatchDishRequire(){
      this.singleOrBatchEdit = 'batch'
      var askGpList = this.dishRequireGroup
      this.activeName = askGpList[0].askGpId

      if(this.publicDishRequire){
        this.dishRequireDetail =  this.initPublicRequireDetail(this.publicDishRequire)
      }else{
        var group = {}
        this.activeName = askGpList[0].askGpId
        for(var i = 0 ; i < askGpList.length;i++){
          var askGpId = askGpList[i].askGpId
          var firstDetailGroupDetail = await fetchDishRequireBatchDetail({askGpId})
          var obj = {}
          obj.askInfs = firstDetailGroupDetail.askInfo
          obj.askInfs = obj.askInfs.map((item,index) => {
            item.askPrice = 0
            item.selected = false
            return item
          })
          obj.askConfigInfos = { "askMin": 0,"askMax": 0}
          obj.askGpId = askGpId
          group[askGpId] = obj
        }
        console.log(group)
        this.publicDishRequire = group
        this.dishRequireDetail= group
      }

      this.onShowModal('secondOrderBatch')
    },

    onShowModal (type) {
      if (this.singleOrBatchEdit == 'batch' && !this.selectedIds.length) {
        this.belongToast = {type: 'warning',text:'请先选择要修改的菜品'}
        this.$refs['selectBelong'].isShow = true
      } else {
        this.$refs[type].isShow = true;
      }
    },
    onChangeSelection (items) {
      console.log(items)
      this.selectedIds = items.map(item => item.itemCd);
    },
    //格式化公共的要求详细
    initPublicRequireDetail(data){
      var obj = {}
      var clone = cloneObj(data)
      for(var key in clone){
        var subObj = clone[key]
        var arr = subObj.askInfs
        var minMax = subObj.askConfigInfos || {}
        if(arr && arr.constructor === Array){
          arr = arr.map((item,index) => {
            item.selected = false
            item.askPrice = 0
            return item
          })
        }
        var clickedCount = arr.filter((item) => {
          return item.selected
        }).length
        subObj.clickedCount = clickedCount  //选择的数量
        subObj.askInfs = arr
        minMax.askMin = 0
        minMax.askMax = 0
        subObj.askConfigInfos = minMax
        subObj.askGpId = key
        obj[key] = subObj
      }
      return obj
    },
    //公共的要求详细
    async publicRequireDetail(){
      if(this.publicDishRequire){
        return this.initPublicRequireDetail(this.publicDishRequire)
      }else{
        var group = {}
        //var DRGroup = await fetchDishRequireGroup()
        var askGpList = this.dishRequireGroup
        this.activeName = askGpList[0].askGpId
        for(var i = 0 ; i < askGpList.length;i++){
          var askGpId = askGpList[i].askGpId
          var firstDetailGroupDetail = await fetchDishRequireBatchDetail({askGpId})
          var obj = {}
          obj.askGpId = askGpId
          if(firstDetailGroupDetail.askInfo && firstDetailGroupDetail.askInfo){
            obj.askInfs = firstDetailGroupDetail.askInfo
            obj.askInfs = obj.askInfs.map((item,index) => {
              item.selected = false
              item.askPrice = 0
              return item
            })
          }else{
            obj.askInfs = []
          }
          obj.clickedCount = 0
          obj.askConfigInfos = { "askMin": 0,"askMax": 0}
          group[askGpId] = obj
        }
        this.publicDishRequire = group
        return group
      }
    },
    //处理数组到对象
    handleSingleDetail(data){
      var obj = {}
      data.map((item,index) => {
        obj[item.askGpId] = item
      })
      return obj
    },
    //编辑单个
    async onClickEdit(row){
      console.log(row)
      this.singleOrBatchEdit = 'single'
//      this.selectSingleId = [row.itemCd]
      this.selectSingleId = [row]
      var publicDetail = await this.publicRequireDetail()
      console.log(publicDetail)
      var singleResult = await fetchDishRequireSingleDetail({itemCd: row.itemCd})
      var singleDetail = this.handleSingleDetail(singleResult.askGpIds)

      for(var item in publicDetail){

        if(singleDetail[item]){
          var obj = {}
          var detail = singleDetail[item].askInfs
          publicDetail[item].clickedCount = detail.length || 0
          if(detail && detail.constructor === Array){
            detail.map((elem,index) => {
              obj[elem.askId] = elem
            })
          }
          publicDetail[item].askInfs = publicDetail[item].askInfs.map((elem,index) => {
            if(obj[elem.askId]){
              elem.askPrice = obj[elem.askId].askPrice
              elem.selected = true
            }else{
              elem.askPrice = 0
              elem.selected = false
            }
            return elem
          })
          publicDetail[item].askConfigInfos = singleDetail[item].askConfigInfos
          publicDetail[item].askGpId = singleDetail[item].askGpId
        }
      }

      this.dishRequireDetail = publicDetail

      this.onShowModal('secondOrderBatch')

    }
  }
};
</script>

<style lang="scss">
.second-point {
  padding: 15px;
  .btn-wrapper-flex{
    display: flex;
    justify-content: space-between;
  }
  .btn-wrapper {
    padding: 10px;
    .el-button {
      height: 36px;
    }
    .el-cascader {
      .el-input {
        display: none;
      }
    }
    .right-btns {
      float: right;
      display: block;
    }
    .alignCenter{
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .el-table .el-table__body .cell {
    display: inline-block;
  }

  .option-wrap {
    height: 45px;
    vertical-align: middle;

    .menu-options {
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
  }

  .btn-upload {
    display: inline-block;
  }

  .no-select {
    .el-table__body-wrapper,
    .el-table__header-wrapper {
      tbody > tr,
      thead > tr {
        :first-child {
          border-right: 0;
        }
      }
    }
  }

  .table-row-link {
    cursor: pointer;
    color: #409EFF;
  }
}

.el-cascader-menus {
  margin-top: 15px;
}
</style>
