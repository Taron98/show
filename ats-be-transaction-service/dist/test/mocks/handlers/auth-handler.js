"use strict";
/** @format */
Object.defineProperty(exports, "__esModule", { value: true });
const msw_1 = require("msw");
const handlers = [
    msw_1.rest.post('*/oauth2/token', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            access_token: 'YTSNU8MHNAlhh247uz3kCALhXpMU',
            token_type: 'BearerToken',
            expires_in: 1799,
            scope: 'CORE PFM admin FRAME',
            refresh_token: 'aC2B3nnWEp9HFgmSXlL3Xk92aSXanxXh',
            refresh_token_expires_in: '0',
        }));
    }),
];
exports.default = handlers;
