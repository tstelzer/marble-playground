import * as Ro from 'rxjs/operators';
import * as Rx from 'rxjs';
import {logger$} from '@marblejs/middleware-logger';
import {r, use, combineRoutes, createServer, httpListener} from '@marblejs/core';
import {multipart$} from '@marblejs/middleware-multipart';

const a$ = r.pipe(
    r.matchPath('a'),
    r.matchType('POST'),
    r.useEffect(req$ => req$.pipe(
        use(multipart$()),
        Ro.mergeMap(req => Rx.combineLatest(Rx.of(req), Rx.from([1, 2, 3]))),
        Ro.tap(([_, n]) => console.log(n)),
        Ro.count(),
        Ro.map(body => ({status: 200, body})),
    )),
)

const b$ = r.pipe(
    r.matchPath('b'),
    r.matchType('POST'),
    r.useEffect(req$ => req$.pipe(
        Ro.mergeMap(req => Rx.combineLatest(Rx.of(req), Rx.from([1, 2, 3]))),
        Ro.tap(([_, n]) => console.log(n)),
        Ro.count(),
        Ro.map(body => ({status: 200, body})),
    )),
)

const api$ = combineRoutes('/', [
    a$,
    b$,
])

const main = async () => {
    const server = await createServer({
        port: 9999,
        hostname: '0.0.0.0',
        httpListener: httpListener({
            effects: [api$],
            middlewares: [logger$({silent: false})],
        })
    });

    server();
}

main();
