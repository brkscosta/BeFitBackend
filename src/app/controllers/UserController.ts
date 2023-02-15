import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import EmailService from '../services/EmailService';
import ErrorHandler from '../utils/ErrorHandler';
import Logger from '../utils/Logger';

const logger = new Logger();
const errorHandler = new ErrorHandler();

class UserController {
    public static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await User.find({});
            const filteredUsers = users.map((user) => user.firstName);

            res.status(200).json(filteredUsers);
        } catch (error) {
            errorHandler.handleError(error, '', res);
        }
    }

    public static async addUser(req: Request, res: Response) {
        const user = new User(req.body);

        try {
            await user.save();
            res.status(201).json({ menssage: 'User added successfully.' });
        } catch (error) {
            errorHandler.handleError(error, '', res);
        }
    }

    public static async toString(req: Request, res: Response) {
        logger.info(`New Request from ${req.socket?.remoteAddress?.split(':').pop()?.trim()}`);

        return res.send(200).send('UserController');
    }

    public static async sendEmail(req: Request, res: Response) {
        const { header, body } = req.body;
        const email = new EmailService({ header, body });

        const result = await email.sendMail();
        const value = result.valueOf();
        let menssage = 'Email sent successfully.';

        if (!value) {
            menssage = 'Email not sent successfully.';
            return res.status(500).json({ message: menssage });
        }

        return res.status(200).json({ message: menssage });
    }
}

export default UserController;
