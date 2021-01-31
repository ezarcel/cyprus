# Cyprus
A minimalist and unopinionated web server framework for Deno

## Usage
This snippet covers Cyprus' basic usage:
```javascript
import { App, middleware as mw } from 'https://ezarcel.github.io/cyprus/releases/1.0/mod.ts'

const app = new App()

app
    .use(mw.log)
    
    .get('*', (req, res) => {
        res
            .status(200)
            .mime('text/plain')
            .send('Hello from the server!')
    })
```

## The why
To be honest, I didn't really like any web server frameworks for Deno and I already had this as a test project for Node.js so it was relatively easy to port

## Inspiration
I took a lot of inspiration from Express.js and the http std module for the internals