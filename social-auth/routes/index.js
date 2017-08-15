const Router = require('koa-router');

const vkRouter = require('../vk/routes');

const router = new Router();

router.use(vkRouter.routes());
router.use(vkRouter.allowedMethods());

module.exports = router;