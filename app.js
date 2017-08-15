const App = require('koa')
    , views = require('koa-views')
    , combineRouters = require('koa-combine-routers')
    , config = require('./config')
    , wifidogRouter = require('./wifidog/routes')
    , portalRouter = require('./portal/routes')
    , socialAuthRouter = require('./social-auth/routes');

const app = new App();

app.use(views(__dirname + '/views', {}));

/*app.use(async (ctx, next) => {
    console.log('<--', ctx.request.method, ' ', ctx.request.url);
    await next();
    console.log('-->', ctx.response.status, ' ', ctx.response.body);
});*/

const router = combineRouters(
    wifidogRouter,
    portalRouter,
    socialAuthRouter
);

app.use(router);

app.listen(config.port);