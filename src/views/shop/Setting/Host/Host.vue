<template>
  <div class="host-form-container">
    <el-form class="mw-form" :class="editPopup" :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="站点名称" prop="hostId">
          <el-input v-model="form.hostId" :disabled="isEdit" placeholder="请输入站点名称" :maxlength='30'></el-input>
        </el-form-item>
        <el-form-item label="站点类型" prop="hostCls">
          <el-select v-model="form.hostCls" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in hostClsList"
              :key="item.hostCls"
              :label="item.hostClsName"
              :value="item.hostCls">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="界面语言" >
          <el-select v-model="form.language" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="item in LANGUAGE"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              style="width: 100%">
            </el-option>
          </el-select>
        </el-form-item>
      <div v-if="form.hostCls != 16">
          <el-form-item label="打印机选择">
            <el-select v-model="form.printerName" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in printerList"
                :key="item.printerName"
                :label="item.printerName"
                :value="item.printerName"
                style="width: 100%">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打印份数" prop="printCount">
            <el-input-number v-model="form.printCount" class="width-full" :min="0" :max="999" controls-position="right"></el-input-number>
          </el-form-item>
        </div>
        <el-form-item label="是否启用KDS智能算法" v-if="form.hostCls == 15">
          <el-radio-group
            :value="form.isEnableKDS"
            @input="(value) => onChangeLevelItem(value, 'form','isEnableKDS')">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      <div v-if="form.hostCls == 15 && form.isEnableKDS == 1">
        <el-form-item label="允许最晚上菜时间" prop="">
          <el-input-number v-model="form.latestUpMenuTime" placeholder="请输入允许最晚上菜时间" class="width-full" :min="0" :max="99" controls-position="right"></el-input-number>
          <!--<el-input v-model="form.latestUpMenuTime" type="number"  ></el-input>-->
        </el-form-item>
        <!--<el-form-item label="外卖菜品是否进KDS">-->
          <!--<el-radio-group-->
            <!--:value="form.isDishesTakeaway"-->
            <!--@input="(value) => onChangeLevelItem(value, 'form','isDishesTakeaway')">-->
            <!--<el-radio :label="1">是</el-radio>-->
            <!--<el-radio :label="0">否</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="是否开启扫码划菜">
          <el-radio-group
            :value="form.isOpenBarcode"
            @input="(value) => onChangeLevelItem(value, 'form','isOpenBarcode')">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联打印部门">
          <el-checkbox-group v-model="connectDepartSelect" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in hostPrintDeparts" :label="item.deptId" :key="item.deptId" :disabled="item.isEdit == 0">{{item.deptName}}</el-checkbox>
          </el-checkbox-group>
          <!--<el-checkbox v-for="item in connectDepart" :key="item.deptId" :label="item.deptName"  v-model="item.isRelation" true-label= "1" false-label= "0" :disabled="item.isEdit == 0"></el-checkbox>-->
        </el-form-item>
      </div>
      <!--<div v-if="KDSSwitch == '0'">-->
        <!--<el-form-item label="设置提醒时间" prop="">-->
          <!--<i class="el-icon-time"></i>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="黄色背景块" prop="">-->
          <!--<el-input v-model="KDSSwitchClose.yellowBGBlock"  placeholder="请输入提醒时间" :maxlength='3'>-->
            <!--<template slot="append">分钟</template>-->
          <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="黄色背景块" prop="">-->
          <!--<el-input v-model="KDSSwitchClose.orangeBGBlock"  placeholder="请输入提醒时间" :maxlength='3'>-->
            <!--<template slot="append">分钟</template>-->
          <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="外卖是否参与并菜">-->
          <!--<el-radio-group-->
            <!--:value="KDSSwitchClose.takeoutfoodWithDishes"-->
            <!--@input="(value) => onChangeLevelItem(value, 'KDSSwitchClose','takeoutfoodWithDishes')">-->
            <!--<el-radio label="1">是</el-radio>-->
            <!--<el-radio label="0">否</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="关联打印部门">-->
          <!--<el-checkbox v-for="item in KDSSwitchClose.connectPrintDepartment" :key="item.id" :label="item.text"  v-model="item.status" true-label= "1" false-label= "0"></el-checkbox>-->
        <!--</el-form-item>-->
      <!--</div>-->
      <div v-if="form.hostCls == 16">
      <!--<div>-->
        <el-form-item label="最大显示订单数" prop="">
          <el-input v-model="form.orderDispNumber"  placeholder="请输入最大订单数" :maxlength='3'>
            <!--<template slot="append">分钟</template>-->
          </el-input>
        </el-form-item>
        <el-form-item label="选择显示订单来源">
          <el-select v-model="form.orderSource" placeholder="请选择" style="width: 100%">
            <el-option label="全部" :value="0" style="width: 100%"></el-option>
            <el-option label="堂食" :value="1" style="width: 100%"></el-option>
            <el-option label="外卖" :value="2" style="width: 100%"></el-option>
          </el-select>
          </el-form-item>
      </div>
      <el-form-item label="说明" >
        <el-input v-model="form.hostDesc" placeholder="请输入说明" :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-text="ON_TEXT" :inactive-text="OFF_TEXT" :active-value="OK" :inactive-value="FORBIDDEN"></el-switch>
      </el-form-item>
      <div class="el-form-item">
        <a class="el-form-item-label" @click="onSetExternalSettingVisibility">
          {{externalSettingBtnText}}
        </a>
      </div>
      <div v-if="externalSettingVisible" class="externalSetting">
        <el-form-item label="钱箱设置">
          <el-radio-group v-model="cashBoxKey">
            <el-radio :label="1" class="mw-radio">无</el-radio>
            <el-radio :label="2" class="mw-radio">钱箱接打印机</el-radio>
            <el-radio :label="3" class="mw-radio">串口
              <el-radio-group v-model="cashBoxValue">
                <el-radio :label="COM1">{{COM1}}</el-radio>
                <el-radio :label="COM2">{{COM2}}</el-radio>
                <el-radio :label="COM3">{{COM3}}</el-radio>
                <el-radio :label="COM4">{{COM4}}</el-radio>
              </el-radio-group>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客显设置">
          <el-radio-group v-model="customerDisplayKey">
            <el-radio :label="1" class="mw-radio">无</el-radio>
            <el-radio :label="2" class="mw-radio">串口
              <el-radio-group v-model="customerDisplayValue">
                <el-radio :label="COM1">{{COM1}}</el-radio>
                <el-radio :label="COM2">{{COM2}}</el-radio>
                <el-radio :label="COM3">{{COM3}}</el-radio>
                <el-radio :label="COM4">{{COM4}}</el-radio>
              </el-radio-group>
            </el-radio>
          </el-radio-group>
          <el-form-item label="波特率" class="mw-form-item">
            <el-input-number size="small" :controls="false" :min="0" v-model="customerDisplayBaudrate" />
          </el-form-item>
        </el-form-item>
        <el-form-item label="电子秤设置">
          <el-radio-group v-model="electronicScaleKey">
            <el-radio :label="1" class="mw-radio">无</el-radio>
            <el-radio :label="2" class="mw-radio">串口
              <el-radio-group v-model="electronicScaleValue">
                <el-radio :label="COM1">{{COM1}}</el-radio>
                <el-radio :label="COM2">{{COM2}}</el-radio>
                <el-radio :label="COM3">{{COM3}}</el-radio>
                <el-radio :label="COM4">{{COM4}}</el-radio>
              </el-radio-group>
            </el-radio>
          </el-radio-group>
          <el-form-item label="波特率" class="mw-form-item">
            <el-input-number size="small" :controls="false" :min="0" v-model="electronicScaleBaudrate" />
          </el-form-item>
        </el-form-item>
        <el-form-item label="双屏设置" v-if="!guidance">
        </el-form-item>
        <el-form-item label="商家短语" v-if="!guidance">
          <el-input v-model="phrase"></el-input>
        </el-form-item>
        <el-form-item label="双频底图" v-if="!guidance">
          <mw-upload
            ref="singleUpload"
            name="files"
            @getImageURI='getImageURI'
            :action="getActionUrl(`shop/${API_UPLOAD_HOST_IMG}`)"
            :dataSource = '(imageUrl && imageUrl.length) ? [{url: imageUrl}] : []'
            :multipleSelect= "false"
            :multipleUpload= "false"
            uploadTip = "注意：单张图片最大为350K（仅支持jpg、png、jpeg、bmp格式)">
          </mw-upload>
        </el-form-item>
        <el-form-item label="图片播放时间" v-if="!guidance">
          <el-input style="width: 30%" v-model="timeOut"></el-input> 秒（每个图片播放）
        </el-form-item>
        <el-form-item label="轮播档案" v-if="!guidance">
          <mw-upload
            ref="multiUpload"
            name="files"
            @getImageURI='getImageURIList'
            :action="getActionUrl(`shop/${API_UPLOAD_HOST_IMG}`)"
            :dataSource = '(imageUrlListBackUp && imageUrlListBackUp.length) ? imageUrlListBackUp : []'
            :multipleSelect="true"
            :multipleUpload="true"
            :acceptedFileSize="512"
            :acceptedMaxFileCount="5"
            uploadTip = "注意：单次可选多张，最多5张。单张图片最大为512K（仅支持jpg、png、jpeg、bmp格式)">
          </mw-upload>
        </el-form-item>
      </div>
      <el-form-item v-if="!guidance" class="operation-item">
        <el-button class="btn-cancel" @click="onCancel">取消</el-button>
        <el-button class="btn-submit" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <Toast
      ref='selectEmptyDishWarn'
      :content="toastInfo.text"
      :timeout="2000"
      :type="toastInfo.type"
    />


  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { Toast } from 'components';
  import { FORBIDDEN, OK } from 'constant/statusCode';
  import {
    ON_TEXT, OFF_TEXT, LANGUAGE,
    COM1, COM2, COM3, COM4, HIDE_EXTERNAL_SETTING,
    SHOW_EXTERNAL_SETTING, CUSTOM_KEY, INPUT_MAX_LENGTH
  } from 'constant/constants';
  import MwUpload from 'components/Upload';
  import { validateName, validateNumber } from 'utils/validateUtil';
  import { API_UPLOAD_HOST_IMG } from 'constant/API';
  import cloneDeep from 'lodash/cloneDeep';

  export default {
    name: 'Printer',
    props: ['guidance', 'hostId'],
    components: {
      MwUpload,
      Toast,
    },
    data () {
      return {
        FORBIDDEN,
        OK,
        ON_TEXT,
        OFF_TEXT,
        LANGUAGE,
        INPUT_MAX_LENGTH,
        SHOW_EXTERNAL_SETTING,
        HIDE_EXTERNAL_SETTING,
        API_UPLOAD_HOST_IMG,
        COM1,
        COM2,
        COM3,
        COM4,
        CUSTOM_KEY,
        cashBoxKey: 1,
        cashBoxValue: COM1,
        customerDisplayKey: 1,
        customerDisplayValue: COM1,
        externalSettingVisible: false,
        customerDisplayBaudrate: 0,
        electronicScaleBaudrate: 0,
        electronicScaleKey: 1,
        electronicScaleValue: COM1,
        externalSettingBtnText: SHOW_EXTERNAL_SETTING,
        phrase: '',
        timeOut: '',
        imageUrl: '',
        imageUrlList: [],
        imageUrlListBackUp: [],
        form: {
          hostId: '',
          hostDesc: '',
          hostCls: '',
          language: LANGUAGE[0].id,
          status: OK,
          dataKind: CUSTOM_KEY,
          printerName: '',
          printCount: 0,
          isEnableKDS: 1,
          latestUpMenuTime:25,//允许最晚上菜时间 默认为25。只能设置大于0的整数
          isDishesTakeaway:0, //外卖是否参与并菜 1:开，0:关
          isOpenBarcode:1, //是否开启扫码划菜 1:开，0:关
          orderSource:0, // 选择显示订单来源 0:全部 1:堂食 2:外卖
          orderDispNumber:10, //最大显示订单数
//          yellowBackground:5, //黄色背景块默认为5
//          orangeBackground:10 //橙色背景块默认为10
        },
        connectDepart:[], //关联打印部门
        connectDepartSelect: [], //选择的打印部门
        orderSourceList:[], //订单来源
        rules: {
          hostId: [
            { required: true, message: '站点名称不能为空', trigger: 'blur, change' },
            { validator: validateName, trigger: ['blur', 'change'] }
          ],
          hostCls: [
            { required: true, message: '请选择站点类型' }
          ],
          printCount: [
            { required: true, type: 'number', message: '打印份数不能为空', trigger: 'blur, change' },
            { validator: validateNumber, trigger: ['blur', 'change'] }
          ]
        },
        isEdit: !!this.$route.params.id || !!this.hostId,
        toastInfo:{ //弹框提示
          text:'',  //文字
          type:'' //类型:  成功 警告  错误
        },
      };
    },
    computed: {
      ...mapState({
        hostItem: state => state.setting.host.hostItem,
        cashBox: state => state.setting.host.cashBox,
        customerDisplay: state => state.setting.host.customerDisplay,
        electronicScale: state => state.setting.host.electronicScale,
        doubleViewSet: state => state.setting.host.doubleViewSet,
        print: state => state.setting.host.print,
        printerList: state => state.setting.host.printerList,
        hostClsList: state => state.setting.host.hostClsList,
        hostPrintDeparts: state => state.setting.host.hostPrintDeparts,

      }),
      editPopup () {
        return {
          'edit-or-add-pop-up': this.guidance
        };
      }
    },
    methods: {
      ...mapActions([
        'fetchHostItem',
        'updateHostItem'
      ]),
      handleCheckedCitiesChange(value) {  //处理关联部门
        console.log(value)
        console.log(this.connectDepartSelect)

      },
      onSetExternalSettingVisibility () {
        this.externalSettingVisible = !this.externalSettingVisible;
        this.externalSettingVisible
          ? this.externalSettingBtnText = HIDE_EXTERNAL_SETTING
          : this.externalSettingBtnText = SHOW_EXTERNAL_SETTING;
      },
      async onSubmit () {
        let validForm = true;
        this.$refs.form.validate((valid) => {
          validForm = valid;
        });
        if (!validForm) return validForm;

        var depts = []

        if(this.form.hostCls == 15 && this.form.isEnableKDS == 1){
          if(!/^[1-9]\d?$/.test(this.form.latestUpMenuTime)){
            this.toastInfo = {text:'请输入正确的最晚上菜时间' , type: 'warning'}
            this.$refs['selectEmptyDishWarn'].isShow = true
            return
          }
          depts = this.connectDepartSelect
        }

        if(this.form.hostCls == 16){
          if(!/^[1-9]\d*$/.test(this.form.orderDispNumber)){
            this.toastInfo = {text:'请输入正确的最大显示订单数' , type: 'warning'}
            this.$refs['selectEmptyDishWarn'].isShow = true
            return
          }
        }

        const { host, hostExternalList } = this.formatRequestPayLoad();
        const operate = this.isEdit ? 'edit' : 'add';
        await this.updateHostItem({ operate, host, hostExternalList, depts,noShowError: this.guidance });

        const { errorStatus } = this.$store.state.error;
        if (errorStatus) {
          return false;
        } else if (!this.guidance) {
          this.$router.push('/myd/setting/host');
        }

        return validForm;
      },
      formatRequestPayLoad () {
        const { hostId } = this.form;
        let host = { ...this.form, updateTime: '', updateUserId: '', updateUserName: '' };

        let hostExternalList = [
          {
            // cash box
            cls: '1',
            hostId,
            paramValue: this.cashBoxKey,
            str1: this.cashBoxValue
          }, {
            // customerDisplay
            cls: '2',
            hostId,
            paramValue: this.customerDisplayKey,
            str1: this.customerDisplayValue,
            int1: this.customerDisplayBaudrate
          }, {
            // double view
            cls: '3',
            hostId,
            paramValue: this.timeOut,
            str1: this.imageUrl, // 双频底图
            str2: this.imageUrlList.length ? this.imageUrlList.map(item => item.url).join('|') : '', // 轮播档案
            str3: this.phrase,
            int1: this.customerDisplayBaudrate
          }, {
            // print count
            cls: '4',
            hostId,
            paramValue: this.form.printCount
          }, {
            // electronic scale
            cls: '5',
            hostId,
            paramValue: this.electronicScaleKey,
            str1: this.electronicScaleValue,
            int1: this.electronicScaleBaudrate
          }];
        return { host, hostExternalList };
      },
      onCancel () {
        this.$router.back();
      },
      init () {
        if (this.hostItem) {
          // host
          this.form = { ...this.form, ...this.hostItem };
          console.log(this.cashBox)
          // cash box
          if (this.cashBox !== null){
            this.cashBoxKey = +this.cashBox.paramValue;
            this.cashBoxValue = this.cashBox.str1;
          }


          // customer display
          this.customerDisplayKey = +this.customerDisplay.paramValue;
          this.customerDisplayValue = this.customerDisplay.str1;
          this.customerDisplayBaudrate = this.customerDisplay.int1;

          // electronic scale
          this.electronicScaleBaudrate = this.electronicScale.int1;
          this.electronicScaleKey = +this.electronicScale.paramValue;
          this.electronicScaleValue = this.electronicScale.str1;

          // double view set
          this.imageUrl = this.doubleViewSet.str1;
          this.imageUrlList = this.doubleViewSet.str2
            ? this.doubleViewSet.str2.split('|').map(item => { return { url: item }; })
            : [];
          this.imageUrlListBackUp = cloneDeep(this.imageUrlList);
          this.phrase = this.doubleViewSet.str3;
          this.timeOut = this.doubleViewSet.paramValue;

          // print count
          this.form.printCount = this.print.paramValue;
        }
        if(this.hostPrintDeparts.length){
//          this.connectDepart = {...this.connectDepart, ...this.hostPrintDeparts}
          this.connectDepartSelect = this.hostPrintDeparts.filter((item,index) => {return item.isRelation == 1}).map((item,index) => {return item.deptId})
        }
      },
      getImageURI (path) {
        this.imageUrl = path;
      },
      getImageURIList (path) {
        path instanceof Array ? this.imageUrlList = path : this.imageUrlList.push({ url: path });
      },
      onChangeItem(value, dataModel){ //设置数据更改
        this[dataModel] = value
      },
      onChangeLevelItem(value, dataModel, secondLevel){  //设置有嵌套的对象更改数据
        this[dataModel][secondLevel] = value
      }
    },
    async created () {
      this.isEdit
        ? await this.fetchHostItem({ hostId: this.$route.params.id || this.hostId })
        : await this.fetchHostItem();
      this.init();
    }
  };
</script>

<style lang="scss">
  .host-form-container {
    padding: 20px;
    display: flex;
    justify-content: center;

    /*.el-form-item__label {*/
      /*width: 200px !important;*/
    /*}*/

    /*.el-form-item__content {*/
      /*margin-left: 200px !important;*/
      /*height: 40px;*/
      /*display: flex;*/
      /*justify-content: flex-start;*/
      /*align-items: center;*/
    /*}*/
    .el-form-item-label {
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #337ab7;
      text-decoration: none;
      line-height: 1;
      padding: 11px 12px 11px 0;
      box-sizing: border-box;
      cursor: pointer;
    }

    .mw-radio {
      display: block;
      margin-left: 0 !important;
      line-height: 30px;
    }

    .externalSetting {
      .el-form-item {
        margin-bottom: 10px !important;
      }

      .el-input-number__decrease,
      .el-input-number__increase {
        top: 5px;
      }
    }

    /*.mw-form-item {*/
      .el-form-item__label {
        width: 180px !important;
      }

      .el-form-item__content {
        margin-left: 180px !important;
      }
    /*}*/

    .edit-or-add-pop-up {
      width: 90% !important;
      min-width: initial;
      margin: 0;
      padding: 5px;
    }
  }

</style>

