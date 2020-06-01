/**
 * @file router config
 */
export default [
    /* eslint-disable no-undef */
    // Keep this line if you want auto add router by noahv create
    {
        component: r => require.ensure([], () => r(require('src/test/performance')), 'test/performance'),
        path: '/test/performance'
    },
    {
        component: r => require.ensure(
            [],
            () => r(require('src/test/chart1.vue')),
            'test/chart1.vue'
        ),
        path: '/test/chart1.vue'
    },
    {
        component: r => require.ensure([], () => r(require('src/test/action')), 'test/action'),
        entry: true,
        path: '/test/action',
        redirect: '/test/action/step1',
        children: [
            {
                path: 'table',
                component: r => require.ensure([], () => r(require('src/test/table')), 'test/table')
            },
            {
                path: 'step1',
                component: r => require.ensure([], () => r(require('src/test/step1')), 'test/step1')
            },
            {
                path: 'chart',
                component: r => require.ensure([], () => r(require('src/test/chart')), 'test/chart'),
                children: [
                    {
                        path: 'chart1',
                        component: r => require.ensure(
                            [],
                            () => r(require('src/test/chart1')),
                            'test/chart1'
                        )
                    },
                    {
                        path: 'chart2',
                        component: r => require.ensure(
                            [],
                            () => r(require('src/test/chart2')),
                            'test/chart2'
                        )
                    },
                    {
                        path: 'chart3',
                        component: r => require.ensure(
                            [],
                            () => r(require('src/test/chart3')),
                            'test/chart3'
                        )
                    }
                ]
            }
        ]
    },
    {
        component: r => require.ensure([], () => r(require('src/test/form')), 'test/form'),
        path: '/test/form'
    },
    {
        component: r => require.ensure(
            [],
            () => r(require('src/test/filterList')),
            'test/filterList'
        ),
        path: '/test/filterList'
    },

    {
        component: r => require.ensure([], () => r(require('src/test/chart')), 'test/chart'),
        path: '/test/chart'
    },
    {
        component: r => require.ensure([], () => r(require('src/test/list')), 'test/list'),
        path: '/test/list'
    },
    {
        component: r => require.ensure([], () => r(require('src/test/table')), 'test/list'),
        path: '/test/table'
    },
    {
        component: r => require.ensure(
            [],
            () => r(require('src/demo/chart/trend')),
            'demo/chart/trend'
        ),
        path: '/demo/chart/trend'
    },
    {
    // file path，string or object
        component: r => require.ensure(
            [],
            () => r(require('src/demo/table/tableDemo')),
            'tableDemo'
        ),
        // hash name,unique
        path: '/tableDemo'
    },
    {
        component: r => require.ensure(
            [],
            () => r(require('src/demo/table/filterTableDemo')),
            'filterTableDemo'
        ),
        path: '/filterTableDemo'
    },
    {
        component: r => require.ensure(
            [],
            () => r(require('src/demo/chart/chartDemo')),
            'chartDemo'
        ),
        path: '/chartDemo'
    },
    {
        component: r => require.ensure(
            [],
            () => r(require('src/demo/chart/chartDemo')),
            'chartDemo'
        ),
        path: '/chartDemo'
    },
    // please keep this object last one
    {
        component: r => require.ensure([], () => r(require('src/common/layout/404')), '404'),
        path: '*'
    }
    /* eslint-enable */
];
