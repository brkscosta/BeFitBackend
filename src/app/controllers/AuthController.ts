import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { comparePassword, User, UserLoginValidation } from '../models/UserModel';
import MongooseErrorWrapper from '../utils/MongooseError';
import ZodError from '../utils/ZodError';

class AuthController {
    public static async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;

        const validatedData = UserLoginValidation.safeParse({ email, password });

        if (!validatedData.success) {
            throw new ZodError(403, validatedData.error.issues);
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new MongooseErrorWrapper(409, 'User or password is incorrect');
        }

        if (!(await comparePassword(password, user.password))) {
            throw new MongooseErrorWrapper(409, 'User or password is incorrect');
        }

        res.status(200).json({
            token: sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20m',
            }),
            message: 'Authentication successful',
        });
    }
}

export default AuthController;
