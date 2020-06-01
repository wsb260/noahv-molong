const EASY_SQLITE3 = require('easy-sqlite3');
// 使用默认库表字段配置
// const EASY_SQLITE3_DEMO = new EASY_SQLITE3();

// 自定义库表字段配置
const EASY_SQLITE3_CLICK = new EASY_SQLITE3({
    // 数据文件存放路径,相对于运行根目录
    path: 'database',
    // 数据库名称
    database: 'clickData',
    // 表名称
    table: 'clickComments',
    // select字段，支持使用[]配置多个字段进行查询
    key: ['className'],
    // 表结构示例
    column: {
        _id: 'TEXT',
        className: 'TEXT',
        path: 'TEXT',
        type: 'INTEGER',
        val: 'TEXT',
        sTime: 'TEXT',
        eTime: 'TEXT'
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
module.exports = EASY_SQLITE3_CLICK;
