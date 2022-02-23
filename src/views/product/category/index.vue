<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets" style="margin-top: 5px"></i>
            <span style="margin-top: 5px">数据列表</span>

            <el-button
                class="btn-add"
                @click="addCategory()"
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
            <el-table-column label="ID"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column label="分类名称"   align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="级别"  align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.level + 1 }}</span>
                </template>
            </el-table-column>

            <el-table-column label="数量" align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.product_count }}</span>
                </template>
            </el-table-column>

            <el-table-column label="数量单位"  align="center" >
                <template slot-scope="{row}">
                    <span>{{ row.product_unit }}</span>
                </template>
            </el-table-column>

            <el-table-column label="导航栏"  align="center" >
                <template slot-scope="{row}">
                    <el-switch
                        @change="changeNavStatus(row)"
                        :active-value="1"
                        :inactive-value="0"
                        v-model="row.nav_status">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="是否显示"  align="center">
                <template slot-scope="{row}">
                    <el-switch
                        @change="changeShowStatus(row)"
                        :active-value="1"
                        :inactive-value="0"
                        v-model="row.show_status">
                    </el-switch>
                </template>
            </el-table-column>

            <el-table-column label="排序"   align="center">
                <template slot-scope="{row}">
                    <span>{{ row.sort }}</span>
                </template>
            </el-table-column>

            <el-table-column label="设置" width="200"  align="center"  >
                <template slot-scope="{row}">
                    <el-button
                        size="mini"
                        :disabled="row.level | disableNextLevel"
                        @click="showNextLevel(row)">查看下级
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="{row}">
                    <el-button
                        size="mini"
                        @click="updateRow(row)">编辑
                    </el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="deleteRow(row)">删除
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
import {getCategoryList, changeCategoryNavStatus, changeCategoryShowStatus, deleteCategory} from '@/api/category'
export default {
    
    name: "ProductCategoryList",
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            list: [
            ],
            total: 0,
            listLoading: false,
            listQuery: {
                page_num: 1,
                page_size: 20,
                pid: 0,
            },
            parentId: 0,
            this_: this,
        }
    },
    created() {
        this.getList();
    },

    watch: {
      $route(route) {
        this.getList();
      }
    },

    methods:{
        getList() {
            this.listLoading = true;
            this.listQuery.pid = this.$route.query.pid;
            getCategoryList(this.listQuery).then((response) => {
                this.list = response.data;
                this.total = response.total;
                this.listLoading = false;
            })
        },
        changeNavStatus(row) {
            var data = {
                "id" : row.id,
                "status" : row.nav_status
            };
            changeCategoryNavStatus(data).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            }).catch(error => {
                if (row.nav_status === 0) {
                    row.nav_status = 1;
                } else {
                    row.nav_status = 0;
                }
            });
        },
        changeShowStatus(row) {
            var data = {
                "id" : row.id,
                "status" : row.show_status
            };
            changeCategoryShowStatus(data).then((response) => {
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            }).catch(error => {
                if (row.show_status === 0) {
                    row.show_status = 1;
                } else {
                    row.show_status = 0;
                }
            });
        },

        updateRow(row) {
            this.$router.push("/product/updateCategory?id="+row.id)
        },

        deleteRow(row) {
            this.$confirm("是否删除该数据", '提示', {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                deleteCategory({id:row.id}).then(response => {
                    this.$message({
                        message: response.detail,
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                })
            })
        },
        showNextLevel(row) {
            this.$router.push({path:"/product/category",query:{pid:row.id}})
        },
        transferProduct(row) {

        },
        addCategory() {
            if (this.$route.query.pid === "") {
                this.$router.push("/product/addCategory")
            } else {
                this.$router.push({path:"/product/addCategory",query:{pid:this.$route.query.pid}})
            }
            
        },
    },

    filters: {
      disableNextLevel(value) {
        if (value === 0) {
          return false;
        } else {
          return true;
        }
      },
      name(value, this_) {
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