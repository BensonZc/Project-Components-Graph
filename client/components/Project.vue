<template>
  <div ref='project' class="project">

  </div>
</template>

<script>
  import echarts from 'echarts'
  import { project } from './../js/constants.js';
  export default {
    data(){
      return{

      }
    },
    mounted(){
      let myChart,option;
      myChart = echarts.init(this.$refs.project);
      option = {
        legend: {
          data: ['Project-Components-Graph']//此处的数据必须和关系网类别中name相对应
        },
        series: [{
          type: 'graph',
          hoverAnimation: true,
          layout: 'force',
          label: {
            normal: {
              show: true,
              position: 'top',
              formatter: (data) => data.data.r_name,
            },
            emphasis: {
              show: true,
              position: 'top',
              formatter: (data) => data.data.name,
            }
          },
          data: project.nodes,
          categories: [{"name": "Project-Components-Graph"}],
          roam: true,
          force: {
            edgeLength: 50, //连线的长度
            repulsion: 100,  //子节点之间的间距
            gravity: 0.1,
          },
          draggable:true,
          focusNodeAdjacency: true,
          symbolSize: 20,
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: 5,
          links: project.links,
        }]
      };
      console.log(option)
      myChart.setOption(option);
    },
    computed: {

    }
  }
</script>

<style>
  .project{
    width: 100%;
    height: 100%;
  }
</style>
