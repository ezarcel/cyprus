declare global {
	/**
	 * An HTTP method
	 * @see [https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
	 */
	export type Method = 'get'
		| 'head'
		| 'post'
		| 'put'
		| 'delete'
		| 'connect'
		| 'options'
		| 'trace'
		| 'patch'

	/**
	 * A mime type (aka `Content-Type`)
	 * @see [https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
	 */
	export type Mime = 'application/epub+zip'
		| 'application/java-archive'
		| 'application/javascript'
		| 'application/json'
		| 'application/msword'
		| 'application/octet-stream'
		| 'application/ogg'
		| 'application/pdf'
		| 'application/rtf'
		| 'application/vnd.amazon.ebook'
		| 'application/vnd.apple.installer+xml'
		| 'application/vnd.mozilla.xul+xml'
		| 'application/vnd.ms-excel'
		| 'application/vnd.ms-powerpoint'
		| 'application/vnd.oasis.opendocument.presentation'
		| 'application/vnd.oasis.opendocument.spreadsheet'
		| 'application/vnd.oasis.opendocument.text'
		| 'application/vnd.visio'
		| 'application/x-7z-compressed'
		| 'application/x-abiword'
		| 'application/x-bzip'
		| 'application/x-bzip2'
		| 'application/x-csh'
		| 'application/x-rar-compressed'
		| 'application/x-sh'
		| 'application/x-shockwave-flash'
		| 'application/x-tar'
		| 'application/xhtml+xml'
		| 'application/xml'
		| 'application/zip'
		| 'audio/3gpp'
		| 'audio/3gpp2'
		| 'audio/aac'
		| 'audio/midi'
		| 'audio/ogg'
		| 'audio/webm'
		| 'audio/x-wav'
		| 'font/ttf'
		| 'font/woff'
		| 'font/woff2'
		| 'image/gif'
		| 'image/jpeg'
		| 'image/svg+xml'
		| 'image/tiff'
		| 'image/webp'
		| 'image/x-icon'
		| 'text/calendar'
		| 'text/css'
		| 'text/csv'
		| 'text/html'
		| 'text/plain'
		| 'video/3gpp'
		| 'video/3gpp2'
		| 'video/mpeg'
		| 'video/ogg'
		| 'video/webm'
		| 'video/x-msvideo'

	/**
	 * The internal structure to handle routes and middleware
	 */
	export type RequestHandler = {
		functions: RequestHandlerFunction[]
	} & ({
		type: 'route',
		method: Method,
		path: import('https://ezarcel.github.io/deno-url-pattern/releases/1.0/mod.ts').URLPattern,
	} | {
		type: 'middleware'
	})

	/**
	 * The structure of a middleware function or route handler
	 * @param request The request object
	 * @param response The response object
	 * @param next A function used for executing the next function in the request handler cascade
	 */
	export type RequestHandlerFunction = (
		request: import('./Request.ts').Request,
		response: import('./Response.ts').Response,
		next: () => void
	) => void

	/**
	 * The type for functions like `app.get` or `app.port`
	 */
	export type RequestHandlerDefiner = (
		path: string,
		...functions: RequestHandlerFunction[]
	) => import('./App.ts').App

	/**
	 * The structure for `request.HTTPVersion`
	 */
	export interface HTTPVersion {
		minor: number
		major: number
		fullVersion: string
	}
}
export type {}