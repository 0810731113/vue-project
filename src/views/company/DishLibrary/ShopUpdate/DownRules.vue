<template>
	<el-dialog
		title="下发规则说明"
		class="base-modal"
		:visible.sync="isShow"
  	width="80%" >
    <div class="down_rules_content down_rules_item">下发规则说明：</div>
    <div class="down_rules_content down_rules_item">此处的业务数据下发，完成的是从“总部云端数据”向“门店云端数据”的同步</div>
    <div class="down_rules_content down_rules_item">什么时间下发业务数据完成？</div>
    <div class="clear down_rules_item">
      <div class='fl'>1：</div>
      <div class='fl'>在所选的下发日期的上午8点开始下发，预计1小时完成完成下发后，美易点设备怎样能看到新的业务数据？</div>
    </div>
    <div class="clear down_rules_item">
      <div class='fl'>2：</div>
      <div class='fl'>美易点Android设备，需要在登录界面点击“同步云端数据”按钮，才能在设备上同步最新的业务数据。不点击就不同步，也就不影响营业</div>
    </div>
    <div class="clear down_rules_item">
      <div class='fl'>3：</div>
      <div class='fl'>美易点Windows设备，每次打开客户端都自动检测云端数据，并同步到设备端</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      isShow: false
    };
  }
};
</script>

<style lang="scss" scoped>
.down_rules_content {
  font-weight: bold;
}

.down_rules_item {
  line-height: 30px;
}
</style>
