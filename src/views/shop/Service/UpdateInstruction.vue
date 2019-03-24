<template>
  <div class='update-instruction'>
    <div>
      <h3>（2018.7.05）集团管理2.0</h3>
      <ol>
        <li>优化 登录页改版</li>
        <li>优化 品牌层系统菜单变动</li>
        <li>优化 门店层全部页面完成翻新</li>
        <li>优化 组织结构树完全与中控同步</li>
        <li>新增 集团下发菜单与门店保持一致，增量、减量都同步</li>
        <li>新增 品牌层增加打印部门，品牌层菜品关联打印部门后，下发菜品时，将集团定义的打印部门也下发至门店</li>
        <li>新增 品牌层增肌付款方式、折扣方案、菜品特价、菜品买减、金额满减</li>
        <li>新增 美易连打印机标识码校验功能</li>
      </ol>
    </div>
    <div>
      <h3>（2018.6.06）菜品优化，后台整体视觉优化</h3>
      <ol>
        <li>优化 页面整体视觉优化</li>
        <li>新增 编辑菜品页面增加新建分类、销售归属、收入归属入口，可直接关联菜品要求</li>
        <li>优化 新建规格可通用</li>
        <li>优化 菜品打印部门模块交互</li>
        <li>新增 部分功能支持版本提示</li>
      </ol>
    </div>
    <div>
      <h3>（2018.5.17）集团管理一期</h3>
      <ol>
        <li>优化 品牌层菜品模块翻新，和门店层菜品模块保持一致</li>
        <li>新增 品牌层增加"菜品"下发功能</li>
        <li>优化 菜品导入、菜品下发的显示顺序，与来源一致</li>
      </ol>
    </div>
    <div>
      <h3>（2018.4.26）菜品配置优化</h3>
      <ol>
        <li>新增 后台功能更新内容说明</li>
        <li>优化 菜品列表可以设置分页数量</li>
        <li>优化 做法、配料做法数量限制</li>
        <li>优化 添加菜品可以使用推荐图片</li>
        <li>优化 金额满减支持自定义菜品</li>
        <li>新增 折扣方案支持关联菜品分类</li>
        <li>优化 权限设置支持按模块全选</li>
        <li>优化 套餐支持复制；套餐配置支持“可外卖”等</li>
        <li>优化 退菜理由支持排序</li>
      </ol>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'systemUpdateInstruction'
  };
</script>
<style lang="scss" scoped>
  .update-instruction {
    padding: 20px 0 0 50px;

    h3 {
      font-weight: 400;
      font-size: 20px;
      color: #333;
      margin: 20px 0 0 0;
    }

    li {
      color: #777;
      font-weight: 100;
      margin: 5px;
    }
  }
</style>
