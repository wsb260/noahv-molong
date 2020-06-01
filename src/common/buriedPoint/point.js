import axios from 'axios';
class BuriedPoint {
    constructor(options) {
        this.storeClick = 'click'; // 点击事件采集标记
        this.pageChange = 'pageChange'; // 页面切换采集标记
        this.openClick = true; // 是否开启点击数据采集
        this.classTag = 'isPoint'; // 主动埋点标识
        this.storePage = 'page'; // 页面采集标记
        this.storeTiming = 'time'; // 页面时间采集标记
        this.sourceTiming = 'source'; // 静态资源采集标记
        this.nodeLength = 2; // 点击元素采集层数,自动埋点时会向上查找,该选项可以配置查找层数
        this.hash = true; // 是否启动了hash模式
        this.openPerformance = true; // 是否开启页面性能采集
        this.openSource = true; // 是否开启静态资源监控
    }

    init() {
    // 清空存储
        Util.removeCookie();
        // 记录当前页面
        this.setLocationPath();
        // 是否开启了点击采集
        if (this.openClick) {
            document.addEventListener('click', e => {
                let event = window.event || e;
                let target = event.srcElement ? event.srcElement : event.target;
                this.getTarget(target);
                console.log('前端埋点');
            });
        }
        // 对页面加载信息进行监听
        if (this.openPerformance) {
            this.loadPerformance(() => {
                // 开始计算
                let loadData = this.processData();
                Util.setCookie(this.storeTiming, loadData);
                Request.setPerformance({
                    url: 'http://localhost:4000/setPerformanceData',
                    data: loadData
                });
            });
        }
        // 对页面静态加载资源监控
        if (this.openSource) {
            this.loadSource(data => {
                Util.setCookie(this.sourceTiming, data);
                Request.setSource({
                    url: 'http://localhost:4000/setSourceData',
                    data: data
                });
            });
        }
    }

    setLocationPath() {
        if (this.hash) {
            Util.setCookie(this.storePage, window.location.hash.substring(1));
        }
        else {
            Util.setCookie(this.storePage, window.location.pathname);
        }
    }

    // 冒泡场景下将除document外所有父元素添加点击事件
    getTarget(node, length) {
        if (Util.isEmpty(length)) {
            length = 0;
        }

        if (!Util.isEmpty(node)) {
            // let parentNode = node && node.parentNode;
            this.setClickAc(node);
            // if (Object.prototype.toString.call(parentNode) !== Object.prototype.toString.call(document) && length < this.nodeLength) {
            //     this.getTarget(parentNode, ++length);
            // }
        }
    }

    // 节点点击时保存数据
    setClickAc(e) {
        if (Util.isEmpty(e.id) && Util.isEmpty(e.className)) {
            return false;
        }
        if (
            !Util.isEmpty(this.classTag)
      && e.className.indexOf(this.classTag) < 0
        ) {
            return false;
        }
        // 获取本地存储的值
        let storeData = Util.getCookie(this.storeClick);
        let eventData = storeData ? storeData : [];
        let nowStr = Util.getTimeStr();
        let clickData = {
            type: this.storeClick,
            path: Util.getCookie(this.storePage),
            className: e.className,
            val: e.value || e.innerText,
            sTime: nowStr,
            eTime: nowStr
        };
        eventData.push(clickData);
        Util.setCookie(this.storeClick, eventData);
        Request.setClickPost({
            url: 'http://localhost:4000/setClickData',
            data: eventData
        });
        Request.getClickPost({
            url: 'http://localhost:4000/getClickData'
        });
        console.log('触发埋点');
    }

    // 页面切换时保存数据
    routerChange(pathname) {
        let eventData = [];
        let nowStr = Util.getTimeStr();
        let clickData = {
            type: this.pageChange,
            path: pathname,
            className: this.classTag,
            val: '',
            sTime: nowStr,
            eTime: nowStr
        };
        eventData.push(clickData);
        Request.setClickPost({
            url: 'http://localhost:4000/setClickData',
            data: eventData
        });
        console.log('触发路由切换埋点');
    }

    // 页面加载性能监听
    loadPerformance(cb) {
        let timer = null;
        let check = () => {
            if (window.performance.timing.loadEventEnd) {
                clearTimeout(timer);
                cb();
            }
            else {
                timer = setTimeout(check, 100);
            }
        };

        this.handleAddListener('load', check);
    }

    handleAddListener(type, fn) {
        if (window.addEventListener) {
            window.addEventListener(type, fn, false);
        }
        else {
            window.attachEvent('on' + type, fn, false);
        }
    }

    // 计算页面性能
    processData() {
        let performance = window.performance;
        let timing = performance.timing;
        let loadData = {};

        let getTimer = this.timingDifference(timing);
        // 上一个页面到这个页面的时长
        loadData.prevPage = getTimer('fetchStart', 'navigationStart');
        // 重定向的时间
        loadData.redirect = getTimer('redirectEnd', 'redirectStart');
        // DNS
        loadData.DNS = getTimer('domainLookupEnd', 'domainLookupStart');
        // TCP链接耗时
        loadData.TCP = getTimer('connectEnd', 'connectStart');
        // 白屏时间
        loadData.WT = getTimer('responseEnd', 'navigationStart');
        // 首包请求时间
        loadData.FirstRes = getTimer('responseEnd', 'responseStart');
        // dom解析耗时
        loadData.ParseDom = getTimer('domComplete', 'domLoading');
        // 脚本加载完成时间
        loadData.ScriptEnd = getTimer('domContentLoadedEventEnd', 'navigationStart');
        // onload执行的时间
        loadData.load = getTimer('loadEventEnd', 'loadEventStart');
        // 总时长
        loadData.total = getTimer('loadEventEnd', 'navigationStart');

        return loadData;
    }

    // 计算性能差
    timingDifference(root) {
        return (startType, endType) => {
            return root[startType] - root[endType];
        };
    }

    // 静态资源加载需要的数据
    sourceData(source) {
        let data = {
            name: source.name, // 资源文件名称
            initiatorType: source.initiatorType, // 资源文件类型
            duration: source.duration
        };
        return data;
    }

    // 静态资源加载监听
    loadSource(cb) {
        this.handleAddListener('load', () => {
            // 获取静态资源数组
            let resourceData = window.performance.getEntriesByType('resource');
            let data = resourceData.map(source => this.sourceData(source));
            cb(data);
        });
    }
}
let Util = {
    isEmpty: obj => {
        return (
            (obj !== 0 || obj !== '0')
      && (obj === undefined
        || typeof obj === 'undefined'
        || obj === null
        || obj === 'null'
        || obj === '')
        );
    },
    getTimeStr: () => {
        let date = new Date();
        let now = date.getFullYear() + '/';
        now += date.getMonth() + 1 + '/';
        now += date.getDate() + ' ';
        now += date.getHours() + ':';
        now += date.getMinutes() + ':';
        now += date.getSeconds() + '';
        return now;
    },
    setCookie: (name, value) => {
        window.localStorage.setItem(name, JSON.stringify(value));
    },
    getCookie: name => {
        return JSON.parse(window.localStorage.getItem(name));
    },
    removeCookie: () => {
        window.localStorage.clear();
    }
};
// 数据上报
let Request = {
    request: options => {
        if (!options.url) {
            return false;
        }
        let instance = axios.create({
            baseURL: options.baseURL | window.location.host,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return type => {
            return new Promise((resolve, reject) => {
                try {
                    if (type === 'post') {
                        instance
                            .post(options.url, {
                                ...options.data
                            })
                            .then(response => resolve())
                            ['catch'](error => reject());
                    }
                    else if (type === 'get') {
                        instance
                            .get(options.url)
                            .then(response => resolve(response))
                            ['catch'](error => reject(error));
                    }
                }
                catch (error) {
                    reject(error);
                }
            });
        };
    },
    // 存储点击事件采集数据
    setClickPost: options => {
        options.data = {
            clickData: options.data
        };
        Request.request(options)('post');
    },
    // 获取点击事件采集数据
    getClickPost: async options => {
        let res = await Request.request(options)('get');
        return res;
    },
    // 存储页面加载采集数据
    setPerformance: options => {
        options.data = {
            performanceData: options.data
        };
        Request.request(options)('post');
    },
    // 获取页面加载采集数据
    getPerformance: async options => {
        let res = await Request.request(options)('get');
        return res;
    },
    // 存储静态资源加载采集数据
    setSource: options => {
        options.data = {
            sourceData: options.data
        };
        Request.request(options)('post');
    },
    // 获取静态资源采集数据
    getSource: async options => {
        let res = await Request.request(options)('get');
        return res;
    }
};
BuriedPoint.install = function (_Vue, options) {
    let Vue = _Vue;
    let point = new BuriedPoint();
    point.init();

    // 添加实例方法,在路由拦截器中调用,监控页面切换
    Vue.prototype.$pageChange = pathname => {
        // 本地存储当前的页面
        point.setLocationPath();
        // 上报路由切换页面
        point.routerChange(pathname);
    };
    // 获取点击数据数据采集对象
    Vue.prototype.$getEventData = async options => {
        if (!options) {
            throw new Error(
                'Dont\'t have the options'
            );
        }
        let res = await Request.getClickPost(
            options
        );
        return res;
    };
    // 获取页面加载采集数据
    Vue.prototype.$getPerformance = async options => {
        if (!options) {
            throw new Error(
                'Dont\'t have the options'
            );
        }
        let res = await Request.getPerformance(
            options
        );
        return res;
    };
    // 获取静态资源采集数据
    Vue.prototype.$getSource = async options => {
        if (!options) {
            throw new Error('Dont\'t have the options');
        }
        let res = await Request.getSource(options);
        return res;
    };
};
export default {
    install: BuriedPoint.install
};
