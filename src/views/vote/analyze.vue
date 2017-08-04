<template>
    <section class="chart-container" >
         <el-row type="flex" justify="center">
             <!-- <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col> 
             <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col> 
              <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>     -->
            <el-col :span="12" >
                <div id="chartPie" style="width:100%; height:700px;"></div>
            </el-col>
            <!-- <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>   -->
        </el-row> 
    </section>
</template>

<script>
    import echarts from 'echarts'
    import {voteExample} from '../../mock/data/vote'
    export default {
        data() {
            return {
                chartPie: null
            }
        },

        methods: {
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: voteExample.name,
                        subtext: voteExample.vote.title,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: voteExample.vote.item
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: voteExample.vote.voteNum[1], name: voteExample.vote.item[1] },
                                { value: voteExample.vote.voteNum[2], name: voteExample.vote.item[2] },
                                { value: voteExample.vote.voteNum[3], name: voteExample.vote.item[3] },
                                { value: voteExample.vote.voteNum[4], name: voteExample.vote.item[4] },
                                { value: voteExample.vote.voteNum[0], name: voteExample.vote.item[0] }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawCharts() {
                // this.drawColumnChart()
                // this.drawBarChart()
                // this.drawLineChart()
                this.drawPieChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
