<template>
    <div class="test-performance">
        <div id="echarts" :style="{width: '300px', height: '300px'}"></div>

        <h4>用户轨迹</h4>
        <table class="table table-bordered" align="center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>时间点</th>
                    <th>页面</th>
                    <th>动作</th>
                    <th>元素id/class</th>
                    <th>值</th>
                </tr>
            </thead>
            <tbody class="js-userFoot">
                <tr v-for="(item,index) in eventDatas" :key="index" align="center">
                    <td width="200px">{{item._id}}</td>
                    <td>{{item.sTime}}</td>
                    <td>{{item.path}}</td>
                    <td>{{item.type | typeFilter}}</td>
                    <td>{{item.className}}</td>
                    <td>{{item.val}}</td>
                </tr>
            </tbody>
        </table>

        <h4>页面加载</h4>
        <table class="table table-bordered" align="center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>DNS解析时间</th>
                    <th>首包请求时间</th>
                    <th>DOM解析时间</th>
                    <th>脚本加载完成时间</th>
                    <th>TCP链接时间</th>
                    <th>白屏时间</th>
                    <th>onload执行时间</th>
                    <th>卸载页面时间</th>
                    <th>重定向时间</th>
                    <th>总时长</th>
                </tr>
            </thead>
            <tbody class="js-userFoot">
                <tr v-for="(item,index) in performanceDatas" :key="index" align="center">
                    <td width="200px">{{item.UID}}</td>
                    <td>{{item.DNS}}</td>
                    <td>{{item.FIRST_RES}}</td>
                    <td>{{item.PARSE_DOM}}</td>
                    <td>{{item.SCRIPT_END}}</td>
                    <td>{{item.TCP}}</td>
                    <td>{{item.WT}}</td>
                    <td>{{item.LOAD}}</td>
                    <td>{{item.PREV_PAGE}}</td>
                    <td>{{item.REDIRECT}}</td>
                    <td>{{item.TOTAL}}</td>
                </tr>
            </tbody>
        </table>

        <h4>静态资源性能监控</h4>
        <table class="table table-bordered" align="center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>文件名称</th>
                    <th>文件类型</th>
                    <th>加载时间</th>
                </tr>
            </thead>
            <tbody class="js-userFoot">
                <tr v-for="(item,index) in sourceData" :key="index" align="center">
                    <td width="200px">{{item.UID}}</td>
                    <td>{{item.NAME}}</td>
                    <td>{{item.TYPE}}</td>
                    <td>{{item.DURATION}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: 'test-performance',
    data() {
        return {
            eventDatas: [],
            performanceDatas: [],
            sourceData: []
        };
    },
    computed: {
    },
    methods: {
        getEventData() {
            this.$getEventData({
                url: 'http://localhost:4000/getClickData'
            }).then(res => {
                this.eventDatas = res.data;
                let newArr = this.unique(res.data);
                this.initPerChart(newArr);
            });
        },
        getPageLoadData() {
            this.$getPerformance({
                url: 'http://localhost:4000/getPerformanceData'
            }).then(res => {
                this.performanceDatas = res.data;
            });
        },
        getPageSourceData() {
            this.$getSource({
                url: 'http://localhost:4000/getSourceData'
            }).then(res => {
                this.sourceData = res.data;
            });
        },
        // 去重
        unique(arr) {
            let obj = {};
            arr.forEach(item => {
                if (!obj[item.path]) {
                    obj[item.path] = 0;
                }
            });
            for (let p in obj) {
                arr.forEach(c => {
                    if (p === c.path) {
                        obj[p]++;
                    }
                });
            }
            let ary = [];
            for (let o in obj) {
                ary.push({
                    value: obj[o],
                    name: o
                });
            }
            console.log(ary);

            return ary;
            // return Array.from(new Set(arr));
        },
        initPerChart(_data) {
            let dom = document.getElementById('echarts');
            let myChart = this.echarts.init(dom);
            // 绘制图表
            myChart.setOption({
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        data: _data
                    }
                ]
            });
        }
    },
    filters: {
        typeFilter(value) {
            if (value === 'click') {
                return '点击';
            }
            else if (value === 'pageChange') {
                return '页面访问';
            }
        }
    },
    mounted() {
        this.getEventData();
        this.getPageLoadData();
        this.getPageSourceData();
    }
};
</script>

<style lang="less" >
    .test-performance {
        .table{
            width: 100%;
            max-width: 100%;
            margin-bottom: 20px;
            table-layout: fixed;
            tbody{
               display: inline-block;
               width: 100%;
               overflow: auto;
               max-height: 400px;
            }
            tr{
                display: flex;
                width: 100%;
                border-bottom: 1px solid #ddd;
                height: 36px;
                line-height: 36px;
            }
             td, th {
                display: inline-block;
                flex:1;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
        }
        .table-bordered{
            border: 1px solid #ddd;
        }
    }
</style>
