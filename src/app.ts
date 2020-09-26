import Koa from 'koa'
import Router from 'koa-router'
import Episode from './lib/Episode'

import errorMiddleware from './middleware/error'

const app = new Koa()
const router = new Router()

// Error handler
app.use(errorMiddleware)

// Routes
router.get('/', async (ctx) => {
	const episode = await Episode.findByRandomFortune()
	if (episode) ctx.body = Episode.sanitise(episode)
	else throw 404
})

// App
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, async () => {
	console.log('May the Force be with you.')
})
