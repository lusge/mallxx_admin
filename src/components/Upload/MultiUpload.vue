<template> 
  <div>
    <el-upload
      action=""
      accept="image/jpeg,image/png,image/jpg"
      :http-request="uploadImage"
      :data="useOss?dataObj:null"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { uploadFile } from '@/api/upload'
import { file } from 'jszip/lib/object';
  export default {
    name: 'MultiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      }
    },
    data() {
      return {
        dataObj: {
        },
        dialogVisible: false,
        dialogImageUrl:null,
        useOss:true, //使用oss->true;使用MinIO->false
      };
    },
    computed: {
      fileList() {
        let fileList = [];
        for(let i = 0;i < this.value.length; i++){
          fileList.push({url:this.value[i], pic: this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
        uploadImage(params) {
            console.log(this.value, 11)
            const formData = new FormData();
            formData.append("file", params.file)
            uploadFile(formData).then(response=>{
                if (response.code == 200) {
                    this.fileList.push({url: response.url, pic:response.url})
                    this.emitInput(this.fileList);
                }
            })
        },
      emitInput(fileList) {
        let value = [];
        for(let i = 0;i < fileList.length; i++){
          value.push(fileList[i].pic);
        }
        this.$emit('input', value)
      },
      handleRemove(file, fileList) {
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      beforeUpload(file) {
        return true
      },
      handleUploadSuccess(res, file) {
        // this.fileList.push({name: file.name,url:url});
        // this.emitInput(this.fileList);
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    }
  }
</script>
<style>

</style>


