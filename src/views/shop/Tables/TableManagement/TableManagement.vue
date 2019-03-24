<template>
  <div class="table-management-container">
    <el-form :model="form" :class="editPopup" class="mw-form form-width" ref="form" :rules="rules" label-width="100px">
      <el-form-item label="餐桌代码" prop="mtableId">
        <el-input v-model="form.mtableId" placeholder="请输入餐桌代码" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="餐桌名称" prop="mtableName">
        <el-input v-model="form.mtableName" placeholder="请输入餐桌名称" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="座位数" prop="mtableSeats">
        <el-input-number class="input-seat" v-model.number="form.mtableSeats" :controls="false" :min="0" :max='999' placeholder="请输入座位数" />
      </el-form-item>
      <el-form-item label="餐桌类型" prop="mtableClsId">
        <el-select v-model="form.mtableClsId" :style="{'width':guidance ? '100%':'80%'}">
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
        <el-select v-model="form.mareaId" :style="{'width':guidance ? '100%':'80%'}">
          <el-option
            v-for="item in tableAreaList"
            :key="item.mareaId"
            :label="item.mareaName"
            :value="item.mareaId"
            style="width: 100%"></el-option>
        </el-select>
        <label class="icon-add-type" @click="onShowModal('AddAreaModal')" v-if="!guidance">新增区域</label>
      </el-form-item>
      <el-form-item label="二维码" v-if="!guidance">
        <el-input v-model="form.mtableQRCode"></el-input>
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
  import { mapActions, mapState } from 'vuex';
  import { FORBIDDEN, OK } from 'constant/statusCode';
  import { Popup } from 'components';
  import AddTypeModal from '../Components/AddTypeModal';
  import AddAreaModal from '../Components/AddAreaModal';
  import { ON_TEXT, OFF_TEXT } from 'constant/constants';
  import { validateGeneralName, validateNumber , validateId} from 'utils/validateUtil';

  export default {
    name: 'TableManagement',
    props: ['guidance', 'mtableId'],
    components: {
      Popup,
      AddTypeModal,
      AddAreaModal
    },
    data () {
      return {
        FORBIDDEN,
        OK,
        ON_TEXT,
        OFF_TEXT,
        form: {
          mtableId: null,
          mtableName: null,
          mtableSeats: null,
          mtableClsId: null,
          mareaId: null,
          mtableQRCode: null,
          mtableStatus: OK
        },
        rules: {
          mtableId: [
            { required: true, message: '请输入餐桌代码', trigger: ['blur', 'change'] },
            { validator: validateId, trigger: ['blur', 'change'] }
          ],
          mtableName: [
            { required: true, message: '请输入餐桌名称', trigger: ['blur', 'change'] },
            { validator: validateGeneralName, trigger: ['blur', 'change'] }
          ],
          mtableClsId: [
            { required: true, message: '请选择餐桌类型', trigger: ['blur', 'change'] }
          ],
          mareaId: [
            { required: true, message: '请选择餐区区域', trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.mtableId
      };
    },
    computed: {
      ...mapState({
        tableTypelist: state => state.tables.management.tableTypelist,
        tableAreaList: state => state.tables.management.tableAreaList,
        managementItem: state => state.tables.management.managementItem
      }),
      editPopup () {
        return {
          'edit-or-add-pop-up': this.guidance
        };
      }
    },
    methods: {
      ...mapActions([
        'getTableTypelist',
        'getTableArealist',
        'fetchManagementItem',
        'saveTableManagementItem',
        'updateTableManagementItem'
      ]),
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return validForm;
        const data = { ...this.form, noShowError: this.guidance };
        this.isEdit ? await this.updateTableManagementItem(data) : await this.saveTableManagementItem(data);

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
      init () {
        if (this.managementItem) {
          const { mtableStatus } = this.managementItem;
          this.form = {
            ...this.managementItem,
            mtableStatus: mtableStatus === null ? OK : parseInt(mtableStatus)
          };
        }
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
      this.isEdit ? await this.fetchManagementItem({ mtableId: this.$route.params.id || this.mtableId }) : await this.fetchManagementItem();
      this.init();
      this.getTableTypelist();
      this.getTableArealist();
    }
  };
</script>

<style lang="scss">
  .table-management-container {
    .icon-add-type {
      border: 0;
      color: #39c;
      font-style: italic;
      text-decoration: underline;
      cursor: pointer;
      padding-top: 8px;
      margin-left: 20px;
    }

    .edit-or-add-pop-up {
      width: 80% !important;
    }

    .input-seat {
      width: 100%;
    }
  }
</style>

