<template>
  <div class="mw-pagination-wrap">
    <span v-if="totalCount < DEFAULT_PAGES && totalCount > 0" class="total-pages">
      共 <span class="total-count">{{ totalPages }}</span> 页 {{ totalCount }} 条记录
    </span>
    <!--v-if="totalCount >= pageSize"-->
    <el-pagination
      small
      @size-change="onChangeSize"
      @current-change="onChangeCurrent"
      :current-page= "currentPage"
      :page-sizes="PAGE_SIZES"
      :page-size= "pageSize"
      :layout="layout"
      :total="totalCount"
      :class="className"
    >
    <slot>
      <span class="total-wrapper">
        共 <span class="total-count">{{ totalPages }}</span> 页 {{ totalCount }} 条记录
      </span>
    </slot>
    </el-pagination>
  </div>
</template>

<script>
import { PAGE_SIZES, DEFAULT_PAGE, DEFAULT_PAGES } from 'constant/pagination';

export default {
  name: 'pagination',
  props: {
    totalCount: {
      type: Number,
      default: 1
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: DEFAULT_PAGES
    },
    onChangeSize: {
      type: Function,
      default: () => {}
    },
    onChangeCurrent: {
      type: Function,
      default: () => {}
    },
    className: {
      type: String,
      default: 'mw-pagination'
    },
    layout: {
      type: String,
      default: 'slot, ->, prev, pager, next'
    }
  },
  data () {
    return {
      PAGE_SIZES,
      DEFAULT_PAGE,
      DEFAULT_PAGES
    };
  },
  computed: {
    totalPages () {
      const { totalCount, pageSize } = this;
      return Math.ceil(totalCount / pageSize);
    }
  }
};
</script>

<style lang="scss">
.mw-pagination-wrap {
  font-size: 14px;
  color: #48576a;
  display: block;
  padding: 15px 0 30px;

  .total-pages {
    width: 100%;
    text-align: center;
    display: inline-block;
  }

  .total-count {
    height: 24px;
    line-height: 24px;
    color: #f36b5f;
    font-size: 14px;
    min-width: 10px;
    text-align: center;
  }

  .mw-pagination {
    padding: 2px 5px;
    white-space: nowrap;
    vertical-align: top;
    box-sizing: border-box;

    .btn-prev,
    .btn-next {
      line-height: 24px;
      height: 24px;
    }

    button:hover {
      color: #F4ACA6;
    }

    .el-pager {
      li {
        &:last-child {
          height: 24px;
          line-height: 24px;
          min-width: 24px;
        }

        &:hover {
          color: #F4ACA6;
        }

        &.active {
          color: white;
        }
      }

      .number {
        height: 24px;
        line-height: 24px;
        min-width: 24px;
        border-radius: 20px;
        margin: 0 5px;

        &:hover {
          color: #48576A;
          background: #F4ACA6;
          opacity: .67;
        }
      }

      .active {
        border-color: #f36b5f;
        background: #f36b5f;

        &:hover {
          color: #fff;
          background: #f36b5f;
          opacity: 1;
        }
      }
    }

    .total-wrapper {
      font-size: 14px !important;
      font-weight: 100;
    }
  }
}
</style>
