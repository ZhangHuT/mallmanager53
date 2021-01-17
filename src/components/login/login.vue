<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handelLogin()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      formData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handelLogin () {
      // 希望让异步代码看起来像同步代码
      // ES7 async+await
      const res = await this.$http.post('login', this.formData)
      const {meta} = res.data
          if (meta.status === 200) {
            this.$message.success('登录成功！')
            this.$router.push({name: 'home'})
          } else {
            this.$message.error(meta.msg)
          }
        }
      // this.$http
      //   .post('login', this.formData)
      //   .then((res) => {
      //     const {meta} = res.data
      //     if (meta.status === 200) {
      //       this.$message.success('登录成功！')
      //       this.$router.push({name: 'home'})
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   })
    }
  }
}
</script>

<style scoped>
  .login-wrap {
    height: 100%;
    background-color: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-wrap .login-form {
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;
  }
  .login-wrap .login-btn {
    width: 100%;
  }
</style>
