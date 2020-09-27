import Koa from 'koa'
import User from '../lib/User'

const UUID_MAX_LEN = 36

const userMiddleware: Koa.Middleware = async (ctx, next) => {
	if (ctx.query.uuid && ctx.query.uuid.length <= UUID_MAX_LEN) {
		const user = await User.findByUuid(ctx.query.uuid)
		ctx.state.user = user || (await User.create(ctx.query.uuid))
	}
	await next()
}

export default userMiddleware
