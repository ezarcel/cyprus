import type {} from './globals.d.ts'

/**
 * ***Use this with* `app.use`**  
 * A middleware function to log the incoming requests to the console
 */
export const log: RequestHandlerFunction = (req, res, next) => {
	const ip = (req.remoteAddress as Deno.NetAddr).hostname
	const now = new Date()

	const addZero = (data: number) => `${data < 10 ? 0 : ''}${data}`
	const hours = addZero(now.getHours())
	const minutes = addZero(now.getMinutes())
	const seconds = addZero(now.getSeconds())

	const _ip = ip + ' '.repeat(15 - ip.length)
	const method = req.method + ' '.repeat(7 - req.method.length)

	console.log(`(${hours}:${minutes}:${seconds}) ${_ip} ${method} ${req.url}`)
	next()
}