<template>
    <div class="test-chart1 layout" >
          <!-- <div id="simpleList" class="list-group">
            <div class="list-group-item">This is <a href="http://rubaxa.github.io/Sortable/">Sortable</a></div>
            <div class="list-group-item">It works with Bootstrap...</div>
            <div class="list-group-item">...out of the box.</div>
            <div class="list-group-item">It has support for touch devices.</div>
            <div class="list-group-item">Just drag some elements around.</div>
        </div> -->
        <Layout id="layout" style="display:flex;flex-direction:row;">
            <div class='nvh-silder'>
                <Button type="primary" @click="showList">切换列表</Button>
                <ul class='list' id="list" v-if="listFlag">
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
            </div>
            <div class='nvh-layout' id="content">
                <div class='nvh-header'>Header</div>
                <div class='nvh-content'>
                    <NvTrend
                        method="get"
                        :options="trendConf.options"
                        :title="trendConf.title"
                        :trendData="chartData"
                        :params="trendConf.params"
                        :show-loading="trendConf.showLoading"
                    />
                </div>
                <div class='nvh-footer'>Footer</div>
            </div>
        </Layout>
    </div>
</template>

<script>
// import draggable from 'vuedraggable';
import Sortable from 'sortablejs';
import m from 'moment';
import u from 'underscore';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DEFAULT_TIME = {
    startTime: m().subtract(2, 'hour'),
    endTime: m()
};

export default {
    name: 'test-chart1.vue',
    data() {
        return {
            listFlag: false,
            time: {
                dateFormat: DATE_FORMAT,
                value: [
                    DEFAULT_TIME.startTime.toDate(),
                    DEFAULT_TIME.endTime.toDate()
                ],
                dateOptions: {
                    position: 'outer',
                    shortcuts: [
                        {
                            text: '30分钟',
                            value() {
                                return [
                                    m().subtract(30, 'minute').toDate(),
                                    m().toDate()
                                ];
                            }
                        },
                        {
                            text: '1小时',
                            value() {
                                return [
                                    m().subtract(1, 'hour').toDate(),
                                    m().toDate()
                                ];
                            }
                        },
                        {
                            text: '2小时',
                            defaultSelected: true,
                            value() {
                                return [
                                    m().subtract(2, 'hour').toDate(),
                                    m().toDate()
                                ];
                            }
                        },
                        {
                            text: '1天',
                            value() {
                                return [
                                    m().subtract(1, 'day').toDate(),
                                    m().toDate()
                                ];
                            }
                        },
                        {
                            text: '7天',
                            value() {
                                return [
                                    m().subtract(7, 'day').toDate(),
                                    m().toDate()
                                ];
                            }
                        }
                    ]
                }
            },
            trendConf: {
                // title 可选
                title: '趋势图',
                // api 必选
                url: '/api/demo/chart/trend/get',
                params: {
                    startTime: DEFAULT_TIME.startTime.format(DATE_FORMAT),
                    endTime: DEFAULT_TIME.endTime.format(DATE_FORMAT)
                },
                // showLoading 可选
                showLoading: '数据加载中...',
                // options 可选
                options: {
                    loading: {
                        labelStyle: {
                            // color: 'red',
                            // fontSize: '12px'
                        }
                    },
                    yAxis: {
                        // 阈值线配置，如不需要，请注释掉
                        plotLines: [
                            {
                                color: 'red',
                                dashStyle: 'solid',
                                label: {
                                    text: '阈值',
                                    style: {
                                        color: 'red',
                                        fontWeight: 'bold'
                                    },
                                    x: 10
                                },
                                value: 150000,
                                width: 2
                            }
                        ]
                    }
                }
            }
        };
    },
    computed: {
        title() {
            return this.$store.state.chart.title;
        },
        chartData() {
            return this.$store.state.chart.data;
        }
    },
    methods: {
        timeChange(time) {
            if (Array.isArray(time) && time.length === 2) {
                if (time[0] && time[1]) {
                    let params = Object.assign({}, this.trendConf.params, {
                        startTime: m(time[0]).format(DATE_FORMAT),
                        endTime: m(time[1]).format(DATE_FORMAT)
                    });
                    if (!u.isEqual(this.trendConf.params, params)) {
                        this.trendConf.params = params;
                    }
                }
            }

        },
        showList() {
            this.listFlag = !this.listFlag;
            this.$nextTick(() => {
                let list = document.getElementById('list');
                Sortable.create(list, {animation: 300});
            });
        }
    },
    mounted() {
        let el = document.getElementById('layout');
        Sortable.create(el, {animation: 150});
        let content = document.getElementById('content');
        Sortable.create(content, {animation: 150});
        let list = document.getElementById('list');
        Sortable.create(list, {animation: 300});
    }
};
</script>

<style lang="less" scoped>
    .test-chart1 {
        .time-filter-area {
            border: none;
            padding: 0;
            margin-bottom: 20px;
        }
        .ivu-layout-sider{
            background:#3a9fe8
        }
        .ivu-layout-header{
            background: #7cbce9
        }
        .ivu-layout-footer{
            background: #7cbce9
        }
        .nvh-silder{
            display: flex;
            flex:1;
            overflow:hidden;
            background:#3a9fe8;
            align-items: center;
            .list{
                overflow: hidden;
                width:100%;
                li{
                    padding:20px;
                    border:1px solid rgba(0,0,0,.125);
                    background: #d9e97c;
                    cursor: grabbing;
                }
            }
        }
        .nvh-layout{
            display:flex;flex:4;overflow:hidden;flex-direction:column;
        }
        .nvh-header{
            height:100px;
            overflow:hidden;
            background: #7ce98b
        }
        .nvh-content{
            flex:1;overflow:hidden;
        }
        .nvh-footer{
            height:100px;
            overflow:hidden;
            background: #7cbce9
        }
    }
</style>
