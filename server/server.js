const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const uuidv1 = require('uuid').v1;
const EASY_SQLITE3_CLICK = require('./sqlite/index');
const EASY_SQLITE3_PERFORMANCE = require('./sqlite/performance');
const EASY_SQLITE3_SOURCE = require('./sqlite/source');
let app = new Koa();
let router = new Router();
// app.use(async (ctx, next) => {
//     ctx.set('Access-Control-Allow-Origin', '*');
//     ctx.set(
//         'Access-Control-Allow-Headers',
//         'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
//     );
//     ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     if (ctx.method == 'OPTIONS') {
//         ctx.body = 200;
//     }
//     else {
//         await next();
//     }
// });
app.use(cors());
// app.use(bodyParser());
function parsePostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let arr = [];
            ctx.req.on('data', chunk => {
                arr.push(chunk);
            });
            ctx.req.on('end', () => {
                let res = Buffer.concat(arr).toString();
                resolve(res);
            });
        }
        catch (error) {
            reject(error);
        }
    });
}
function getClickData(ctx) {
    return new Promise((reslove, reject) => {
        EASY_SQLITE3_CLICK.selectData({ className: 'isPoint' }, data => {
            reslove(data);
        });
    });
}

function saveClickData(ctx, data) {
    return new Promise((resolve, reject) => {
        data.forEach(item => {
            EASY_SQLITE3_CLICK.insertData({
                _id: uuidv1(),
                className: item.className,
                path: item.path,
                type: item.type,
                val: item.val,
                sTime: item.sTime,
                eTime: item.eTime
            });
        });

        resolve(data);
    });
}
// 获取页面性能采集数据
function getPerformanceData(ctx) {
    return new Promise((reslove, reject) => {
        EASY_SQLITE3_PERFORMANCE.selectData({ UID: 'pf' }, data => {
            reslove(data);
        });
    });
}
// 保存页面性能采集数据
function savePerformanceData(ctx, data) {
    return new Promise((resolve, reject) => {
        EASY_SQLITE3_PERFORMANCE.insertData({
            UID: 'pf',
            DNS: data.DNS, // DNS解析时间
            FIRST_RES: data.FirstRes, // 首包请求时间
            PARSE_DOM: data.ParseDom, // dom解析耗时
            SCRIPT_END: data.ScriptEnd, // 脚本加载完成时间
            TCP: data.TCP, // TCP链接耗时
            WT: data.WT, // 白屏时间
            LOAD: data.load, // onload执行的时间
            PREV_PAGE: data.prevPage, // 上一个页面到这个页面的时长
            REDIRECT: data.redirect, // 重定向的时间
            TOTAL: data.total // 总时长
        });
        resolve(data);
    });
}
// 保存静态资源采集数据
function saveSourceData(ctx, datas) {
    return new Promise((resolve, reject) => {
        try {
            datas.forEach(data => {
                EASY_SQLITE3_SOURCE.insertData({
                    UID: 'source',
                    NAME: data.name,
                    TYPE: data.initiatorType,
                    DURATION: data.duration
                });
            });

            resolve(datas);
        }
        catch (error) {
            reject(error);
        }
    });
}
// 获取静态资源采集数据
function getSourceData() {
    return new Promise((reslove, reject) => {
        EASY_SQLITE3_SOURCE.selectData({ UID: 'source' }, data => {
            reslove(data);
        });
    });
}
// 获取点击事件采集数据
router.get('/getClickData', async (ctx, next) => {
    let res = await getClickData(ctx);
    ctx.body = res;
});
// 保存点击事件采集数据
router.post('/setClickData', async (ctx, next) => {
    let res = await parsePostData(ctx);
    let pastData = await saveClickData(ctx, JSON.parse(res).clickData);
    ctx.body = pastData;
});

// 保存页面性能采集数据
router.post('/setPerformanceData', async (ctx, next) => {
    let res = await parsePostData(ctx);
    let pastData = await savePerformanceData(ctx, JSON.parse(res).performanceData);
    ctx.body = pastData;
});
// 获取页面性能采集数据
router.get('/getPerformanceData', async (ctx, next) => {
    let res = await getPerformanceData(ctx);
    ctx.body = res;
});
// 保存静态资源采集数据
router.post('/setSourceData', async (ctx, next) => {
    let res = await parsePostData(ctx);
    console.log('source:', JSON.parse(res).sourceData);
    let sourceData = await saveSourceData(ctx, JSON.parse(res).sourceData);
    ctx.body = sourceData;
});
// 获取静态资源采集数据
router.get('/getSourceData', async (ctx, next) => {
    let res = await getSourceData(ctx);
    ctx.body = res;
});
// router.get('/getEventData', (ctx, next) => {
//     try {
//         let data = fs.readFileSync('./sqlite/data.json');
//         ctx.body = data;
//     }
//     catch (error) {

//     }
// });

app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
    console.log('success');
});
