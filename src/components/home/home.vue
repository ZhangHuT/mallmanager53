<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <img src="../../assets/logo.png" alt="无法展示图片">
          </div>
        </el-col>
        <el-col :span="16">
          <h3 class="middle">后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div class="grid-content bg-purple">
            <a class="logout" @click.prevent="logout()" href="#">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          default-active="1"
          :unique-opened="true"
          :router="true">
          <el-submenu
            v-for="(menu, index) in menus"
            :index="''+menu.order"
            :key="index">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>{{menu.authName}}</span>
            </template>
            <el-menu-item v-for="(item, i) in menu.children" :index="item.path" :key="i">
              <i class="el-icon-s-unfold"></i>
              <span>{{item.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      menus: []
    }
  },
  beforeCreate () {
    // 进入home页面之前，先检查用户是否登录
    // 1.获取token
    //const token = localStorage.getItem('token')
    // 2.判断token是否存在，存在时继续访问，不存在时返回登录页面
    // if (!token) {
    //   this.$router.push({name: 'login'})
    // }
  },
  mounted () {
    this.getMenus()
  },
  methods: {
    async getMenus () {
      const res = await this.$http.get('menus')
      const {data} = res.data
      this.menus = data
    },
    logout () {
      // 进行退出
      // 1. 删除用户的token信息
      localStorage.clear()
      // 2. 返回登录页面并给予提示
      this.$router.push({name: 'login'})
      this.$message.success('退出成功！')
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside{
  background-color: #d3dce6;
}
.main{
  background-color: #e9eef3;
  height: 100%;
}
.middle{
  text-align: center;
}
.logout{
  text-decoration: none;
  line-height: 60px;
}
</style>
