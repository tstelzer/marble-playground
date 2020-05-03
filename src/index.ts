import {requestValidator$} from '@marblejs/middleware-io';
import {HttpEffect, use, HttpError, HttpStatus} from '@marblejs/core';
import * as io from 'io-ts';

const TestCodec = io.type({a: io.string});

export const testEffect$: HttpEffect = (req$) => req$.pipe(
    requestValidator$({
        query: TestCodec
    })
);
