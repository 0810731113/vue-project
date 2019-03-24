<template>
  <div>
    <div class="customize-template-container">
      <draggable v-model="draggableSource">
        <div class="row-sortable" v-for="(element, index) in draggableSource" :key="index">
          <div class="row-tool-bar" draggable="false">
            <el-button
              icon="el-icon-plus"
              size="mini"
              v-if="element.Type !== 2" @click="() => onAddTagClick(element, 'addAttributeModal')"></el-button>
            <el-button
              icon="edit"
              size="mini"
              @click="() => onEditRowClick(element, index, 'dataSourceModal')"></el-button>
            <el-button
              icon="circle-cross"
              size="mini"
              @click="() => draggableSource.splice(draggableSource.indexOf(element),1)"></el-button>
          </div>
          <draggable v-model="element.Cell" v-if="element.Type !== TYPE_LINE">
            <mw-tag
              :key="index"
              v-for="(item, index) in element.Cell"
              @editTag="() => onEditTagClick(element, item, index, 'addAttributeModal')"
              @deleteTag="() => element.Cell.splice(element.Cell.indexOf(item),1)">
              {{item.Text}}
            </mw-tag>
          </draggable>
          <draggable v-if="element.Type === TYPE_LINE" class="remarks">
            <span v-for="n in 20" :key="n">{{element.Remarks}}</span>
          </draggable>
        </div>
      </draggable>
      <AddAttributeModal ref="addAttributeModal" :reportId="reportId" @setTagItem='setTagItem' :tagItem="tagItem"></AddAttributeModal>
      <ReportTemplateDataSourceModal ref="dataSourceModal" :reportId="reportId" @setRowItem='setRowItem' :rowItem="rowItem"></ReportTemplateDataSourceModal>
      <AddLineModal ref="addLineModal" @setLineItem='setRowItem' :lineItem="rowItem"></AddLineModal>
      <Popup
        ref="popup"
        title="请选择属性"
        okText="确认">
        <div slot="content" class="content">{{JSON.stringify(draggableSource)}}</div>
      </Popup>
      <Toast
        ref='toast'
        content="请选择小票单据类型!"
        :timeout="2000"
        type="warning"
      />
    </div>
    <div class="custom-template-toolbar">
      <el-button class="btn-primary" @click="onAddRowClick">添加行</el-button>
      <el-button class="btn-primary" @click="() => onAddLineClick('addLineModal')">分割线</el-button>
      <el-button class="btn-primary" @click="onPreviewClick">预览</el-button>
    </div>
  </div>
</template>
<script>
  import MwTag from './Tag';
  import draggable from 'vuedraggable';
  import AddLineModal from './AddLineModal';
  import AddAttributeModal from './AddAttributeModal';
  import ReportTemplateDataSourceModal from './ReportTemplateDataSourceModal';
  import { Popup, Toast } from 'components';
  import { TYPE_LINE } from 'constant/constants';

  export default {
    name: 'CustomizeTemplate',
    props: {
      dataSource: Array,
      reportId: String
    },
    data () {
      return {
        draggableSource: this.dataSource,
        element: {},
        tagItem: {},
        tagIndex: 0,
        rowItem: {},
        rowIndex: 0,
        lineItem: {},
        lineIndex: 0,
        TYPE_LINE
      };
    },
    components: {
      MwTag,
      Popup,
      Toast,
      draggable,
      AddLineModal,
      AddAttributeModal,
      ReportTemplateDataSourceModal
    },
    watch: {
      dataSource () {
        this.draggableSource = this.dataSource;
      }
    },
    methods: {
      onAddRowClick () {
        if (!this.reportId) {
          this.$refs.toast.isShow = true;
          return;
        }

        this.draggableSource.push({
          'Type': 0,
          'Data': '',
          'Remarks': '',
          'FillType': 0,
          'Colour': 0,
          'Height': 0,
          'Cell': []
        });
      },
      onAddLineClick (ref) {
        if (!this.reportId) {
          this.$refs.toast.isShow = true;
          return;
        }

        this.$refs[ref].isShow = true;
        this.rowItem = null;
      },
      onEditTagClick (element, tagItem, tagIndex, ref) {
        this.element = element;
        this.tagItem = tagItem;
        this.tagIndex = tagIndex;
        this.$refs[ref].isShow = true;
      },
      onAddTagClick (element, ref) {
        this.$refs[ref].isShow = true;
        this.tagItem = null;
        this.element = element;
      },
      onPreviewClick () {
        this.$refs['popup'].isShow = true;
      },
      onEditRowClick (element, index) {
        if (element.Type !== TYPE_LINE) {
          this.$refs['dataSourceModal'].isShow = true;
        } else {
          this.$refs['addLineModal'].isShow = true;
        }
        this.rowItem = element;
        this.rowIndex = index;
      },
      setTagItem (item) {
        if (this.tagItem) {
          this.element.Cell.splice(this.tagIndex, 1, item);
        } else {
          this.element.Cell.push(item);
        }
      },
      setRowItem (item) {
        if (this.rowItem) {
          this.draggableSource.splice(this.rowIndex, 1, item);
        } else {
          this.draggableSource.push(item);
        }
      },
      getReportTemplateContent () {
        return this.draggableSource;
      }
    }
  };
</script>
<style lang="scss">
  .customize-template-container {
    width: 50%;
    min-height: 400px;
    display: inline-block;
    margin: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;

    .el-dialog--tiny {
      width: auto;
    }
  }

  .row-sortable {
    position: relative;
    padding: 14px 0;
    border: 1px dashed #DDD;
    margin: 0 0 10px;
    border-radius: 5px;
    min-height: 36px;
    background: aliceblue;

    &:hover {
      .row-tool-bar {
        display: block;
      }
    }

    .remarks {
      display: flex;
      justify-content: center;
    }

    .row-tool-bar {
      display: none;
      position: absolute;
      top: -20px;
      right: 0;

      .el-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
      }
    }

    .content {
      text-align: center;
    }
  }

  .custom-template-toolbar {
    display: inline-block;
    vertical-align: top;
    padding: 20px 0;

    .btn-primary {
      display: block;
      margin: 10px !important;
      width: 100px;
      height: 26px;
    }
  }
</style>
