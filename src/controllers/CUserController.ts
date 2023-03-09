import { Request, Response } from 'express';
import { CMongooseException } from '../errors/CMongooseException';
import { CZodException } from '../errors/CZodException';
import { IUser, UserCreationValidation } from '../models/CUserModel';
import { IUserRepository } from '../repositories/CUserRepository';
import { IMailService } from '../services/CEmailService';

export class CUserController {
    private static userRepository: IUserRepository;
    private static emailSrv: IMailService;

    constructor(userRepository: IUserRepository, emailSrv: IMailService) {
        CUserController.userRepository = userRepository;
        CUserController.emailSrv = emailSrv;
    }

    public async getAllUsers(_req: Request, res: Response) {
        const users = await CUserController.userRepository.findAll();
        const filteredUsers: string[] = users.map((user) => user.firstName);

        return res.status(200).json(filteredUsers);
    }

    public async addUser(req: Request, res: Response) {
        const validatedData = UserCreationValidation.safeParse(req.body);

        if (!validatedData.success) {
            throw new CZodException(403, validatedData.error.issues);
        }

        const user = validatedData.data as IUser;
        const userExists = await CUserController.userRepository.findByEmail(user.email);
        if (userExists) {
            throw new CMongooseException(409, 'Email already in use');
        }

        const newUser = await CUserController.userRepository.create(user);

        if (!newUser) {
            throw new CMongooseException(409, 'Failed to create user');
        }

        return res.status(201).json({ id: newUser.id, message: 'User added successfully' });
    }

    public async remove(req: Request, res: Response) {
        const email = req.params.email;

        if (!(await CUserController.userRepository.remove(email))) {
            return res.status(400).json({ message: 'User has not been deactivated!' });
        } else {
            return res.status(200).json({ message: 'User has been deactivated!' });
        }
    }

    public async find(req: Request, res: Response) {
        const user = await CUserController.userRepository.findByEmail(req.params.email);

        if (!user) {
            throw new CMongooseException(404, `User email ${req.params.email} not found`);
        }

        return res.status(200).json({ user: user });
    }

    public async sendEmail(req: Request, res: Response) {
        const { header, body } = req.body;
        const emailSrv = CUserController.emailSrv;

        const isEmailSent = await emailSrv.sendMail(header, body);
        if (isEmailSent) {
            return res.status(200).json({ message: 'Email sent successfully.' });
        } else {
            return res.status(400).json({ message: 'Email not sent :c' });
        }
    }

    public static async toString(_req: Request, res: Response) {
        return res.status(200).send(CUserController.name);
    }
    // Restante da classe
}
