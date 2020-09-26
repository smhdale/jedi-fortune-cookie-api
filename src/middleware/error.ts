import Koa from 'koa'

const getErrorMessage = (status: number): string => {
	switch (status) {
		case 404:
			return 'Perhaps the archives are incomplete.'
		default:
			return 'Do. Or do not. There is no try.'
	}
}

const errorMiddleware: Koa.Middleware = async (ctx, next) => {
	try {
		await next()
	} catch (err) {
		const status = typeof err === 'number' ? err : 500
		const message = getErrorMessage(status)
		ctx.status = status
		ctx.body = { status, message }
	}
}

export default errorMiddleware
