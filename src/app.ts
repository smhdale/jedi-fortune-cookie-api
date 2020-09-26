import * as Koa from 'koa'
import * as Router from 'koa-router'

const app = new Koa()
const router = new Router()

// Routes
router.get('/', async (ctx, next) => {
	ctx.body = { message: 'Hello there.' }
	await next()
})

// App
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, () => {
	console.log('May the Force be with you.')
})
