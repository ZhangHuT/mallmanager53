<template>
    <el-card class="box-card">
      <!--面包屑-->
      <myread level1="权限管理" level2="角色列表"></myread>
      <el-row class="addrolebtn">
        <el-col><el-button type="info" @click="showAddRoleDia()">添加角色</el-button></el-col>
      </el-row>
      <!--表格-->
      <el-table
        :data="roleList"
        style="width: 100%" height="400px">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i) in scope.row.children" :key="i">
              <!--一级权限标签-->
              <el-col :span="4">
                <el-tag type="success"
                        @close="remAuth(scope.row, item1.id)"
                        closable>{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!--不存在权限是，告诉用户-->
              <!--二级权限标签-->
              <el-col :span="20">
                <el-row v-for="(item2, i) in item1.children" :key="i">
                  <el-col :span="4">
                    <el-tag
                      type="warning"
                      closable
                      @close="remAuth(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <!--三级权限标签-->
                    <el-tag type="danger"
                            closable
                            v-for="(item3, i) in item2.children"
                            :key="i"
                            @close="remAuth(scope.row, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <span v-if="scope.row.children.length === 0">未分配权限</span>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="#"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述">
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditRoleDia(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click="deleteRole(scope.row.id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button @click="showRoleRightDia(scope.row)" size="mini" plain type="success" icon="el-icon-check" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--添加角色-->
      <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="addrole" :rules="rules" ref="addrole">
          <el-form-item prop="roleName" label="角色名称" label-width="120px">
            <el-input v-model="addrole.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="roleDesc" label="角色描述" label-width="120px">
            <el-input v-model="addrole.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
          <el-button type="primary" @click="addRole()">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改角色-->
      <el-dialog title="修改角色" :visible.sync="dialogFormVisibleEdit">
        <el-form :model="addrole">
          <el-form-item prop="roleName" label="角色名称" label-width="120px">
            <el-input v-model="addrole.roleName" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item prop="roleDesc" label="角色描述" label-width="120px">
            <el-input v-model="addrole.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editRole()">确 定</el-button>
        </div>
      </el-dialog>
      <!--修改权限-->
      <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
        <el-tree
          :data="treeData"
          ref="tree"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="currentRole"
          :props="treeNode">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
          <el-button type="primary" @click="setRoleright()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
</template>

<script>
  export default {
    name: 'role',
    data () {
      return {
        roleList: [],
        dialogFormVisibleRight: false,
        treeData: [],
        treeNode: {
          children: 'children',
          label: 'authName'
        },
        currentRole: [],
        role: {},
        dialogFormVisibleAdd: false,
        addrole: {
          id: '',
          roleName: '',
          roleDesc: ''
        },
        rules: {
          roleName: [
            {
              required: true,
              message: '请输入角色名',
              trigger: 'blur'
            }
          ],
          roleDesc: [
            {
              required: true,
              message: '请输入角色描述',
              trigger: 'blur'
            }
          ]
        },
        dialogFormVisibleEdit: false
      }
    },
    created () {
      this.getRoleList()
    },
    methods: {
      // 修改用户
      async editRole () {
       await this.$http.put(`roles/${this.addrole.id}`, this.addrole)
        this.dialogFormVisibleEdit = false
        this.getRoleList()
      },
      // 展示修改用户表单
      showEditRoleDia (role) {
        this.dialogFormVisibleEdit = true
        this.addrole = role
      },
      // 删除角色
      deleteRole (id) {
        // 删除提示
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
          const res = await this.$http.delete(`roles/${id}`)
          const {meta: {msg, status}} = res.data
          if (status === 200) {
            this.$message.success(msg)
          } else {
            this.$message.warning(msg)
          }
          this.getRoleList()
        }).catch(() => {
          // 点击取消时触发的方法
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 添加角色
      addRole () {
        this.role = {}
        this.$refs['addrole'].validate ( async  (validate) => {
          if (validate) {
            const res = await this.$http.post('roles', this.addrole)
            const {meta:{ status, msg}} = res.data
            if (status === 201) {
              this.$message.success(msg)
            } else {
              this.$message.warning(msg)
            }
            this.dialogFormVisibleAdd = false
            this.addrole = {}
            this.getRoleList()
          }
        } )
      },
      // 展示添加角色表单
      showAddRoleDia () {
        this.dialogFormVisibleAdd = true
      },
      // 修改用户权限
      async setRoleright () {
        // Vue的js 获取dom对象对其进行操作
        // 1、在对应的dom中设置ref='属性名'
        // 2、在js代码中通过this.$refs.属性名使用该对象，调用它的方法

        // 获取全部选中节点的数据
        let arr1 = this.$refs.tree.getCheckedKeys()
        // 获取半选中节点的数据,不设置半选中节点时，半选中不会生效
        let arr2 = this.$refs.tree.getHalfCheckedKeys()
        let treeNodes = [...arr1, ...arr2]

        await this.$http.post(`roles/${this.role.id}/rights` ,{
          rids: treeNodes.join(',')
        })
        this.dialogFormVisibleRight = false
        this.getRoleList()
      },
      // 展示用户的权限
      async showRoleRightDia (role) {
        this.currentRole = []
        this.role = role;
         console.log(role)

        this.dialogFormVisibleRight = true
        const res = await this.$http.get(`rights/tree`)
        // 进行treeData数据的渲染
        this.treeData = res.data.data

        // 将当前角色的权限进行渲染,  父节点选中后字节点会自动全部选中
        role.children.forEach( (item1) => {
         //this.currentRole.push(item1.id)
          item1.children.forEach( (item2) => {
            //this.currentRole.push(item2.id)
            item2.children.forEach( (item3) => {
              this.currentRole.push(item3.id)
            } )
          } )
        } )
      },
      // 移除角色的权限
      async remAuth (role, rightId) {
        // 进行角色权限的删除
        const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        const {data} = res.data
        // 返回的数据为删除后的权限的数据
        role.children = data
      },
      async getRoleList () {
        const  res = await this.$http.get(`roles`)
        this.roleList = res.data.data
      }
    }
  }
</script>

<style scoped>
.addrolebtn {
  margin-top: 20px;
}
</style>
