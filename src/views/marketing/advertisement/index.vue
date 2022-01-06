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
            <el-form :inline="true" :model="listQuery" size="small" label-width="90px">
            <el-form-item label="输入搜索：">
                <el-input style="width: 203px" v-model="listQuery.name" placeholder="广告名称"></el-input>
            </el-form-item>
            <el-form-item label="广告位置：">
                <el-select v-model="listQuery.pos" placeholder="全部" clearable class="input-width">
                    <el-option v-for="item in posOptions"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker
                    class="input-width"
                    v-model="listQuery.start_time"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="结束时间">
                <el-date-picker
                    class="input-width"
                    v-model="listQuery.end_time"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="请选择时间">
                </el-date-picker>
            </el-form-item>
            </el-form>
        </div>
        </el-card>

        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets"></i>
            <span>数据列表</span>
            <el-button size="mini" class="btn-add" @click="handleAdd()" style="float:right">添加广告</el-button>
        </el-card>
        
        <div class="table-container">
        <el-table ref="homeAdvertiseTable"
                    :data="list"
                    style="width: 100%;"
                    
                    v-loading="listLoading" border>
            <el-table-column label="编号" width="120" align="center">
            <template slot-scope="scope">{{scope.row.id}}</template>
            </el-table-column>
            <el-table-column label="广告图片"  align="center">
            <template slot-scope="scope">
                <img style="height: 80px" :src="scope.row.img">
            </template>
            </el-table-column>
            <el-table-column label="广告名称"   align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="广告位置" align="center">
            <template slot-scope="scope">{{scope.row.pos | formatType}}</template>
            </el-table-column>
            
            <el-table-column label="时间" align="center">
            <template slot-scope="scope">
                <p>开始时间：{{scope.row.start_time }}</p>
                <p>到期时间：{{scope.row.end_time }}</p>
            </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
            <template slot-scope="scope">
                <el-button size="mini"
                        type="text"
                        @click="handleUpdate(scope.$index, scope.row)">编辑
                </el-button>
                <el-button size="mini"
                        type="text"
                        @click="handleDelete(scope.$index, scope.row)">删除
                </el-button>
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
        
    </div>
</template>

<script>

const defaultListQuery = {
    page_num: 1,
    page_size: 20,
    name:"",
    pos: null,
    start_time: "", 
    end_time: "", 
}
import {getAdList, deteleAd} from '@/api/advertisement'

import {formatDate} from '@/utils/date';
export default {
    name:"Advertisement",
    components: {  formatDate },
    data() {
        return {
            list: [],
            listQuery: Object.assign({}, defaultListQuery),
            listLoading: false,
            total:null,
            posOptions:[
                {
                    id:0,
                    name:"顶部"
                },
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
            ]
        };
    },

    created() {
        this.getList();
    },

    methods: {
        getList() {
            this.listLoading = true;
            getAdList(this.listQuery).then(response => {
                this.listLoading = false;
                this.list = response.data;
            });
        },

        handleSearchList() {
            this.getList();
        },

        handleResetSearch() {
            this.listQuery = defaultListQuery;
        },

        handleUpdate(index, row) {
            this.$router.push("/advertisement/update?id="+row.id)
        },

        handleDelete(index, row) {
            this.$confirm("是否删除数据", '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                deteleAd({id:row.id}).then(resp => {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            });
        },

        handleAdd(){
            this.$router.push("/advertisement/add")
        },

        handleSizeChange(val) {
            this.listQuery.page_num = 1;
            this.listQuery.page_size = val;
            this.getList();
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
    },

    filters:{
      formatType(type){
        if(type===1){
            return '推荐位';
        }else if (type === 2){
            return 'APP首页轮播';
        } else if (type == 3) {
            return "分类顶部";
        } else {
            return "N/A"
        }
      },
      formatTime(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
}
</script>