<template>
  <el-form class="shop-user mw-form" label-width="140px" ref="form" :rules="rules" :model="form" @submit.prevent.native>
    <!--    <el-form-item label="员工代码:" prop="staffId">
          <el-input placeholder="请输入员工代码" v-model="form.staffId" :maxlength='20'></el-input>
        </el-form-item>-->
    <el-form-item label="员工名称:" prop="shopUserName">
      <el-input placeholder="请输入员工名称" v-model="form.shopUserName" :maxlength='50'></el-input>
    </el-form-item>
    <el-form-item label="所属部门:">
      <el-select v-model="form.deptId" placeholder="请选择">
        <el-option
          v-for="item in deparmentList"
          :key="item.deptId"
          :label="item.deptName"
          :value="item.deptId">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="是否销售人员:">
      <el-checkbox v-model="form.isSales" :true-label="1" :false-label="0"></el-checkbox>
    </el-form-item>
    <el-form-item label="手机号码:">
      <el-input placeholder="请输入手机号码" v-model="form.cellphone" :maxlength='20'></el-input>
    </el-form-item>
    <el-form-item label="登录账号:" prop="shopUserId">
      <el-input placeholder="请输入登录账号" v-model="form.shopUserId" :maxlength='20' :disabled="isEdit"></el-input>
    </el-form-item>
    <el-form-item label="登录密码:" prop="pwd">
      <el-input type="password" placeholder="请输入登录密码" v-model="form.pwd" :maxlength='6'></el-input>
    </el-form-item>
    <el-form-item label="IC卡编码:" prop="iccardCode">
      <el-input placeholder="请输入IC卡编码" v-model="form.iccardCode" :maxlength='20'></el-input>
    </el-form-item>
    <el-form-item label="备注:">
      <el-input placeholder="请输入备注" v-model="form.note" :maxlength='250'></el-input>
    </el-form-item>
    <el-form-item label="状态:">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
    </el-form-item>
    <el-form-item label="职务角色:">
      <el-checkbox-group v-model="selectedUsers">
        <el-checkbox v-for="item in form.userRoleDtos" :label="item.roleId" :key="item.roleId">{{item.roleName}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="允许折扣方案:">
      <el-radio v-model="form.isDiscount" :label="0">不限</el-radio>
      <el-radio v-model="form.isDiscount" :label="1">指定</el-radio>
      <el-button class="btn-base" @click="onShowDiscount">已选择 {{ discountCount }} 个</el-button>
    </el-form-item>
    <el-form-item label="允许退菜菜品:">
      <el-radio v-model="form.isRetreatFood" :label="0">不限</el-radio>
      <el-radio v-model="form.isRetreatFood" :label="1">指定</el-radio>
      <el-button class="btn-base" @click="onShowRelation('retreatMenu')">已选择 {{ form.menuRetreatCount }} 个</el-button>
    </el-form-item>
    <el-form-item label="允许赠菜菜品:">
      <el-radio v-model="form.isGift" :label="0">不限</el-radio>
      <el-radio v-model="form.isGift" :label="1">指定</el-radio>
      <el-button class="btn-base" @click="onShowRelation('giftMenu')">已选择 {{ form.menuGiveCount }} 个</el-button>
    </el-form-item>
    <el-form-item label="允许最大折扣率(%):" prop="userDiscount">
      <el-input-number class="max-discount" v-model="form.userDiscount" :min='0' :max='100' :controls="false"></el-input-number>
      <span class="tip">(请输入0-100的整数,打九折折扣率为10%)</span>
    </el-form-item>
    <el-form-item label="账单优化权限:">
      <el-radio v-model="form.billAuthority" :label="0">是</el-radio>
      <el-radio v-model="form.billAuthority" :label="1">否</el-radio>
    </el-form-item>
    <el-form-item label="允许查看账单分类:">
      <el-radio v-model="form.billClass" :label="0">A类</el-radio>
      <el-radio v-model="form.billClass" :label="1">B类</el-radio>
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button @click="onCancel" class="btn-cancel">取消</el-button>
      <el-button native-type='submit' type="primary" class="btn-submit" @click="onSubmit">保存</el-button>
    </el-form-item>
    <relation-modal
      :type="type"
      :treeData="menuClassList"
      :itemType="ITEMTYPE.ALL"
      :menuList="menuList"
      :linkedMenus="linkedMenus"
      :fetchAllMenuItems="fetchAllMenuItems"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :onSelectedSubmitMenu="onChangeMenuCount"
      :rightTable="rightTable"
      ref="relation" />
    <discount-plan-list
      :selectedDiscount="selectedDiscount"
      :onSelectedDiscount="onSelectedDiscount"
      ref="discount" />
  </el-form>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { OK, FORBIDDEN } from 'constant/statusCode';
  import { validateName, validateId, validateNumber } from 'utils/validateUtil';
  import { ON_TEXT, OFF_TEXT, ITEMTYPE, ITEMKIND } from 'constant/constants';
  import { RelationModal } from 'views/common';
  import { DiscountPlanList } from '../components/index';

  export default {
    name: 'shopUser',
    components: {
      RelationModal,
      DiscountPlanList
    },
    data () {
      return {
        OK,
        ITEMTYPE,
        ITEMKIND,
        FORBIDDEN,
        ON_TEXT,
        OFF_TEXT,
        form: {
          staffId: '',
          shopUserName: '',
          deptId: '',
          isSales: 0,
          cellphone: '',
          shopUserId: '',
          pwd: '',
          iccardCode: '',
          note: '',
          isDiscount: 0,
          isRetreatFood: 0,
          userDiscount: 0,
          isGift: 0,
          status: OK,
          menuGiveCount: 0,
          menuRetreatCount: 0,
          userMenuItemGive: [],
          billAuthority: 1,
          billClass: 0
        },
        oldname: '',
        type: '',
        discountCount: 0,
        selectedDiscount: [],
        linkedMenus: [],                              // 退菜菜品或赠菜菜品弹窗已添加菜品的集合,为null表示
        retreatMenuCliclk: false,                     // 退菜菜品是否已点击
        giftClick: false,                             // 赠菜菜品是否已点击
        selectedUsers: [],
        selectedMenuItem: [],                         // 退菜菜品和赠菜菜品两个list的集合
        rightTable: [
          { key: 'itemName', name: '菜品' },
          { key: 'orderUint', name: '规格' },
          { key: 'salePrice', name: '标准价' }
        ],
        rules: {
          staffId: [
            { required: true, message: '请输入员工代码', trigger: ['blur', 'change'] },
            { validator: validateId, trigger: ['blur', 'change'] }
          ],
          shopUserName: [
            { required: true, message: '请输入员工名称', trigger: ['blur', 'change'] },
            { validator: validateName, trigger: ['blur', 'change'] }
          ],
          shopUserId: [
            { required: true, message: '请输入登录账号', trigger: ['blur', 'change'] }
          ],
          iccardCode: [
            { required: false, message: '编码只能输入数字和字母', trigger: ['blur', 'change'] },
            { validator: validateId, trigger: ['blur', 'change'] }
          ],
          pwd: [
            { required: true, message: '请输入登录密码', trigger: ['blur', 'change'] },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ],
          userDiscount: [
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.deptId
      };
    },
    async created () {
      const { isEdit } = this;
      const id = this.$route.params.id || this.staffId;
      await this.getShopUserDetail({ staffId: isEdit ? id : null, operate: isEdit ? 'edit' : 'add' });
      await this.fetchShopDeptList({ deptCls: 0, isPage: 0 });
      this.form = { ...this.form, ...this.shopUserDetail };
      await this.fetchAllDiscountPlan({ shopUserId: id });
      if (isEdit) {
        await this.init();
      }
    },
    computed: {
      ...mapState({
        shopUserDetail: state => state.employe.shopUser.shopUserDetail,
        deparmentList: state => state.employe.department.deparmentList,
        errorStatus: state => state.error.errorStatus,
        menuList: state => state.dishes.explain.menuList,
        menuClassList () {
          const { classList } = this.$store.state.dishes.menu;
          return [{ children: classList, menuClsName: '全部分类', menuClsKind: '1' }];
        }
      })
    },
    methods: {
      ...mapActions([
        'getShopUserDetail',
        'updateShopUserInfo',
        'fetchMenuClassList',
        'fetchAllMenuItems',
        'fetchShopDeptList',
        'fetchAllDiscountPlan'
      ]),
      async init () {
        const { userRoleDtos, shopUserName, userDiscountItemDtos, userMenuItemGive } = this.form;
        this.discountCount = userDiscountItemDtos.length;
        userDiscountItemDtos.map(item => {
          this.selectedDiscount.push(item.discountId);
        });
        this.oldname = shopUserName;
        userRoleDtos.map(item => {
          if (item.check === 1) {
            this.selectedUsers.push(item.roleId);
          }
        });
        userMenuItemGive.map(item => {
          this.selectedMenuItem.push({ itemCd: item.itemCd, type: item.type, orderUintCd: item.orderUintCd });
        });
      },
      onShowDiscount (row) {
        this.$refs.discount.isShow = true;
      },
      onSelectedDiscount (param) {
        this.discountCount = param.length;
        this.selectedDiscount = param;
      },
      async onShowRelation (type) {
        if ((type === 'retreatMenu' && !this.retreatMenuCliclk) || (type === 'giftMenu' && !this.giftMenuCliclk)) {
          await this.fetchMenuClassList();
          await this.fetchAllMenuItems({ itemKind: ITEMKIND.DISH, menuClsId: 0, itemType: ITEMTYPE.SINGLE });
          const selectMenu = [];
          this.form.userMenuItemGive.map(item => {
            if (item.type === 0) {
              selectMenu.push(item);
            } else {
              selectMenu.push(item);
            }
          });

          const items = [];
          this.menuList.map(item => {
            selectMenu.map(menu => {
              if (item.itemCd === menu.itemCd && item.orderUintCd === menu.orderUintCd) {
                if (type === 'retreatMenu' && +menu.type === 0) {
                  items.push(item);
                } else if (type === 'giftMenu' && +menu.type === 1) {
                  items.push(item);
                }
              }
            });
          });
          this.linkedMenus = items;
        }
        type === 'retreatMenu' ? (this.retreatMenuCliclk = true) : (this.giftMenuCliclk = true);

        this.type = type;
        const relation = this.$refs.relation;
        relation.isShow = true;
      },
      onChangeLinkedMenu (item) {
        const index = this.linkedMenus.findIndex(menu =>
          menu.itemCd === item.itemCd && menu.orderUintCd === item.orderUintCd
        );
        if (index >= 0) {
          this.linkedMenus.splice(index, 1);
        } else {
          this.linkedMenus.push(item);
        }
      },
      onChangeMenuCount (datas) {
        const { itemCds, type } = datas;
        this.form.menuCount = itemCds.length;
        /**
         * @description 根据type字符串来判断是退菜还是赠菜，正确做法是这里type应该用0和1区分，
         * @description 两种情况逻辑相同，不同在于添加时候type分别对应0和1
         */
        if (type === 'retreatMenu') {
          this.form.menuRetreatCount = itemCds.length;
          const indexArr = [];
          this.selectedMenuItem.forEach((item, index) => {
            if (+item.type === 0) {
              indexArr.unshift(index);
            }
          });
          indexArr.forEach(index => {
            this.selectedMenuItem.splice(index, 1);
          });
          this.linkedMenus.forEach((item, index) => {
            this.selectedMenuItem.push({ itemCd: item.itemCd, type: 0, orderUintCd: item.orderUintCd });
          });
          // this.linkedMenus.length = 0;
          // this.linkedMenus.push(...this.selectedMenuItem.filter(item => +item.type === 0));
        } else {
          this.form.menuGiveCount = itemCds.length; const indexArr = [];
          this.selectedMenuItem.forEach((item, index) => {
            if (+item.type === 1) {
              indexArr.unshift(index);
            }
          });
          indexArr.forEach(index => {
            this.selectedMenuItem.splice(index, 1);
          });
          this.linkedMenus.forEach((item, index) => {
            this.selectedMenuItem.push({ itemCd: item.itemCd, type: 1, orderUintCd: item.orderUintCd });
          });
          // this.linkedMenus.length = 0;
          // this.linkedMenus.push(...this.selectedMenuItem.filter(item => +item.type === 1));
        }
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return validForm;

        const { isEdit, form, oldname, selectedMenuItem, selectedDiscount, selectedUsers } = this;
        const itemParam = {
          ...form,
          userMenuItemGive: selectedMenuItem,
          userDiscountItem: selectedDiscount.toString(),
          userRoleItem: selectedUsers.toString()
        };
        const data = { shopUserItemDto: itemParam, operate: isEdit ? 'edit' : 'add', oldname };
        delete data.shopUserItemDto.userDiscountItemDtos;
        delete data.shopUserItemDto.userRoleDtos;
        await this.updateShopUserInfo(data);

        if (this.errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.$router.back();
        }
        return validForm;
      },
      onCancel () {
        this.$router.back();
      }
    }
  };
</script>

<style lang='scss'>
  .mw-form {
    width: 45%;

    .el-form-item__content {
      margin-left: 140px;

      .max-discount {
        width: 400px;
      }
    }
  }
</style>
