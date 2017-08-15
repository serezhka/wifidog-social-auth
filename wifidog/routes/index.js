const Router = require('koa-router')
    , moment = require('moment')
    , crypto = require('crypto')
    , config = require('../../config/index')
    , users = require('../../models/users');

const router = new Router();

router.get('/ping', ctx => {
    ctx.body = 'Pong';
    console.log('Wifidog gateway uptime: ' + moment.duration(parseInt(ctx.request.query.wifidog_uptime), 'seconds').humanize());
});

router.get('/login', async ctx => {

    await ctx.render('welcome.pug', {
        gw_address: ctx.request.query.gw_address,
        gw_port: ctx.request.query.gw_port,
        token: crypto.randomBytes(20).toString('hex'),
        time_to_auth: config.authTime
    });

    ctx.status = 511;
});

router.get('/auth', ctx => {

    let ip = ctx.request.query.ip,
        mac = ctx.request.query.mac,
        token = ctx.request.query.token,
        stage = ctx.request.query.stage;

    let user = users.getUserByToken(token);

    if (stage === 'login') {

        if (!user) {
            user = users.addUser(ip, mac, token);
        }

        user.stage = users.AUTH_STATE.VALIDATION_REQUIRED;
        user.validationStartedAt = moment().unix();
        users.update(user);

        ctx.body = 'Auth: 5';

    } else if (stage === 'counters') {

        switch (user.stage) {
            case users.AUTH_STATE.VALIDATION_SUCCEED:
                ctx.body = 'Auth: 1';
                return;
            case users.AUTH_STATE.VALIDATION_FAILED:
                ctx.body = 'Auth: 6';
                return;
            case users.AUTH_STATE.VALIDATION_REQUIRED:
                if (moment().diff(moment.unix(user.validationStartedAt), 'seconds') < config.authTime) {
                    ctx.body = 'Auth: 5';
                } else {
                    user.stage = users.AUTH_STATE.VALIDATION_FAILED;
                    users.update(user);
                    ctx.body = 'Auth: 6';
                }
                return;
        }
    }
});

module.exports = router;