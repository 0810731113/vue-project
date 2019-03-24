<template>
  <div class="upload-container" @dragover="onDragEnter" @drop="onDragOut" @dragleave="onDragOut">
    <el-upload
      drag
      ref="upload"
      :name="name"
      :action="action"
      :accept="accept"
      :auto-upload="autoUpload"
      :file-list="dataSource"
      :multiple="multipleSelect"
      list-type="picture-card"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :class="uploadClass"
      :before-upload="beforeAvatarUpload"
      :on-preview="preview ? handlePictureCardPreview : null">
      <el-button v-if="!dragEnter" icon="el-icon-plus">添加图片</el-button>
      <div class="drag-tip" v-else>将图片拖拽到这里上传</div>
      <div slot="tip" class="el-upload__tip">{{uploadTip}}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" custom-class="preview">
      <img :src="dialogImageUrl" alt="" >
    </el-dialog>
    <toast
      ref='toast'
      :content="content"
      :timeout="2000"
      type="warning" />
    <dl class="menu-upload-images" v-if="emitUploadImg && uploadImages.length !== 0">
      <dt class="upload-images-title">
        使用推荐图片
        <a href="javascript:;" @click='emitUploadList' class="mw-link">换一批</a>
      </dt>
      <dd class="upload-images-cont" :class="item.id === imgId ? 'upload-images-cont-checked' : ''" @click= "() => emitUploadImg(item.id)" v-for="item in uploadImages" :key="item.id">
        <img :src="item.image" alt="推荐图片" />
      </dd>
    </dl>
  </div>
</template>
<script>
  import { SUCCESS } from 'constant/statusCode';
  import { MAX_FILE_SIZE } from 'constant/constants';
  import { Toast } from 'components';
  import store from 'store';

  export default {
    name: 'Mwupload',
    components: {
      Toast
    },
    data () {
      return {
        fileList: this.dataSource,
        dialogVisible: false,
        dialogImageUrl: '',
        dragEnter: false,
        content: ''
      };
    },
    props: {
      accept: {
        type: String,
        default: '.png,.jpg,.jpeg,.bmp'
      },
      multipleSelect: {
        type: Boolean,
        default: false
      },
      multipleUpload: {
        type: Boolean,
        default: false
      },
      preview: {
        type: Boolean,
        default: false
      },
      autoUpload: {
        type: Boolean,
        default: true
      },
      name: {
        type: String,
        default: 'file'
      },
      uploadTip: String,
      action: String,
      dataSource: {
        type: Array,
        default: () => []
      },
      deleteImage: {
        type: Function,
        default: () => {}
      },
      acceptedFileType: {
        type: Array,
        default: () => ['image/png', 'image/jpg', 'image/jpeg', 'image/bmp']
      },
      acceptedFileSize: {
        type: Number,
        default: MAX_FILE_SIZE
      },
      acceptedMaxFileCount: {
        type: Number,
        default: null
      },
      uploadImages: {
        type: Array,
        default: () => []
      },
      changeUploadImg: {
        type: Function,
        default: () => {}
      },
      imgId: {
        type: Number,
        default: -1
      },
      changeUploadList: Function
    },
    computed: {
      uploadClass () {
        if (this.multipleUpload) {
          return 'upload-multiple';
        }

        if (this.fileList.length === 1) {
          return 'upload-single';
        }
        return 'upload-initial';
      }
    },
    watch: {
      dataSource () {
        this.fileList = this.dataSource;
      }
    },
    methods: {
      handleChange (file, fileList) {
        if (this.acceptedMaxFileCount && fileList.length > this.acceptedMaxFileCount) {
          fileList.splice(fileList.indexOf(file), 1);
          this.content = `最多上传${this.acceptedMaxFileCount}张图片`;
          this.$refs.toast.isShow = true;
        }

        this.fileList = fileList;
      },
      onSubmit () {
        this.$refs.upload.submit();
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      onDragEnter () {
        this.dragEnter = true;
      },
      onDragOut () {
        this.dragEnter = false;
      },
      handleRemove (file, fileList) {
        this.emitUploadImg(-1);
        if (!file) return;
        this.fileList = fileList;

        if (this.multipleUpload) {
          this.$emit(
            'getImageURI',
            // 偶现url最前面带有blob:字段，需移除
            fileList.map(item => {
              const url = item.url.match(/(https|http)?:\/\/(\w|\d|\.|\/)+\.(jpg|png|jpeg|bmp)$/)[0];
              return { url };
            })
          );
        } else {
          this.deleteImage(file.url.slice(file.url.lastIndexOf('/') + 1));
          this.$emit('getImageURI', '');
        }
      },
      handleSuccess (response, file, fileList) {
        console.log(response)
        const { errNo, errMsg } = response.data.err;
        const files = [];
        this.$refs.upload.uploadFiles.map(item => {
          if (errNo !== SUCCESS) {
            item.status = 'error';
            if (!this.multipleUpload) {
              store.commit('SHOW_ERROR', { status: true, msg: errMsg, showToast: true });
              setTimeout(function () {
                store.commit('SHOW_ERROR', { status: false, msg: '', showToast: false });
              }, 3000);
            }
          }
          files.push(item);
        });

        this.$refs.upload.uploadFiles = files;
        // 不同response 结构不同，若无response.data.path，则返回response.data，自行解析
        this.$emit('getImageURI', response.data.path || response.data);
      },
      beforeAvatarUpload (file) {
        const { acceptedFileSize } = this;
        const isFileType = this.acceptedFileType.includes(file.type);
        const isFileSize = (file.size / 1024) <= acceptedFileSize;

        if (!isFileType || !isFileSize) {
          this.content = !isFileType ? '上传图片只能是png、jpg、jpeg或bmp格式!' : '上传图片大小不能超过最大值!';
          this.$refs.toast.isShow = true;
          return false;
        }

        return true;
      },
      emitUploadImg (id) {
        this.$emit('changeUploadImg', id);
      },
      emitUploadList () {
        this.$emit('changeUploadList');
      }
    }
  };

</script>
<style lang="scss">
  .upload-container {
    .el-upload-dragger {
      width: 200px;
      height: 150px;
      border: 1px solid #DDD;
      background: url('images/img_upload.png') no-repeat left 50%;
    }

    .el-upload--picture-card i {
      font-size: inherit;
      color: white;
    }

    .el-upload__tip {
      margin-top: 0;
      color: #666;
    }

    .el-upload--picture-card {
      border: none;
      height: 150px !important;
      width: 200px !important;
    }

    .upload-single {
      margin-top: 40px;

      .el-upload-list__item {
        height: 150px !important;
        width: 200px !important;
      }

      .el-upload--picture-card {
        border: none;
        display: none;
        left: 0;
        position: absolute;
      }
    }

    .upload-multiple {
      margin-top: 40px;

      .el-upload-list__item {
        height: 150px !important;
        width: 200px !important;
      }

      .el-upload-list {
        .is-error {
          width: 200px;
          background-image: url('./images/img_upload_fail.png');

          img {
            opacity: .1;
          }
        }
      }
    }

    .upload-initial {
      margin-top: 40px;

      .el-upload-list__item {
        display: none;
      }
    }

    .el-upload__tip {
      position: absolute;
      width: 600px;
      top: 0;
    }

    .el-button {
      color: white;
      width: 100px;
      height: 26px;
      background: #F36B5F;
      border-radius: 3px;
      border: none;
    }

    .drag-tip {
      width: 100px;
      height: 26px;
      display: inline-block;
      color: white;
      background: #B7B7B7;
      border-radius: 3px;
      border: none;
    }

    .upload-images-title {
      margin-bottom: 5px;

      a {
        float: right;
        display: block;
        margin-right: 5px;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .menu-upload-images {
      overflow: hidden;
    }

    .upload-images-cont {
      height: 150px;
      margin: 0 5px 5px 0;
      position: relative;
      overflow: hidden;
      float: left;
      display: block;

      &:before {
        content: url('../assets/icon_ok.png');
        position: absolute;
        display: none;
        right: 3px;
        bottom: 3px;
        z-index: 2;
      }

      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        display: none;
        width: 100%;
        height: 40px;
        background: rgba(0, 0, 0, .5);
        z-index: 1;
      }

      img {
        display: block;
        width: 200px;
        height: 150px;
      }

      &:hover img {
        cursor: pointer;
        filter: brightness(1.2);
      }
    }

    .upload-images-cont-checked {
      &:before {
        display: block;
      }

      &:after {
        display: block;
      }
    }

    .preview {
      width: 600px;
    }
    .el-dialog__body {
      text-align: center;
    }
  }
</style>
