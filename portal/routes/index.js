const Router = require('koa-router')
    , config = require('../../config')
    , users = require('../../models/users');

const router = new Router();

router.get('/portal', async ctx => await ctx.render('login.pug', {
    vkApiId: config.vkApiId,
    token: ctx.request.query.token
}));

module.exports = router;