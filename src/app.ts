import Koa from 'koa'
import Router from 'koa-router'
import logger from 'koa-logger'
import noCache from 'koa-no-cache'
import { RateLimit as limit } from 'koa2-ratelimit'

import Episode from './lib/Episode'
import User from './lib/User'
import Stat from './lib/Stat'

import errorMiddleware from './middleware/error'
import userMiddleware from './middleware/user'

const app = new Koa()
const router = new Router()

// Middlewares
app.use(logger())
app.use(errorMiddleware)
app.use(userMiddleware)
app.use(noCache({ global: true }))
app.use(
	limit.middleware({
		interval: 30000,
		delayAfter: 20,
		timeWait: 1000,
		max: 50,
		handler() {
			throw 429
		},
	})
)

// Home page
router.get('/', async (ctx) => {
	ctx.body = { status: 200, message: 'Hello there.' }
})

// Random episode
router.get('/random', async (ctx) => {
	let user: User | undefined = ctx.state.user

	// If user has seen every episode, reset seen array
	if (user) {
		const numEpisodes = await Episode.count(true)
		const numSeen = user.seen.length
		if (numSeen === numEpisodes) user = await User.clearSeen(user._id)
	}

	const doc = await Episode.findByRandomFortune(user?.seen)
	if (!doc) throw 404

	// If user, mark episode as seen
	if (user) user = await User.markSeen(user._id, doc._id)

	// Track and return episode
	ctx.app.emit('track', doc)
	ctx.body = Episode.sanitise(doc)
})

// Exact episode
router.get('/episode/:season/:episode', async (ctx) => {
	const { season, episode } = ctx.params
	const doc = await Episode.findBySeasonAndEpisode(
		Number(season),
		Number(episode)
	)
	if (!doc) throw 404

	// Track and return episode
	ctx.app.emit('track', doc)
	ctx.body = Episode.sanitise(doc)
})

// Entire season
router.get('/season/:season', async (ctx) => {
	const { season } = ctx.params
	const docs = await Episode.findBySeason(Number(season))
	if (!docs.length) throw 404

	// Track and return season
	docs.forEach((doc) => {
		ctx.app.emit('track', doc)
	})
	ctx.body = docs.map(Episode.sanitise)
})

// App
app.use(router.routes()).use(router.allowedMethods())
app.use(async () => {
	throw 404
})

app.on('track', async (episode: Episode) => {
	try {
		await Stat.track(episode)
	} catch (err) {
		console.error('Failed to track episode:', err.message)
	}
})

async function main() {
	await Stat.bootstrap()
	app.listen(process.env.PORT || 3000, () => {
		console.log('May the Force be with you.')
	})
}

main()
