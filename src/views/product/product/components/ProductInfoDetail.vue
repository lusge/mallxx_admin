<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 600px" size="small">
      <el-form-item label="商品分类：" prop="product_category_id">
        <el-cascader
          v-model="selectProductCateValue"
          :options="productCateOptions">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="副标题：" prop="subTitle">
        <el-input v-model="value.sub_title"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌：" prop="brandId">
        <el-select
          v-model="value.brand_id"
          @change="handleBrandChange"
          placeholder="请选择品牌">
          <el-option
            v-for="item in brandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品介绍：">
        <el-input
          :autoSize="true"
          v-model="value.description"
          type="textarea"
          placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="商品货号：">
        <el-input v-model="value.product_sn"></el-input>
      </el-form-item>
      <el-form-item label="商品售价：">
        <el-input-number v-model.number="value.price"></el-input-number>
      </el-form-item>
      <el-form-item label="市场价：">
        <el-input-number v-model.number="value.original_price"></el-input-number>
      </el-form-item>
      <el-form-item label="商品库存：">
        <el-input-number v-model.number="value.stock"></el-input-number>
      </el-form-item>
      <el-form-item label="计量单位：">
        <el-input v-model="value.unit"></el-input>
      </el-form-item>
      <el-form-item label="商品重量：">
        <el-input-number v-model.number="value.weight" style="width: 300px"></el-input-number>
        <span style="margin-left: 20px">克</span>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model.number="value.sort"></el-input-number>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getCategoryListWithChildren} from '@/api/category'
  import {getBrandList} from '@/api/brand'
 
  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated:false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        brandOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          sub_itle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
          product_category_id: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
          brand_id: [{required: true, message: '请选择商品品牌', trigger: 'blur'}],
          description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          requiredProp: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getCategoryList();
      this.getBrandList();
    },
    computed:{
      //商品的编号
      productId(){
        return this.value.id;
      },
      productCategoryId() {
        return this.value.product_category_id
      }
    },
    watch: {
      value: function(){
        this.handleEditCreated();
      },
      productCateOptions: function(newValue) {
        if(!this.isEdit) return;
        if(newValue === undefined || newValue == null || newValue === 0) return;
        this.handleEditCreated();
      },

      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          
          this.value.product_category_id = newValue[1];
          this.value.product_category_name= this.getCateNameById(this.value.product_category_id);
        } else {
          this.value.product_category_id = null;
          this.value.product_category_name = null;
        }
      }
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated(){
        if(this.value.product_category_id !== null){
          for (var i in this.productCateOptions) {
            let pitem = this.productCateOptions[i]
            if (pitem.children != null && pitem.children.length > 0) {
              for (var j in pitem.children) {
                let citem = pitem.children[j];
                if (this.value.product_category_id == citem.value) {
                  
                  this.selectProductCateValue = []
                  this.selectProductCateValue.push(pitem.value,citem.value)
                }
              }
            }
          }
        }
        this.hasEditCreated=true;
      },

      getCategoryList() {
        getCategoryListWithChildren().then(response => {
          let list = response.data;
          this.productCateOptions = [];
          for (let i = 0; i < list.length; i++) {
            let children = [];
            for (let j = 0; j < list.length; j++) {
              if (list[j].parent_id != 0 && list[i].id == list[j].parent_id) {
                children.push({label: list[j].name, value: list[j].id});
              }
            }
            if (list[i].parent_id == 0) {
                this.productCateOptions.push({label: list[i].name, value: list[i].id, children: children});
            }
          }

          this.handleEditCreated();
        });
      },
      getBrandList() {
        getBrandList({page_num: 1, page_size: 2000}).then(response => {
          this.brandOptions = [];
          let brandList = response.data;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getCateNameById(id){
        let name=null;
        for(let i=0;i<this.productCateOptions.length;i++){
          for(let j=0;j<this.productCateOptions[i].children.length;j++){
            if(this.productCateOptions[i].children[j].value===id){
              name=this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name;
      },
      handleNext(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      handleBrandChange(val) {
        let brandName = '';
        for (let i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].value === val) {
            brandName = this.brandOptions[i].label;
            break;
          }
        }
        this.value.brand_name = brandName;
      }
    }
  }
</script>

<style scoped>
</style>
