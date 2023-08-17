import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import ErrorHandlerBase from '../errors/ErrorHandlerBase';
import { ILogger } from '../utils/Logger';

export const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction, logger: ILogger) => {
    if (error instanceof ErrorHandlerBase) {
        const errorMessages = error.composedErrorMessage;

        if (Object.keys(errorMessages).length === 0 && errorMessages.constructor === Object) {
            logger.error(error.message);
            return res.status(error.statusCode).json({ error: error.message });
        }

        logger.error(JSON.stringify(errorMessages));
        return res.status(error.statusCode).json({ error: errorMessages });
    }

    next(error);
    logger.error(error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction, logger: ILogger) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        logger.error('No token provided');
        return res.status(401).json({ message: 'No token provided' });
    }

    const parts = authHeader.split(' ');

    if (parts.length <= 1) {
        logger.error('Token error');
        return res.status(401).json({ message: 'Token error' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        logger.error('Token malformated');
        return res.status(401).json({ message: 'Token malformated' });
    }

    verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) {
            logger.error('Invalid token');
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.body.user = user;
        return next();
    });
};
