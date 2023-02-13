import { compare, genSalt, hash } from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

enum UserType {
    PERSONAL = 1,
    NORMAL_USER = 2,
    NUTRICIONIST = 3,
}

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: string;
    createdAt: Date;
    isAdmin: boolean;
    isActive: boolean;
    type: UserType;

    comparePassword(this: IUser, password: string): Promise<boolean>;
}

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    type: {
        type: Number,
        default: UserType.NORMAL_USER,
    },
});

userSchema.pre<IUser>('save', async function (next) {
    const user = this as IUser;
    if (!user.isModified('password')) return next();

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (
    this: IUser,
    password: string
): Promise<boolean> {
    return compare(password, this.password);
};

export const User = model<IUser>('User', userSchema);
