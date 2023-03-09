import { CUserModel, IUser } from '../models/CUserModel';

export interface IUserRepository {
    findByEmail(email: string): Promise<IUser | null>;
    create(user: IUser): Promise<IUser>;
    findAll(): Promise<IUser[]>;
    remove(email: string): Promise<boolean>;
}

export class CUserRepository implements IUserRepository {
    public async remove(email: string): Promise<boolean> {
        if (!this.findByEmail(email)) {
            return false;
        }

        const user = await CUserModel.findOneAndUpdate({ email });

        if (!user) {
            return false;
        }

        user.isActive = false;
        await user.save();

        return true;
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        return await CUserModel.findOne({ email }, { firstName: 1, lastName: 1, email: 1, type: 1, isAdmin: 1 });
    }

    public async create(user: IUser): Promise<IUser> {
        return await CUserModel.create(user);
    }

    public async findAll(): Promise<IUser[]> {
        return await CUserModel.find();
    }
}
