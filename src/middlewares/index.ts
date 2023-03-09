import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { CErrorHandlerBase } from '../errors/CErrorHandlerBase';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof CErrorHandlerBase) {
        const errorMessages = error.composedErrorMessage;

        if (Object.keys(errorMessages).length === 0 && errorMessages.constructor === Object) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(error.statusCode).json({ error: errorMessages });
    }

    next(error);
    return res.status(500).json({ error: 'Internal Server Error' });
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length <= 1) {
        res.status(401).json({ message: 'Token error' });
        return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ message: 'Token malformated' });
        return;
    }

    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }

        req.body.user = user;
        next();
    });
};
