import { Request, Response } from 'express';
import { IUser, User } from '../models/user.model';

export class UserController {
    static async getAllUsers(req: Request<{}, {}, IUser>, res: Response) {
        try {
            const users = await User.find({});
            let filteredUsers = users.map((user) => user.firstName);

            res.status(200).json(filteredUsers);
        } catch (error) {
            const typedError = error as Error;
            console.log(typedError?.message);
            res.status(500).json({ message: typedError?.message });
        }
    }

    static async addUser(req: Request<{}, {}, IUser>, res: Response) {
        const user = new User(req.body);
        //mudei
        try {
            await user.save();
            res.status(201).json(user);
        } catch (error) {
            const typedError = error as Error;
            console.log(typedError?.message);
            res.status(400).json({ message: typedError?.message });
        }
    }

    static async toString(req: Request, res: Response) {
        console.log(`New Request from ${req.socket?.remoteAddress?.split(':').pop()?.trim()}`);
        return res.status(200).send('UserController');
    }
}
