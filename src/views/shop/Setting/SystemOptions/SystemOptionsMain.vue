<template>
  <div class="container">
    <mw-bread-crumb :dataSource="SYSTEM_OPTIONS" :onSelectionChange="onSelectionChange" />
    <div class="container-content">
      <transition name="fade">
        <GeneralParameter v-if="index === 0" transition="fade"></GeneralParameter>
        <OpenParametersMain v-if="index === 1" transition="fade"></OpenParametersMain>
        <OrderParameter v-if="index === 2" transition="fade"></OrderParameter>
        <CashierParameter v-if="index === 3" transition="fade"></CashierParameter>
        <PrinterParameter v-if="index === 4" transition="fade"></PrinterParameter>
      </transition>
    </div>
  </div>
</template>
<script>
  import MwBreadCrumb from '../Component/Breadcrumb';
  import GeneralParameter from './GeneralParameter';
  import OpenParametersMain from './OpenParametersMain';
  import OrderParameter from './OrderParameter';
  import CashierParameter from './CashierParameter';
  import PrinterParameter from './PrinterParameter';
  import { SYSTEM_OPTIONS } from 'constant/systemOptions';

  export default {
    name: 'SystemOptionMain',
    components: {
      MwBreadCrumb,
      GeneralParameter,
      OpenParametersMain,
      OrderParameter,
      CashierParameter,
      PrinterParameter
    },
    data () {
      return {
        SYSTEM_OPTIONS,
        index: 0
      };
    },
    methods: {
      onSelectionChange (index) {
        this.index = index;
      }
    }
  };
</script>
<style lang="scss">
  .container {
    .container-content {
      border-top: 1px solid #ccc;

      .el-form {
        .el-form-item {
          margin-bottom: 10px;
        }

        .label-title {
          font-weight: 600;
          margin: -10px 0 10px;

          .el-form-item__label {
            font-size: 16px;
          }
        }
      }
    }
  }

  .fade-enter-active {
    transition: all .5s ease;
    -webkit-transition: all .5s ease;
  }

  .fade-enter {
    opacity: 0;
    transform: translateX(20%);
    -webkit-transform: translateX(20%);
  }
</style>
