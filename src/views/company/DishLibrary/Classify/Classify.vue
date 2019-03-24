<template>
  <el-form class="classify-form mw-form" :rules="rules" ref="form" :model="form" label-width="120px">
    <el-form-item label="分类级别" prop="level" v-if="!isSetMeal">
      <el-cascader
        :options="levelOption"
        :disabled="isEdit && (classifyDetail.level === FIRST_LEVEL)"
        :props="defaultProps"
        v-model="form.level"
        class="width-full" />
    </el-form-item>
    <el-form-item label="分类名称" prop="menuClsName">
      <el-input v-model="form.menuClsName" placeholder="2-30个字符，支持中文、英文、数字" />
    </el-form-item>
    <el-form-item label="分类类型" prop="menuClsKind" v-if="!isGuide && !isSetMeal">
      <el-radio-group v-model="form.menuClsKind">
        <el-radio
          v-for="item in MENUCLS_KIND"
          v-if="!+form.level[0] ? true : item.label < 2"
          :key="item.label"
          :label="item.label"
          :disabled="isEdit">
        {{ item.name }}
      </el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="销售归属" prop="expClsId">
      <el-select v-model="form.expClsId" class="width-full">
        <div class="el-select-dropdown__item option-add" v-show="!isGuide" @click="onShowModal('sale')">添加新归属</div>
        <el-option
          v-for="item in expclsList"
          :key="item.expClsId"
          :label="item.expClsName"
          :value="item.expClsId"/>
      </el-select>
    </el-form-item>
    <el-form-item label="收入归属" prop="revenueTypeId">
      <el-select v-model="form.revenueTypeId" class="width-full">
        <div class="el-select-dropdown__item option-add" v-show="!isGuide" @click="onShowModal('income')">添加新归属</div>
        <el-option
          v-for="item in revenueTypeList"
          :key="item.revenueTypeId"
          :label="item.revenueTypeName"
          :value="item.revenueTypeId"/>
      </el-select>
    </el-form-item>
    <div v-if="!isSetMeal && checkIsShop()">
      <el-form-item label="打印部门" prop="isPrn" v-show="form.menuClsKind == MENUCLS_KIND[0].label">
        <el-select v-model="form.isPrn" class="width-full">
          <el-option
            v-for="item in MENU_PRINT_TYPE"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="deptId" v-show="(form.menuClsKind == MENUCLS_KIND[0].label) && (form.isPrn == MENU_PRINT_TYPE[1].id)">
        <el-select v-model="form.deptId" class="width-full">
          <el-option
            v-for="item in printDeptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="menuClsMuldept" v-show="(form.menuClsKind == MENUCLS_KIND[0].label) && (form.isPrn == MENU_PRINT_TYPE[2].id)">
        <multi-menu-print
          ref="multi-menu-print"
          v-model="form.menuClsMuldept"
          :printDeptList="printDeptList"
        />
      </el-form-item>
    </div>
    <el-form-item label="分类状态" prop="status">
      <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN" />
    </el-form-item>
    <el-form-item class="operation-item">
      <el-button v-show="!isGuide" class="btn-cancel" @click="onCancel">取消</el-button>
      <el-button type="primary" @click="onSubmit" class="btn-submit">保存</el-button>
    </el-form-item>
    <el-form-item class="btn-wrapper error-wrapper" v-if="!!menuClsError && isGuide">
      <div>
        <i class="el-icon-circle-cross"></i>
        {{ menuClsError }}
      </div>
    </el-form-item>
    <attribution-modal
      :type="attributionType"
      tilte="添加归属"
      :onSaveAttribution="onSaveAttribution"
      ref="attribution" />
  </el-form>
</template>

<script>
import { isShop } from 'utils/configUtil';
import { mapActions, mapState } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import { AttributionModal, MultiMenuPrint } from 'views/shop/Dishes/components';
import { OK, FORBIDDEN, UNCLASSIFIED } from 'constant/statusCode';
import { MENUCLS_KIND, ITEMKIND, FIRST_LEVEL, THIRD_LEVEL, ON_TEXT, OFF_TEXT, MENU_PRINT_TYPE } from 'constant/constants';
import { validateDishName } from 'utils/validateUtil';

export default {
  name: 'classify',
  props: ['isGuide', 'isSetMeal', 'editId', 'level', 'onClickSubmit'],
  components: {
    MultiMenuPrint,
    AttributionModal
  },
  data () {
    return {
      OK,
      FORBIDDEN,
      ON_TEXT,
      OFF_TEXT,
      FIRST_LEVEL,
      MENUCLS_KIND,
      UNCLASSIFIED,
      MENU_PRINT_TYPE,
      form: {
        menuClsId: 0,
        level: ['0'],
        menuClsName: '',
        menuClsKind: 1,
        expClsId: UNCLASSIFIED,
        revenueTypeId: UNCLASSIFIED,
        status: 1,
        deptId: null,
        isPrn: MENU_PRINT_TYPE[0].id,
        menuClsMuldept: []
      },
      rules: {
        level: [{ required: true }],
        menuClsName: [
          { validator: validateDishName, trigger: ['blur', 'change'] },
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] },
          { min: 2, max: 30, message: '2-30个字符，支持中文、英文、数字', trigger: ['blur', 'change'] }
        ],
        menuClsKind: [{ required: true }],
        expClsId: [{ required: true, message: '请输入销售归属', trigger: ['blur', 'change'] }],
        revenueTypeId: [{ required: true, message: '请输入收入归属', trigger: ['blur', 'change'] }],
        status: [{ required: true }]
      },
      defaultProps: {
        value: 'menuClsId',
        label: 'menuClsName',
        children: 'children'
      },
      attributionType: '',
      menuClsError: '',
      isEdit: !!this.$route.params.id || !!this.editId
    };
  },
  computed: mapState({
    classifyList: state => state.dishes.classify.allClassify,
    expclsList (state) {
      return [{ expClsId: UNCLASSIFIED, expClsName: '未分组' }].concat(state.dishes.classify.expclsList);
    },
    revenueTypeList (state) {
      return [{ revenueTypeId: UNCLASSIFIED, revenueTypeName: '未分组' }].concat(state.dishes.classify.revenueTypeList);
    },
    classifyDetail: state => state.dishes.classify.detail,
    lastId: state => state.dishes.classify.lastId,
    printDeptList: state => state.dishes.menuPrint.printDeptList,
    error: state => state.error,
    levelOption () {
      let levelItems = this.classifyList.map(item => {
        const { menuCount, children } = item;
        item.disabled = menuCount;
        if (children) {
          children.map(item => delete item.children);
        }
        return item;
      });
      levelItems.unshift({ menuClsId: '0', menuClsName: '全部分类' });
      return levelItems;
    }
  }),
  async created () {
    const { id } = this.$route.params;
    this.checkIsShop() && await this.getAllPrintDept();
    await this.fetchAllClassify();
    await this.fetchAllExpcls();
    await this.fetchAllRevenueType();
    if (this.isEdit) {
      const editId = id || this.editId;
      await this.fetchClassifyDetail(editId);
      this.initData(this.classifyDetail);
    } else {
      await this.getClassifyNewId();
      let { level } = this.$route.query;
      this.form.menuClsId = +this.lastId;
      if (this.isGuide) {
        level = this.level;
      }
      this.form.level = level && level[0] ? level : ['0'];

      if (!this.checkIsShop()) {
        return null;
      }
      this.form.deptId = this.printDeptList ? this.printDeptList[0].deptId : null;
    }
  },
  methods: {
    ...mapActions([
      'fetchAllClassify',
      'saveClassify',
      'updateClassify',
      'fetchClassifyDetail',
      'getClassifyNewId',
      'fetchAllRevenueType',
      'fetchAllExpcls',
      'saveExpcls',
      'saveRevenueType',
      'getAllPrintDept'
    ]),
    initData (editData) {
      let level = [editData.menuClsId_P];
      if (editData.level === THIRD_LEVEL) {
        this.levelOption.map(item => {
          if (item.children) {
            const subItem = item.children.find(subItem => subItem.menuClsId === editData.menuClsId_P);
            if (subItem) {
              level.unshift(subItem.menuClsId_P);
            }
          }
        });
      }

      const getDeptId = () => {
        if (!this.checkIsShop()) {
          return null;
        }
        if (editData.isPrn === MENU_PRINT_TYPE[1].id) {
          return editData.deptId;
        }
        return this.printDeptList ? this.printDeptList[0].deptId : null;
      };

      this.form = {
        ...editData,
        menuClsId: editData.menuClsId,
        level,
        deptId: getDeptId(),
        menuClsMuldept: editData.isPrn === MENU_PRINT_TYPE[2].id ? cloneDeep(editData.menuClsMuldept) : []
      };
    },
    async onSubmit () {
      this.menuClsError = '';
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });
      if (!validForm) return;
      const { form, isGuide, isSetMeal } = this;
      const selectedItem = this.levelOption.find(item => item.menuClsId === form.level[0]);
      const menuClsFullName = selectedItem.menuClsName;
      const level = !+form.level[0] ? 0 : form.level.length;
      const departId = (form.isPrn === MENU_PRINT_TYPE[1].id) ? form.deptId : null;
      const multiDepart = (form.isPrn === MENU_PRINT_TYPE[2].id) ? form.menuClsMuldept : [];
      let data = { ...form, level, menuClsId_P: level ? form.level[level - 1] : 0, menuClsFullName, deptId: departId, menuClsMuldept: multiDepart };
      if (isSetMeal) {
        data = { ...data, menuClsKind: ITEMKIND.SETMEAL };
      }

      if (this.isEdit) {
        const { level, menuClsName, menuClsFullName, expClsId, menuClsKind, menuClsId, menuClsId_P, status, revenueTypeId, dtlLvl, deptId, isPrn, menuClsMuldept } = data;
        await this.updateClassify({
          noShowError: isGuide,
          level,
          menuClsName,
          menuClsFullName,
          expClsId,
          menuClsKind,
          menuClsId,
          menuClsId_P,
          status,
          dtlLvl,
          revenueTypeId,
          deptId,
          isPrn,
          menuClsMuldept: isPrn === MENU_PRINT_TYPE[2].id ? menuClsMuldept : []
        });
      } else {
        await this.saveClassify({ ...data, noShowError: isGuide });
      }

      const { errorStatus, errorMsg } = this.error;
      if (errorStatus) {
        this.menuClsError = errorMsg;
      }

      if (this.isGuide && !errorStatus) {
        this.onClickSubmit();
        return;
      }
      if (!errorStatus) {
        this.$router.back();
      }
    },
    onCancel () {
      this.$router.back();
    },
    onShowModal (type) {
      this.$refs.attribution.isShow = true;
      this.attributionType = type;
    },
    async onSaveAttribution (type, params) {
      const { name, status } = params;
      if (type === 'sale') {
        await this.saveExpcls({ expClsName: name, status });
        await this.fetchAllExpcls();

        if (!this.error.errorStatus) {
          this.form.expClsId = this.expclsList.find(item => item.expClsName === name).expClsId;
        }
      } else {
        await this.saveRevenueType({ revenueTypeName: name, status });
        await this.fetchAllRevenueType();
        if (!this.error.errorStatus) {
          const item = this.revenueTypeList.find(item => item.revenueTypeName === name);
          this.form.revenueTypeId = item ? item.revenueTypeId : null;
        }
      }
    },
    checkIsShop () {
      return isShop();
    }
  }
};
</script>

<style lang="scss">
.classify-form {
  width: 50%;

  .error-wrapper {
    margin-bottom: 0;
    color: #ff4949;
  }

  .el-select-dropdown {
    .option-add {
      color: #fff;
      font-size: 14px;
      background: #c7c7c7;
    }
  }
}
</style>
