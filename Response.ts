import type {} from './globals.d.ts'
import { ServerRequest, Status } from 'https://deno.land/std@0.83.0/http/mod.ts'

export class Response {
	protected request!: ServerRequest

	protected statusCode: number = 0
	protected headers: string[][] = []

	constructor(request: ServerRequest, protected removeBranding: boolean = true) {
		Object.defineProperty(this, 'request', {
			configurable: false,
			enumerable: false,
			value: request,
			writable: false
		})
	}

	/**
	 * Set a value for a header key
	 * @param key Name of the key
	 * @param value Value of the key
	 */
	setHeader(key: string, value: string): Response {
		this.headers.push([ key, value ])
		return this
	}

	/**
	 * Set the response status code
	 * @param status The status number or enum member to be sent
	 */
	status(status: number | Status): Response {
		this.statusCode = status
		return this
	}

	/**
	 * Shortcut for `response.setHeader('Content-Type', mime)`
	 * @param mime The Mime-type to be set
	 */
	mime(mime: Mime): Response {
		this.setHeader('Content-Type', mime)
		return this
	}

	/**
	 * Send data to the requester and close the connection
	 * @param data The data to be sent
	 * @returns The response
	 */
	send(data: string | Uint8Array | Deno.Reader): Response {
		this.request.respond({
			body: data,
			headers: new Headers([ ...this.headers, (this.removeBranding ? [] : [ 'X-Powered-By', 'cyprus' ]) ]),
			status: this.statusCode
		})
		return this
	}

	/**
	 * Send a file to the requester and close the connection
	 * @param path The file's path to be sent
	 * @returns The response
	 */
	sendFile(path: string): Response {
		this.request.respond({
			body: Deno.readFileSync(path),
			headers: new Headers([ ...this.headers, (this.removeBranding ? [] : [ 'X-Powered-By', 'cyprus' ]) ]),
			status: this.statusCode
		})
		return this
	}
}