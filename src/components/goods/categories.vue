<template>
    <el-card class="box-card">
      <!--面包屑-->
      <myread level1="商品管理" level2="商品分类"></myread>
      <!--按钮-->
      <el-row class="addbtn">
        <el-col>
          <el-button type="success" @click="showAddCatDia()">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="tableData">
        <el-tree-grid
          folder-icon=""
          prop="cat_name"
          label="分类名称"
          width="180"
          treeKey="cat_id"
          parentKey="cat_pid"
          levelKey="cat_level"
          childKey="children">
        </el-tree-grid>
        <el-table-column
          label="级别"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_level === 0">一级</span>
            <span v-if="scope.row.cat_level === 1">二级</span>
            <span v-if="scope.row.cat_level === 2">三级</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否有效"
          width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.cat_eleted === true">无效</span>
            <span v-else>有效</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="index"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="editGoods(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteCate(scope.row.cat_id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      <!-- 添加分类的组件-->
      <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="categories">
          <el-form-item prop="username" label="分类名称" label-width="120px">
            <el-input v-model="categories.cat_name"  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="分类" label-width="120px">
            <el-cascader
              change-on-select
              v-model="selectValue"
              :options="allSelectValue"
              :props="defaultParms"
              @change="handleChange"
              size="200"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addCateg()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>

<script>
  // ElTreeGrid的使用和el-table-colum一样
  var ElTreeGrid = require('element-tree-grid')
  export default {
    name: 'categories',
    components: {
      ElTreeGrid
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 10,
        total: -1,
        dialogFormVisibleAdd: false,
        categories: {},
        selectValue: [],
        allSelectValue: [],
        defaultParms: {
          label: 'cat_name',
          value: 'cat_id',
          children: 'children',
          expandTrigger: 'hover'
        }
      }
    },
    mounted () {
      this.getCategories()
    },
    methods: {
      // 删除分类
      async deleteCate (id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          // 点击确认是触发的方法
          const res = await this.$http.delete(`categories/${id}`)
          const {meta: {status, msg}} = res.data
          if (status === 200) {
            this.$message({
              type: 'success',
              message: msg
            });
            this.currentPage = 1
          } else {
            this.$message({
              type: 'warning',
              message: msg
            });
          }
        }).catch(() => {
          // 点击取消时触发的方法
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
        this.getCategories()
      },
      async addCateg () {
        // 增加分类
        // cat_pid
        // cat_level
        // 一级分类
        // 二级分类
        // 三级分类
        if (this.selectValue.length === 0) {
          this.categories.cat_pid = '0'
          this.categories.cat_level = '0'
        } else if (this.selectValue.length === 1) {
          this.categories.cat_pid = this.selectValue[0] + ''
          this.categories.cat_level = '1'
        } else if (this.selectValue.length === 2){
          this.categories.cat_pid = this.selectValue[1] + ''
          this.categories.cat_level = '2'
        }

        await this.$http.post(`categories`, this.categories)
        this.dialogFormVisibleAdd = false
        this.getCategories()
      },
      handleChange (val){
        this.selectValue = val
      },
      async getCategories () {
        const res = await this.$http.get(`categories?type=3&pagenum=${this.currentPage}&pagesize=${this.pageSize}`)
        this.tableData = res.data.data.result
        this.total = res.data.data.total
      },
      handleSizeChange (val) {
        this.currentPage = 1
        this.pageSize = val
        this.getCategories()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getCategories()
      },
      async showAddCatDia () {
        this.dialogFormVisibleAdd = true
        const res = await this.$http.get(`categories?type=2`)
        this.allSelectValue = res.data.data
      }
    }
  }
</script>

<style scoped>
.addbtn {
  margin-top: 20px;
}
</style>
