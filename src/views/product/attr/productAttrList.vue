<template>
    <div class="app-container">

           <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets" style="margin-top: 5px"></i>
            <span style="margin-top: 5px">《{{cname}}》的属性列表</span>

            <el-button
                class="btn-add"
                @click="handleAddOrEdit('add')"
                size="mini" style="float:right">
                添加
            </el-button>
        </el-card>

            <el-table
                :key="tableKey"
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

            <el-table-column label="属性名称" prop="id"  align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="商品类型" width="140" align="center">
                <template>{{$route.query.cname}}</template>
            </el-table-column>

            <el-table-column label="属性是否可选" width="120" align="center">
            <template slot-scope="{row}">{{row.select_type|selectTypeFilter}}</template>
            </el-table-column>


            <el-table-column label="属性值的录入方式" width="150" align="center">
                <template slot-scope="{row}">{{row.input_type|inputTypeFilter}}</template>
            </el-table-column>
            <el-table-column label="可选值列表" align="center">
                <template slot-scope="{row}">{{row.input_list}}</template>
            </el-table-column>
            <el-table-column label="排序" width="100" align="center">
                <template slot-scope="{row}">{{row.sort}}</template>
            </el-table-column>

            <el-table-column label="操作" prop="id" align="center">
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
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.page_num" :limit.sync="listQuery.page_size" @pagination="getList" />
        </div>



    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import {getProductAttrList, delteProductAttr} from '@/api/product_attribute'
export default {
    name:"productAttrList",
    components: { Pagination },
    data() {
        return {
            cid: this.$route.query.cid,
            cname:this.$route.query.cname,
            list:[],
            total:0,
            tableKey: 0,
            listLoading: false,
            listQuery: {
                page_num: 1,
                page_size: 10,
                cid:this.$route.query.cid,
                type: this.$route.query.type,
            },
        }
    },

    created() {
        this.getList();
    },

    methods: {
        getList() {
            // this.listQuery.cid = this.$route.query.cid;
            getProductAttrList(this.listQuery).then((response) => {
                this.total = response.total;
                this.list = response.data;
            });
        },

        handleClose() {},

        handleAddOrEdit(val) {
            this.$router.push({path:'/product/editProductAttr', query:{cid: this.cid, type: this.$route.query.type}})
        },
        handleDelete(val) {
            this.$confirm('是否要删除该类型', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delteProductAttr(val).then((response) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration:1000
                    });
                    this.getList();
                });
            });
        },
        handleUpdate(row) {
            this.$router.push({path:'/product/editProductAttr', query:{cid: this.cid, id: row.id, type: this.$route.query.type}})
        },

    },

    filters: {
      inputTypeFilter(value) {
        if (value === 1) {
          return '从列表中选取';
        } else {
          return '手工录入'
        }
      },
      selectTypeFilter(value) {
        if (value === 1) {
          return '单选';
        } else if (value === 2) {
          return '多选';
        } else {
          return '唯一'
        }
      },
    }
}
</script>