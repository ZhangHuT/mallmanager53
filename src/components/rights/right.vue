<template>
    <el-card class="box-card">
      <!--面包屑组件-->
      <myread level1="权限管理" level2="权限列表"></myread>
      <!--表格-->
      <el-table
        :data="powerData"
        height="610"
        border
        style="width: 100%" class="roleRow">
        <el-table-column
          type="index"
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          label="等级">
          <template slot-scope="scope">
            <span v-if="scope.row.level === '0'">一级</span>
            <span v-if="scope.row.level === '1'">二级</span>
            <span v-if="scope.row.level === '2'">三级</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
</template>

<script>
  export default {
    name: 'right',
    data () {
      return {
        powerData: []
      }
    },
    created () {
      this.getPowerDate()
    },
    methods: {
      async getPowerDate () {
        const  res = await this.$http.get(`rights/list`)
        console.log(res)
        const {data} = res.data
        this.powerData = data

      }
    }
  }
</script>

<style scoped>
.roleRow {
  margin-top: 20px;
}
</style>
