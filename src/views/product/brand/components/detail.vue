<template>
    <el-card class="form-container" shadow="never">
    <el-form :model="brand" :rules="rules" ref="brandFrom" label-width="150px">
      <el-form-item label="品牌名称：" prop="name">
        <el-input v-model="brand.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母：">
        <el-input v-model="brand.first_letter"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO：" prop="logo">
        <single-image v-model="brand.logo"></single-image>
      </el-form-item>
      <el-form-item label="品牌专区大图：">
        <single-image v-model="brand.big_pic"></single-image>
      </el-form-item>
      <el-form-item label="品牌故事：">
        <el-input
          placeholder="请输入内容"
          type="textarea"
          v-model="brand.brand_story"
          :autosize="true"></el-input>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="品牌地址：" prop="sort">
        <el-input v-model.number="brand.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="brand.show_status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌制造商：">
        <el-radio-group v-model="brand.factory_status">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('brandFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('brandFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import {addBrand, getBrandInfo, updateBrand} from '@/api/brand'
import SingleImage from '@/components/Upload/SingleImage';
const defaultBrand={
    id:0,
    big_pic: '',
    brand_story: '',
    factory_status: 0,
    first_letter: '',
    logo: '',
    name: '',
    show_status: 0,
    sort: 0,
    url:""
  };
export default {
    name:"BrandDetail",
    components: {SingleImage},
    props: {
        isEdit:{
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            brand:Object.assign({}, defaultBrand),
            rules: {
                name:[
                    {required: true, message:"请输入品牌名称", trigger:"blur"},
                    {mix:2, max: 140, message:"长度在 2 到 140 个字符", trigger: "blur"}
                ],
                logo:[
                    {required: true, message:"请上传品牌LOGO", trigger:"blur"},
                ],
                sort: [
                    {type: 'number', message: '排序必须为数字'}
                ]
            },
        }
    },
    created() {
        if (this.isEdit) {
            this.getInfo()
        }
    },
    methods: {
        getInfo() {
            getBrandInfo({id:this.$route.query.id}).then(response => {
                this.brand = response.data
            }) 
        },
        onSubmit(from) {
            this.$refs[from].validate((valid) => {
                if (valid) {
                    if (this.isEdit) {
                        updateBrand(this.brand).then(response => {
                            this.$message({
                                message: response.detail,
                                type: 'success',
                                duration: 1000
                            });
                            this.$router.back();
                        })
                    } else {
                        addBrand(this.brand).then(response => {
                            this.$message({
                                message: response.detail,
                                type: 'success',
                                duration: 1000
                            });
                            this.$router.back();
                        })
                    }
                }
            })
        },
        resetForm(from) {

        }
    }
}
</script>