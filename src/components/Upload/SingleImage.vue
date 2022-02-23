<template>
  <div >
    <el-upload
      action=""
      accept="image/jpeg,image/png,image/jpg"
      list-type="picture"
      :data="dataObj"
      :multiple="false"
      :show-file-list="false"
      :on-success="handleImageSuccess"
      class="image-uploader"
      :http-request="uploadImage"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>

    <div class="image-preview image-app-preview">
      <div v-show="tempUrl.length>1" class="image-preview-wrapper">
        <img :src="tempUrl">
        <div class="image-preview-action">
          <i class="el-icon-delete" @click="rmImage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import { getToken } from '@/api/qiniu'
import {formatDate} from '@/utils/date'
export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      qiniuaddr:"",
      token: "",
      tempUrl: '',
      dataObj:{}
    }
  },

  watch: {
    value(val) {
      if (val == null) {
        this.tempUrl = "";
        return;
      }
      if (val.length > 0) {
        this.tempUrl =  val;
      } else {
        this.tempUrl = ""
      }
      
    }
  },
  created() {
    getToken().then(response => {
      this.token = response.token
      this.qiniuaddr = response.host
    })

    if (this.value == null) {
      this.tempUrl = "";
    } else {
      this.tempUrl = this.value;
    }
  },

  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
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
    getRandomInt(min, max) {
        // 以下函数返回 min（包含）～ max（包含）之间的数字：
       return  Math.floor(Math.random() * (max - min + 1)) + min
    },
    rmImage() {
      this.emitInput('')
      this.tempUrl = "";
    },
    emitInput(val) {
      console.log(val,"singleimage")
      this.$emit('input', val)
    },
    handleImageSuccess(res, file) {
      this.emitInput(res)
    },
    beforeUpload() {
      return true
    }
  }
}
</script>
<style scoped>
.image-preview-wrapper img {
  /* width: 80px; */
  height: 80px;
}
</style>