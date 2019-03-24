<template>
  <div class="upload-bill-manager-main">
    <!--<el-form :inline="true" :model="searchForm" class="search-bar">-->
      <!--<el-form-item label="">-->
        <!--<el-date-picker-->
          <!--v-model="searchForm.date"-->
          <!--placeholder="选择日期"-->
          <!--:editable="false">-->
        <!--</el-date-picker>-->
      <!--</el-form-item>-->
      <!--<div style="line-height: 40px; display: inline-block">-->
        <!--<el-button class="btn-search" @click="onClickSearch">搜索</el-button>-->
        <!--<el-button class="btn-reset" @click="onClickReset">重置</el-button>-->
      <!--</div>-->
    <!--</el-form>-->
    <div class="division-line"></div>
    <!--<el-row class="operation-button">-->
      <!--<el-button class="btn-primary" :disabled="isMaintain" @click="onUploadBill">上传账单</el-button>-->
    <!--</el-row>-->
    <el-table ref="billTable" :data="billList" border >
      <el-table-column prop="accountBookId" min-width="50px" label="编号" />
      <el-table-column prop="accountBookName" align="center" label="统计方式"/>
      <el-table-column prop="apiName" align="center" label="关联协议" />
      <el-table-column prop="uploadTime" align="center" label="上传方式">
        <template slot-scope="scope">
          {{getUploadLabel(scope.row.uploadType)}}
        </template>
      </el-table-column>
      <el-table-column prop="uploadType" align="center" label="自动上传时间">
        <template slot-scope="scope">
          {{scope.row.uploadTime || '- -'}}
        </template>
      </el-table-column>
      <el-table-column prop="" align="center" label="操作">
        <template slot-scope="scope">
          <!--{{ getUploadStatus(scope.row) }}-->
          <el-button class="btn-cancel" @click="() => setUploadProgram(scope.row)">设置</el-button>
          <el-button class="btn-submit" v-if="scope.row.accountBookName === 'B' && scope.row.uploadType == 2" @click="goPrevUploadBill(scope.row)">手动上传</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<pagination-->
      <!--:onChangeSize="onChangeSize"-->
      <!--:onChangeCurrent="onChangeCurrent"-->
      <!--:currentPage="billistupload.pageIndex"-->
      <!--:pageSize="billistupload.pageSize"-->
      <!--:totalCount="billistupload.recordCount"-->
      <!--layout="slot, ->, prev, pager, next, sizes"-->
    <!--&gt;-->
    <!--</pagination>-->
    <Toast
      ref='selectEmptyDishWarn'
      :content="toastInfo.text"
      :timeout="2000"
      :type="toastInfo.type"
    />
    <popup
      ref="uploadSettingModal"
      type="submit"
      size="large"
      title="上传方案设置"
      okText="保存"
      :handleOk="uploadSettingSubmit"
    >
      <div slot="content">
        <el-form :model="form" class="mw-form edit-or-add-pop-up" ref="form" :rules="rules"  label-width="160px">
          <el-form-item label="关联协议">
            <el-select v-model="form.apiType" placeholder="请选择" >
              <el-option
                v-for="(item,index) in getBillApiType"
                :key="index"
                :label="item.apiName"
                :value="item.guid"
                class="width-full"/>
            </el-select>
          </el-form-item>
          <el-form-item label="上传方式">
            <el-select v-model="form.uploadType" placeholder="请选择" >
              <el-option
                v-for="item in uploadTypeList"
                :key="item.uploadType"
                :label="item.label"
                :value="item.uploadType"
                class="width-full"/>
            </el-select>
          </el-form-item>
          <el-form-item label="自动上传时间" v-if="(statisticsType == 'A' || statisticsType == 'B') && form.uploadType == 1">
            <el-select v-model="form.uploadTime" placeholder="请选择" >
              <el-option
                v-for="(item,index) in uploadTimeList"
                :key="index"
                :label="item"
                :value="item"
                class="width-full"/>
            </el-select>
          </el-form-item>
          <el-form-item label="自动上传数量" v-if="statisticsType == 'B' && form.uploadType == 1">
            <el-input-number
              :min="0"
              v-model="form.dataPercent"
              controls-position="right"
            />
            %
          </el-form-item>
        </el-form>
      </div>
    </popup>

  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Pagination, Popup, Toast } from 'components';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { INPUT_MAX_LENGTH } from 'constant/constants';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import { validateIpAndMac, validateNumber, validateGeneralName, validatePrinterNumber, validate433Printer } from 'utils/validateUtil';
  import { fetchNewBillDetail, updateNewBillDetail} from 'api/bill';
  import fecha from 'fecha';

  export default{
    name: 'UploadBillManager',
    components: {
      Pagination,
      Popup,
      Toast
    },
    data () {
      return {
        form:{
          apiType:'', //--协议类型
          uploadType: 1, //--上传类型
          uploadTime:"18:00:00", //--上传时间
          dataPercent:50, //--上传数量
        },
        statisticsType:'',  //统计方式
        currRowInfo:{},
        uploadTimeList:['23:00:00','06:00:00','02:00:00'],  //  上传时间列表
        uploadTypeList:[
          {
            uploadType:1,
            label:'自动上传',
          },
          {
            uploadType:2,
            label:'手动上传',
          },
          {
            uploadType:3,
            label:'实时上传',
          }
        ],
        rules: {
//          printerName: [
//            { required: true, message: '这是必填字段', trigger: ['blur', 'change'] },
//            { validator: validateNumber, trigger: ['blur', 'change'] }
//          ],
        },
        toastInfo:{
          text:'',  //文字
          type:'' //类型:  成功 警告  错误
        },
      };
    },
    async created () {
      await this.fetchNewBillList();
    },
    mounted(){
      //this.$refs['uploadSettingModal'].isShow = true
    },
    computed: {
      ...mapState({
        billList: state => state.bill.billManagerList.billList,
        getBillApiType: state => state.bill.billManagerList.getBillApiType,

      })
    },
    methods: {
      ...mapActions([
        'fetchNewBillList',
        'fetchNewBillApiTypeList',
      ]),
      //
      getUploadLabel(id){
        var index =  this.uploadTypeList.findIndex((item) => {return item.uploadType == id})
        return index >= 0  ? this.uploadTypeList[index].label : "- -"
      },
      onClickReset () {
        this.searchForm = {
          date: new Date()
        };
      },
      async setUploadProgram(row){
        console.log(row)
        this.currRowInfo = row
        this.statisticsType = row.accountBookName
        var params = {
          accountBookId: row.accountBookId
        }

        await this.fetchNewBillApiTypeList()
        var result = await fetchNewBillDetail(params)
        console.log(result)
        if(result.err.errNo == 0 && result.billDeatail){
          this.form.apiType = result.billDeatail.interfaceMid
          this.form.uploadType = result.billDeatail.uploadType
          this.form.uploadTime = result.billDeatail.uploadTime
          this.form.dataPercent = result.billDeatail.dataPercent
          this.$refs['uploadSettingModal'].isShow = true
          var timeArrIndex = this.uploadTimeList.findIndex((item) => {
            return item == result.billDeatail.uploadTime
          })
          if(timeArrIndex < 0 && result.billDeatail.uploadTime){
            this.uploadTimeList.unshift(result.billDeatail.uploadTime)
          }
        }

      },
      handleSelectionChange (val) {
        this.multipleSelection = val;
      },

      //跳回到原来的位置
      goPrevUploadBill(row){
        this.$router.push({path: `/myd/bill/uploadbill/${row.accountBookId}`, query: {accountBookId: row.accountBookId, accountBookName: row.accountBookName}});
      },
      async uploadSettingSubmit(){  //提交上传账单设置
        //console.log('提交上传账单设置')
        const {apiType, uploadType, uploadTime,dataPercent} = this.form
        var row = this.statisticsType
        if(row === 'B'){
          if(!/\d{1,3}|\d{1,2}(\.\d{1,2})?/.test(dataPercent) || dataPercent < 0 || dataPercent >100   ){
            this.toastInfo = {text:'请输入正确的上传数量' , type: 'error'}
            this.$refs['selectEmptyDishWarn'].isShow = true
            return
          }
        }

        var param = {
          billSetVO:{
            "interfaceMid":apiType, //--协议类型
            "uploadType":uploadType, //--上传类型
            "uploadTime":uploadTime, //--上传时间
            "dataPercent":dataPercent, //--上传数量
          }
        }

        param.billSetVO.accountBookId = this.currRowInfo.accountBookId
        param.billSetVO.accountBookName = this.currRowInfo.accountBookName

        var result = await updateNewBillDetail(param)
        console.log(result)
        if(result.err.errNo == 0){
          this.$refs['uploadSettingModal'].isShow = false
          await this.fetchNewBillList();
        }else{
          console.log("上传失败")
          this.toastInfo = {text:'保存失败' , type: 'error'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }

      },
    },
  };
</script>

<style lang="scss">
  .upload-bill-manager-main {
    padding: 15px;
    .edit-or-add-pop-up {
      width: 80% !important;
    }
    .search-bar {
      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .operation-button {
      padding: 10px 0;
    }
  }
</style>
