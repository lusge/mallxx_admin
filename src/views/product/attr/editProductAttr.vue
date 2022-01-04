<template>
    <div class="app-container">
        <el-card class="form-container" shadow="never">
        <el-form :model="productAttr" :rules="rules" ref="productAttrFrom" label-width="150px" style="width: 700px" size="small">
            <el-form-item label="属性名称：" prop="name">
                <el-input v-model="productAttr.name"></el-input>
            </el-form-item>
        

            <el-form-item label="商品类型：">
            <el-select v-model="productAttr.category_attribute_id" placeholder="请选择">
            <el-option
                v-for="item in productAttrCateList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="分类筛选样式:">
                <el-radio-group v-model="productAttr.filter_type">
                <el-radio :label="0">普通</el-radio>
                <el-radio :label="1">颜色</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="能否进行检索:">
                <el-radio-group v-model="productAttr.search_type">
                <el-radio :label="0">不需要检索</el-radio>
                <el-radio :label="1">关键字检索</el-radio>
                <el-radio :label="2">范围检索</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商品属性关联:">
                <el-radio-group v-model="productAttr.related_status">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="属性是否可选:">
                <el-radio-group v-model="productAttr.select_type">
                <el-radio :label="0">唯一</el-radio>
                <el-radio :label="1">单选</el-radio>
                <el-radio :label="2">复选</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="属性值的录入方式:">
                <el-radio-group v-model="productAttr.input_type">
                <el-radio :label="0">手工录入</el-radio>
                <el-radio :label="1">从下面列表中选择</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="属性值可选值列表:">
                <el-input :autosize="true" type="textarea" v-model="inputListFormat"></el-input>
            </el-form-item>
            <el-form-item label="是否支持手动新增:">
                <el-radio-group v-model="productAttr.hand_add_status">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序属性：">
                <el-input v-model="productAttr.sort"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
                <!-- <el-button  v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button> -->
            </el-form-item>
        </el-form>
        </el-card>
    </div>
</template>

<script>
import {addProductAttr, getProductAttrInfo, updateProductAttr} from '@/api/product_attribute'
import {  getList }   from '@/api/category_attr'
export default {
    name:"editProductAttr",

    data() {
        return {
            productAttr:{
                id: this.$route.query.id,
                name:"",
                category_attribute_id:0,
                filter_type: 0,
                search_type: 0,
                related_status: 0,
                select_type: 0,
                input_type: 0,
                hand_add_status:1,
                sort:0,
                language: "zh",
                input_list:"",
                type: Number(this.$route.query.type),
            },
            productAttrCateList:[],
            inputListFormat:null,
            // isEdit:false,
            rules: {
                name: [
                    {required: true, message: '请输入属性名称', trigger: 'blur'},
                    {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                ]
            },
        }
    },

    created() {
        this.getCategoryList();
        if (this.productAttr.id > 0) {
            console.log(this.productAttr.id)
            this.getProductAttrInfo();
        }
    },

    watch:{
      inputListFormat: function (newValue, oldValue) {
        newValue = newValue.replace(/\n/g,',');
        this.productAttr.input_list = newValue;
      }
    },

    methods: {
        getProductAttrInfo() {
            getProductAttrInfo({id:this.productAttr.id}).then((response) => {
                this.productAttr = response.data
                this.inputListFormat = this.productAttr.input_list.replace(/,/g,'\n');
            });
        },
        getCategoryList() {
            let listQuery = {pageNum: 1, pageSize: 1000};
            getList(listQuery).then(response => {
                this.productAttrCateList = response.data
                this.productAttr.category_attribute_id = Number(this.$route.query.cid);
            })
        },
        onSubmit(val) {
            this.$refs[val].validate((valid) => {
                if (valid) {
                    this.$confirm('是否提交数据', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var func = addProductAttr
                        if (this.productAttr.id > 0) {
                            func = updateProductAttr
                        }

                        func(this.productAttr).then((response) => {
                            this.$message({
                                message: '提交成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.$router.back();
                        })
                        
                    });
                }
            });
        }
    }
}
</script>
