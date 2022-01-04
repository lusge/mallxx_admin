<template>
<el-card class="form-container" shadow="never">
    <el-form :model="category" :rules="rules" ref="categoryForm" label-width="150px">

        <el-form-item label="分类名称:" prop="name">
            <el-input v-model="category.name"></el-input>
        </el-form-item>

        <el-form-item label="上级分类:">
            <el-select v-model="category.parent_id" placeholder="请选择分类">
                <el-option v-for="item in selectCategoryList"
                :key="item.id"
                :label="(item.name)"
                :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item label="数量单位:">
            <el-input v-model="category.product_unit" > </el-input>
        </el-form-item>

        <el-form-item label="排序:">
            <el-input v-model="category.sort"></el-input>
        </el-form-item>

        <el-form-item label="是否显示:">
            <el-radio-group v-model="category.show_status">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="是否显示在导航栏:">
            <el-radio-group v-model="category.nav_status">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="分类图标:">
            <single-image v-model="category.icon"> </single-image>
        </el-form-item>

        <el-form-item v-for="(filterProductAttr, index) in filterProductAttrList"
                    :label="index | filterLabelFilter"
                    :key="filterProductAttr.key">
            <el-cascader
            clearable
            v-model="filterProductAttr.value"
            :options="filterAttrs">
            </el-cascader>
            <el-button style="margin-left: 20px" @click.prevent="removeFilterAttr(index)">删除</el-button>
        </el-form-item>
        <el-form-item>
            <el-button size="small" type="primary" @click="addFilterAttr()">新增</el-button>
        </el-form-item>

        <el-form-item label="关键字:">
            <el-input v-model="category.keywords"> </el-input>
        </el-form-item>

        <el-form-item label="分类描述:">
            <el-input type="textarea" :autosize="true" v-model="category.description"> </el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit('categoryForm')" > 提交 </el-button>
            <el-button v-if="!isEdit" @click="resetForm('categoryForm')"> 重置 </el-button>
        </el-form-item>

    </el-form>
</el-card>
</template>

<script>
import {getCategoryList, updateCategory, createCategory, getCategoryInfo} from '@/api/category'
import {getCategoryAttrAndProductAttr} from '@/api/category_attr'
import SingleImage from '@/components/Upload/SingleImage';

const defaultCategory = {
    id:0,
    parent_id:0,
    level:0,
    product_count:0,
    product_unit:"件",
    nav_status:0,
    show_status:0,
    sort:0,
    icon:"",
    product_attribute_ids: [],
    language: "zh-CN"
};
export default {
    name:"CategoryDetail",
    components: {SingleImage},
    props: {
        isEdit:{
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            category:Object.assign({}, defaultCategory),
            selectCategoryList:[],
            rules: {
                name: [
                    {required: true, message: '请输入品牌名称', trigger: 'blur'},
                    {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
                ]
            },
            filterAttrs: [],
            filterProductAttrList: [{
                value: []
            }],
            this_:this,
        }
    },
    created() {
        this.getSelectProductCateList();
        this.getCateogryAttrAndProductAttr();
    },
    methods: {
        getSelectProductCateList() {
            getCategoryList({pageSize: 1000, pageNum: 1}).then(response => {
                this.selectCategoryList = response.data;
                this.selectCategoryList.unshift({id:0, name:"无上级分类"});
            })
        },

        getCategoryInfo() {
            getCategoryInfo({"id":this.$route.query.id}).then(response => {
                this.category = response.data
                for (var i in this.filterAttrs) {
                    const pAttrs = this.filterAttrs[i];
                    const pid = pAttrs.value
                    if (!pAttrs.children) {
                        continue
                    }
                    for (var j in pAttrs.children) {
                        const cid = pAttrs.children[j].value;
                        const ids = this.category.product_attribute_ids
                        if (ids == null || ids.length < 1) {
                            continue
                        }
                        for (var k in this.category.product_attribute_ids) {
                            const rid = this.category.product_attribute_ids[k];
                            if (rid == cid) {
                                this.filterProductAttrList = []
                                this.filterProductAttrList.push({value:[pid,cid]})
                            }
                        }
                    }
                }
            })
        },

        getProductAttrIds() {
            let ids = [];
            for (let i in this.filterProductAttrList) {
                let item = this.filterProductAttrList[i]
                if (item.value !== null && item.value.length === 2) {
                    ids.push(item.value[1])
                }
            }
            return ids;
        },

        getCateogryAttrAndProductAttr() {
            getCategoryAttrAndProductAttr().then(response => {
                let list = response.data
                for( let i in list) {
                    let cateAttr = list[i]
                    let children = [];
                    if (cateAttr.children != null && cateAttr.children.length > 0) {
                        for (let j in cateAttr.children) {
                            let productAttr = cateAttr.children[j]
                            children.push({
                                label: productAttr.name,
                                value: productAttr.id
                            })
                        }
                    }
                    this.filterAttrs.push({
                        label: cateAttr.category_attr.name,
                        value: cateAttr.category_attr.id,
                        children: children
                    })         
                }
                if (this.isEdit) {
                    this.getCategoryInfo();
                }
            })
        },

        onSubmit(formName) {
            console.log(this.category)
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm("是否提交数据", '提示', {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.category.product_attribute_ids = this.getProductAttrIds()
                        if (this.isEdit) {
                            this.category.id = Number(this.$route.query.id);
                            updateCategory(this.category).then(response =>{
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.$router.back();
                            })
                        } else {
                            createCategory(this.category).then(response => {
                                this.$message({
                                    message: '提交成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.$router.back();
                            })
                        }
                    })
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.category = Object.assign({}, defaultCategory);
            this.getSelectProductCateList();
            this.filterProductAttrList = [{
                value: []
            }];
        },
        removeFilterAttr(index) {
            if (this.filterProductAttrList.length === 1) {
                this.$message({
                    message:"最少保留一项",
                    type: 'warning',
                    duration: 1000,
                });
                return;
            }

            this.filterProductAttrList.splice(index, 1);
        },

        addFilterAttr() {
            if (this.filterProductAttrList.length === 3) {
                this.$message({
                    message:"最多添加三项",
                    type: 'warning',
                    duration: 1000,
                });
                return;
            }
            this.filterProductAttrList.push({
                value:null,
                key: Date.now()
            })
        }
    },
    filters: {
      filterLabelFilter(index) {
        if (index === 0) {
          return '筛选属性：';
        } else {
          return '';
        }
      },
      name(value, this_) {
          console.log(value)
          for (var i = 0; i < value.length; i++) {
              var item = value[i];
              if (item.language == this_.language) {
                  return item.name;
              }
          }

          return "";
      }
    }
}
</script>