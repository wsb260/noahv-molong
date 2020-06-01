<template>
    <div class="test-action">
        <div style="height:64px;line-height:64px;display:flex;align-item:center;">
            <i-button type="primary" @click="modal1 = true" style="margin-right:30px;">创建表格</i-button>
            <Input search enter-button placeholder="根据表格标题搜索" @on-search="searchTable" style="width: 300px"/>
            <!-- <Input suffix="ios-search" placeholder="Enter text" style="width: auto"  on-search="searchTable"/> -->
        </div>
         <Modal
            v-model="modal1"
            title="表格标题"
            @on-ok="ok"
            @on-cancel="cancel">
            <Input v-model="value" placeholder="表格标题" style="width: 300px" />
        </Modal>
        <Table v-for="(tab,index) in tables" :key="index" :table='tab.children' :title="tab.title"></Table>
    </div>
</template>

<script>
import Table from './list';
export default {
    name: 'test-action',
    components: {
        Table
    },
    data() {
        return {
            modal1: false,
            tip: 'This is a blank page, you can write any code in here',
            value: '',
            tables: [],
            oldTables: []
        };
    },
    computed: {

    },
    methods: {
        searchTable(t) {
            if (!t) {
                this.tables = this.oldTables;
                return false;
            }
            this.tables = this.oldTables.filter(item => (item.title ? item.title.includes(t) : false));
        },
        createTable(title) {
            this.getTable(title);
        },
        getTable(title) {
            this.$request({
                url: '/api/demo/table/get',
                method: 'get',
                data: {
                    dev: true
                },
                showLoading: true
            }).then(datas => {
                let { data } = datas.data;
                let obj = {
                    children: data,
                    title: title
                };
                this.tables.push(obj);
                this.oldTables.push(obj);
            });
        },
        ok() {
            if (this.value) {
                this.createTable(this.value);
                this.value = '';
                this.$Message.info('表格创建成功');
            }
            else {
                this.$Message.info('表格创建失败');
                return false;
            }
        },
        cancel() {
            this.$Message.info('表格创建失败');
        }
    },
    created() {
    },
    mounted() {
        this.getTable();
    }
};
</script>

<style lang="less" >
    .test-action {

    }
</style>
