import { Request, Response } from 'express';
import CServer from '../CServer';
import CMongooseException from '../errors/CMongooseException';
import CZodException from '../errors/CZodException';
import { CUserModel, UserCreationValidation } from '../models/CUserModel';

/**
 * Reponsible for handling requests to /api/v1/users
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 **/
class UserController {
    public static async getAllUsers(req: Request, res: Response) {
        const users = await CUserModel.find({});
        const filteredUsers: string[] = users.map((user) => user.firstName);

        return res.status(200).json(filteredUsers);
    }

    public static async addUser(req: Request, res: Response) {
        let success = true;
        let message = '';
        const validatedData = UserCreationValidation.safeParse(req.body);

        if (!validatedData.success) {
            throw new CZodException(403, validatedData.error.issues);
        }

        if (await CUserModel.findOne({ email: validatedData.data.email })) {
            throw new CMongooseException(409, 'User already exists with this email');
        }

        await CUserModel.create(validatedData.data).catch((error: Error) => {
            if (error) {
                success = false;
                message = error.message.split(':')[0];
            }
        });

        if (!success) {
            throw new CMongooseException(409, message);
        }

        return res.status(201).send({
            message: 'User added successfully',
        });
    }

    public static async toString(req: Request, res: Response) {
        CServer.getLogger().info(`New Request from ${req.socket?.remoteAddress?.split(':').pop()?.trim()}`);

        return res.status(200).send('UserController');
    }

    public static async sendEmail(req: Request, res: Response) {
        const { header, body } = req.body;
        const emailSrv = CServer.getEmailService();

        await emailSrv.sendMail(header, body);

        return res.status(200).json({ message: 'Email sent successfully.' });
    }
}

export default UserController;
