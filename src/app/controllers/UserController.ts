import { Request, Response } from 'express';
import Server from '../../Server';
import { User, UserCreationValidation } from '../models/UserModel';
import EmailService from '../services/EmailService';
import ErrorHandler from '../utils/ErrorHandler';
import MongooseErrorWrapper from '../utils/MongooseError';
import ZodError from '../utils/ZodError';

/**
 * Reponsible for handling requests to /api/v1/users
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 **/
class UserController {
    public static async getAllUsers(req: Request, res: Response) {
        const users = await User.find({});
        const filteredUsers: string[] = users.map((user) => user.firstName);

        return res.status(200).json(filteredUsers);
    }

    public static async addUser(req: Request, res: Response) {
        let success = true;
        let message = '';
        const validatedData = UserCreationValidation.safeParse(req.body);

        if (!validatedData.success) {
            throw new ZodError(403, validatedData.error.issues);
        }

        if (await User.findOne({ email: validatedData.data.email })) {
            throw new MongooseErrorWrapper(409, 'User already exists with this email');
        }

        await User.create(validatedData.data).catch((error: Error) => {
            if (error) {
                success = false;
                message = error.message.split(':')[0];
            }
        });

        if (!success) {
            throw new MongooseErrorWrapper(409, message);
        }

        return res.status(201).send({
            message: 'User added successfully',
        });
    }

    public static async toString(req: Request, res: Response) {
        Server.getLogger().info(
            `New Request from ${req.socket?.remoteAddress?.split(':').pop()?.trim()}`
        );

        return res.status(200).send('UserController');
    }

    public static async sendEmail(req: Request, res: Response) {
        const { header, body } = req.body;
        const email = new EmailService({ header, body });

        const result = await email.sendMail();
        const value = result.valueOf();

        if (!value) {
            throw new ErrorHandler(400, 'Email not sent successfully');
        }

        return res.status(200).json({ message: 'Email sent successfully.' });
    }
}

export default UserController;
