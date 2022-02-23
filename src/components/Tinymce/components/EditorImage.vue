<template>
  <div class="upload-container">
    <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" size="mini" type="primary" @click=" dialogVisible=true">
      upload
    </el-button>
    <el-dialog :visible.sync="dialogVisible">
      <el-upload
        :multiple="true"
        :file-list="fileList"
        :show-file-list="true"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        class="editor-slide-upload"
        action=""
        accept="image/jpeg,image/png,image/jpg"
        :http-request="uploadImage"
        list-type="picture-card"
      >
        <el-button size="small" type="primary">
          Click upload
        </el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">
        Cancel
      </el-button>
      <el-button type="primary" @click="handleSubmit">
        Confirm
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import { getToken } from '@/api/qiniu'
import {formatDate} from '@/utils/date'
export default {
  name: 'EditorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      qiniuaddr:"",
      token: "",
      dialogVisible: false,
      listObj: {},
      fileList: []
    }
  },
  created() {
    getToken().then(response => {
      this.token = response.token
      this.qiniuaddr = response.host
    })
  },
  methods: {
    getRandomInt(min, max) {
        // 以下函数返回 min（包含）～ max（包含）之间的数字：
       return  Math.floor(Math.random() * (max - min + 1)) + min
    },
    uploadImage(params) {
      let _self = this;
      let config = {
        useCdnDomain: true,
        region: qiniu.region.as0,
        debugLogLevel: 'INFO'
      };
      let putExtra = {
        fname: params.file.name,
        params: {},
        mimeType: null
      };

      let filetype = params.file.name.slice(params.file.name.lastIndexOf('.'),params.file.name.length)
      let key = formatDate(new Date(),"yyyyMMddhhmmss") + this.getRandomInt(1000, 9999) + filetype

      // 调用sdk上传接口获得相应的observable，控制上传和暂停
      let observable = qiniu.upload(params.file, key, this.token, putExtra, config);
      let subscription = observable.subscribe((response) =>{
        
      }, (error) => {
        console.log(error, "error")
      }, (complete) => {
        params.onSuccess(_self.qiniuaddr + "/" +complete.key);
      })
    },
    checkAllSuccess() {
      return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
    },
    handleSubmit() {
      const arr = Object.keys(this.listObj).map(v => this.listObj[v])
      if (!this.checkAllSuccess()) {
        this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
        return
      }
      this.$emit('successCBK', arr)
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          this.listObj[objKeyArr[i]].url = response
          this.listObj[objKeyArr[i]].hasSuccess = true
          return
        }
      }
    },
    handleRemove(file) {
      const uid = file.uid
      const objKeyArr = Object.keys(this.listObj)
      for (let i = 0, len = objKeyArr.length; i < len; i++) {
        if (this.listObj[objKeyArr[i]].uid === uid) {
          delete this.listObj[objKeyArr[i]]
          return
        }
      }
    },
    beforeUpload(file) {
      const _self = this
      const _URL = window.URL || window.webkitURL
      const fileName = file.uid
      this.listObj[fileName] = {}
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = _URL.createObjectURL(file)
        img.onload = function() {
          _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
        }
        resolve(true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  ::v-deep .el-upload--picture-card {
    width: 100%;
  }
}
</style>
