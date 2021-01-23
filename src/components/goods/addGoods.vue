<template>
  <el-card class="box-card">
    <!--面包屑-->
    <myread level1="商品管理" level2="商品列表"></myread>
    <!--提示栏-->
    <el-row class="alert">
      <el-col>
        <el-alert
          title="添加商品信息"
          type="success"
          center
          show-icon>
        </el-alert>
      </el-col>
    </el-row>
    <!--步骤条-->
    <el-row class="steps">
      <el-col>
        <el-steps :active="active" finish-status="success">
          <el-step title="步骤 1" name="1"></el-step>
          <el-step title="步骤 2" name="2"></el-step>
          <el-step title="步骤 3" name="3"></el-step>
          <el-step title="步骤 4" name="4"></el-step>
          <el-step title="步骤 5" name="5"></el-step>
        </el-steps>
        <el-tabs v-model="active" tab-position="left" @tab-click="tabClick()" style="height: 500px;">
          <el-tab-pane label="基本信息" name="1">
            <el-form label-width="80px" :model="goods" label-position="top" style="overflow: auto; height: 500px">
              <el-form-item label="商品名称">
                <el-input v-model="goods.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格">
                <el-input v-model="goods.goods_price"></el-input>
              </el-form-item>
              <el-form-item label="商品重量">
                <el-input v-model="goods.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量">
                <el-input v-model="goods.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类">
                <el-cascader
                  v-model="selectValue"
                  :options="allSelectValue"
                  :props="defaultParms"
                  @change="handleChange"
                size="200"></el-cascader>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form label-width="80px" label-position="top">
              <el-form-item  v-for="(item, index) in arrDyParams" :label="item.attr_name" :key="index">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox v-model="checkList" :label="attr" border size="medium" v-for="(attr, index) in item.attr_vals" :key="index"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form label-width="80px" label-position="top">
              <el-form-item label="商品分类">
                <el-form-item :label="item.attr_name" v-for="(item, index) in arrStaticParams" :key="index">
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload
              class="upload-demo"
              :headers="headers"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <el-form>
            <el-form-item>
                <el-button @click="addGoods()" type="success">添加商品</el-button>
            </el-form-item>
            <el-form-item>
              <quill-editor
                ref="myQuillEditor"
                :content="content"
                :options="editorOption"
              />
            </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import { quillEditor } from 'vue-quill-editor'
  export default {
    name: 'addGoods',
    components: {
      quillEditor
    },
    data () {
      return {
        active: '1',
        goods: {
          goods_name: '',
          goods_cat: '',
          goods_price: '',
          goods_number: '',
          goods_weight: '',
          goods_introduce: '',
          pics: [],
          attrs: []
        },
        // 级联选择器数据
        selectValue: [],
        allSelectValue: [],
        defaultParms: {
          label: 'cat_name',
          value: 'cat_id',
          expandTrigger: 'hover'
        },
        arrDyParams: [],
        headers: {
          Authorization: localStorage.getItem('token')
        },
        arrStaticParams: [],
        fileList: [],
        content: '',
        editorOption: {}
      }
    },
    mounted () {
      this.handleClick()
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    methods: {
      // 添加商品
      async addGoods () {
        //console.log(this.$refs.myQuillEditor.quill.getContents().ops[0].insert)
        this.goods.goods_cat = this.selectValue.join(',')
        this.goods.goods_introduce = this.$refs.myQuillEditor.quill.getContents().ops[0].insert
        this.goods.goods_pics = this.fileList.map(item => {
          return {pic: item.pic}
        })
        let attrs = [...this.arrStaticParams, ...this.arrDyParams]
        this.goods.attrs = attrs
        const res = await this.$http.post('goods', this.goods)
        console.log(res)
        this.$router.push({name: 'goods'})
      },
      handleSuccess (file) {
        this.fileList.push({pic: file.data.tmp_path, url: file.data.url})
      },
      handleRemove(file, fileList) {
        let index = this.fileList.findIndex( item => {
         return item.pic === file.pic
        })
        this.fileList.splice(index, 1)
      },
      handlePreview(file) {
        console.log(file);
      },
      async tabClick () {
        // 进行商品参数操作的时候需要将级联选择器进行赋值
        if (this.active === '2') {
          if (this.selectValue.length !== 3) {
            this.$message.error('请选中商品三级分类')
            return
          }
          const res = await this.$http.get(`categories/${this.selectValue[2]}/attributes?sel=many`)
          this.arrDyParams = res.data.data
          // 判断商品参数是否为空
          this.arrDyParams.forEach( item => {
            item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.trim().split(',')
          })

        }
        if (this.active === '3') {
          if (this.selectValue.length !== 3) {
            this.$message.error('请选中商品三级分类')
            return
          }

          const res = await this.$http.get(`categories/${this.selectValue[2]}/attributes?sel=only`)
          this.arrStaticParams = res.data.data
        }
      },
      // 级联选择器方法
      handleChange(value) {
        this.selectValue = value
      },
       async handleClick() {
         const  res = await this.$http.get(`categories?type=3`)
         this.allSelectValue = res.data.data
      }
    }
  }
</script>

<style scoped>
  .alert{
    margin-top: 20px;
  }
  .steps {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  ql-editor{
    min-height: 400px;
    height: 260px;
  }
</style>
