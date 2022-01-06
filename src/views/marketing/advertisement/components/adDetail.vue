<template>
    <el-card class="form-container" shadow="never">
        <el-form :model="data" label-width="120px" ref="adData" :rules="rules">
            <el-form-item label="名称：" prop="name">
                <el-input v-model="data.name"> </el-input>
            </el-form-item>

            <el-form-item label="广告位置：" prop="pos">
                <el-select v-model="data.pos" >
                    <el-option
                        v-for="item in posOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="分类：" prop="category_id">
                <el-select v-model="data.pos" >
                    <el-option
                        v-for="item in posOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="广告类型：" prop="type">
                <el-select v-model="data.type" >
                    <el-option
                        v-for="item in types"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="URL：" v-show="data.type == 2" prop="url">
                <el-input v-model="data.url"> </el-input>
            </el-form-item>

            <el-form-item label="分类图标：" prop="img">
                <single-image v-model="data.img"> </single-image>
            </el-form-item>

            <el-form-item label="商品ID：" prop="go_id">
                <el-input v-model.number="data.go_id"> </el-input>
            </el-form-item>

            <el-form-item label="开始时间：" prop="start_time">
                <el-date-picker
                    class="input-width"
                    v-model="data.start_time"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间：" prop="end_time">
                <el-date-picker
                    class="input-width"
                    v-model="data.end_time"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="date"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSubmit('adData')" > 提交 </el-button>
                <el-button v-if="!isEdit" @click="resetForm('adData')"> 重置 </el-button>
            </el-form-item>
            
        </el-form>
    </el-card>
</template>

<script>

//位置，0无，1优惠活动（只出现在首页）2:首页顶部
const defaultAd = {
    id: null, 
    name: "", 
    img: "", 
    pos: 2, 
    category_id: 0, 
    type: 1, 
    url: "", 
    go_id: 1, 
    status: 0, 
    start_time: "", 
    end_time: "", 
    add_time:"",
}
import SingleImage from '@/components/Upload/SingleImage';
import { addAd, updateAd, getInfo as getAdInfo } from '@/api/advertisement'
export default {
    name:"adDetail",
    components: {SingleImage},
    props: {
        isEdit:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            data: Object.assign({}, defaultAd),
            rules: {
                name: [
                    {required: true, message: '请输入广告名称', trigger: 'blur'},
                    {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                ],
                img: [
                    {required: true, message:"请上传品牌LOGO", trigger:"blur"},
                ],
                start_time: [
                    {required: true, message:"请输入时间", trigger:"blur"},
                ],
                end_time: [
                    {required: true, message:"请输入时间", trigger:"blur"},
                ],
            },
            posOptions:[
                {
                    id:1,
                    name:"优惠活动"
                },
                {
                    id:2,
                    name:"首页顶部"
                },
                {
                    id:3,
                    name:"分类顶部"
                },
            ],
            //0商品列表，1:单个商品，2:url链接
            types : [
                {
                    id:0,
                    name:"商品列表"
                },
                {
                    id:1,
                    name:"单个商品"
                },
                {
                    id:2,
                    name:"url链接"
                },
            ],
        }
    },
    created() {
        if (this.isEdit) {
            this.getInfo();
        }
    },
    
    methods: {
        getInfo() {
            getAdInfo({id: this.$route.query.id}).then(resp => {
                this.data = resp.data;
            })
        },
        onSubmit(fromName) {
            this.$refs[fromName].validate(vaild => {
                if (vaild) {
                    this.$confirm("是否提交数据", '提示', {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        if (this.isEdit) {
                            updateAd(this.data).then(resp =>{
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.$router.back();
                            });
                        } else {
                            addAd(this.data).then(resp => {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.$router.back();
                            });
                        }
                    });
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.data = Object.assign({}, defaultAd)
        }
    },
}
</script>