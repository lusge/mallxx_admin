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
import * as qiniu from 'qiniu-js'
import { getToken } from '@/api/qiniu'
import {formatDate} from '@/utils/date'
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
        qiniuaddr:"",
        token: "",
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
    created(){
      getToken().then(response => {
        this.token = response.token
        this.qiniuaddr = response.host
      })
    },
    methods: {
      getRandomInt(min, max) {
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
          console.log(complete, "complete")
          params.onSuccess(_self.qiniuaddr + "/" +complete.key);
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
        this.fileList.push({name: file.name,pic:res});
        this.emitInput(this.fileList);
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


