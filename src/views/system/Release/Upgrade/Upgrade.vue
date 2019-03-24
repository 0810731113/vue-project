<template>
  <div class="upgrade-edit">
    <el-form class="mw-form" label-width="80px" ref="form" :rules="rules" :model="form">
      <el-form-item label="软件类型" prop="softId">
        <el-select v-model="form.softId" :disabled="isEdit" placeholder="请选择" class="width-full">
          <el-option
            v-for="item in softList"
            :key="item.id"
            :label="item.name"
            :value="item.id.toString()" />
        </el-select>
      </el-form-item>
      <el-form-item label="发布渠道">
        <el-select v-model="form.publishChannel" class="width-full">
          <el-option
            v-for="item in PUBLISH_CHANNEL"
            :key="item.value"
            :label="item.name"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="更新内容" prop="upContent">
        <el-input placeholder="请输入更新内容" v-model="form.upContent" :maxlength="200" />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input placeholder="请输入版本号" v-model="form.version" :maxlength="20" />
      </el-form-item>
      <el-form-item label="文件名称" prop="fileName">
        <el-input placeholder="请输入文件名称" v-model="form.fileName" :maxlength="20" />
      </el-form-item>
      <el-form-item label="文件地址" prop="fileUrl">
        <el-input placeholder="请输入文件地址" v-model="form.fileUrl" :maxlength="200" />
      </el-form-item>
      <el-form-item label="校验码">
        <el-input placeholder="请输入校验码" v-model="form.checkCode" :maxlength="100" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input placeholder="请输入备注" v-model="form.note" :maxlength="50" />
      </el-form-item>
      <el-form-item label="升级方式">
        <el-select v-model="form.updateType" class="width-full">
          <el-option
            v-for="item in UPGRADE_TYPE"
            :key="item.value"
            :label="item.name"
            :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="升级门店">
        <el-select v-model="form.publishType" placeholder="请选择" class="width-full">
          <el-option
            v-for="item in upgradeOptions"
            :key="item.value"
            :label="item.value"
            :value="item.label">
          </el-option>
        </el-select>
        <!--<div class='city-contain' v-show="form.publishType === 1">-->
          <!--<citys :selected="citys" :getSelectValue="getSelectValue" class="width-full"/>-->
        <!--</div>-->
        <div class='btn-base-contain' v-show="form.publishType === 2">
          <el-button  class="btn-base" @click="onShowModal">选取门店</el-button>
          <el-table border :data="shopList" max-height="300">
            <el-table-column  align="center" label="公司名称" prop="companyname"/>
            <el-table-column align="center" label="门店名称" prop="shopname" />
            <el-table-column align="center" label="删除">
              <template slot-scope="scope">
                <mw-button class="btn-delete" content="删除" @click="spliceShopList(scope.$index)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class='btn-base-contain' v-show="form.publishType === 3">
          <el-button class="btn-base" @click="handlerSelectBrand">选择品牌</el-button>
          <el-table border :data="brandList" max-height="300">
              <el-table-column align="center" label="品牌名称" prop="brandName" />
              <el-table-column align="center" label="门店名称" prop="shopName" />
              <el-table-column align="center" label="删除">
                <template slot-scope="scope">
                  <mw-button class="btn-delete" content="删除" @click="spliceBrandList(scope.$index)" />
                </template>
              </el-table-column>
            </el-table>
          <el-dialog title="选择品牌" custom-class="base-modal" :visible.sync="dialogFormVisible">
            <el-form class="dialog-form-brand clear" onsubmit="return false;">
              <span class="select-brand fl">选择品牌</span>
              <div class="search-form fl">
                <el-input placeholder="请输入品牌名称" v-model="brandData" @keyup.enter.native="searchCompanyList(brandData)">
                <el-button slot="append" icon="el-icon-search" @click="searchCompanyList(brandData)"></el-button>
                </el-input>
              </div>
            </el-form>
            <ul class="company-list" v-show="companyList.length">
              <li
                @click="selectBrandName(company.companyName)"
                :class="company.companyGUID === companyGUID ? 'selected-brand' : ''"
                v-for="company in companyList"
                :key="company.companyGUID" >
                <el-radio v-model="companyGUID" :label="company.companyGUID">
                  {{ company.companyName }}
                </el-radio>
              </li>
            </ul>
            <div slot="footer" class="dialog-footer">
              <el-button class="el-button el-button--default btn-submit" type="primary" @click="fetchCompanyAfterBrand">确 定</el-button>
              <div class="tip-select" v-if="this.companyGUID === -1">请选择品牌</div>
            </div>
          </el-dialog>
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" class="width-full">
          <el-option label="已发布" :value="OK" />
          <el-option label="待发布" :value="PENDING" />
          <el-option label="删除" :value="DELETE" />
        </el-select>
      </el-form-item>
      <el-form-item class="operation-item">
        <el-button @click="onCancel" class="btn-cancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <ChooseShopModal
      v-model="selectedShops"
      errorMessage="请选择门店"
      ref="chooseShopModal"
      :selectShopList="shopList"
      :multiple="true"
      :isUpgrade="true"
      :onSubmit="onSubmitShop" />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { Citys, MwButton } from 'components';
import ChooseShopModal from 'system/Components/ChooseShopModal';
import { UPGRADE_TYPE, PUBLISH_CHANNEL } from 'constant/constants';
import { OK, PENDING, DELETE, ALL } from 'constant/statusCode';
import { DEFAULT_PAGE, MAX_PAGE_SIZE } from 'constant/pagination';
import { validateFileUrl } from 'utils/validateUtil';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'Upgrade',
  components: {
    Citys,
    MwButton,
    ChooseShopModal
  },
  data () {
    return {
      OK,
      PENDING,
      DELETE,
      UPGRADE_TYPE,
      PUBLISH_CHANNEL,
      citys: [],
      shopList: [],
      selectedShops: [],
      upgradeOptions: [
//        { value: '按省市区', label: 1 },
        { value: '按门店', label: 2 },
        { value: '按品牌', label: 3 }
      ],
      dialogFormVisible: false,           // 按品牌选取的dialog显示状态
      brandData: '',                      // 查询品牌Input输入值
      companyGUID: null,                  // 选择的品牌id,
      brandList: [],
      brandName: '',
      form: {
        softId: null,
        version: '',
        upContent: '',
        publishChannel: OK,
        fileName: '',
        fileUrl: '',
        checkCode: '',
        note: '',
        updateType: 2,
        status: PENDING,
        publishType: 2,
        shopJosn: '',
        shopNames: ''
      },
      rules: {
        softId: [
          { required: true, message: '请选择软件类型', trigger: 'blur, change' }
        ],
        upContent: [
          { required: true, message: '请输入更新内容', trigger: 'blur, change' }
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur, change' }
        ],
        fileName: [
          { required: true, message: '请输入文件名称', trigger: 'blur, change' }
        ],
        fileUrl: [
          { validator: validateFileUrl, trigger: 'blur' },
          { required: true, message: '请输入文件地址', trigger: 'blur, change' }
        ]
      },
      isEdit: false
    };
  },
  async created () {
    await this.fetchSoftwareList({
      pageIndex: DEFAULT_PAGE,
      pageSize: MAX_PAGE_SIZE
    });
    const { id, softId } = this.$route.params;
    const { version } = this.$route.query;

    if (id && softId && version) {
      this.isEdit = true;
      await this.fetchUpgradeDetail({ id, softId, version });
      const { publishType, shopJosn } = this.detail;
      if (+publishType === OK) {
//        const cityJson = JSON.parse(shopJosn.replace(/{/, '{"').replace(/:"/g, '":"').replace(/,/g, ',"'));
//        for (const key in cityJson) {
//          this.citys.push(cityJson[key]);
//        }
      } else if (+publishType === 2) {
        this.shopList = JSON.parse(shopJosn);
      } else {
        this.brandList = JSON.parse(shopJosn);
      }
      this.form = { ...this.detail, softId };
    }
  },
  computed: mapState({
    softList: state => state.release.software.list,
    detail: state => state.release.upgrade.detail,
    errorStatus: state => state.error.errorStatus,
    companyList: state => state.release.functionDetection.companyList,
    shopListFromBrand (state) {
      const brandName = this.brandName;
      const newCompanyList = [];
      const { shopList } = state.release.functionDetection;

      if (brandName) {
        shopList.forEach(item => {
          newCompanyList.push(Object.assign(item, { brandName }));
        });
      }

      return newCompanyList;
    }
  }),
  methods: {
    ...mapActions([
      'fetchSoftwareList',
      'fetchUpgradeDetail',
      'saveUpgrade',
      'fetchCompanyList',
      'fetchShopList'
    ]),
    getSelectValue (data) {
      this.citys = data;
    },
    onShowModal () {
      this.$refs.chooseShopModal.isShow = true;
    },
    onSubmitShop (shopItems) {
      this.shopList = cloneDeep(shopItems);
    },
    async onSubmit () {
      let validForm = true;
      this.$refs.form.validate((valid) => {
        validForm = valid;
      });

      if (!validForm) return;
      const { form, isEdit, shopList, brandList } = this;
      let shopJosn;

      // publishType ＝> 1:省市，2:门店, 3:品牌,  ...后续可能会有更多选项
      if (+form.publishType === OK) {
//        const [provinceId, cityId, countyId] = citys;
//        // 获取默认值0
//        const getInitState = (id) => {
//          if (id === 'undefined' || !id) {
//            id = '0';
//          }
//          return id;
//        };
//        shopJosn = `{Province:"${getInitState(provinceId)}",City:"${getInitState(cityId)}",County:"${getInitState(countyId)}"}`;
      } else if (+form.publishType === 2) {
        if (!shopList.length) {
          this.$toast.show({ content: '请选择门店', type: 'warning' });
          return;
        }
        shopJosn = JSON.stringify(shopList);
      } else {
        if (!brandList.length) {
          this.$toast.show({ content: '请选择品牌', type: 'warning' });
          return;
        }
        shopJosn = JSON.stringify(brandList);
      };
      const itemDto = { ...form, shopJosn };
      await this.saveUpgrade({ itemDto, operate: isEdit ? 'edit' : 'add' });
      if (!this.errorStatus) {
        this.onCancel();
      }
    },
    onCancel () {
      this.$router.push('/myd/release/upgrade');
    },
    // 查询完品牌后查询对应的所有门店
    async fetchCompanyAfterBrand () {
      if (!this.companyGUID || this.companyGUID === -1) {
        this.companyGUID = -1;
        return;
      }
      await this.fetchShopList({ companyGUID: this.companyGUID, shopType: ALL, shopGroupId: null });
      this.brandList = cloneDeep(this.shopListFromBrand);
      this.dialogFormVisible = false;
    },
    // 选择品牌
    selectBrandName (name) {
      this.brandName = name;
    },
    // 删除品牌下的门店
    spliceBrandList (index) {
      this.brandList.splice(index, 1);
    },
    spliceShopList (index) {
      this.shopList.splice(index, 1);
    },
    // 获取品牌下的门店，重置GUID
    searchCompanyList () {
      this.companyGUID = null;
      this.fetchCompanyList(this.brandData);
    },
    handlerSelectBrand () {
      this.fetchCompanyList(this.brandData);
      this.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="scss">
.clear:after {
  content: '';
  display: block;
  clear: both;
}

.fl {
  float: left;
  display: block;
}

.fr {
  float: right;
  display: block;
}

.upgrade-edit {
  padding: 15px;

  .el-dialog {
    padding: 20px;
  }

  .radio-name {
    width: 75px;
  }

  .city-contain {
    margin-top: 2px;
  }

  .btn-base-contain {
    margin-top: 2px;

    .btn-base {
      margin-bottom: 4px;
    }
  }

  .select-brand {
    width: 12%;
    height: 40px;
    line-height: 40px;
  }

  .search-form {
    display: inline-block;
    width: 88%;
  }

  .tip-select {
    text-align: center;
    height: 30px;
    line-height: 30px;
    color: #ff4949;
  }

  .company-list {
    margin: 10px 0 0;
    padding: 0;
    max-height: 300px;
    overflow-y: auto;
    overflow-x: hidden;
    border-top: 1px solid #E6E9F3;
    border-bottom: 1px solid #E6E9F3;

    .el-radio {
      text-align: left;
    }

    li {
      position: relative;
      height: 40px;
      line-height: 40px;
      list-style-type: none;
      text-indent: 3px;
      border: 1px solid #E6E9F3;
      border-top: 0 none;

      .el-radio {
        width: 100%;
        height: 40px;
        line-height: 40px;
      }

      &:hover {
        cursor: pointer;
        background-color: #eee;
      }
    }

    li:last-child {
      border-bottom: 0 none;
    }
  }

  .dialog-form-brand {
    position: relative;
    max-width: 665px;
    margin: 0 auto;
  }

  .dialog-footer {
    text-align: center;
  }
}
</style>
