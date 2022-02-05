<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width: 203px" v-model="listQuery.sn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brand_id" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publish_status" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verify_status" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini" style="float:right">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="getFullPic(scope.row.pic)"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brand_name}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.product_sn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.publish_status">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.new_status">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommend_status">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verify_status | verifyStatusFilter}}</p>
            <p>
              <el-switch
                @change="handleVerifyStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.verify_status">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.page_size"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page_num"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="编辑货品信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="60%" height="60%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.product_sn}}</span>
      <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input>
      <el-table style="width: 100%;margin-top: 10px;"
                max-height="500"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
          label="SKU编号"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sku_code"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in editSkuInfo.productAttr"
          :label="item.name"
          :key="item.id"
          align="center">
          <template slot-scope="scope">
            {{getProductSkuSp(scope.row,index)}}
          </template>
        </el-table-column>
        <el-table-column
          label="销售价格"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="库存预警值"
          width="100"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.low_stock"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {getSkuStockList, updateSkuStockList} from '@/api/sku_stock'
  import {getProductAttrList} from '@/api/product_attribute'
  import {getProductList, changePublishStatus, changeVerifyStatus, changeNewStatus, changeRecommendStatus, deleteProduct} from '@/api/product'
  import {getBrandList as fetchBrandList} from '@/api/brand'
  import {getCategoryListWithChildren} from '@/api/category'

  const defaultListQuery = {
    name: null,
    page_num: 1,
    page_size: 20,
    publish_status: null,
    verify_status: null,
    sn: null,
    category_id: null,
    brand_id: null
  };
  export default {
    name: "productList",
    data() {
      return {
        editSkuInfo:{
          dialogVisible:false,
          product_id:null,
          product_sn:'',
          product_attribute_category_id:null,
          stockList:[],
          productAttr:[],
          keyword:null
        },
        operates: [
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }]
      }
    },
    created() {
      this.getList();
      this.getBrandList();
      this.getProductCateList();
    },
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.category_id = newValue[1];
        } else {
          this.listQuery.category_id = null;
        }

      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      }
    },
    methods: {
      getFullPic(img) {
        return img
      },
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.sp_data);
        if(spData != null && index < spData.length){
          return spData[index].value;
        }else{
          return null;
        }
      },
      getList() {
        this.listLoading = true;
        getProductList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.total = response.total;
        });
      },
      getBrandList() {
        fetchBrandList({page_num: 1, page_size: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      getProductCateList() {
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
        });
      },
      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible=true;
        this.editSkuInfo.product_id=row.id;
        this.editSkuInfo.product_sn=row.product_sn;
        this.editSkuInfo.product_attribute_category_id = row.product_attribute_category_id;
        this.editSkuInfo.keyword=null;
        getSkuStockList({product_id:row.id,keyword:this.editSkuInfo.keyword}).then(response=>{
          this.editSkuInfo.stockList=response.data;
        });
        if(row.product_attribute_category_id != null){
          let param = {page_num: 1, page_size: 1000, type: 0, cid:row.product_attribute_category_id};
          getProductAttrList(param).then(response=>{
            this.editSkuInfo.productAttr=response.data;
          });
        }
      },
      handleSearchEditSku(){
        getSkuStockList({keyword:this.editSkuInfo.keyword, product_id:this.editSkuInfo.product_id}).then(response=>{
          this.editSkuInfo.stockList=response.data;
        });
      },
      handleEditSkuConfirm(){
        if(this.editSkuInfo.stockList==null||this.editSkuInfo.stockList.length<=0){
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          updateSkuStockList({list:this.editSkuInfo.stockList}).then(response=>{
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible=false;
          });
        });
      },
      handleSearchList() {
        this.listQuery.page_num = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path:'/product/addProduct'});
      },
      handleSizeChange(val) {
        this.listQuery.page_num = 1;
        this.listQuery.page_size = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page_num = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        changePublishStatus({id:row.id, status:row.publish_status}).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        }).catch(error => {
          if (row.publish_status === 0) {
              row.publish_status = 1;
          } else {
              row.publish_status = 0;
          }
        });
      },
      handleVerifyStatusChange(index, row) {
        changeVerifyStatus({id:row.id, status:row.verify_status}).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        }).catch(error => {
          if (row.verify_status === 0) {
              row.verify_status = 1;
          } else {
              row.verify_status = 0;
          }
        });
      },
      handleNewStatusChange(index, row) {
        changeNewStatus({id:row.id, status:row.new_status}).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.new_status === 0) {
              row.new_status = 1;
          } else {
              row.new_status = 0;
          }
        });
      },
      handleRecommendStatusChange(index, row) {
        changeRecommendStatus({id:row.id, status:row.recommend_status}).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        }).catch(error => {
          if (row.recommend_status === 0) {
              row.recommend_status = 1;
          } else {
              row.recommend_status = 0;
          }
        });
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row){
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteProduct({id:row.id}).then(response =>{
            this.getList();
          });
        });
      },
      handleUpdateProduct(index,row){
        this.$router.push({path:'/product/updateProduct',query:{id:row.id}});
      },
      handleShowVerifyDetail(index,row){
        console.log("handleShowVerifyDetail",row);
      },
    }
  }
</script>
<style></style>


