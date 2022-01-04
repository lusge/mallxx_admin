<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <i class="el-icon-tickets" style="margin-top: 5px"></i>
            <span style="margin-top: 5px">数据列表</span>

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

            <el-table-column label="分类名称" prop="id"  align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.name }}</span>
                </template>
            </el-table-column>

            <el-table-column label="属性数量" prop="id"  align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.attribute_count }}</span>
                </template>
            </el-table-column>

            <el-table-column label="参数数量" prop="id" align="center"  >
                <template slot-scope="{row}">
                    <span>{{ row.param_count }}</span>
                </template>
            </el-table-column>

            <el-table-column label="设置" prop="id"  align="center"  >
                <template slot-scope="{row}">
                    <el-button
                    size="mini"
                    @click="getAttrList(row)">属性列表
                    </el-button>
                    <el-button
                    size="mini"
                    @click="getParamList(row)">参数列表
                    </el-button>
                </template>
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

        <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        :before-close="handleClose()"
        width="30%">
        <el-form ref="attrFrom" :model="attr" :rules="rules" label-width="120px">
            <el-form-item label="类型名称" prop="name">
            <el-input v-model="attr.name" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleConfirm('attrFrom')">确 定</el-button>
        </span>
        </el-dialog>

    </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { editAttr, getList, delCategoryAttr }   from '@/api/category_attr'

export default {
    
    name: "ProductAttrList",
    components: { Pagination },
    data() {
        return {
            attr:{
                attribute_count: 0,
                id: 0,
                language: "zh",
                name: "",
                param_count: 0,
            },
            rules: {
                name: [
                    { required: true, message: '请输入类型名称', trigger: 'blur' }
                ]
            },
            dialogTitle: "添加",
            dialogVisible: false,
            tableKey: 0,
            list: [],
            total: 2,
            listLoading: false,
            listQuery: {
                page_num: 1,
                page_size: 10
            },
            parentId: 0
        }
    },

    created() {
        this.getList();
    },
    methods:{
        getList() {
            getList(this.listQuery).then(response => {
                console.log(response);
                this.list = response.data
                this.total = response.total;
            })
        },

        handleAddOrEdit(operation) {
            this.dialogVisible = true;
            if (operation == "add") {
                this.dialogTitle = "添加类型";
            } else {
                this.dialogTitle = "编辑类型";
            }
        },

        handleClose() {
            if (!this.dialogVisible && this.$refs.attrFrom) {
                this.$refs.attrFrom.clearValidate()
            }
        },

        handleConfirm(val) {
            this.dialogVisible = false;
            if (this.attr.name.length <= 0) {
                this.$message({
                  message: '名称不能为空',
                  type: 'error',
                  duration:1000
                });
                return;
            }
            editAttr(this.attr).then(response => {
                if (response.status == 200) {
                    this.$message({
                        message: response.message,
                        type: 'success',
                        duration:1000
                    });
                    this.name = "";
                    this.attr.id = 0;
                    this.getList();
                }
                this.getList();
            });
        },

        handleUpdate(row) {
            this.dialogVisible = true;
            this.dialogTitle = "编辑类型"
            this.attr = row;
        },
        
        handleDelete(row) {
            this.$confirm('是否要删除该类型', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delCategoryAttr(row).then(response=>{
                    this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration:1000
                    });
                    this.getList();

                });
            });
        },

        getAttrList(row) {
            this.$router.push({path:'/product/productAttrList',query:{cid:row.id,cname:row.name,type:0}})
        },
        getParamList(row) {
            this.$router.push({path:'/product/productAttrList',query:{cid:row.id,cname:row.name,type:1}})
        }
    }
}
</script>