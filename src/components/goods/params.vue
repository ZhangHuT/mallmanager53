<template>
    <el-card>
      <!--面包屑-->
      <myread level1="商品管理" level2="分类参数"></myread>

      <!--提示栏-->
      <el-row class="alert">
        <el-col>
          <el-alert
            title="只允许为第三级设置参数"
            type="error"
          >
          </el-alert>
        </el-col>
      </el-row>
      <!--搜索框-->
      <el-form class="paramsForm">
        <el-form-item label="商品分类">
          <el-cascader
            v-model="selectValue"
            :options="allSelectValue"
            :props="defaultParms"
            @change="handleChange"
            size="200"
            :show-all-levels="false"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
              <el-row>
                <el-col>
                  <el-form>
                    <el-form-item>
                      <el-button type="danger" :disabled="this.selectValue.length ===0 ? true : false">设置动态参数</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-table
                    :data="paramsData"
                    style="width: 100%">
                    <el-table-column
                      type="expand"
                      label="#"
                      width="180">
                      <template slot-scope="scope">
                        <el-row>
                          <el-col>
                            <el-tag
                              v-for="(tag, index) in scope.row.attr_vals"
                              closable
                              :key="index"
                              :disable-transitions="false"
                              @close="handleClose(scope.row.attr_vals, scope.row.attr_name, scope.row.attr_id, tag)" style="margin-left: 10px">
                              {{tag}}
                            </el-tag>
                            <el-input
                              class="input-new-tag"
                              v-if="inputVisible"
                              v-model="inputValue"
                              ref="saveTagInput"
                              size="small"
                              @keyup.enter.native="handleInputConfirm(scope.row.attr_vals,scope.row.attr_name, scope.row.attr_id)"
                              @blur="handleInputConfirm(scope.row.attr_vals, scope.row.attr_name, scope.row.attr_id)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="attr_name"
                      label="属性名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      label="操作">
                      <template slot-scope="scope">
                        <el-button @click="editGoods(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteGoods(scope.row.goods_id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                      </template>
                      </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
              <el-row>
                <el-col>
                  <el-form>
                    <el-form-item>
                      <el-button type="danger" :disabled="this.arrStaticParams.length ===0 ? true : false">设置动态参数</el-button>
                    </el-form-item>
                  </el-form>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-table
                    :data="arrStaticParams"
                    style="width: 100%">
                    <el-table-column
                      type="index"
                      label="#"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="attr_name"
                      label="属性名称"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="attr_vals"
                      label="属性值"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      label="操作">
                      <template slot-scope="scope">
                        <el-button @click="editGoods(scope.row)" size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button @click="deleteGoods(scope.row.goods_id)" size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script>
  export default {
    name: 'params',
    data () {
      return {
        selectValue: [],
        allSelectValue: [],
        defaultParms: {
          label: 'cat_name',
          value: 'cat_id',
          expandTrigger: 'hover'
        },
        activeName: '1',
        paramsData: [],
        inputVisible: false,
        inputValue: '',
        arrStaticParams: []
      }
    },
    created (){
      this.getGoodsParams()
    },
    methods: {
      async handleInputConfirm(attr_vals ,attr_name, attr_id) {
        let inputValue = this.inputValue
        if (inputValue) {
          attr_vals.push(inputValue)
        }
        await this.$http.put(`categories/${this.selectValue[2]}/attributes/${attr_id}`, {
          attr_name: attr_name,
          attr_sel: 'many',
          attr_vals: attr_vals.join(',')
        })
        this.inputVisible = false
        this.inputValue = ''
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async handleClose (attr_vals, attr_name, attr_id, tag) {
        attr_vals.splice(attr_vals.indexOf(tag), 1)
        // 进行动态参数的删除
        await this.$http.put(`categories/${this.selectValue[2]}/attributes/${attr_id}`, {
          attr_name: attr_name,
          attr_sel: 'many',
          attr_vals: attr_vals.join(',')
        })
      },
      // 获取商品的参数
      async getGoodsParams () {
        const res = await this.$http.get(`categories?type=3`)
        this.allSelectValue = res.data.data
      },
      async handleChange (val) {
        if (this.activeName === '1') {
          // 动态参数
          const  res = await this.$http.get(`categories/${val[2]}/attributes?sel=many`)
          this.paramsData = res.data.data
          this.paramsData.forEach( item => {
            item.attr_vals = item.attr_vals.split(',')
          })
        } else if (this.activeName === '2') {
          // 动态参数
          const  res = await this.$http.get(`categories/${val[2]}/attributes?sel=only`)
          this.arrStaticParams = res.data.data
          this.arrStaticParams.forEach( item => {
            item.attr_vals = item.attr_vals.join(',')
          })
          console.log(this.arrStaticParams)
        }
      },
      handleClick (tab, event){
        // 获取静态参数的数据
        this.handleChange(this.selectValue)
      }
    }
  }
</script>

<style scoped>
  .alert ,.paramsForm{
    margin-top: 20px;
  }
</style>
