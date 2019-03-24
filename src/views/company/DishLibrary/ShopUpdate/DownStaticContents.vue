<template>
  <el-dialog
    title="下发业务说明"
    class="down-static-content base-modal"
    :visible.sync="isShow"
    width="80%" >
    <ul class="clear">
      <li v-for="(content, index) in staticTitle" :key="index" class="fl" :class="index === menuIndex ? 'active' : ''" @click="changeMenuIndex(index)"><a href="javascript:;">{{ content }}</a><span class='border_right'>右边界线</span></li>
    </ul>
    <div class="tab_item" v-show="menuIndex === 0">
      <div class='title'>下发集团菜单规则</div>
      <div class='clear'>
        <div class='fl'>1：</div>
        <div class='fl'>
          <div>集团模式下下发新的集团菜单</div>
          <div>1.1：原门店的集团菜品全部删掉，门店的集团菜品全部替换成为最新下发的集团菜单</div>
          <div>1.2：门店原菜品如果与集团菜同名，则门店菜升级成为集团菜，此菜品全部属性、口味、做法完全与集团菜相同</div>
          <div>1.3：不重名的门店菜作为“自定义菜”继续存在于门店菜品库</div>
        </div>
      </div>
      <div class='clear'>
        <div class='fl'>2：总店菜品必须先定义好收入归属和销售归属，才能下发</div>
      </div>
      <div>3：当总店的“菜品分类”与门店的“菜品分类”同名且同类型，则做映射操作</div>
      <div>4：门店自定义套餐全部删除，以集团下发为准</div>
      <div>5：菜品顺序展示，同类型菜品内，集团菜在一起，排在门店菜前面。门店集团菜与集团的菜品顺序完全一致</div>
      <div class='title'>下发打印部门规则</div>
      <div>先定义集团打印部门，再定义集团菜品与打印部门关联关系。下发集团菜单同时，下发全部集团打印部门、集团菜单内部菜品与打印部门关联关系，集团打印部门覆盖门店同名打印部门，门店多余打印部门删掉</div>
      <div class='title'>下发后门店权限</div>
      <div>1：门店不允许修改集团菜品</div>
      <div>2：门店不允许添加打印部门，允许修改打印部门与菜品的关联关系，可以添加打印机，并允许打印机关联打印部门</div>
    </div>
    <div class="tab_item" v-show="menuIndex === 1">
      <div class='title'>下发规则：</div>
      <div>1：每次只下发时状态为“正常”的付款方式</div>
      <div>2：每次都清空门店现有的全部付款方式，全部以新下发的为主</div>
      <div>3：门店默认初始化的付款方式在总店不存在。如果总店下发了集团定义的付款方式，但是与门店的系统默认付款方式重名，则将集团下发的付款方式名称后面增加“（集团下发）”字样</div>
      <div class='title'>下发后门店权限：</div>
      <div>允许门店修改颜色，修改显示状态，其余统统不允许修改，不允许删除</div>
    </div>
    <div class="tab_item" v-show="menuIndex === 2 || menuIndex === 3 || menuIndex === 4 || menuIndex === 5">
      <div class='title'>下发规则</div>
      <div>1：“业务内容”列表展示的是全部“正常”状态的条目，禁用状态的条目在此页面不展示，也不能下发</div>
      <div>2：一旦下发了集团的优惠方式，门店原有的全部清空</div>
      <div>3：追加方式，因为集团优惠方式是逐条下发，同一门店会多条优惠方式并存，所以采用追加方式</div>
      <div>4：如果集团下发的优惠方式内部存在重名，则以后下发的为准，删掉门店之前的，不管是否同类型</div>
      <div>5：集团的优惠方式关联菜品时，如果集团菜品存在多个规则，只要关联集团菜品任意规格，下发到门店后，门店菜品的全部规格都应用此优惠方式</div>
      <div>6：允许下发“清空”指令，时间久了，门店的各种优惠配置条目很多，互相之间的有效时间段也各不相同，可能会说不清楚，下发“清空”指令后，清空门店所有的优惠方式，便于管理</div>
      <div class='title'>门店权限：</div>
      <div>1：品牌切换为“集团管理”模式后，门店不允许添加、复制优惠方式</div>
      <div>2：已经下发的集团优惠方式，门店账号自己不能修改和删除，可查看</div>
      <div>所有优惠方式超期后，状态变成“超期”</div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'downStaticContent',
    data () {
      return {
        staticTitle: ['集团菜单', '付款方式', '折扣方案', '菜品特价', '菜品买减', '金额满减'],
        isShow: false,
        menuIndex: 0
      };
    },
    methods: {
      changeMenuIndex (index) {
        this.menuIndex = index;
      }
    }
  };
</script>

<style lang="scss">
  .down-static-content {
    ul {
      margin: 0;
      padding: 0;
      border: 1px solid rgb(223, 223, 223);
      background-color: #eee;

      li {
        height: 50px;
        line-height: 50px;
        padding: 0 30px;
        cursor: pointer;
        position: relative;

        .border_right {
          position: absolute;
          display: block;
          right: 0px;
          top: 10px;
          width: 1px;
          height: 30px;
          text-indent: -999em;
          background-color: rgb(199, 199, 199);
        }

        a {
          text-decoration: none;
          color: #909399;
        }

        &.active {
          border-bottom: 0 none;
          background-color: #fff;

          &:after {
            content: '';
            display: block;
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 1px;
            background-color: #fff;
            z-index: 999;
          }

          a {
            color: #464646;
          }
        }
      }
    }

    .tab_item {
      padding-top: 10px;

      .title {
        font-weight: bold;
        color: #373737;
      }

      div {
        line-height: 30px;
      }
    }
  }
</style>
