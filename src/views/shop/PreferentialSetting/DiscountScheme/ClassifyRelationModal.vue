<template>
  <el-dialog v-if='isShow' custom-class='base-modal classify-relation-modal' :visible.sync='isShow' title='关联菜品分类'>
    <el-form inline>
      <el-form-item label='折扣率'>
        <el-input-number placeholder='请输入折扣率' :controls='false' v-model="discountRate" :min="0" :max="100" @blur="onDiscountRateBlur"></el-input-number>&nbsp;&nbsp;%
      </el-form-item>
      <el-form-item>
        <el-button class='btn-primary' @click="batchChangeDiscountRate">更新折扣率</el-button>
      </el-form-item>
      <div>举例：打九折折扣率为10%，更新折扣率后，所有分类折扣率会全部更新。</div>
      <div class="tips">注： 关联菜品分类后，向分类中添加新菜，新菜会自动关联该要求。</div>
    </el-form>
    <el-table :data="classifyList" border class="classify-table" max-height="400">
      <el-table-column align="center" prop="menuClsName" class-name="class-number" label="菜品分类" min-width="70%">
        <template slot-scope="scope">
          <i :class="{
              'no-icon': !scope.row.children,
              'el-icon-caret-bottom': checkShowChildren(scope.row),
              'el-icon-caret-right': scope.row.level === FIRST_LEVEL && scope.row.children && !checkShowChildren(scope.row)
            }"
             @click="() => onShowOrHiddenChildren(scope.row)"
          />
          <i class="icon-level" :class="{ 'hidden': scope.row.level === FIRST_LEVEL, 'level-three': scope.row.level === THIRD_LEVEL }"></i>
          <span class="menucls-id">{{ scope.row.menuClsName }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="折扣率">
        <template slot-scope="scope">
          <div v-if="!scope.row.children">
            <el-input-number :controls="false" v-model="scope.row.discountRate" :min="0" :max="100" @blur="onCheckNumber(scope.row)"></el-input-number>&nbsp;&nbsp;%
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-group">
      <el-button class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button class="btn-submit" @click="onSubmit" v-if="!isChain">保存</el-button>
    </div>
    <div class="error-wrapper horizontal-center" v-if="!!errorMessage">
      <i class="el-icon-circle-cross"></i>
      {{ errorMessage }}
    </div>
  </el-dialog>
</template>
<script>
  import cloneDeep from 'lodash/cloneDeep';
  import { REGEX_NUMBER } from 'constant/regex';
  import { mapActions, mapState } from 'vuex';
  import { FIRST_LEVEL, THIRD_LEVEL, DEFAULT_MENU } from 'constant/constants';
  import { isChain } from 'utils/configUtil';

  export default {
    name: 'ClassifyRelationModal',
    props: ['discountId'],
    data () {
      return {
        FIRST_LEVEL,
        THIRD_LEVEL,
        DEFAULT_MENU,
        REGEX_NUMBER,
        isShow: false,
        showChildrenIds: [],
        classifyList: [],
        errorMessage: '',
        discountRate: 0,
        isChain: isChain()
      };
    },
    watch: {
      async isShow () {
        if (this.isShow) {
          this.discountRate = 0;
          const { discountId } = this;
          await this.fetchDiscountMenuClsList({ discountId, showSystemData: true });
        }
      },
      discountMenuClsList () {
        this.classifyList = cloneDeep(this.discountMenuClsList);
      }
    },
    computed: mapState({
      discountMenuClsList: state => state.preferential.discountScheme.discountMenuClsList
    }),
    methods: {
      ...mapActions([
        'fetchDiscountMenuClsList',
        'saveDiscountLinkedMenuCls'
      ]),
      onShowOrHiddenChildren (row) {
        const position = this.classifyList.findIndex(item => item.menuClsId === row.menuClsId);
        const subItems = this.getChildren(row.children);
        if (this.checkShowChildren(row)) {
          const index = this.showChildrenIds.findIndex(id => id === row.menuClsId);
          this.showChildrenIds.splice(index, 1);
          // 已显示子集, 则从 list 移除
          for (let i = 1; i <= subItems.length; i++) {
            this.classifyList.splice(position + 1, 1);
          }
        } else {
          // 未显示子集, 则追加到父级后
          for (let i = 1; i <= subItems.length; i++) {
            this.classifyList.splice(position + i, 0, subItems[i - 1]);
          }
          this.showChildrenIds.push(row.menuClsId);
        }
      },
      getChildren (row) {
        const children = [];
        row.map(item => {
          children.push(item);
          item.children && item.children.map(subItem => {
            children.push(subItem);
          });
        });
        return children;
      },
      checkShowChildren (row) {
        return this.showChildrenIds.includes(row.menuClsId);
      },
      showAddChildren (row) {
        const { menuType, level, currentMenuCount } = row;
        return menuType === DEFAULT_MENU && level !== THIRD_LEVEL && !currentMenuCount;
      },
      onCheckNumber (row) {
        row.discountRate = parseInt(row.discountRate);
      },
      onDiscountRateBlur (e) {
        this.discountRate = parseInt(e.target.value);
      },
      batchChangeDiscountRate () {
        this.classifyList.map(item => {
          item.children ? item.children.map(subItem => {
            subItem.children ? subItem.children.map(node => {
              node.discountRate = this.discountRate;
            }) : subItem.discountRate = this.discountRate;
          }) : item.discountRate = this.discountRate;
        });
      },
      onCancel () {
        this.isShow = false;
      },
      async onSubmit () {
        const { discountId } = this;

        let menuClsDiscountDtoList = this.formatData();
        await this.saveDiscountLinkedMenuCls({ discountId, menuClsDiscountDtoList, loading: true, noShowError: true });

        const { errorStatus, errorMsg } = this.$store.state.error;
        if (errorStatus) {
          this.errorMessage = errorMsg;
        } else {
          this.errorMessage = '';
          this.isShow = false;
          this.$emit('onSubmit');
        }
      },
      formatData () {
        const { discountId } = this;

        let data = [];
        this.classifyList.map(item => {
          const { menuClsId, discountRate } = item;
          data.push({ discountId, menuClsId, discountRate });
          item.children && item.children.map(subItem => {
            const { menuClsId, discountRate } = subItem;
            data.push({ discountId, menuClsId, discountRate });
            subItem.children && subItem.children.map(node => {
              const { menuClsId, discountRate } = node;
              data.push({ discountId, menuClsId, discountRate });
            });
          });
        });

        return data;
      }
    }
  };

</script>
<style lang='scss'>
  .classify-relation-modal {
    padding: 10px 0;
    text-align: center;

    .classify-table {
      width: 80%;
      margin: auto;
    }

    .tips {
      margin: 10px 0;
      color: red;
    }

    .class-number {
      .cell {
        justify-content: left;

        .no-icon {
          visibility: hidden;
          margin-left: 33px;
        }

        .icon-plus,
        .el-icon-caret-bottom,
        .el-icon-caret-right {
          height: 44px;
          line-height: 44px;
          padding: 0 10px;
          cursor: pointer;
        }

        .icon-plus {
          margin-left: 20px;
        }
      }

      .icon-level {
        width: 12px;
        height: 12px;
        margin-top: 15px;
        display: inline-block;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        margin-right: 5px;
        margin-left: 25px;
      }

      .level-three {
        margin-left: 50px;
      }
    }

    .btn-group {
      margin: 10px 0;
    }
  }
</style>
