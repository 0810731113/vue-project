<template>
  <el-dialog custom-class="base-modal valud-added-modal" :visible.sync="isShow" size="tiny">
    <div class="modal-title" slot="title">门店服务</div>
    <el-form inline class="top-form">
      <el-form-item label="ID">{{ data.shopGUID }}</el-form-item>
      <el-form-item label="名称">{{ data.shopName }}</el-form-item>
      <el-form-item label="类型">{{ getShopKind(data) }}</el-form-item>
      <el-form-item label="所属总店">{{ data.superiorShopName }}</el-form-item>
      <el-form-item label="终端类型">{{ data.clientType }}</el-form-item>
      <el-form-item label="版本号">{{ data.softVersion }}</el-form-item>
    </el-form>
    <el-form class="bottom-form">
      <el-form-item label="门店服务">
        <el-table border :data="data.serviceList">
          <el-table-column align="center" prop="serviceId" label="服务ID" />
          <el-table-column align="center" prop="serviceName" label="服务名称" />
          <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="scope">
              {{ scope.row.status === OK ? '启用' : '禁用' }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="" label="操作">
            <template slot-scope="scope">
              <mw-button
                :class="scope.row.status == FORBIDDEN ? 'btn-ok' : 'btn-forbid'"
                :content="scope.row.status == FORBIDDEN ? '启用' : '禁用'"
                @click="onClickChangeStatus(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="站点管理">
        <el-table border :data="data.hostClsList">
          <el-table-column align="center" prop="hostClsName" label="类型" />
          <el-table-column align="center" prop="maxHostCount" label="数量">
            <template slot-scope="scope">
              <el-input-number :min="0" :max="99" :controls="false" size="small" v-model="scope.row.maxHostCount" controls-position="right"/>
              <span>个</span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="btn-wrapper">
      <el-button class="btn-submit" @click="onSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { MwButton } from 'components';
import { OK, FORBIDDEN } from 'constant/statusCode';
import { SHOPKIND_NAME } from 'constant/constants';

export default {
  name: 'valueAddedModal',
  components: {
    MwButton
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    saveValueAdded: {
      type: Function,
      default: () => {}
    }
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      isShow: false
    };
  },
  methods: {
    async onSubmit () {
      const { shopGUID, serviceList, hostClsList } = this.data;
      await this.saveValueAdded({ shopId: shopGUID, serviceList, hostClsList });
      this.isShow = false;
    },
    getShopKind (row) {
      const item = SHOPKIND_NAME.find(item => item.value === row.shopKind);
      return item && item.name;
    },
    onClickChangeStatus (row) {
      row.status = row.status === OK ? FORBIDDEN : OK;
    }
  }
};
</script>

<style lang="scss">
.valud-added-modal {
  width: 700px;

  .el-dialog__body {
    padding-top: 0;
  }

  .btn-wrapper {
    text-align: center;
  }

  .top-form {
    .el-form-item {
      width: calc(50% - 16px);
      margin-bottom: 0;

      .el-form-item__label {
        font-weight: 600;
      }
    }
  }
}
</style>
