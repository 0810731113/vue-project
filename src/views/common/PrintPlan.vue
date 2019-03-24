<template>
  <el-dialog :title="title" custom-class="base-modal print-plan-detail" v-if="isShow" :visible.sync="isShow" width="45%">
    <el-form class="mw-form" ref="form" label-width="100px" :model="currentPlanDetailTag" :rules="rules">
      <div v-if="showTip" class='print-plan-tip'>修改打印方案会影响所有关联菜品，请谨慎操作!</div>
      <el-form-item label='打印方案名:' prop="printName">
        <el-input v-model="currentPlanDetailTag.printName" />
      </el-form-item>
      <div>方案详情</div>
      <el-table :data="currentPlanDetailTag.detailList" border style="width: 100%" max-height="280">
        <el-table-column prop="mareaName" label="餐桌区域" align="center" min-width="40%">
          <template slot-scope="scope">
            <div class="mareaName-box">
              <div class="mareaName-cont">{{ getPlanListDetails(scope.row.marea) }}</div>
              <mw-button class="btn-edit" content="编辑" @click="showEditMarea(scope.row, scope.$index)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="deptName" label="打印部门" align="center" min-width="40%">
          <template slot-scope="scope">
            <el-select v-model="scope.row.deptId" placeholder="请选择">
              <el-option
                v-for="item in printDeptList"
                v-if="+item.deptId !== -1 && +item.deptId !== 9999"
                :key="item.deptId"
                :label="item.deptName"
                :value="item.deptId">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="20%">
          <template slot-scope="scope">
            <div class="btn-wrapper">
              <mw-button class="btn-delete" content="删除" :disabled="scope.$index === 0" @click="deletePrintPlan(scope.$index)" />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class='add-print-plan' @click="addPrintPlan">+新增</div>
      <div class="save-box">
        <el-button native-type='submit' class="btn-submit" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
    <edit-marea
      title="添加区域"
      ref="editMarea"
      :hasSelectedMarea="hasSelectedMarea"
      :changeMarea="changeMarea"
      :tableArea="tableArea" />
	</el-dialog>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { MwButton } from 'components';
import EditMarea from './components/EditMarea';
import { validateName } from 'utils/validateUtil';
import { mapActions } from 'vuex';

export default {
  name: 'AddPrintPlan',
  components: { MwButton, EditMarea },
  props: {
    'showTip': {
      type: Boolean,
      default: false
    },
    'title': {
      type: String,
      default: ''
    },
    printDeptList: {
      type: Array,
      default: () => ([])
    },
    currentPlanDetail: {
      type: Object,
      default: () => ({ detailList: [], printId: null, printName: '' })
    },
    tableArea: {
      type: Array
    },
    handleMenuPrintPlan: {
      type: Function,
      default: () => {}
    },
    getListPrintPlanDetail: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    isShow () {
      const currentPlanDetailTag = cloneDeep(this.currentPlanDetail);
      const { detailList } = currentPlanDetailTag;
      const showMulPrintPlan = [];
      detailList && detailList.forEach(item => {
        const index = showMulPrintPlan.findIndex(showPlan => showPlan.deptId === item.deptId && !!item.mareaId);
        if (index > -1) {
          showMulPrintPlan[index].marea.push({ mareaId: item.mareaId, mareaName: item.mareaName });
        } else {
          showMulPrintPlan.push({ deptId: item.deptId, deptName: item.deptName, marea: [{ mareaId: item.mareaId, mareaName: item.mareaName }] });
        }
      });
      currentPlanDetailTag.detailList = showMulPrintPlan;
      if (detailList && detailList.length === 0) {
        currentPlanDetailTag.detailList.push({
          deptId: null,
          deptName: null,
          marea: this.tableArea
        });
      }
      this.currentPlanDetailTag = currentPlanDetailTag;
    }
  },
  data () {
    const currentPlanDetailTag = cloneDeep(this.currentPlanDetail);
    return {
      isShow: false,
      currentPlanDetailTag,
      hasSelectedMarea: [],
      editIndex: null,          // 修改的方案详情序列值
      rules: {
        printName: [
          { required: true, placeholder: '请输入打印方案名称', message: '请输入打印方案名称', trigger: ['blur', 'change'] },
          { validator: validateName, trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  methods: {
    ...mapActions([
      'isPrintPlanExist'
    ]),
    // 根据数据中打印部门id的不同判断展示数据条数
    getShowDetailListLength (data) {
      const idList = new Set();
      data.forEach(item => {
        idList.add(item.deptId);
      });
      return [...idList].length;
    },
    getPlanListDetails (data) {
      if (data.length === this.tableArea.length) {
        return '全部区域';
      }
      return data.map(item => item.mareaName).join(',');
    },
    async onSubmit (e) {
      e.preventDefault();
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return null;

      const { detailList, printName, printId } = this.currentPlanDetailTag;
      const requestData = [];
      // 从展示数据结构转换成接口所需结构
      detailList.forEach(item => {
        item.marea.forEach(item1 => {
          requestData.push({
            deptId: item.deptId,
            mareaId: item1.mareaId || null
          });
        });
      });
      // 参数检验
      for (let i = 0; i < requestData.length; i++) {
        if (!(requestData[i].deptId && requestData[i].mareaId)) {
          this.$toast.show({ content: '餐桌区域和打印部门都为必选项', type: 'warning' });
          return null;
        }
      }

      let exist;
      if (!this.showTip) {
        exist = await this.isPrintPlanExist({ printPlanName: printName }).then(res => res.exist);
      }
      if (exist) {
        this.$toast.show({ content: '该方案名已存在', type: 'warning' });
        return null;
      }
      await this.handleMenuPrintPlan({
        printPlanId: printId,
        printPlanName: printName,
        requestData
      });
      await this.getListPrintPlanDetail();
      this.isShow = false;
    },
    // 新增方案详情
    addPrintPlan () {
      this.currentPlanDetailTag.detailList.push({
        deptId: null,
        deptName: null,
        marea: this.tableArea
      });
    },
    deletePrintPlan (index) {
      this.currentPlanDetailTag.detailList.splice(index, 1);
    },
    showEditMarea (data, index) {
      this.editIndex = index;
      this.hasSelectedMarea = data.marea.map(item => item.mareaId);
      this.$refs.editMarea.isShow = true;
    },
    changeMarea (marea) {
      const { editIndex, currentPlanDetailTag } = this;
      currentPlanDetailTag['detailList'][editIndex].marea = marea;
    }
  }
};
</script>

<style lang="scss">
  .print-plan-detail {
    .mw-form {
      width: 90%;

      .print-plan-tip {
        margin-bottom: 20px;
        color: red;
        text-align: center;
      }

      .mareaName-box {
        position: relative;
        width: 100%;
        height: 45px;

        .mareaName-cont {
          padding-right: 24px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .btn-edit {
          position: absolute;
          top: 0;
          right: 0;
        }
      }

      .el-form-item__label {
        text-align: left;
      }

      .add-print-plan {
        font-size: 14px;
        height: 46px;
        line-height: 46px;
        background-color: #fff;
      }

      .save-box {
        text-align: center;
        margin: 10px 0;
      }
    }

  }
</style>
