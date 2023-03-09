import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { CMongooseException } from '../errors/CMongooseException';
import { CZodException } from '../errors/CZodException';
import { comparePassword, CUserModel, UserLoginValidation } from '../models/CUserModel';

/**
 * Reponsible for handling requests to /api/v1/auth
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 **/
export class CAuthController {
    public static async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;

        const validatedData = UserLoginValidation.safeParse({ email, password });

        if (!validatedData.success) {
            throw new CZodException(403, validatedData.error.issues);
        }

        const user = await CUserModel.findOne({ email }).select('+password');
        if (!user) {
            throw new CMongooseException(409, 'User or password is incorrect');
        }

        if (!(await comparePassword(password, user.password))) {
            throw new CMongooseException(409, 'User or password is incorrect');
        }

        res.status(200).json({
            token: sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20m',
            }),
            message: 'Authentication successful',
        });
    }
}
