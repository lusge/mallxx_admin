<template>
    <div class="app-container">
        <div class="filter-container">
        <el-input v-model="listQuery.keyword" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
        </el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
            添加
        </el-button>
        </div>

        <el-table ref="brandTable"
                    :data="brand"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border>
            <!-- <el-table-column type="selection" width="60" align="center"></el-table-column> -->
            <el-table-column label="ID"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>
            <el-table-column label="品牌名称" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="品牌首字母" width="100" align="center">
                <template slot-scope="{row}">{{row.first_letter}}</template>
            </el-table-column>
            <el-table-column label="排序" width="100" align="center">
                <template slot-scope="{row}">{{row.sort}}</template>
            </el-table-column>
            <el-table-column label="品牌制造商" width="100" align="center">
                <template slot-scope="{row}">
                    <el-switch
                    @change="handleFactoryStatusChange(row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="row.factory_status">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="是否显示" width="100" align="center">
                <template slot-scope="{row}">
                    <el-switch
                    @change="handleShowStatusChange(row)"
                    :active-value="1"
                    :inactive-value="0"
                    v-model="row.show_status">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="相关" width="220" align="center">
                <template slot-scope="{row}">
                    <span>商品：{{row. product_count}}</span>
                    
                    <span>评价：{{ row.product_comment_count }}</span>
                    
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="{row}">
                    <el-button
                    size="mini"
                    @click="handleUpdate(row)">编辑
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
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageNum" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import waves from '@/directive/waves'
import {getBrandList, deleteBrand, changeBrandShowStatus, changeBrandFactoryStatus, updateBrand} from '@/api/brand'
export default {
    name: "ProductBrandList",
    components: { Pagination },
    directives: { waves },
    data() {
        return {
            total: 0,
            listLoading: true,
            listQuery: {
                pageNum: 1,
                pageSize: 20,
                keyword:''
            },
            brand: []
        }
    },

    created() {
        this.getList();
    },

    methods: {
        getList() {
            this.listLoading = true;
            getBrandList(this.listQuery).then(response => {
                this.brand = response.data
                this.total = response.total
                this.listLoading = false;
            })
        },
        handleCreate() {
            this.$router.push("/product/brand/add")
        }, 
        handleFilter() {
            this.listLoading = true;
            // this.keyword = 
            getBrandList(this.listQuery).then(response => {
                this.brand = response.data
                this.total = response.total
                this.listLoading = false;
            })
        },
        handleSelectionChange() {

        },
        handleFactoryStatusChange(row) {
            var data = {
                "id" : row.id,
                "status" : row.factory_status
            };
            changeBrandFactoryStatus(data).then(response => {
                this.$message({
                    message: response.detail,
                    type: 'success',
                    duration: 1000
                });
                this.getList();
            }).catch(error => {
                if (row.factory_status === 0) {
                    row.factory_status = 1;
                } else {
                    row.factory_status = 0;
                }
            });
        },
        handleShowStatusChange(row) {
            var data = {
                "id" : row.id,
                "status" : row.show_status
            };
            changeBrandShowStatus(data).then(response => {
                this.$message({
                    message: response.detail,
                    type: 'success',
                    duration: 1000
                });
                this.getList();
            }).catch(error => {
                if (row.show_status === 0) {
                    row.show_status = 1;
                } else {
                    row.show_status = 0;
                }
            });
        },
        handleUpdate(row) {
            this.$router.push("/product/brand/update?id="+row.id)
        },
        handleDelete(row) {
            this.$confirm("是否删除该数据", '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                deleteBrand({id:row.id}).then(response => {
                    this.$message({
                        message: response.detail,
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                })
            })
            
        }
    }
}
</script>