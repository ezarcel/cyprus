import type {} from './globals.d.ts'
import * as p from 'https://deno.land/std@0.85.0/path/mod.ts';
import { Status } from "https://deno.land/std@0.83.0/http/http_status.ts";

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

/**
 * ***Use this with* `app.use`**  
 * A middleware function to quickly create a static web server
 */
export const staticFiles = (path: string): RequestHandlerFunction => {
	const exists = (path: string): boolean => {
		try {
			Deno.statSync(path)
			return true
		} catch {
			return false
		}
	}
	if (exists(path))
		return (req, res, next) => {
			const filePath = p.join(path, req.url)
			if (req.method === 'GET' && exists(filePath)) {
				res.status(Status.OK)
				res.sendFile(filePath)
			}
			else next()
		}
	else
		throw new Error(`${path} does NOT exist`)
}