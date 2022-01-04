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
import { uploadFile } from '@/api/upload'
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
      tempUrl: '',
      dataObj: { token: '', key: '' },
    }
  },

  watch: {
    value(val) {
      if (val.length > 0) {
        this.tempUrl = STATIC_URL + val;
      } else {
        this.tempUrl = ""
      }
      
    }
  },
  created() {
    
  },

  computed: {
    imageUrl() {
      return this.value
    }
  },
  methods: {
    uploadImage(params) {
      console.log(this.value, 11)
      const formData = new FormData();
      formData.append("file", params.file)
      uploadFile(formData).then(response=>{
        if (response.code == 200) {
          this.tempUrl = response.url;
          params.onSuccess(response.path)
        }
      })
    },
    rmImage() {
      this.emitInput('')
      this.tempUrl = "";
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    handleImageSuccess(res, file) {
      console.log(res)
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