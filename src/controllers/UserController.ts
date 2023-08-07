import { Request, Response } from 'express';
import MongooseException from '../errors/MongooseException';
import ZodException from '../errors/ZodException';
import { UserCreationValidation, UserModel as userModel } from '../models/UserModel';
import { IUserRepository } from '../repositories/UserRepository';
import { IEmailService, IMail } from '../services/EmailService';
import { ILogger } from '../utils/Logger';

/**
 * Reponsible for handling requests to /api/v1/user
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 **/

class UserController {
    private logger: ILogger;
    private emailSrv: IEmailService;
    private userRepo: IUserRepository;

    constructor(logger: ILogger, emailSrv: IEmailService, userRepo: IUserRepository) {
        this.logger = logger;
        this.emailSrv = emailSrv;
        this.userRepo = userRepo;
    }

    public async getAllUsers(req: Request, res: Response) {
        const allUsers = await this.userRepo.findAll();

        return res.status(200).json(allUsers);
    }

    public async addUser(req: Request, res: Response) {
        let success = true;
        let message = '';
        const validatedData = UserCreationValidation.safeParse(req.body);

        if (!validatedData.success) {
            throw new ZodException(403, validatedData.error.issues);
        }

        if (await userModel.findOne({ email: validatedData.data.email })) {
            throw new MongooseException(409, 'User already exists with this email');
        }

        await userModel.create(validatedData.data).catch((error: Error) => {
            if (error) {
                success = false;
                message = error.message.split(':')[0];
            }
        });

        if (!success) {
            throw new MongooseException(409, message);
        }

        return res.status(201).send({
            message: 'User added successfully',
        });
    }

    public async toString(req: Request, res: Response) {
        this.logger.info(`New Request from ${req.socket?.remoteAddress?.split(':').pop()?.trim()}`);

        return res.status(200).send('UserController');
    }

    public async findByEmail(req: Request, res: Response) {
        const user = await this.userRepo.findByEmail(req.body.email);

        if (!user) {
            throw new MongooseException(404, 'User not found');
        }

        return res.status(200).json(user);
    }

    public async sendEmail(req: Request<IMail>, res: Response) {
        const email = req.body as IMail;

        this.emailSrv.send(email, (isEmailSent: boolean) => {
            if (!isEmailSent) {
                return res.status(400).json({ message: 'Email was not sent.' });
            }

            return res.status(200).json({ message: 'Email sent successfully.' });
        });
    }
}

export default UserController;
