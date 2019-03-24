<template>
  <div class="add-batch-table-management-container">
    <el-form class="mw-form" :style="{'width':guidance ? '80%':'35%'}" :model="form" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="餐桌代码" required>
        <el-col :span="11">
          <el-form-item prop="startsNumber">
            <el-input-number v-model="form.startsNumber" placeholder="起始编号" :min="0" :max="99999999" :controls="false"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="2" style="text-align: center">至</el-col>
        <el-col :span="11">
          <el-form-item prop="endNumber">
            <el-input-number v-model="form.endNumber" placeholder="结束编号" :min="0" :max="99999999" :controls="false"></el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="餐桌名前缀" prop="mtableName">
        <el-input v-model="form.mtableName" placeholder="餐桌名称格式为'餐桌名前缀'+'餐桌代码'" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="座位数" required>
        <el-input-number v-model="form.mtableSeats" :min="1" :max="999" :controls="false" class="input-seat" />
      </el-form-item>
      <el-form-item label="餐桌类型" prop="mtableClsId">
        <el-select v-model="form.mtableClsId" :style="{'width':guidance ? '100%':'70%'}">
          <el-option
            v-for="item in tableTypelist"
            :key="item.mtableClsId"
            :label="item.mtableClsName"
            :value="item.mtableClsId"
            style="width: 100%"></el-option>
        </el-select>
        <label class="icon-add-type" @click="onShowModal('AddTypeModal')" v-if="!guidance">新增类型</label>
      </el-form-item>
      <el-form-item label="餐桌区域" prop="mareaId">
        <el-select v-model="form.mareaId" :style="{'width':guidance ? '100%':'70%'}">
          <el-option
            v-for="item in tableAreaList"
            :key="item.mareaId"
            :label="item.mareaName"
            :value="item.mareaId"
            style="width: 100%"></el-option>
        </el-select>
        <label class="icon-add-type" @click="onShowModal('AddAreaModal')" v-if="!guidance">新增区域</label>
      </el-form-item>
      <!-- <el-form-item label="状态">
        <el-switch v-model="form.mtableStatus" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
      </el-form-item> -->
      <el-form-item v-if="!guidance" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <AddTypeModal ref="AddTypeModal" :onTableTypeCallBack="onTableTypeCallBack"></AddTypeModal>
    <AddAreaModal ref="AddAreaModal" :onTableAreaCallBack="onTableAreaCallBack"></AddAreaModal>
  </div>
</template>

<script>
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { mapActions, mapState } from 'vuex';
  import AddTypeModal from '../Components/AddTypeModal';
  import AddAreaModal from '../Components/AddAreaModal';
  import { ON_TEXT, OFF_TEXT } from 'constant/constants';
  import { validateGeneralName, validateNumber } from 'utils/validateUtil';

  export default {
    name: 'AddBatchModal',
    props: ['guidance'],
    components: {
      AddTypeModal,
      AddAreaModal
    },
    data () {
      return {
        OK,
        FORBIDDEN,
        ON_TEXT,
        OFF_TEXT,
        isShow: false,
        form: {
          startsNumber: 0,
          endNumber: 0,
          mtableName: null,
          mtableClsId: null,
          mareaId: null,
          mtableStatus: OK,
          mtableSeats: 1
        },
        rules: {
          startsNumber: [
            { type: 'number', required: true, message: '餐桌代码不能为空', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          endNumber: [
            { type: 'number', required: true, message: '餐桌代码不能为空', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          mtableName: [
            { required: true, message: '餐桌名前缀不能为空', trigger: ['blur', 'change'] },
            { validator: validateGeneralName, trigger: ['blur', 'change'] }
          ],
          mtableSeats: [
            { required: true, message: '座位数不能为空', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ]
        }
      };
    },
    watch: {
      tableTypelist () {
        if (this.tableTypelist.length) {
          this.form.mtableClsId = this.tableTypelist[0].mtableClsId;
        }
      },
      tableAreaList () {
        if (this.tableAreaList.length) {
          this.form.mareaId = this.tableAreaList[0].mareaId;
        }
      }
    },
    computed: {
      ...mapState({
        tableTypelist: state => state.tables.management.tableTypelist,
        tableAreaList: state => state.tables.management.tableAreaList
      })
    },
    methods: {
      ...mapActions([
        'saveBatchTableManagement',
        'getTableTypelist',
        'getTableArealist'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return validForm;

        const data = { ...this.form, noShowError: this.guidance };
        await this.saveBatchTableManagement(data);

        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.$router.back();
        }
        return validForm;
      },
      onCancel () {
        this.$router.back();
      },
      onShowModal (type) {
        this.$refs[type].isShow = true;
      },
      onTableTypeCallBack (tableTypeId) {
        this.form.mtableClsId = tableTypeId;
      },
      onTableAreaCallBack (tableAreaId) {
        this.form.mareaId = tableAreaId;
      }
    },
    async created () {
      await this.getTableTypelist();
      await this.getTableArealist();
    }
  };
</script>
<style lang="scss">
  .add-batch-table-management-container {
    .icon-add-type {
      border: 0;
      color: #39c;
      font-style: italic;
      text-decoration: underline;
      cursor: pointer;
      padding-top: 8px;
      margin-left: 20px;
    }

    .el-input-number {
      width: auto;
    }

    .input-seat {
      width: 100%;
    }
  }
</style>

