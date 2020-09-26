import Koa from 'koa'
import Router from 'koa-router'
import Episode from './lib/Episode'

const app = new Koa()
const router = new Router()

// Routes
router.get('/', async (ctx, next) => {
	const episode = await Episode.findByRandomFortune()
	if (episode) ctx.body = episode
	else ctx.throw(404)
})

// App
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, async () => {
	console.log('May the Force be with you.')
})
