<template>
  <!-- 卡片 -->
  <el-card class="box-card">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!--  搜索，添加  -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="search" clearable @clear="handleUsers()">
          <el-button slot="append" @click="queryUser()" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="showAddUser()" type="success">添加用户</el-button>
  <!--         添加用户的组件-->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
          <el-form :model="user" :rules="rules" ref="user">
            <el-form-item prop="username" label="用户名称" :label-width="formLabelWidth">
              <el-input v-model="user.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
              <el-input v-model="user.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="user.email" autocomplete="off"></el-input>
          </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="user.mobile" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="addUser()">确 定</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  <!--  表格  -->
    <el-table
      :data="usersList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建日期">
      <!--    el-table-column和template是两个不同的组件，他们的值不能进行共享，所以需要进行传值使用    -->
      <!--    如果给单元格内显示的内容不是字符串（文本），需要给被显示的内容外层包裹一个template    -->
      <!--    template 内部要用数据，使用slot-scope属性，该属性的值是用数据create_time的数据源userlist    -->
      <!--    slot-scop作用是进行传值    -->
        <template slot-scope="usersList">
          {{usersList.row.create_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template slot-scope="usersList">
          <el-switch
            @change="chengeUserState(usersList.row)"
            v-model="usersList.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="editUser(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button @click="deleteUser(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button @click="setUserRole(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  <!--  分页  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--编辑用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="user" :rules="rules" ref="user">
        <el-form-item prop="username" label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="user.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="user.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="sureEditUser(user.id)">确 定</el-button>
      </div>
    </el-dialog>
  <!--  分配角色  -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRol">
      <el-form :model="user">
        <el-form-item label="用户姓名" :label-width="formLabelWidth">
          {{currentUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currentRoleId">
            <el-option label="请选择" :value="-1" disabled></el-option>
            <el-option
              v-for="(item, i) in allRoles"
              :key="i"
              :label="item.roleName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRol = false">取 消</el-button>
        <el-button type="primary" @click="editUserRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'user',
  data () {
    return {
      query: '',
      usersList: [],
      pagenum: 1,
      pagesize: 6,
      total: -1,
      dialogFormVisibleAdd: false,
      formLabelWidth: '120px',
      user: {
        id: '',
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      },
      dialogFormVisibleEdit: false,
      dialogFormVisibleRol: false,
      currentRoleId: -1,
      currentUserName: '',
      currentUserId: '',
      allRoles: []
    }
  },
  // 设置属性规则，这边是进行必填项属性的增加
  created () {
    this.handleUsers()
  },
  methods: {
    // 分配角色功能实现
    async editUserRole () {
      const res = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: `${this.currentRoleId}`
      })
      const {meta:{msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
      this.dialogFormVisibleRol = false
    },
    // 分配用户角色弹出框
    async setUserRole (user) {
      this.dialogFormVisibleRol = true
      this.currentUserName = user.username
      this.currentUserId = user.id
      // 获取当前用户的数据
      const result = await this.$http.get(`users/${this.currentUserId}`)
      this.currentRoleId = result.data.data.rid

      // 获取全部的角色
      const res = await this.$http.get(`roles`)
      const {data, meta: {status}} = res.data
      if (status === 200) {
        this.allRoles = data
      }
    },
    // 修改用户的状态
    async chengeUserState (user) {
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 确认修改用户
    async sureEditUser (id) {
      const res = await this.$http.put(`users/${id}`, this.user)
      const {meta: {status, msg}} = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.user = {}
        this.dialogFormVisibleEdit = false
        this.handleUsers()
      } else {
        this.$message.warning(msg)
      }
    },
    // 编辑用户
    async editUser (user) {
      this.dialogFormVisibleEdit = true
      this.user = user
    },
    // 删除用户
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then( async () => {
        // 点击确认是触发的方法
        const res = await this.$http.delete(`users/${id}`)
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
    showAddUser () {
      this.dialogFormVisibleAdd = true
      this.user = {}
    },
    //增加用户
    addUser () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.$http.post('users', this.user)
            .then((res) => {
              const {
                data,
                meta: {msg, status}
              } = res.data
             if (status === 201) {
               this.$message.success(msg)
               this.handleUsers()
             } else {
               this.$message.warning(msg)
             }
             this.dialogFormVisibleAdd = false
            })
        }
      })
    },
    // 分页自带的方法
    handleSizeChange(val) {
      this.pagesize = val
      this.pagenum = 1
      this.handleUsers()
    },
    handleCurrentChange(val) {
      this.pagenum = val
      this.handleUsers()
    },
    async handleUsers () {
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      // eslint-disable-next-line no-template-curly-in-string,no-useless-escape
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      const {
        data: {total, pagenum, users},
        meta: {msg, status}
      } = res.data
      if (status === 200) {
        this.total = total
        this.pagenum = pagenum
        this.usersList = users
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    },
    // 查询用户
    queryUser () {
      this.handleUsers()
    }
  }
}
</script>

<style scoped>
  .box-card{
    height: 100%;
  }
  .search {
    width: 300px;
  }
  .searchRow {
    margin-top: 20px;
  }
</style>
