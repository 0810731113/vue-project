<template>
  <el-dialog custom-class="base-modal menu-setting" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">批量操作</div>
    <div v-if="singleOrBatchEdit == 'batch'" class="select-count">已选择{{ data.length }}个菜品</div>
    <div v-if="singleOrBatchEdit == 'single'" class="select-count">菜品: {{ !!data[0] && data[0].itemName }}</div>
    <div class="margin-outer">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--<el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>-->
        <el-tab-pane
          v-for="(item, index) in dishRequireGroup"
          :key="index"
          :label="item.askGpName"
          :name="item.askGpId">
          <div v-if="dishRequireDetail[item.askGpId]">
            <div class="item-line"
              v-for="(elem, idx) in dishRequireDetail[item.askGpId].askInfs"
              :key="idx">
              <div class="search-item">
                <div class="left">
                  <el-checkbox v-model="elem.selected" @change="selectDishRequire(dishRequireDetail[item.askGpId],elem,idx)">{{elem.askName}}</el-checkbox>
                </div>
                <div :class="{middle: true, activeText: elem.selected}">加价</div>
                <el-input v-model="elem.askPrice" :disabled="!elem.selected" placeholder="请输入加价价格"></el-input>
              </div>
            </div>
          </div>
          <div v-if="!(dishRequireDetail[item.askGpId] && dishRequireDetail[item.askGpId].askInfs.length)" class="empty-content">当前要求分组下没有设置选项</div>
          <div>
            <div class="item-line"
              v-if="dishRequireDetail[item.askGpId] && dishRequireDetail[item.askGpId].clickedCount">
              <div class="search-item">
                <div class="left">菜品做法最低选择数量</div>
                <!--<div class="middle"></div>-->
                <el-input-number v-model="dishRequireDetail[item.askGpId].askConfigInfos.askMin"  :min="0" label=""></el-input-number>
              </div>
              <div class="search-item">
                <div class="left">菜品做法最高选择数量</div>
                <!--<div class="middle"></div>-->
                <el-input-number v-model="dishRequireDetail[item.askGpId].askConfigInfos.askMax"  :min="0" label=""></el-input-number>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <span slot="footer" class="modal-footer">
      <el-button type="primary" class="btn-submit" @click="onSubmit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import {fetchDishRequireGroup,fetchDishRequireBatchDetail,fetchDishRequireSingleDetail} from 'api/dishes'

export default {
  name: 'SecondOrderBatch',
  props: ['data','onUpdateDishRequire','singleOrBatchEdit','dishRequireDetail'],
  data () {
    return {
      isShow: false,
      activeName: null,
      dishRequireBatchObj:{ //批量设置详细
//        '0':{
//          askGpId: 1,
//          askInfo:[{
//            "askId": "494",
//            "askName": "不制作"
//            },
//            {
//              "askId": "495",
//              "askName": "*加急*"
//            }
//          ],
//          askConfigInfos: {
//            "askMin": null,
//            "askMax": null
//          }
//        }
      },
    };
  },
  created(){
    //this.initData();
  },
  mounted(){
    console.log(this.dishRequireGroup)
    //this.dishRequireBatchObj[this.dishRequireGroup[0].askGpId] = this.firstBatchDetail
  },
  computed: mapState({
    dishRequireGroup: state => state.dishes.secondpoint.dishRequireGroup,
//    dishRequireBatch: state => state.dishes.secondpoint.dishRequireBatch,
    dishRequireSingle: state => state.dishes.secondpoint.dishRequireSingle,
  }),
  watch: {
    isShow () {
      if (this.isShow) {
        this.activeName = this.dishRequireGroup[0].askGpId
      }
    },

  },
  methods: {
    ...mapActions([
      'fetchDishRequireGroupListSP',
      'fetchSingleDishRequireSP',
//      'fetchBatchDishRequireSP',
    ]),
    async initData () {
      this.dishRequireBatchObj = {}
      var group = {}
      var DRGroup = await fetchDishRequireGroup()
      this.activeName = DRGroup.askGpList[0].askGpId
      for(var i = 0 ; i < DRGroup.askGpList.length;i++){
        var askGpId = DRGroup.askGpList[i].askGpId
        var firstDetailGroupDetail = await fetchDishRequireBatchDetail({askGpId})
        var obj = {}
        obj.askInfo = firstDetailGroupDetail.askInfo
        obj.askInfo = obj.askInfo.map((item,index) => {
          item.askPrice = 0
          return item
        })
        obj.askConfigInfos = { "askMin": 0,"askMax": 0}
        group[askGpId] = obj
      }
      console.log(group)
      this.dishRequireBatchObj= group
    },

    async onSubmit () {
      await this.onUpdateDishRequire(this.dishRequireDetail);
      //this.onShowOrHideModal();
    },
    onShowOrHideModal () {
      this.isShow = false;
      //this.initData();
    },
    async handleClick(tab, event) { //点击弹框tab

    },
    //勾选设置菜品要求
    selectDishRequire(obj,item,index){
      console.log(obj)
      console.log(item)
      console.log(index)
      var selectedCount = obj.askInfs.filter((item) => {
        return item.selected
      }).length || 0
      obj.clickedCount = selectedCount

    },


  }
};
</script>

<style lang="scss">
.menu-setting {
  max-width: 75%;
  white-space: nowrap;

  .select-count {
    padding-bottom: 15px;
    /*margin-left: 30px;*/
    font-size: 16px;
  }

  .search-item{
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 52px;
    .left{
      width: 180px;
      font-size: 14px;
      font-weight: 400;
      padding-left: 24px;
    }
    .middle{
      width: 100px;
      font-size: 14px;
      color: #cccccc;
      text-align: right;
      padding-right: 12px;
    }
    .activeText{
      color: #000000;
    }
    .el-input{
      //width: 240px;
    }
  }
  .input-number-box{
    .el-input{
      //width: 120px;
    }
  }
  .empty-content{
    font-size: 16px;
    color:#cccccc;
    padding: 24px;
    text-align: center;

  }

}
</style>
