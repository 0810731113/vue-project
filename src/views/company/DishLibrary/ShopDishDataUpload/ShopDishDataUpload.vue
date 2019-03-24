<template>
  <div class="shop-dish-data-upload-container">
    <el-table
      ref="multipleTable"
      :data="dataList"
      border>
      <el-table-column prop="shopGuid" align="center" label="门店ID" min-width="80px"/>
      <el-table-column prop="shopName" align="center" label="门店名称" min-width="180px"/>
      <el-table-column prop="itemCount" align="center" label="最近设备同步时间" >
        <template slot-scope="scope">
          {{ scope.row.pushMydDate || '- -' }}
        </template>
      </el-table-column>

      <el-table-column  align="center" label="同步数据到设备端" >
        <template slot-scope="scope">
          <el-button type="primary" plain @click="synchronousDataToDevice(scope.row)">同步</el-button>
          <!--<el-button  content="同步" @click="synchronousDataToDevice(scope.row)" />-->
        </template>
      </el-table-column>
      <el-table-column prop="itemCount" align="center" label="同步结果" >
        <template slot-scope="scope">
          <div v-if="scope.row.pushMydResult == '成功'">成功</div>
          <div v-else-if="scope.row.pushMydResult == '失败'" style="color:red;">失败</div>
          <div v-else>- -</div>
        </template>
      </el-table-column>
      <el-table-column prop="itemCount" align="center" label="最近上传网络订单时间" >
        <template slot-scope="scope">
          {{ scope.row.pushNetOrderDate || '- -' }}
        </template>
      </el-table-column>
      <el-table-column  align="center" label="上传菜品到网络订单" >
        <template slot-scope="scope">
          <el-button type="warning" plain @click="uploadDishToNetOrder(scope.row)">上传</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="itemCount" align="center" label="上传结果" >
        <template slot-scope="scope">
          <div v-if="scope.row.pushNetOrderResult == '成功'">成功</div>
          <div v-else-if="scope.row.pushNetOrderResult == '失败'" style="color:red;">失败</div>
          <div v-else>- -</div>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="最近上传历史记录" >
        <template slot-scope="scope">
          <el-button type="info" plain @click="nearestUploadRecord(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Toast
      ref='selectEmptyDishWarn'
      :content="toastInfo.text"
      :timeout="2000"
      :type="toastInfo.type"
    />
    <el-dialog title="导入信息" :visible.sync="uploadInfoDialog" center>
      <div v-html="uploadOrderInfo">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="uploadInfoDialog = false">关 闭</el-button>
        <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
      </div>
    </el-dialog>
    <el-dialog title="上传信息" :visible.sync="dialogFormVisible" center>

      <div v-html="historyRecordInfo">
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">关 闭</el-button>
        <!--<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>-->
      </div>
    </el-dialog>


  </div>
</template>
<script>
  import { OK } from 'constant/statusCode';
  import { mapActions, mapState, mapMutations } from 'vuex';
  import { Pagination, Popup, Toast, MwButton } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import {cloneObj} from '../../../../utils/someUsefulUtil'
  import {synchronousDataToDevice,uploadDishToNetOrder,resentlyUploadRecord} from '../../../../api/dishLibrary'

  export default {
    components: { Pagination, Popup, Toast, MwButton },
    name: 'ShopDishDataUpload',
    data () {
      return {
        synchronousInfo:'',
        uploadOrderInfo:'', //上传返回信息
        historyRecordInfo:'', //历史记录信息
        toastInfo:{
          text:'',  //文字
          type:'' //类型:  成功 警告  错误
        },
        dialogFormVisible:false,  //弹框开关
        uploadInfoDialog: false,  //上传信息对话框
      };
    },
    async created () {
      this.getTableList()
    },
    computed: {
      ...mapState({
        dataList: state => state.dishLibrary.shopDishDataUpload.dataList,

      }),
      dataListCopy(){
        var dataList = this.$store.state.dishLibrary.shopDishDataUpload.dataList
        console.log(dataList)
        return cloneObj(dataList) || []

      }
    },
    methods: {
      ...mapActions([
        'fetchShopDishDataUploadList',
      ]),
      ...mapMutations([
//        'CHANGE_COOK_VISIBLE'
      ]),
      getTableList(){
        this.fetchShopDishDataUploadList({
          shopKind: 3,
          shopStatusList:[2,3],
          treeType:10,
        });
      },
      async switchDishMenuStatus(row,event){
        const {pageSize,pageIndex} = this
        console.log(row,event)
        var params = {

        }
        var result = await switchDishMenuStatus(params)
        if(result.err.errNo == 0){
          this.toastInfo = {text:'修改成功' , type: 'success'}
          this.$refs['selectEmptyDishWarn'].isShow = true

        }else{
          this.toastInfo = {text:'修改失败' , type: 'error'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }
      },
      //同步数据到设备端
      async synchronousDataToDevice(row){
        var params = {
          shopKind: 3,
          pushShopGuid:row.shopGuid //需要推送的门店
        }
        var result = await synchronousDataToDevice(params)
        console.log(result)
        if(result.err.errNo == 0){
          this.toastInfo = {text:'更新数据成功' , type: 'success'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }else{
          this.toastInfo = {text:'操作失败,请稍后再试' , type: 'error'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }
        this.getTableList()

      },
      //上传菜品到网络订单
      async uploadDishToNetOrder(row){
        var params = {
          shopKind: 3,
          pushShopGuid:row.shopGuid //需要推送的门店
        }
        var result = await uploadDishToNetOrder(params)
        console.log(result)
        if(result.err.errNo == 0){
          var str = ''
          str += result.data ? '<h4 style="color:#e6a23c">' + result.data +'</h4>' : ''
          for(var key in result){
            if(result[key] && /msg$/i.test(key)){
              str += result[key]
            }
          }
          if(!str){
            str = '<h2 style="color:#cccccc;textAlign: center;">暂无相关信息</h2>'
          }
          this.uploadOrderInfo = str
          this.uploadInfoDialog = true
        }else{
          this.toastInfo = {text:'操作失败,请稍后再试' , type: 'error'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }
        this.getTableList()
      },
      //最近上传历史记录
      async nearestUploadRecord(row){
        var params = {
          shopKind: 3,
          pushShopGuid:row.shopGuid //需要推送的门店
        }
        var result = await resentlyUploadRecord(params)
        console.log(result)
        if(result.err.errNo == 0){
          var str = ''
          str += result.data ? '<h4 style="color:#e6a23c">' + result.data +'</h4>' : ''
          for(var key in result ){
            //var content = result[item] ? JSON.parse(result[item]) : ''
//            var content = result[item] ? result[item] : ''
//            if(content && Object.prototype.toString.call(content) === '[object String]'){
//              str+= content
//            }
            if(result[key] && /msg$/i.test(key)){
              str += result[key]
            }
          }
          if(!str){
            str = '<h2 style="color:#cccccc;textAlign: center;">暂无相关信息</h2>'
          }
          this.historyRecordInfo = str
          this.dialogFormVisible = true
        }else{
          this.toastInfo = {text:'操作失败,请稍后再试' , type: 'error'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }

      },

    }
  };
</script>
<style lang="scss">
  .shop-dish-data-upload-container {
    padding: 20px;
  }
</style>
