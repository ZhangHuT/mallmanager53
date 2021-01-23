<template>
    <el-card class="box-card">
      <!--面包屑-->
      <myread level1="订单管理" level2="订单列表"></myread>
      <!--表格-->
      <el-table :data="orderList">
        <el-table-column
          type="index"
          label="#"
          width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          label="是否付款"
          width="180px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.order_pay === '0'">
              <el-tagcity_data2017_element.js>未付款</el-tagcity_data2017_element.js>
            </span>
            <span v-else>
              <el-tag type="danger" >已付款</el-tag>
              </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="180px"
        >
        </el-table-column>
        <el-table-column
          label="下单时间"
          width="180px"
        >
          <template slot-scope="scope">
            {{scope.row.create_time | fmtDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button @click="showEditOrder(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currenrPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!--修改订单-->
      <el-dialog title="修改订单地址" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="address">
          <el-form-item prop="username" label="省市区" label-width="120">
            <el-cascader
              expand-trigger="hover"
              :options="cityOptions"
              :value="city"
              @change="changeProvince"
              change-on-select
            >
            </el-cascader>
          </el-form-item>
          <el-form-item prop="password" label="详细地址" label-width="120">
            <el-input v-model="address.password" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>

<script>
  import cityOptions from '@/assets/city_data2017_element.js'
  export default {
    name: 'orders',
    data () {
      return {
        orderList: [],
        currenrPage: 1,
        total: -1,
        pagesize: 10,
        dialogFormVisibleEdit: false,
        address: {},
        cityOptions: cityOptions,
        city: []
      }
    },
    created () {
      this.getOrderList()
    },
    methods: {
      changeProvince (val) {
        console.log(val)
      },
      // 打开编辑界面
      showEditOrder (order){
        console.log(order)
        this.dialogFormVisibleEdit = true
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getOrderList()
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.getOrderList()
      },
      async getOrderList () {
        const res = await this.$http.get(`orders?query=&pagenum=${this.currentPage}&pagesize=${this.pagesize}`)
        console.log(res)
        this.orderList = res.data.data.goods
        this.total = res.data.data.total
        this.currentPage = res.data.pagenum
      }
    }
  }
</script>

<style scoped>

</style>
