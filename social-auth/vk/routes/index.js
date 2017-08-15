const Router = require('koa-router')
    , crypto = require('crypto')
    , config = require('../../../config')
    , users = require('../../../models/users');

const router = new Router();

router.get('/vkcallback', ctx => {

    let user_id = ctx.request.query.uid,
        hash = ctx.request.query.hash,
        token = ctx.request.query.token;

    if (crypto.createHash('md5').update(config.vkApiId + user_id + config.vkSecretKey).digest('hex') === hash) {
        let user = users.getUserByToken(token);
        user.id = user_id;
        user.stage = users.AUTH_STATE.VALIDATION_SUCCEED;
        users.update(user);
        console.log('User with id ', user_id, ' logged in!')
    }
});

module.exports = router;