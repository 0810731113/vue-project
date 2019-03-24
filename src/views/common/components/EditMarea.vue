<template>
  <el-dialog :title="title" custom-class="base-modal edit-marea" v-if="isShow" :modal="false" :visible.sync="isShow" width="30%">
    <el-form class="mw-form edit-marea-form" ref="form" label-width="100px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			<el-checkbox-group v-model="selectMarea" @change="handleCheckedCitiesChange">
        <div class='table-item' v-for="marea in tableArea" :key="marea.mareaId">
          <el-checkbox :label="marea.mareaId">{{marea.mareaName}}</el-checkbox>
        </div>
			</el-checkbox-group>
      <div class="dialog_footer">
        <el-button native-type='submit' class="btn-submit" @click="onSubmit">保存</el-button>
        <el-button native-type='submit' class="btn-submit" @click="onCancel">取消</el-button>
      </div>
		</el-form>
	</el-dialog>
</template>

<script>
import { MwButton } from 'components';

export default {
  name: 'EditMarea',
  components: { MwButton },
  props: ['title', 'tableArea', 'hasSelectedMarea', 'changeMarea'],
  data () {
    return {
      isShow: false,
      selectMarea: [],
      checkAll: false,
      isIndeterminate: true
    };
  },
  watch: {
    isShow () {
      if (this.isShow === true) {
        // 传入数据为全选进行状态处理
        const checkAll = this.hasSelectedMarea.filter(item => !!item === true).some(item => item === '-1');
        if (checkAll) {
          this.checkAll = checkAll;
          this.isIndeterminate = false;
          this.selectMarea = this.tableArea.map(item => item.mareaId);
        } else {
          this.selectMarea = this.hasSelectedMarea.filter(item => !!item === true);
        }
      }
    }
  },
  methods: {
    onCancel (e) {
      e.preventDefault();
      this.isShow = false;
    },
    onSubmit (e) {
      e.preventDefault();
      if (this.selectMarea.length === 0) {
        this.$toast.show({ content: '区域为必选项', type: 'warning' });
        return null;
      }

      const marea = [];
      this.selectMarea.forEach(item => {
        const index = this.tableArea.findIndex(area => area.mareaId === item);
        if (index > -1) {
          marea.push(this.tableArea[index]);
        }
      });
      this.changeMarea(marea);
      this.isShow = false;
    },
    handleCheckAllChange (val) {
      this.selectMarea = val ? this.tableArea.map(item => item.mareaId) : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange (value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.tableArea.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableArea.length;
    }
  }
};
</script>

<style lang="scss">
  .edit-marea {
    margin-top: 25vh !important;

    .el-dialog__body {
      padding: 10px;
    }
  }

	.edit-marea-form {
    .table-item {
      margin: 12px 0;
    }

    .dialog_footer {
      margin-top: 15px;
      text-align: center;
    }
	}
</style>
