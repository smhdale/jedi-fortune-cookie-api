import Koa from 'koa'
import Router from 'koa-router'
import Episode from './lib/Episode'
import User from './lib/User'

import errorMiddleware from './middleware/error'
import userMiddleware from './middleware/user'

const app = new Koa()
const router = new Router()

// Middlewares
app.use(errorMiddleware)
app.use(userMiddleware)

// Home page
router.get('/', async (ctx, next) => {
	ctx.body = { status: 200, message: 'Hello there.' }
	await next()
})

// Random episode
router.get('/random', async (ctx, next) => {
	let user: User | undefined = ctx.state.user

	// If user has seen every episode, reset seen array
	if (user) {
		const numEpisodes = await Episode.count(true)
		const numSeen = user.seen.length
		console.log({ numEpisodes, numSeen })
		if (numSeen === numEpisodes) user = await User.clearSeen(user._id)
	}

	const doc = await Episode.findByRandomFortune(user?.seen)
	if (!doc) throw 404

	// If user, mark episode as seen
	if (user) user = await User.markSeen(user._id, doc._id)

	// Return episode
	ctx.body = Episode.sanitise(doc)
	await next()
})

// Exact episode
router.get('/episode/:season/:episode', async (ctx, next) => {
	const { season, episode } = ctx.params
	const doc = await Episode.findBySeasonAndEpisode(
		Number(season),
		Number(episode)
	)
	if (!doc) throw 404
	ctx.body = Episode.sanitise(doc)
	await next()
})

// Entire season
router.get('/season/:season', async (ctx, next) => {
	const { season } = ctx.params
	const docs = await Episode.findBySeason(Number(season))
	if (!docs.length) throw 404
	ctx.body = docs.map(Episode.sanitise)
	await next()
})

// App
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000, async () => {
	console.log('May the Force be with you.')
})
