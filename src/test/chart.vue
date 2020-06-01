<template>
    <div class="test-chart">
        <div class="time-filter-area">
            <NvDatePicker
                :width="350"
                type="daterangetime"
                :dateFormat="time.dateFormat"
                v-model="time.value"
                :options="time.dateOptions"
                @on-change="timeChange"
            />
        </div>
        <Button type="primary"><router-link :to="{path:'/test/action/chart/chart1'}">布局-1</router-link></Button>
        <Button type="primary"><router-link :to="{path:'/test/action/chart/chart2'}">布局-2</router-link></Button>
        <Button type="primary"><router-link :to="{path:'/test/action/chart/chart3'}">布局-3</router-link></Button>
        <button value="前端埋点" class='isPoint'>前端埋点</button>
        <!-- <NvTrend
            method="get"
            :options="trendConf.options"
            :title="trendConf.title"
            :url="trendConf.url"
            :params="trendConf.params"
            :show-loading="trendConf.showLoading"
        /> -->
        <router-view></router-view>
    </div>
</template>

<script>
import m from 'moment';
import u from 'underscore';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DEFAULT_TIME = {
    startTime: m().subtract(2, 'hour'),
    endTime: m()
};
export default {
    name: 'test-chart',
    data() {
        return {
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

        }
    },
    mounted() {
        this.$request({
            url: '/api/demo/chart/trend/get',
            method: 'get',
            data: {
                dev: true
            },
            showLoading: true
        }).then(datas => {
            let { data: obj } = datas.data;
            this.$store.dispatch('setChartData', obj);
        });
    }
};
</script>

<style lang="less" >
    .test-chart {
        .time-filter-area {
            border: none;
            padding: 0;
            margin-bottom: 20px;
        }
    }
</style>
