const EASY_SQLITE3 = require('easy-sqlite3');
// 使用默认库表字段配置
// const EASY_SQLITE3_DEMO = new EASY_SQLITE3();

// 自定义库表字段配置
const PERFORMANCE = new EASY_SQLITE3({
    // 数据文件存放路径,相对于运行根目录
    path: 'database',
    // 数据库名称
    database: 'performanceData',
    // 表名称
    table: 'performanceData',
    // select字段，支持使用[]配置多个字段进行查询
    key: ['UID'],
    // 表结构示例
    column: {
        UID: 'TEXT',
        DNS: 'INTEGER', // DNS解析时间
        FIRST_RES: 'INTEGER', // 首包请求时间
        PARSE_DOM: 'INTEGER', // dom解析耗时
        SCRIPT_END: 'INTEGER', // 脚本加载完成时间
        TCP: 'INTEGER', // TCP链接耗时
        WT: 'INTEGER', // 白屏时间
        LOAD: 'INTEGER', // onload执行的时间
        PREV_PAGE: 'INTEGER', // 上一个页面到这个页面的时长
        REDIRECT: 'INTEGER', // 重定向的时间
        TOTAL: 'INTEGER' // 总时长
    }
});

// EASY_SQLITE3_DEMO.insertData({
//     _id: uuidv1(),
//     className: 'isPoint',
//     path: 'data.path',
//     type: 'data.type',
//     val: 'data.val',
//     sTime: 'data.sTime',
//     eTime: 'data.eTime'
// });
module.exports = PERFORMANCE;
