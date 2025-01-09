import * as express from 'express';
import { GeneralError } from '../errors/GeneralError';

export function authenticateToken(err: Error, req: express.Request, res: express.Response, next: any) {
    // eslint-disable-next-line no-console
    console.warn(`Caught Error for ${req.path}:`, err.message);

    if (err instanceof GeneralError) {
        return res.status(err.getCode()).json(err.toJSON());
    }

    return next(err);
}
