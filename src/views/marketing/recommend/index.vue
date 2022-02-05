<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets" style="margin-top: 5px"></i>
            <span style="margin-top: 5px">数据列表</span>

            <el-button
                class="btn-add"
                @click="handleAdd()"
                size="mini" style="float:right">
                添加
            </el-button>
        </el-card>


        <el-table
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
            >
            <el-table-column label="ID" prop="id" align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column label="名称" prop="product_name"  align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.product_name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="排序" prop="sort"  align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.sort }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" prop="id" align="center">
                <template slot-scope="{row}">
                    <el-button
                    size="mini"
                    @click="handleSetSort(row)">设置排序
                    </el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(row)">删除
                    </el-button>
                </template>
            </el-table-column>
           
        </el-table>
        
        <div class="pagination-container">
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" @pagination="getList" />
        </div>

        <el-dialog
        title="选择商品"
        :visible.sync="productDialogVisible"
        width="60%" height="60%">
        <span></span>
        <el-input v-model="productListQuery.name" style="width: 250px;margin-bottom: 20px" size="small" placeholder="商品名称搜索" >
            <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
        </el-input>

        <el-table :data="productList" @selection-change="handleDialogSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="货号" width="160" align="center">
          <template slot-scope="scope">NO.{{scope.row.product_sn}}</template>
        </el-table-column>
        <el-table-column label="价格" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page.sync="productListQuery.page_num"
          :page-size="productListQuery.page_size"
          :page-sizes="[5,10,15]"
          :total="productTotal">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button  size="small" @click="productDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleProductDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置排序"
               :visible.sync="sortDialogVisible"
               width="40%">
      <el-form :model="sortDialogData"
               label-width="150px">
        <el-form-item label="排序：">
          <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateSort" size="small">确 定</el-button>
      </span>
    </el-dialog>

    </div>
</template>

<script>
const defaultListQuery = {
    name: null,
    page_num: 1,
    page_size: 20,
};
import Pagination from '@/components/Pagination';
import {getProductList} from '@/api/product'
import {getRecommendList, addRecommend, deleteRecommend, setRecommendSort} from "@/api/recommend"
export default {
    name:"recommend",
    components: { Pagination },
    data() {
        return {
            productDialogVisible: false,
            sortDialogVisible: false,
            productList: [],
            productTotal:0,
            list: [],
            total: 0,
            listLoading: false,
            listQuery: {
                page_num: 1,
                page_size: 10
            },
            productListQuery:Object.assign({}, defaultListQuery),
            productIds:[],
            sortDialogData: {id:null, sort:0},
        }
    },

    created() {
        this.getList();
    },
    methods: {
        handleSetSort(row) {
            this.sortDialogData.id = row.id;
            this.sortDialogData.sort = row.sort;
            this.sortDialogVisible = true;
        },

        handleUpdateSort(){
            this.sortDialogVisible = false;
            this.sortDialogData.sort = Number(this.sortDialogData.sort);
            setRecommendSort(this.sortDialogData).then(resp => {
                this.$message({
                    message: '设置成功',
                    type: 'success',
                    duration:1000
                });
                this.getList();
            })
        },
        handleDelete(row) {
            this.$confirm('使用要进行添加操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            deleteRecommend({"product_ids": [row.id]}).then(resp => {
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration:1000
                });
                this.getList();
            })
        })
            
        },
        handleAdd() {
            this.productDialogVisible = true;
            this.getProduct();
        },
        handleDialogSelectionChange(val) {
            this.productIds = [];
            for (var i in val) {
                var item = val[i];
                this.productIds.push(item.id);
            }
        },
        handleProductDialogConfirm(){
            addRecommend({"product_ids":this.productIds}).then(res =>{
                this.$message({
                    message: '添加成功',
                    type: 'success',
                    duration:1000
                });
                this.productDialogVisible = false;
                this.getList();
            })
        },
        getProduct() {
            getProductList(this.productListQuery).then(response => {
                this.productList = response.data;
            })
        },
        getList() {
            this.listLoading = true;
            getRecommendList(this.listQuery).then(response => {
                this.listLoading = false;
                this.list = response.data;
            })
        },
        handleSelectSearch() {
            this.getProduct();
        }
    }
}
</script>