const EASY_SQLITE3 = require('easy-sqlite3');
// 使用默认库表字段配置
// const EASY_SQLITE3_DEMO = new EASY_SQLITE3();

// 自定义库表字段配置
const SOURCE = new EASY_SQLITE3({
    // 数据文件存放路径,相对于运行根目录
    path: 'database',
    // 数据库名称
    database: 'source',
    // 表名称
    table: 'source',
    // select字段，支持使用[]配置多个字段进行查询
    key: ['UID'],
    // 表结构示例
    column: {
        UID: 'TEXT',
        NAME: 'TEXT', // 文件名
        TYPE: 'TEXT', // 文件类型
        DURATION: 'TEXT' // 加载所需时长
    }
});

module.exports = SOURCE;
