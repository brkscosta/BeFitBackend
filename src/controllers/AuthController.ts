import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import MongooseException from '../errors/MongooseException';
import ZodException from '../errors/ZodException';
import { comparePassword, UserLoginValidation, UserModel as userModel } from '../models/UserModel';
import { IEmailService } from '../services/EmailService';
import { ILogger } from '../utils/Logger';

/**
 * Reponsible for handling requests to /api/v1/auth
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 **/
class AuthController {
    private logger: ILogger;
    private emailSrv: IEmailService;

    constructor(logger: ILogger, emailSrv: IEmailService) {
        this.logger = logger;
        this.emailSrv = emailSrv;
    }

    public async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;

        const validatedData = UserLoginValidation.safeParse({ email, password });

        if (!validatedData.success) {
            throw new ZodException(403, validatedData.error.issues);
        }

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            throw new MongooseException(409, 'User or password is incorrect');
        }

        if (!(await comparePassword(password, user.password))) {
            throw new MongooseException(409, 'User or password is incorrect');
        }

        return res.status(200).json({
            token: sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '20m',
            }),
            message: 'Authentication successful',
        });
    }
}

export default AuthController;
