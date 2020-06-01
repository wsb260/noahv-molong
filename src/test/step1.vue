<template>
    <div class="test-step1">
        <label>请选择要浏览的类型:</label>
        <nv-list :action="products.action" :type="products.type" :templates="products.templates" :data="products.data"></nv-list>
    </div>
</template>

<script>
export default {
    name: 'test-step1',
    data() {
        return {
            products: {
                type: 'flat',
                templates: {
                    name: '${name}',
                    link: '?em/#/test/action/${name}'
                },
                action: {
                    url: '',
                    method: 'get',
                    params: {}
                },
                data: [
                    {
                        'id': 1,
                        'uid': 'b598b424-1d7b-328e-a8fd-af9acb457f54',
                        'name': 'table'
                    },
                    {
                        'id': 2,
                        'uid': 'f7dd5720-4dca-3e92-a24d-8ba37e096293',
                        'name': 'chart'
                    }
                ]
            }
        };
    },
    computed: {
    },
    methods: {

    }
};
</script>

<style lang="less" >
    .test-step1 {

    }
</style>
