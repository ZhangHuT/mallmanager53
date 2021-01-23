<template>
    <el-card class="box-card">
      <!--面包屑-->
      <myread level1="商品管理" level2="商品列表"></myread>
      <!--搜索框，添加按钮-->
      <el-row class="searchRow">
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="search" clearable @clear="handleUsers()">
            <el-button slot="append" @click="searchGoods" icon="el-icon-search"></el-button>
          </el-input>
          <el-button @click="$router.push({name: 'addGoods'})" type="success">添加商品</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table
        :data="tableData"
        border
        height="500"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格（元）">
        </el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量">
        </el-table-column>
        <el-table-column
          label="创建日期">
          <template slot-scope="scope">
            {{scope.row.upd_time | fmtDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button @click="editGoods(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteGoods(scope.row.goods_id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          </template>
         </el-table-column>
      </el-table>
      <!--  分页  -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
</template>

<script>
  export default {
    name: 'goods',
    data () {
      return {
        query: '',
        tableData: [],
        pagenum: 1,
        pagesize: 100,
        total: -1
      }
    },
    mounted () {
      this.getGoodsList()
    },
    methods: {
      // 搜索商品
      searchGoods() {
        this.pagenum = 1
        this.getGoodsList()
      },
      // 分页
      handleSizeChange (val) {
        this.pagesize = val
        this.pagenum = 1
        this.getGoodsList()
      },
      handleCurrentChange (val) {
        this.pagenum = val
        this.getGoodsList()
      },
      // 删除商品
     deleteGoods (id) {
        this.$confirm('此操作将永久删除该物品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          // 点击确认是触发的方法
          console.log(id)
          const res = await this.$http.delete(`goods/${id}`)
          console.log(res)
          const {meta: {status, msg}} = res.data
          if (status === 200) {
            this.$message({
              type: 'success',
              message: msg
            });
            this.pagenum = 1
            this.handleUsers()
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
      },
      async getGoodsList () {
        const res = await this.$http.get(`goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        const {data, meta: {msg, status}} = res.data
        if (status === 200) {
          this.tableData = data.goods
          this.total = data.total
          this.pagenum = data.pagenum
          this.$message.success(msg)
        } else {
          this.$message.warning(msg)
        }
      }
    }
  }
</script>

<style scoped>
  .searchRow {
    margin-top: 20px;
  }

  .search {
    width: 400px;
  }
</style>
