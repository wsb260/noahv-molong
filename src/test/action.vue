<template>
    <div class="test-action">
        <nv-list :action="currentStatus.action" :type="currentStatus.type" :templates="currentStatus.templates" :data="currentStatus.data"></nv-list>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'test-action',
    data() {
        return {
            currentStatus: {
                type: 'process',
                templates: {
                    name: '${status}',
                    time: '${time}',
                    detail: '${detail}'
                },
                action: {
                    url: '',
                    method: 'get',
                    params: {}
                },
                data: [
                    {
                        'status': '任务开始',
                        'time': '2018-04-10 14:00:00',
                        'detail': '任务启动'
                    },
                    {
                        'status': '监听异常',
                        'time': '2018-04-10 14:00:10',
                        'detail': '所有指标正常'
                    },
                    {
                        'status': '监听异常',
                        'time': '2018-04-10 14:00:10',
                        'detail': '所有指标正常'
                    },
                    {
                        'status': '监听异常',
                        'time': '2018-04-10 14:00:10',
                        'detail': '所有指标正常'
                    },
                    {
                        'status': '监听异常',
                        'time': '2018-04-10 14:00:10',
                        'detail': '所有指标正常'
                    },
                    {
                        'status': '监听异常',
                        'time': '2018-04-10 14:00:10',
                        'detail': '所有指标正常'
                    }
                ]
            }
        };
    },
    computed: {

    },
    methods: {

    },
    mounted() {
        // this.$router.push({path: '/test/action/step1'});
    }
};
</script>

<style lang="less" >
    .test-action {

    }
</style>
