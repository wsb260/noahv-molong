const fs = require('fs');
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const uuidv1 = require('uuid').v1;
const querystring = require('querystring');

let app = new Koa();
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
                console.log(arr);
                resolve(Buffer.concat(arr).toString());
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

const body = ctx => {
    return new Promise((resolve, reject) => {
        let arr = [];
        ctx.req.on('data', chunk => {
            arr.push(chunk);
        });
        ctx.req.on('end', () => {
            resolve(Buffer.concat(arr).toString());
        });
    });
};

app.use(async ctx => {
    if (ctx.path === '/setClickData' && ctx.method.toLowerCase() == 'post') {
        // console.log(ctx);
        // console.log('t::::', ctx.request.body.clickData);
        let pastData = await parsePostData(ctx);
        ctx.body = pastData;
    }
    else {
        ctx.body = 'not found';
    }
});
app.listen(4000);
