import { IUser, UserModel as userModel } from '../models/UserModel';

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    create(user: IUser): Promise<IUser>;
    findAll(): Promise<IUser[]>;
    remove(email: string): Promise<boolean>;
}

export class UserRepository implements IUserRepository {
    public async remove(email: string): Promise<boolean> {
        if (!this.findByEmail(email)) {
            return false;
        }

        const user = await userModel.findOneAndUpdate({ email });

        if (!user) {
            return false;
        }

        user.isActive = false;
        await user.save();

        return true;
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        return await userModel.findOne({ email }, { firstName: 1, lastName: 1, email: 1, type: 1, isAdmin: 1 });
    }

    public async create(user: IUser): Promise<IUser> {
        return await userModel.create(user);
    }

    public async findAll(): Promise<IUser[]> {
        return userModel.find({}, { firstName: 1, _id: 0 });
    }
}
