<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品信息"></el-step>
      <el-step title="填写商品促销"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </product-info-detail>

    <product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-attr-detail
      v-show="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
    <product-relation-detail
      v-show="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit"> 
    </product-relation-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductSaleDetail from './ProductSaleDetail';
  import ProductAttrDetail from './ProductAttrDetail';
  import ProductRelationDetail from './ProductRelationDetail';
  import {getProductInfo, createProduct, updateProduct} from '@/api/product';

  const defaultProductParam = {
      id:0,
      brand_id: null,
      product_category_id: null,
      feight_template_id:0,
      product_attribute_category_id: null,
      product_sn:"",
      delete_status:0,
      publish_status:0,
      new_status:0,
      recommand_status:0,
      verify_status:0,
      sort:0,
      sale:0,
      price:0,
      promotion_price:0,
      gift_growth:0,
      gift_point:0,
      use_point_limit:0,
      original_price:0,
      stock:0,
      low_stock:0,
      unit:"件",
      weight:0,
      preview_status:0,
      service_ids: "",
      pic: "",
      album_pics: "",
      promotion_start_time:"",
      promotion_end_time:"",
      promotion_per_limit:0,
      promotion_type:0,
      language:"zh-CN",
      name:"",
      sub_title:"",
      description:"",
      keywords:"",
      note:"",
      detail_title:"",
      detail_desc:"",
      detail_html:"",
      detail_mobile_html:"",
      product_category_name:"",
      brand_name:"",

      member_price:[],
      product_full_reduction: [{full_price: 0, reduce_price: 0}],
      //商品阶梯价格
      product_ladder: [{count: 0,discount: 0,price: 0}],
    }
  ;
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductSaleDetail, ProductAttrDetail, ProductRelationDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false]
      }
    },
    created(){
      if(this.isEdit){
        getProductInfo({id:this.$route.query.id}).then(response=>{
          this.productParam = response.data
        })
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit(isEdit) {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(isEdit){
            // this.productParam.id = this.$route.query.id
            updateProduct(this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              this.$router.back();
            });
          }else{
            createProduct(this.productParam).then(response=>{
              this.$message({
                type: 'success',
                message: '提交成功',
                duration:1000
              });
              location.reload();
            });
          }
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
    /* position: absolute; */
    left: 0;
    right: 0;
    padding: 35px 35px 15px;
    margin: 20px auto;
  }
</style>


