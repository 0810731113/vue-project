<template>
  <div class="shop-role-container">
    <el-form class="mw-form" :model="form" ref="form" :rules="rules" label-width="140px">
      <el-form-item label="角色编号" prop="roleId">
        <el-input v-model="form.roleId" placeholder="请输入角色编号" :disabled="isEdit"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="form.roleName" placeholder="请输入角色编号"></el-input>
      </el-form-item>
      <el-form-item label="权限类型" class="authority-list">
        <div>
          <el-checkbox
            v-model="allChecked"
            :true-label="1"
            :false-label="0"
            @change="(value) => onAllCheckedChangge(value)"
          >全选
          </el-checkbox>
        </div>
        <div v-for="item in authorityList" :key='item.progId'>
          <div class="title">
            <label>{{item.progName}}:</label>
            <el-checkbox
              v-model="item.usable"
              :true-label="1"
              :false-label="0"
              @change="(value) => onItemCheckedChange(value,item)"
            >选择全部
            </el-checkbox>
          </div>
          <div class="el-checkbox-group" v-for="subItem in item.vprojDtoList" :key='subItem.progId-subItem.progName'>
            <label>{{subItem.progName}}:</label>
            <el-checkbox
              v-for="node in subItem.vprogDtlDtoList"
              :key='node.progId-node.progDtlId'
              v-model="node.usable"
              :true-label="1"
              :false-label="0"
              @change="checkStatus"
            >{{node.proglName}}
            </el-checkbox>
          </div>
        </div>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import cloneDeep from 'lodash/cloneDeep';
  import { mapActions, mapState } from 'vuex';
  import { validateName } from 'utils/validateUtil';

  export default {
    name: 'shopRole',
    data () {
      return {
        form: {
          roleId: null,
          roleName: null
        },
        authorityList: [],
        allChecked: 1,
        rules: {
          roleId: [
            { required: true, message: '请输入角色编号', trigger: 'blur, change' }
          ],
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur, change' },
            { validator: validateName, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id
      };
    },
    computed: {
      ...mapState({
        shopRoleDetail: state => state.employe.shopRole.shopRoleDetail
      })
    },
    methods: {
      ...mapActions([
        'getShopRoleDetail',
        'updateShopRoleInfo'
      ]),
      onAllCheckedChangge (value) {
        this.authorityList.map(item => {
          item.usable = 1;
          item.vprojDtoList.map(subItem => {
            subItem.vprogDtlDtoList.map(node => {
              node.usable = value ? 1 : 0;
              item.usable = item.usable * node.usable;
            });
          });
        });
      },
      onItemCheckedChange (value, item) {
        item.vprojDtoList.map(subItem => {
          subItem.vprogDtlDtoList.map(node => {
            node.usable = value ? 1 : 0;
          });
        });
        this.checkStatus();
      },
      checkStatus () {
        this.allChecked = 1;
        this.authorityList.map(item => {
          item.usable = 1;
          item.vprojDtoList.map(subItem => {
            subItem.vprogDtlDtoList.map(node => {
              item.usable = item.usable * node.usable;
              this.allChecked = this.allChecked * item.usable;
            });
          });
        });
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return;

        await this.updateShopRoleInfo(this.formatData());
        const { errorStatus } = this.$store.state.error;
        if (!errorStatus) {
          this.onCancel();
        }
      },
      formatData () {
        let authoritydtl = [];
        this.authorityList.map(item => {
          item.usable = 1;
          item.vprojDtoList.map(subItem => {
            subItem.vprogDtlDtoList.map(node => {
              authoritydtl.push({
                'projid': item.progId,
                'progid': node.progId,
                'progdtlid': node.progDtlId,
                'usable': node.usable
              });
            });
          });
        });
        const { roleId, roleName } = this.form;
        return {
          operate: this.isEdit ? 'edit' : 'add',
          roleId,
          roleName,
          authoritydtl,
          loading: true
        };
      },
      onCancel () {
        this.$router.push('/myd/employe/shoprole');
      }
    },
    async created () {
      if (this.isEdit) {
        await this.getShopRoleDetail({ roleId: this.$route.params.id, operate: 'edit', loading: true });
      } else {
        await this.getShopRoleDetail({ operate: 'add', loading: true });
      }
      const { roleId, roleName, vprojListDtoList } = this.shopRoleDetail;
      this.form = { ...this.form, roleId, roleName };
      this.authorityList = cloneDeep(vprojListDtoList);
      this.checkStatus();
    }
  };
</script>

<style lang="scss">
  .shop-role-container {
    .mw-form {
      width: 60% !important;
    }

    .authority-list {
      max-height: 600px;
      overflow: auto;

      .title {
        font-size: 16px;
        padding-left: 150px;
        margin-top: 10px;
        border-top: 1px dashed #ddd;

        > label:first-child {
          position: absolute;
          left: 0;
        }
      }

      .el-checkbox-group {
        font-size: 14px;
        padding-left: 150px;

        label:first-child {
          position: absolute;
          left: 0;
        }
      }

      .el-checkbox {
        margin-right: 30px;

        + .el-checkbox {
          margin-left: 0;
        }
      }
    }
  }
</style>
