import type {} from './globals.d.ts'
import { LazyGetter } from 'https://ezarcel.github.io/deno-lazy-getter/releases/1.0/mod.ts'
import { URLPatternParameters } from 'https://ezarcel.github.io/deno-url-pattern/releases/1.0/mod.ts'

import { ServerRequest } from 'https://deno.land/std@0.83.0/http/server.ts'

export class Request {
	protected request!: ServerRequest

	/**
	 * The method used to make the request
	 */
	get method(): string { return this.request.method }

	/**
	 * The IP of the remote machine
	 */
	get remoteAddress() { return this.request.conn.remoteAddr }

	/**
	 * The path which the user is requesting
	 */
	get url(): string { return this.request.url }

	/**
	 * The HTTP version used
	 */
	get HTTPVersion(): HTTPVersion {
		return {
			fullVersion: this.request.proto,
			major: this.request.protoMajor,
			minor: this.request.protoMinor
		}
	}

	/* Lazy Getters */
	/**
	 * The body of the request. It can be either an string or an object, depending on the `Content-Type` header
	 */
	body!: Promise<string | { [ key: string ]: any }>

	/**
	 * The raw body of the request. The default one provided by the Deno's http std module
	 */
	rawBody!: Promise<Uint8Array>

	/**
	 * The recieved cookies. They usually handle authentication (which user is making the request) or ad personalization
	 */
	cookies!: { [ key: string ]: string }

	/**
	 * The recieved headers, like `Content-Type`, `Content-Length`, etc.
	 */
	headers!: { [ key: string ]: string }

	constructor(request: ServerRequest, public parameters: URLPatternParameters) {
		Object.defineProperty(this, 'request', {
			configurable: false,
			enumerable: false,
			value: request,
			writable: false
		})
		new LazyGetter<Promise<Uint8Array>>(this, 'rawBody', () => Deno.readAll(this.request.body))
		new LazyGetter<Promise<any>>(this, 'body', async () => {
			const content = await this.rawBody
			let body = ''
			content.forEach(char => body += String.fromCharCode(char))
			return this.headers[ 'content-type' ] === 'application/json' ? JSON.parse(body) : body
		})
		new LazyGetter<{ [ key: string ]: string } | null>(this, 'cookies', () => {
			let cookies: { [ key: string ]: string } = {};
			const cookie = this.request.headers.get('Cookie')
			if (!cookie) return null
			cookie.split(';').forEach(cookie => {
				const [ key, value ] = cookie.split('=')
				cookies[ key.trim() ] = value.trim()
			})
			return cookies
		})
		new LazyGetter<{ [ key: string ]: string }>(this, 'headers', () => {
			let headers: { [ key: string ]: string } = {};
			[ ...this.request.headers.entries() ].forEach(([ key, value ]) => {
				headers[ key.toLowerCase() ] = value
			})
			return headers
		})
	}
}