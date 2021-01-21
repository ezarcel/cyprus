import type {} from './globals.d.ts'
import { Request } from './Request.ts'
import { Response } from './Response.ts'
import { URLPattern } from 'https://ezarcel.github.io/deno-url-pattern/releases/1.0/mod.ts'

import { listenAndServe, listenAndServeTLS, ServerRequest, Status } from 'https://deno.land/std@0.83.0/http/mod.ts'

/**
 * Specify a `certFile` and `keyFile` parameters to make the server even more secure
 * @param certFile The path to the `.crt` file
 * @param keyFile The path to the `.key` file
 * @param removeBranding A boolean to control whether the branding is sent or not
 */
export type AppSettings = {
	removeBranding?: boolean
} & ({
	certFile: string
	keyFile: string
} | {})

/**
 * Create an app to handle requests coming from your frontend
 * @param appSettings Object of settings to make the server more secure or to remove the branding
 */
export class App {
	protected _port: number = 0
	protected certFile: string
	protected keyFile: string
	protected isSecure: boolean
	protected removeBranding: boolean
	protected requestHandlers: RequestHandler[] = []

	/**
	 * The port which the server is listening on
	 */
	get port(): number { return this._port }

	/**
	 * Define a set of functions which handle a `delete` request
	 * @param path The path that this set of functions will handle
	 * @param ...handlers The set of function that will handle the set path
	 */
	delete: RequestHandlerDefiner = (path, ...handlers) => this.attachRoute('delete', path, ...handlers)

	/**
	 * Define a set of functions which handle a `get` request
	 * @param path The path that this set of functions will handle
	 * @param ...handlers The set of function that will handle the set path
	 */
	get: RequestHandlerDefiner = (path, ...handlers) => this.attachRoute('get', path, ...handlers)

	/**
	 * Define a set of functions which handle a `head` request
	 * @param path The path that this set of functions will handle
	 * @param ...handlers The set of function that will handle the set path
	 */
	head: RequestHandlerDefiner = (path, ...handlers) => this.attachRoute('head', path, ...handlers)

	/**
	 * Define a set of functions which handle a `post` request
	 * @param path The path that this set of functions will handle
	 * @param ...handlers The set of function that will handle the set path
	 */
	post: RequestHandlerDefiner = (path, ...handlers) => this.attachRoute('post', path, ...handlers)

	/**
	 * Define a set of functions which handle a `put` request
	 * @param path The path that this set of functions will handle
	 * @param ...handlers The set of function that will handle the set path
	 */
	put: RequestHandlerDefiner = (path, ...handlers) => this.attachRoute('put', path, ...handlers)

	constructor(appSettings?: AppSettings) {
		const { certFile = '', keyFile = '', removeBranding = false } = appSettings as { [ key: string ]: any }
		this.isSecure = !!certFile && !!keyFile
		this.certFile = certFile
		this.keyFile = keyFile
		this.removeBranding = removeBranding
	}
	private requestListener(req: ServerRequest) {
		const response = new Response(req, this.removeBranding)
		try {
			const results = this.requestHandlers.map(rh =>
				rh.type === 'middleware' ? 'middleware' : (rh.method === req.method.toLowerCase() ? rh.path.match(req.url) : false)
			)
			const rhs = this.requestHandlers.filter((rh, i) => results[ i ])
			let parameters = {}
			Object.assign(parameters, ...results.filter(r => !!r && r !== 'middleware'))
			const request = new Request(req, parameters)

			const functions: RequestHandlerFunction[] = [
				...rhs.map(rh => rh.functions).flat(),
				(req, res) => {
					res.status(Status.NotFound)
					if (this.removeBranding)
						res.mime('text/plain').send('')
					else
						res.mime('text/html').sendFile('./404.html')
				}
			]
			const runFunction = (i: number) => { if (functions[ i ]) functions[ i ](request, response, () => runFunction(i + 1)) }
			runFunction(0)
		} catch (e) {
			console.error(e)
			response
				.status(Status.InternalServerError)
				.mime('text/plain')
				.send((e as Error).stack as string)
		}
	}
	private attachRoute(method: Method, path: string, ...functions: RequestHandlerFunction[]): App {
		this.requestHandlers.push({
			functions, method,
			path: new URLPattern(path),
			type: 'route'
		})
		return this
	}

	/**
	 * Add a set of middleware functions to handle the requests more efficiently, eg. for authentication (which user is making the request) or logging
	 * @param ...mw The set of middleware functions to add
	 */
	use(...mw: RequestHandlerFunction[]) {
		this.requestHandlers.push(...mw.flat().map((e): RequestHandler => ({
			type: 'middleware',
			functions: [ e ]
		})))
		return this
	}

	/**
	 * Start listening on a specific port to handle the requests
	 * @param port (Optional) The port to listen on
	 * @param callback (Optional) A function to run after starting the server
	 */
	listen(port?: number, callback?: (port: number, isSecure: boolean) => void) {
		this._port = port ?? (this.isSecure ? 443 : 80)
		if (this.isSecure)
			listenAndServeTLS({ certFile: this.certFile, keyFile: this.keyFile, port: this._port }, this.requestListener.bind(this))
		else
			listenAndServe({ port: this._port }, this.requestListener.bind(this))
		if (typeof callback === 'function') callback(this._port, this.isSecure)
	}
}