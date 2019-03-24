<template>
  <div class="shop-list-main">
    <el-form :inline="true" ref="search" :model="searchForm" class="search-bar">
      <el-form-item label="门店ID:" prop="s_shopID">
        <el-input v-model="searchForm.s_shopID" placeholder="门店ID" />
      </el-form-item>
      <el-form-item label="门店名称:" prop="s_shopName">
        <el-input v-model="searchForm.s_shopName" placeholder="门店名称" />
      </el-form-item>
      <el-form-item label="门店分组:" prop="s_shopGroupId">
        <el-select v-model="searchForm.s_shopGroupId" class="group-select">
          <el-option label="全部" :value="null" />
          <el-option
            v-for="item in shopGroupList"
            :key="item.shopGroupId"
            :label="item.shopGroupName"
            :value="item.shopGroupId" />
        </el-select>
      </el-form-item>
      <el-form-item label="门店状态:">
        <el-select v-model="searchForm.s_status" class="group-select">
          <el-option label="全部" :value="null" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="9" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-search" @click="onClickSearch">搜索</el-button>
        <el-button class="btn-reset" @click="onClickReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="division-line"></div>
    <div class="content">
      <div class="left">
        <div class="required">(*点击分组或者门店进行操作)</div>
        <el-tree
          v-loading="loading"
          :data="shopTree"
          node-key="itemId"
          :expand-on-click-node="false"
          :props="defaultProps"
          :default-expand-all="true"
          :highlight-current="true"
          @node-click="onNodeClick"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-drag-end="handleDragEnd"
        >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span :class="data.children ? 'node' : 'leaf'">{{ node.label }}<span v-if="data.children">({{getShopIdsFromNode(data).length}})</span></span>
            <span class="node-btn-bar" :class="{ selected: data.itemId === selectedTreeNodeData.itemId}">
              <el-button class='btn-up'  v-if="+data.itemType !== 0" @click="() => onMoveUp(node, data)"></el-button>
              <el-button class='btn-down' v-if="+data.itemType !== 0" @click="() => onMoveDown(node, data)"></el-button>
              <el-button class='btn-add-icon' v-if="+data.itemType !== SHOP_NODE " @click="() => showNodeOperationModal(node, data, 'addNewNodeModal')"></el-button>
              <el-button class='btn-edit' v-if="+data.itemType !== SHOP_NODE && +data.itemType !== 0"   @click="() => showNodeOperationModal(node, data, 'updateNodeModal')"></el-button>
              <el-button class='btn-delete' v-if="+data.itemType !== SHOP_NODE && +data.itemType !== 0" @click="() => showNodeOperationModal(node, data, 'deleteNodeConfirmModal')"></el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="right" v-if="+selectedTreeNodeData.itemType === SHOP_NODE">
        <div class="shop-detail">
          <div class="header">
            <div class="btn-group">
              <form :action='actionUrl' class="manage-shop" method="post" target="nm_iframe" v-if="+shopDetail.foodTradeId !== 1">
                <input :value="shopDetail.shopGUID" name="fsShopGUID"/>
                <mw-button size="small" class="btn-shop" :disabled="isMaintain" content="管理门店" nativeType="submit" @click="refreshParent(shopDetail)" />
              </form>
              <!-- <mw-button
                size="small"
                :content="shopDetail.status == FORBIDDEN ? '启用' : '禁用'"
                :class="shopDetail.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
                @click="onClickChangeStatus(shopDetail)"
                :disabled="isMaintain"
              /> -->
              <mw-button size="small" class="btn-shop" :disabled="isMaintain" content="管理门店" @click="refreshParent(shopDetail)" v-if="+shopDetail.foodTradeId === 1"/>
              <mw-button size="small" :disabled="isMaintain" class="btn-update" @click="onClickRenew(shopDetail)" content="更新" />
              <mw-button size="small" :disabled="isMaintain" class="btn-edit" @click="onClickEdit(shopDetail)" content="编辑" />
            </div>
            <h3>门店信息</h3>
          </div>
          <div class="content">
            <div class="form-item">
              <label>门店ID:</label>
              <label>{{shopDetail.shopGUID}}</label>
            </div>
            <div class="form-item">
              <label>门店说明:</label>
              <label>{{shopDetail.shopDesc}}</label>
            </div>
            <div class="form-item">
              <label>门店名称:</label>
              <label>{{shopDetail.shopName}}</label>
            </div>
            <div class="form-item">
              <label>餐饮业态:</label>
              <label>{{+shopDetail.foodTradeId === 1 ? '快餐': +shopDetail.foodTradeId === 2 ? '正餐' : '轻正餐'}}</label>
            </div>
            <div class="form-item">
              <label>门店代码:</label>
              <label>{{shopDetail.shopId}}</label>
            </div>
            <div class="form-item">
              <label>许可号:</label>
              <label>{{shopDetail.licenceCode}}</label>
            </div>
            <div class="form-item">
              <label>门店别名:</label>
              <label>{{shopDetail.shopAlias}}</label>
            </div>
            <div class="form-item">
              <label>备注:</label>
              <label>{{shopDetail.note}}</label>
            </div>
            <div class="form-item">
              <label>邮箱:</label>
              <label>{{shopDetail.email}}</label>
            </div>
            <div class="form-item">
              <label>外卖:</label>
              <label>{{+shopDetail.isTakeAway === 0 ? '不开启' : '开启'}}</label>
            </div>
            <div class="form-item">
              <label>电话:</label>
              <label>{{shopDetail.tel}}</label>
            </div>
            <div class="form-item">
              <label>状态:</label>
              <label>{{shopDetail.status == 1 ? '开启' : "禁用" }}</label>
            </div>
            <div class="form-item">
              <label>传真:</label>
              <label>{{shopDetail.fax}}</label>
            </div>
            <div class="form-item">
              <label>所属区域:</label>
              <label>{{shopDetail.provinceName}}&nbsp;{{shopDetail.cityName}}&nbsp;{{shopDetail.districtName}}</label>
            </div>
            <div class="form-item">
              <label>地址:</label>
              <label>{{shopDetail.addr}}</label>
            </div>
            <div class="form-item">
              <label>邮编:</label>
              <label>{{shopDetail.postal}}</label>
            </div>
            <div class="form-item">
              <label>联络人:</label>
              <label>{{shopDetail.contact}}</label>
            </div>
            <div class="form-item">
              <label>联络人手机:</label>
              <label>{{shopDetail.cellphoneCt}}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="right" v-else>
        <el-table :data="manageShopList" border class="mw-table">
          <el-table-column prop="shopId" align="center" class-name="table-auto" label="门店ID" min-width="25%" />
          <el-table-column prop="shopName" align="center" class-name="table-auto" label="门店名称" min-width="25%" />
          <el-table-column prop="provinceName" align="center" label="地区" min-width="25%" >
            <template slot-scope="scope">
              <div>{{scope.row.provinceName}}<br/>
                {{scope.row.cityName}}<br/>
                {{scope.row.districtName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态" min-width="25%" >
            <template slot-scope="scope">
              <div>{{ getStatusText(scope.row) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" min-width="25%">
            <template slot-scope="scope">
              <div>
                <form :action="actionUrl" class="manage-shop" method="post" target="nm_iframe" v-if="+scope.row.foodTradeId !== 1">
                  <input :value="scope.row.shopId" name="fsShopGUID"/>
                  <mw-button size="small" class="btn-shop" :disabled="isMaintain" content="管理门店" nativeType="submit" @click="refreshParent(scope.row)" />
                </form>
                <!-- <mw-button
                  size="small"
                  :content="scope.row.status == FORBIDDEN ? '启用' : '禁用'"
                  :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
                  @click="onClickChangeStatus(scope.row)"
                  :disabled="isMaintain"
                /> -->
                <mw-button size="small" class="btn-shop" :disabled="isMaintain" content="管理门店" @click="refreshParent(scope.row)" v-if="+scope.row.foodTradeId === 1"/>
                <mw-button size="small" :disabled="isMaintain" class="btn-update" @click="onClickRenew(scope.row)" content="更新" />
                <mw-button size="small" :disabled="isMaintain" class="btn-edit" @click="onClickEdit(scope.row)" content="编辑" />
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :onChangeCurrent="onChangeCurrent"
          :currentPage="pageIndex"
          :pageSize="pageSize"
          :totalCount="recordCount" />
      </div>
    </div>
    <renew-modal
      ref="renewModal"
      :shopId="renewShopId"
      :shopMessage="shopMessage"
      :getShopList="() => getShopList(pageIndex, pageSize)"
      :updateMessage="updateManageShopMessage" />
    <popup
      width="30%"
      ref="addNewNodeModal"
      type="submit"
      title="新增分组"
      :handleOk="onAddNewGroupNode">
      <div slot="content" style="text-align: center">
        <el-form
          ref="form"
          :rules="rules"
          :model="addGroupForm"
        >
          <el-form-item prop="nodeName">
            <el-input placeholder="输入分组名称" v-model="addGroupForm.nodeName" :maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </popup>
    <popup
      width="30%"
      ref="updateNodeModal"
      type="submit"
      title="修改分组"
      :handleOk="onUpdateShopTreeNode">
      <div slot="content" style="text-align: center">
        <el-form
          ref="editForm"
          :rules="rules"
          :model="addGroupForm"
        >
          <el-form-item prop="nodeName">
            <el-input placeholder="输入分组名称" v-model="addGroupForm.nodeName" :maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </popup>
    <popup
      title="删除操作"
      tips="您确认要删除此分组吗?"
      :handleOk="onDeleteShopTreeNOde"
      ref="deleteNodeConfirmModal" />
    <iframe id="nm_iframe" name="nm_iframe" style="display:none;"></iframe>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import { Popup, Pagination, MwButton } from 'components';
  import { OK, FORBIDDEN, DELETE } from 'constant/statusCode';
  import { DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';
  import { RenewModal } from '../components';
  import { checkMaintainRight } from 'utils/permissionUtil';
  import cloneDeep from 'lodash/cloneDeep';
  import { validateName } from 'utils/validateUtil';

  const SHOP_NODE = 10;
  const GROUP_NODE = 20;
  export default {
    name: 'shopListMain',
    components: {
      Popup,
      MwButton,
      RenewModal,
      Pagination
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        DELETE,
        SHOP_NODE,
        GROUP_NODE,
        isEditId: '',
        renewShopId: '',
        searchForm: {
          s_shopID: null,
          s_shopName: null,
          s_shopGroupId: null,
          s_status: null
        },
        shopTree: [],
        defaultProps: {
          children: 'children',
          label: 'itemName'
        },
        selectedTreeNode: {},
        selectedTreeNodeData: {},
        isSearching: false,
        loading: true,
        addGroupForm: {
          nodeName: null
        },
        parentBaseUrl: null,
        actionUrl: null,
        shopList: [],
        isMaintain: !checkMaintainRight(this),
        rules: {
          nodeName: [
            { required: true, message: '请输入分组名称', trigger: 'blur, change' },
            { validator: validateName, trigger: 'blur, change' }
          ]
        }
      };
    },
    async created () {
      this.getShopGroupTypes();
      this.fetchShopTreeDataSource({ treeType: 10, shopStatusList: [2, 3] });
      this.actionUrl = process.env.NODE_ENV !== 'production' ? 'http://test.www.mwpos.cn/Home/LoginManage' : 'http://www.mwpos.cn/Home/LoginManage';
    },
    computed: mapState({
      manageShopList: state => state.shopManagement.shopList.manageShopList,
      treeDataSource: state => state.shopManagement.shopList.treeDataSource,
      shopGroupList: state => state.shopManagement.shopList.shopGroupList,
      shopMessage: state => state.shopManagement.shopList.shopMessage,
      recordCount: state => state.shopManagement.shopList.recordCount,
      pageIndex: state => state.shopManagement.shopList.pageIndex,
      pageSize: state => state.shopManagement.shopList.pageSize,
      newNodeId: state => state.shopManagement.shopList.newNodeId,
      shopDetail: state => state.shopManagement.shopList.shopDetail,
      error: state => state.error
    }),
    watch: {
      treeDataSource () {
        if (!this.shopTree.length) {
          this.shopTree = cloneDeep(this.treeDataSource);
          this.loading = false;
          this.getShopListByNode({ shopList: this.getShopIdsFromNode(this.treeDataSource[0]), pageIndex: 1, pageSize: 10 });
        }
      }
    },
    methods: {
      ...mapActions([
        'updateManageShopStatus',
        'updateManageShopMessage',
        'fetchManageShopList',
        'getUpdateShopMessage',
        'getShopGroupTypes',
        'fetchShopTreeDataSource',
        'createShopTreeNode',
        'deleteShopTreeNode',
        'updateShopTreeNode',
        'getShopListByNode',
        'fetchManageShopDetail',
        'moveShopTreeNode',
        'moveShopNodeUp',
        'moveShopNodeDown',
        'moveShopItemUp',
        'moveShopItemDown',
        'moveShopTreeItem'
      ]),
      ...mapMutations([
        'FETCH_MANAGE_SHOP_LIST'
      ]),
      async onNodeClick (data) {
        this.isSearching = false;
        this.selectedTreeNodeData = data;
        if (+data.itemType === SHOP_NODE) {
          this.fetchManageShopDetail({ operateShopGUID: data.itemId });
        } else {
          if (!this.getShopIdsFromNode(data).length) {
            this.FETCH_MANAGE_SHOP_LIST({ manageShopList: [], pageIndex: 1, recordCount: 0 });
            return;
          }
          this.shopList = this.getShopIdsFromNode(data);
          await this.getShopListByNode({ shopList: this.shopList, pageIndex: 1, pageSize: 10 });
        }
      },
      getShopIdsFromNode (data) {
        let shopIds = [];
        if (+data.itemType === SHOP_NODE) {
          shopIds.push(data.itemId);
        }

        if (data.children) {
          data.children.map(item => {
            if (+item.itemType === SHOP_NODE) {
              shopIds.push(item.itemId);
            }
            if (item.children) {
              shopIds = [...shopIds, ...this.getShopIdsFromNode(item)];
            }
          });
        }
        return shopIds;
      },
      async onAddNewGroupNode () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        const { itemId } = this.selectedTreeNodeData;
        await this.createShopTreeNode({ parentNodeId: itemId, nodeType: 20, nodeName: this.addGroupForm.nodeName });
        this.$refs.addNewNodeModal.isShow = false;
        if (!this.error.errorStatus) {
          this.$toast.show({ content: '新增分组成功' });
//        this.addNode(this.selectedTreeNodeData, { itemId: this.newNodeId, itemName: this.addGroupForm.nodeName });
          this.loading = true;
          await this.fetchShopTreeDataSource({ treeType: 10, shopStatusList: [2, 3] });
          this.shopTree = cloneDeep(this.treeDataSource);
          this.loading = false;
        }
      },
      async onDeleteShopTreeNOde () {
        await this.deleteShopTreeNode({ targetNodeId: this.selectedTreeNodeData.itemId });
        this.$refs.deleteNodeConfirmModal.isShow = false;
        if (!this.error.errorStatus) {
          this.$toast.show({ content: '删除分组成功' });
          this.removeNode(this.selectedTreeNode, this.selectedTreeNodeData);
        }
      },
      async onUpdateShopTreeNode () {
        let validForm = true;
        this.$refs.editForm.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.updateShopTreeNode({ nodeId: this.selectedTreeNodeData.itemId, nodeType: this.selectedTreeNodeData.itemType, nodeName: this.addGroupForm.nodeName });
        this.$refs.updateNodeModal.isShow = false;
        if (!this.error.errorStatus) {
          this.$toast.show({ content: '更新分组成功' });
          this.updateNode(this.selectedTreeNode, this.selectedTreeNodeData);
        }
      },
      addNode (data, newNode) {
        const { itemName, itemId } = newNode;
        const newChild = { itemId, itemName, itemType: GROUP_NODE, children: [], parentNodeId: data.itemId };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      removeNode (node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.itemId === data.itemId);
        children.splice(index, 1);
      },
      updateNode (node, data) {
        data.itemName = this.addGroupForm.nodeName;
      },
      allowDrop (draggingNode, dropNode) {
        return +dropNode.data.itemType !== SHOP_NODE && dropNode.data.itemId !== draggingNode.parent.data.itemId && dropNode.data.itemId !== draggingNode.data.itemId;
      },
      allowDrag (draggingNode, dropNode) {
        return true && draggingNode.data.index !== 0;
      },
      async handleDragEnd (draggingNode, dropNode) {
        if (!draggingNode || !dropNode) return;

        if (+draggingNode.data.itemType === GROUP_NODE) {
          await this.moveShopTreeNode({ newParentId: dropNode.data.itemId, targetNodeId: draggingNode.data.itemId });
        } else {
          await this.moveShopTreeItem({ nodeId: dropNode.data.itemId, itemIds: [draggingNode.data.itemId], treeType: 10 });
        }

        if (!this.error.errorStatus) {
          this.$toast.show({ content: '分组移动成功' });
        } else {
          this.$toast.show({ content: '分组移动失败' });
        }
        this.loading = true;
        await this.fetchShopTreeDataSource({ treeType: 10, shopStatusList: [2, 3] });
        this.shopTree = cloneDeep(this.treeDataSource);
        this.loading = false;
      },
      async onMoveUp (node, data) {
        const parent = node.parent;
        // 门店节点和分组节点分开处理
        if (+data.itemType === GROUP_NODE) {
          await this.moveShopNodeUp({ nodeId: data.itemId, noShowError: true });
        } else {
          await this.moveShopItemUp({ itemId: data.itemId, nodeId: parent.data.itemId, noShowError: true });
        }

        if (!this.error.errorStatus) {
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.itemId === data.itemId);
          const target = children.splice(index, 1)[0];
          children.splice(index - 1, 0, { ...target });
        } else {
          this.$toast.show({ content: this.error.errorMsg, type: 'warning' });
        }
      },
      async onMoveDown (node, data) {
        const parent = node.parent;

        if (+data.itemType === GROUP_NODE) {
          await this.moveShopNodeDown({ nodeId: data.itemId, noShowError: true });
        } else {
          await this.moveShopItemDown({ itemId: data.itemId, nodeId: parent.data.itemId, noShowError: true });
        }

        if (!this.error.errorStatus) {
          const children = parent.data.children || parent.data;
          const index = children.findIndex(d => d.itemId === data.itemId);
          const target = children.splice(index, 1)[0];
          children.splice(index + 1, 0, { ...target });
        } else {
          this.$toast.show({ content: this.error.errorMsg, type: 'warning' });
        }
      },
      async onChangeCurrent (pageIndex) {
        if (this.isSearching) {
          await this.getShopList(pageIndex, this.pageSize);
        } else {
          await this.getShopListByNode({ shopList: this.getShopIdsFromNode(this.selectedTreeNodeData), pageIndex, pageSize: this.pageSize });
        }
      },
      async onClickSearch () {
        this.isSearching = true;
        this.selectedTreeNodeData = {};
        const { s_shopID, s_shopName } = this.searchForm;
        this.getShopListByNode({
          ...this.searchForm,
          s_shopID: s_shopID || null,
          s_shopName: s_shopName || null,
          shopList: null,
          pageIndex: 1,
          pageSize: 10 });
      },
      async onClickReset () {
        this.searchForm = {
          s_shopID: null,
          s_shopName: null,
          s_shopGroupId: null,
          s_status: null
        };
        this.$refs.search.resetFields();
      },
      onClickEdit (row) {
        this.$router.push(`/shopmanagement/shoplist/edit/${row.shopId}`);
      },
      async onClickChangeStatus (row) {
        const { pageIndex, pageSize } = this;
        const status = +row.status === OK ? FORBIDDEN : OK;
        const { shopId, shopGUID } = row;
        await this.updateManageShopStatus({ shopID: shopGUID || shopId, status });
        if (this.isSearching) {
          await this.getShopList(pageIndex, pageSize);
        } else {
          await this.getShopListByNode({ shopList: this.shopList, pageIndex, pageSize, noShowError: true });
        }
        this.fetchManageShopDetail({ operateShopGUID: shopGUID, noShowError: true });
      },
      async onClickRenew (row) {
        this.$refs.renewModal.isShow = true;
        if (row) {
          this.renewShopId = row.shopId;
        }
        await this.getUpdateShopMessage({ operateShopGUID: row.shopId });
      },
      async getShopList (pageIndex, pageSize) {
        pageIndex = pageIndex || DEFAULT_PAGE;
        pageSize = pageSize || DEFAULT_PAGES;
        const { searchForm } = this;
        await this.fetchManageShopList({ ...searchForm, pageIndex, pageSize, shopList: null });
      },
      showNodeOperationModal (node, data, ref) {
        this.addGroupForm.nodeName = ref === 'updateNodeModal' ? data.itemName : null;
        this.selectedTreeNodeData = data;
        this.selectedTreeNode = node;
        this.$refs[ref].isShow = true;
      },
      refreshParent (row) {
        if (!row || !row.foodTradeId) return;

        if (+row.foodTradeId === 1) {
          this.$toast.show({ content: '快餐业态禁止跳转登录，请从门店直接登录', type: 'warning' });
          return;
        }

        setTimeout("window.location.href = window.location.origin + '/shopinfo'", 2000);
      }
    }
  };
</script>

<style lang="scss">
  .shop-list-main {
    padding: 15px;

    .content {
      .left {
        float: left;
        width: 500px;
        height: 500px;
        overflow: auto;
        border: 1px solid #ebeef5;

        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;

          .btn-down {
            background-size: 18px !important;
          }

          .btn-add-icon,
          .btn-delete,
          .btn-edit {
            background-size: 20px !important;
          }

          .el-button + .el-button {
            margin-left: 0;
          }

          .node-btn-bar {
            display: none;

            &.selected {
              display: block;
            }
          }

          .node {
            color: #409EFF;
            width: 180px;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      .right {
        padding-left: 510px;

        form {
          display: inline-block;

          input {
            display: none;
          }
        }

        .el-table .el-table__body .cell {
          line-height: 1.5;
        }

        .shop-detail {
          margin-top: 15px;
          border: 1px solid #ebeef5;
          padding: 10px;
          min-height: 460px;

          .header {
            line-height: 40px;
            border-bottom: 1px solid #ebeef5;

            .btn-group {
              float: right;
            }
          }

          .content {
            .form-item {
              color: #606266;
              padding: 10px 0 10px 10px;
              float: left;
              display: block;
              width: 45%;
            }
          }
        }
      }
    }

    .search-bar {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    .division-line {
      margin: 8px auto;
    }

    .el-form-item__label {
      padding-right: 10px;
    }

    .link {
      margin-right: 5px;
    }

    .btn-renew {
      height: 30px;
    }

    .required {
      text-align: right;
    }
  }
</style>
