/**
 * NoahV
 * Copyright (c) 2019 Baidu, Inc. All Rights Reserved.
 *
 * @file main entry for project
 * @author darren(darrenywyu@gmail.com)
 *         Joannamo(joannamo123@163.com)
 */

import 'babel-polyfill';
import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview';
import noahvRequest from 'noahv-request';
import noahvComponent from 'noahv-component';
import noahv from 'noahv-core';
import routerConfig from './common/router';
import headerConfig from './common/header';
import footerApp from './common/layout/footer';
import store from './store/';
import './common/hook/ajax';
import './common/assets/css/main.less';
import BuriedPoint from './common/buriedPoint/point';

import Echarts from 'echarts';

Vue.use(Echarts);
Vue.prototype.echarts = Echarts;

// If wanted diy layout, please import this file
// import layoutApp from './common/layout/layout';
// const routerPush = VueRouter.prototype.push;
// VueRouter.prototype.push = function push(location) {
//     return routerPush.call(this, location)['catch'](error => error);
// };
// keep this
Vue.use(VueRouter);


// import iview & noahvComponent
Vue.use(iView);

// must use noahvRequest
Vue.use(noahvRequest);

Vue.use(noahvComponent);

// use default layout with header config
noahv.layout(headerConfig, footerApp);

// If wanted diy layout, please use this line
// noahv.useLayout(layoutApp);

// keep this
noahv.router(routerConfig);

// if you want use baidu tongji, add this line
// for detail info, you can visit this page: http://tongji.baidu.com/web/help/article?id=174&type=0
// noahv.useBaiduTrack('baidutongjiaccountId')

// init project
noahv.start('#app', store);

Vue.use(BuriedPoint);

noahv._router.afterEach((to, from) => {
    if (to.path) {
    // 记录页面改变
        noahv.vueInstance.$pageChange(to.path);
    }
});

