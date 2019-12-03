import * as Ro from 'rxjs/operators';
import * as Rx from 'rxjs';
import {logger$} from '@marblejs/middleware-logger';
import {r, use, combineRoutes, createServer, httpListener} from '@marblejs/core';
import {multipart$} from '@marblejs/middleware-multipart';

const a$ = r.pipe(
    r.matchPath('a'),
    r.matchType('POST'),
    r.useEffect(Rx.pipe(
        use(multipart$()),
        Ro.combineLatest(Rx.from([1, 2, 3])),
        Ro.count(),
        Ro.map(body => ({status: 200, body})),
    )),
)

const b$ = r.pipe(
    r.matchPath('b'),
    r.matchType('POST'),
    r.useEffect(Rx.pipe(
        Ro.combineLatest(Rx.from([1, 2, 3])),
        Ro.count(),
        Ro.map(body => ({status: 200, body})),
    )),
)

const api$ = combineRoutes('/', [
    a$,
    b$,
])

createServer({
    port: 9999,
    hostname: '0.0.0.0',
    httpListener: httpListener({
        effects: [api$],
        middlewares: [logger$({silent: false})],
    })
})()
