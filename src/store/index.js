/**
 * @file store
 * @author Joannamo(joannamo123@163.com)
 *         darren(darrenywyu@gmail.com)
 */

import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import {
    LOGIN,
    UPDATE_BASE_FLAG,
    UPDATE_USER_FLAG,
    SET_CHART_DATA
} from './mutation-types';
import api from 'common/header';
const VUE_INSTANCE = new Vue();

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});
const state = {
    username: 'guest',
    baseDataReady: false,
    userNameReady: false,
    chart: {}
};

const mutations = {
    [LOGIN](state, username) {
        state.username = username;
    },
    [UPDATE_USER_FLAG](state, flag) {
        state.userNameReady = flag;
    },
    [UPDATE_BASE_FLAG](state, flag) {
        state.baseDataReady = flag;
    },
    [SET_CHART_DATA](state, obj) {
        let { data, title } = obj;
        state.chart.title = title;
        state.chart.data = obj;
    }
};

const actions = {
    getUserName({commit, state}) {
        // only request once
        if (api.login.hasLogin && !state.userNameReady) {
            if (api.login.url && api.login.url !== '') {
                VUE_INSTANCE.$request.post(api.login.url).then(response => {
                    if (!response.data.success) {
                        return;
                    }
                    commit(UPDATE_USER_FLAG, true);
                    let resData = response.data.data;
                    if (resData.userName) {
                        commit(LOGIN, resData.userName);
                    }
                });
            }
        }
    },
    // 获取基础数据
    getBaseData({commit}) {
        let depInfo = [];
        return Promise.all(depInfo).then(() => {
            // 基础信息准备完成标识
            commit(UPDATE_BASE_FLAG, true);
        });
    },
    setChartData({commit}, proload) {
        commit(SET_CHART_DATA, proload);
    }
};

export default new Vuex.Store({
    state: Object.assign({}, state),
    modules: Object.assign({}),
    actions: Object.assign({}, actions),
    mutations: Object.assign({}, mutations),
    plugins: [vuexLocal.plugin]
});
