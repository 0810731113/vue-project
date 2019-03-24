<template>
  <div class="cookbook-form-container">
    <cook-book-relation-modal
      :decround="form.decround"
      :itemType="0"
      :withDiscountPrice="true"
      :menuList="menuList"
      :onChangeLinkedMenu="onChangeLinkedMenu"
      :fetchAllMenuItems="fetchAllMenuItems"
      :onSalePriceChange="onSalePriceChange"
      title="选择菜品"
      :linkedMenus="linkedMenus"
      :rightTable="rightTable"
      :treeData="menuClassifyList"
      ref="relationModal"
    >
      <el-form  slot="sideBar" class="mw-form-long" :model="form" ref="form" :rules="rules" label-width="90px">
        <!--<el-form-item label="菜单编号" prop="cookid">-->
          <!--<el-input v-model="form.cookid" :disabled="true" placeholder="请输入菜品编号" :maxlength='INPUT_MAX_LENGTH'></el-input>-->
        <!--</el-form-item>-->
        <el-form-item style="margin-bottom: 30px" label="菜单名称" prop="cookname">
          <el-input v-model="form.cookname" placeholder="请输入菜品名称" :maxlength='10'></el-input>
        </el-form-item>
        <!--<el-form-item label="调价幅度">-->
          <!--<el-input-number v-model="form.priceRange" :min="1" :max="100" style="width: 92%">%</el-input-number>-->
          <!--<span>%</span>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="包含菜品">-->
          <!--<el-button v-model="form.menuItemCount" @click="onShowModalClick">-->
            <!--已选择{{ linkedMenus.length }}个-->
          <!--</el-button>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="小数位处理">-->
          <!--<el-radio-group v-model="form.decround">-->
            <!--<el-radio v-for="item in DECIMAL_ROUND" :key="item.id" :label="item.id">{{item.name}}</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="状态">-->
          <!--<el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>-->
        <!--</el-form-item>-->
        <!--<el-form-item class="operation-item">-->
          <!--<el-button class="btn-cancel" @click="onCancel">取消</el-button>-->
          <!--<el-button class="btn-submit" @click="onSubmit">保存</el-button>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </div>
    </cook-book-relation-modal>
  </div>
</template>

<script>
  import { mapActions, mapState, mapMutations } from 'vuex';
  import { CookBookRelationModal } from 'views/common';
  import { validateName, validateId } from 'utils/validateUtil';
  import { TRUE, FALSE, FORBIDDEN, OK } from 'constant/statusCode';
  import {
    ON_TEXT,
    OFF_TEXT,
    INPUT_MAX_LENGTH,
    NO_FRACTION,
    ONE_DECIMAL_FRACTION,
    TWO_DECIMAL_FRACTION,
    DECIMAL_ROUND
  } from 'constant/constants';
  import cloneDeep from 'lodash/cloneDeep';
  // 价格去尾数
  const settlePrice = (price, decround) => {
    price += '';
    const int = price.split('.')[0];
    const float = price.split('.')[1] || '0';
    if (decround === 0) {
      price = int + '.' + float.slice(0, 2);
    } else if (decround === 1) {
      price = int + '.' + float.slice(0, 1);
    } else {
      price = int;
    };

    return +price;
  };

  export default {
    name: 'CookBook',
    components: { CookBookRelationModal },
    props: ['toCookBookGuId', 'refreshTableFromServer','toastWarning'],
    data () {
      return {
        FORBIDDEN,
        OK,
        TRUE,
        FALSE,
        ON_TEXT,
        OFF_TEXT,
        INPUT_MAX_LENGTH,
        NO_FRACTION,
        ONE_DECIMAL_FRACTION,
        TWO_DECIMAL_FRACTION,
        DECIMAL_ROUND,
        form: {
          cookid: '',
          cookname: '',
          priceRange: 100,
          menuItemCount: 1,
          decround: 0,
          status: OK
        },
        linkedMenus: [],
        rightTable: [
          { key: 'itemName', name: '菜品' },
          { key: 'orderUint', name: '规格' },
          { key: 'salePrice', name: '标准价' }
        ],
        rules: {
//          cookid: [
//            { required: true, message: '这是必填字段', trigger: 'blur, change' },
//            { validator: validateId, trigger: ['blur', 'change'] }
//          ],
          cookname: [
            { required: true, message: '这是必填字段', trigger: 'blur, change' },
            { validator: validateName, trigger: 'blur, change' }
          ]
        },
        isEdit: !!this.toCookBookGuId
      };
    },
    watch: {
      'form.decround' () {
        if (!this.isEdit) {
          this.linkedMenus.forEach(item => {
            item.cbSalePrice = settlePrice(item.salePrice * this.form.priceRange / 100, this.form.decround);
          });
        }
      },
      'form.priceRange' () {
        if (!this.isEdit) {
          this.linkedMenus.forEach(item => {
            item.cbSalePrice = settlePrice(item.salePrice * this.form.priceRange / 100, this.form.decround);
          });
        }
      }
    },
    async created () {
      if (this.isEdit) {
        const cookGuid = this.toCookBookGuId;
        await this.fetchCompanyMenuClassify({ type: 3 });
        await this.fetchCookBookItem({ operate: 'edit', cookGuid });
        await this.fetchCompanyLinkedMenuList({ cookGuid });
      } else {
        await this.fetchCookBookItem({ operate: 'add' });
        await this.fetchCompanyMenuClassify({ type: 3 });
      }
      this.init();
    },
    computed: mapState({
      menuClassifyList: state => state.common.menuClassifyList,
      cookBookItem (state) {
        // 是添加菜品时默认状态为启用
        const cookBookItem = cloneDeep(state.dishLibrary.cookBook.cookBookItem);
        if (!this.isEdit) {
          cookBookItem.status = 1;
        }
        return cookBookItem;
      },
      menuList: state => state.dishes.explain.menuList,
      linkedMenuList: state => state.dishLibrary.cookBook.linkedMenuList,
      error: state => state.error
    }),
    methods: {
      ...mapActions([
        'fetchCompanyMenuClassify',
        'fetchCookBookItem',
        'saveCookBookItem',
        'fetchAllMenuItems',
        'fetchCompanyLinkedMenuList'
      ]),
      ...mapMutations([
        'CHANGE_COOK_VISIBLE'
      ]),
      init () {
        const { cookname, decround, priceRange } = this.cookBookItem;
        this.form = {
          ...this.form,
          ...this.cookBookItem,
          cookname: cookname || '',
          decround: decround || DECIMAL_ROUND[0].id,
          priceRange: priceRange || 100
        };
        // 是新增时候将编辑时传入的linkedMenus清空
        if (this.isEdit) {
          this.linkedMenus = this.linkedMenuList.slice();
        } else {
          this.linkedMenus = [];
        }
      },
      onChangeLinkedMenu (item) {
        // item.cbSalePrice = item.salePrice * this.form.priceRange / 100;

        item.cbSalePrice = settlePrice(item.salePrice * this.form.priceRange / 100, this.form.decround);

        const index = this.linkedMenus.findIndex(menu => menu.itemCd === item.itemCd && menu.orderUintCd === item.orderUintCd);
        if (index >= 0) {
          this.linkedMenus.splice(index, 1);
        } else {
          this.linkedMenus.push(item);
        }
      },
      onSalePriceChange (value, item) {
        const editedItem = cloneDeep(item);
        const index = this.linkedMenus.findIndex(menu => menu.itemCd === item.itemCd && menu.orderUintCd === item.orderUintCd);
        if (index >= 0) {
          this.linkedMenus.splice(index, 1, editedItem);
        }
        //if (this.isEdit) {
          this.linkedMenus[index].cbSalePrice = value;
        //}
      },
      async onShowModalClick () {
        await this.fetchCompanyMenuClassify();
        this.$refs.relationModal.isShow = true;
      },
      async onSubmit () {
        if (!this.validateForm()) return;
        var linkedDishes = this.linkedMenus
        console.log(linkedDishes)
        for(var i = 0; i < linkedDishes.length; i++){
          var price = linkedDishes[i].cbSalePrice
          if(!price){
            this.toastWarning({type: 'warning',text:'菜品售价为必填项，检查到部分菜品售价未填写，请检查'})
            return
          }
          if(!/^\d+(\.\d{1,2})?$/.test(price)){
            this.toastWarning({type: 'warning',text:'请输入正确的菜品售价'})
            return
          }
        }

        await this.saveCookBookItem({ info: this.form, menuItems: this.linkedMenus, noShowError: true });
        const { errorStatus, errorMsg } = this.error;
        if (!errorStatus) {
          this.$toast.show({ content: '保存成功!', type: 'success' });
          setTimeout(() => {
            this.CHANGE_COOK_VISIBLE();
            this.refreshTableFromServer();
          }, 2000);
        } else {
          const dishName = `菜单(${errorMsg.split('!')[1]})已存在,请重新修改`;
          this.$toast.show({ content: dishName, type: 'warning' });
        }
      },
      validateForm () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });

        return validForm;
      },
      onCancel () {
        this.CHANGE_COOK_VISIBLE();
      }
    }
  };
</script>

<style lang="scss">
.cookbook-form-container {
  .relation-modal {
    width: 90% !important;

    .dishes-transfer {
      /*width: 45% !important;*/
    }

    .relation-tree {
      //width: 21%;
    }

    .el-radio {
      display: block;
      margin-left: 0;
      margin-bottom: 5px;
    }

    /*.operation-item .el-form-item__content {*/
      /*margin-left: 10px !important;*/
    /*}*/
  .operation-item{
    /*margin: 24px 6px;*/
    /*display: flex;*/
    /*justify-content: center;*/

  }


    .mw-form-long {
      /*display: inline-block;*/
      /*vertical-align: top;*/
      width: 90%;
      padding-left: 15px;

      //padding: 0 20px;
    }

    /*.btn-cancel,*/
    /*.btn-submit {*/
      /*width: 45%;*/
    /*}*/
  }
}
</style>
