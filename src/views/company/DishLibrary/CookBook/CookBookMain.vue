<template>
  <div class="cook-book-container">
    <el-button :disabled="isMaintain" class="btn-add btn-bottom" icon="el-icon-plus" @click="onAddClick">新增</el-button>
    <!-- <el-button :disabled="isMaintain" class="btn-add btn-bottom" @click="onShowConfirmCopyModal">复制</el-button> -->
    <el-table
      ref="multipleTable"
      :data="copyCookBookList"
      border>
      <el-table-column prop="cookid" align="center" label="菜单编号" min-width="10%"/>
      <el-table-column prop="cookname" align="center" label="菜单名称" min-width="20%"/>
      <el-table-column prop="itemCount" align="center" label="菜品数量" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.itemCount || '0' }}
        </template>
      </el-table-column>
      <el-table-column prop="setCount" align="center" label="套餐数量" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.setCount || '0' }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="shopCount" align="center" label="使用门店数量" min-width="10%">
        <template slot-scope="scope">
          <a @click="showTree" href="javascript:;">{{ scope.row.shopCount || '0' }}&nbsp;</a>个
          {{ scope.row.shopCount || '0' }}个
        </template>
      </el-table-column> -->
      <el-table-column prop="status" align="center" label="状态" min-width="10%">
        <template slot-scope="scope">
          <!--{{ scope.row.status == OK ? '正常' : '禁用' }}-->
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#cccccc"
            active-text="启用"
            inactive-text="禁用"
            @change="(event) => switchDishMenuStatus(scope.row,event)"
            :active-value="1"
            :inactive-value="9">
          </el-switch>

        </template>
      </el-table-column>
      <el-table-column  align="center" label="操作" min-width="20%">
        <template slot-scope="scope">
          <mw-button class="btn-copy" :disabled="isMaintain" content="复制" @click="onShowConfirmCopyModal(scope.row)" />
          <mw-button class="btn-edit" :disabled="isMaintain" content="编辑" @click="onEditClick(scope.row)" />
          <mw-button class="btn-delete" :disabled="isMaintain" content="删除"  @click="onShowConfirmDeleteModal(scope.row)" />
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :totalCount="recordCount"
      :currentPage="pageIndex"
      :pageSize="pageSize"
      :onChangeSize="onPageSizeChange"
      :onChangeCurrent="onChangeCurrent">
    </Pagination>
    <Popup
      title="删除操作"
      tips="您确认要删除此数据吗?"
      :handleOk="onDeleteClick"
      ref="deleteModal"/>
    <Popup
      title="复制菜单"
      tips="是否需要复制本条记录?"
      :handleOk="onCopyClick"
      ref="copyModal"/>
    <Toast
      ref='toast'
      content="请选择需要复制的门店!"
      :timeout="2000"
      type="warning"/>
    <toast
      ref='selectBelong'
      :content="belongToast.text"
      :timeout="2000"
      :type="belongToast.type"
    />
    <el-dialog :visible.sync="treeVisible">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        default-expand-all >
      </el-tree>
    </el-dialog>
    <cook-book
      :toastWarning = "toastWarning"
      v-if="cookVisible"
      :toCookBookGuId='toCookBookGuId'
      :refreshTableFromServer="refreshTableFromServer" />
    <Toast
      ref='selectEmptyDishWarn'
      :content="toastInfo.text"
      :timeout="2000"
      :type="toastInfo.type"
    />
  </div>
</template>
<script>
  import { OK } from 'constant/statusCode';
  import { mapActions, mapState, mapMutations } from 'vuex';
  import { Pagination, Popup, Toast, MwButton } from 'components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import cookBook from './CookBook.vue';
  import {cloneObj} from '../../../../utils/someUsefulUtil'
  import {switchDishMenuStatus} from '../../../../api/dishLibrary'

  export default {
    components: { Pagination, Popup, Toast, MwButton, cookBook },
    name: 'CookBookMain',
    data () {
      return {
        toCookBookGuId: null,       // 传递给CookBook的cookGuid
        OK,
        cookGuid: '',
        selectedItem: null,
        isMaintain: !checkMaintainRight(this),
        defaultProps: {
          children: 'children',
          label: 'itemName'
        },
        treeVisible: false,
        belongToast:{
          text:'请选择',
          type:'warning',
        },
        //copyCookBookList:[] //复制表格数据
        toastInfo:{
          text:'',  //文字
          type:'' //类型:  成功 警告  错误
        },
      };
    },
    async created () {
      await this.refreshTableFromServer();
    },
    computed: {
      ...mapState({
        cookBookList: state => state.dishLibrary.cookBook.cookBookList,
        pageIndex: state => state.dishLibrary.cookBook.pageIndex,
        pageSize: state => state.dishLibrary.cookBook.pageSize,
        recordCount: state => state.dishLibrary.cookBook.recordCount,
        cookVisible: state => state.dishLibrary.cookBook.cookVisible,
        treeData: state => state.dishLibrary.cookBook.treeData,
      }),
      copyCookBookList(){
        return cloneObj(this.cookBookList) || []
      }
    },
    methods: {
      ...mapActions([
        'fetchCookBookList',
        'deleteCookBookItem',
        'copyCookBookItem',
        'fetchCompanyDetails'
      ]),
      ...mapMutations([
        'CHANGE_COOK_VISIBLE'
      ]),
      async switchDishMenuStatus(row,event){
        const {pageSize,pageIndex} = this
        console.log(row,event)
        var params = {
          "shopKind" : 3,
          "cookGuid": row.cookGuid,
          "status":event,
        }
        var result = await switchDishMenuStatus(params)
        if(result.err.errNo == 0){
          this.toastInfo = {text:'修改成功' , type: 'success'}
          this.$refs['selectEmptyDishWarn'].isShow = true
          //this.fetchCookBookList({ pageSize, pageIndex });
        }else{
          this.toastInfo = {text:'修改失败' , type: 'error'}
          this.$refs['selectEmptyDishWarn'].isShow = true
        }
      },
      onPageSizeChange (pageSize) {
        const { pageIndex } = this;
        this.fetchCookBookList({ pageSize, pageIndex });
      },
      onChangeCurrent (pageIndex) {
        const { pageSize } = this;
        this.fetchCookBookList({ pageSize, pageIndex });
      },
      onAddClick () {
        this.toCookBookGuId = '';
        this.CHANGE_COOK_VISIBLE();
      },
      toastWarning(info){ //警告信息
        this.belongToast = info
        this.$refs['selectBelong'].isShow = true
      },
      async onCopyClick () {
        await this.copyCookBookItem({ cookGuid: this.selectedItem.cookGuid });
        await this.refreshTableFromServer();
      },
      onEditClick (row) {
        this.toCookBookGuId = row.cookGuid;
        this.CHANGE_COOK_VISIBLE();
        // this.$router.push(`/dishes/cookbook/edit/${row.cookGuid}`);
      },
      async onDeleteClick () {
        const { cookGuid } = this;
        await this.deleteCookBookItem({ cookGuid });
        await this.refreshTableFromServer();
      },
      onShowConfirmDeleteModal (row) {
        this.cookGuid = row.cookGuid;
        this.$refs.deleteModal.isShow = true;
      },
      onShowConfirmCopyModal (row) {
        this.selectedItem = row;
        this.$refs.copyModal.isShow = true;
      },
      async refreshTableFromServer () {
        const { pageIndex, pageSize } = this;
        await this.fetchCookBookList({ pageIndex, pageSize });
      }
      // 展示下发树组件
      // async showTree () {
      //   await this.fetchCompanyDetails({ rootId: null, treeType: 10 });
      //   this.treeVisible = true;
      // }
    }
  };
</script>
<style lang="scss">
  .cook-book-container {
    padding: 20px;
  }
</style>
