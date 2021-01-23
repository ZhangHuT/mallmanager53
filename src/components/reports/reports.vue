<template>
    <el-card class="box-card">
      <!--面包屑-->
      <myread level1="数据统计" level2="数据报表"></myread>

      <el-row>
        <el-row>
          <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
          <div id="main" style="width: 600px;height:400px;"></div>
        </el-row>
      </el-row>
    </el-card>
</template>

<script>
  var eCharts = require('echarts')
  export default {
    name: 'reports',
    async mounted () {
      // 基于准备好的dom，初始化echarts实例
      var myChart = eCharts.init(document.getElementById('main'));
      const res = await this.$http.get('reports/type/1')
      let option2 = res.data.data
      console.log(option2)
      let option1 = {
        title: {
          text: '堆叠区域图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      }
      let option = {...option1, ...option2}
      // 绘制图表
      myChart.setOption(option);
    }
  }
</script>

<style scoped>

</style>
