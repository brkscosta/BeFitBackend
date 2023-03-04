import { compare, genSalt, hash } from 'bcrypt';
import { Document, model, Schema } from 'mongoose';
import { boolean, date, number, object, string } from 'zod';

export enum EUserType {
    PERSONAL = 1,
    NORMAL_USER = 2,
    NUTRICIONIST = 3,
}

export const UserCreationValidation = object({
    firstName: string({ required_error: 'First name is required' }).min(3, {
        message: 'Must be 3 or more characters long',
    }),
    lastName: string({ required_error: 'Last name is required' }).min(3, {
        message: 'Must be 3 or more characters long',
    }),
    dateOfBirth: string()
        .regex(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/)
        .transform((value) => new Date(value)),
    email: string({ required_error: 'Email is required' }).email({
        message: 'Invalid email address',
    }),
    password: string({ required_error: 'Password is required' }).min(8, {
        message: 'Must be 8 or more characters long',
    }),
    passwordResetToken: string().optional(),
    passwordResetExpires: date().optional(),
    createdAt: date().default(() => new Date()),
    isAdmin: boolean().default(false),
    isActive: boolean().default(true),
    type: number().default(EUserType.NORMAL_USER),
});

export const UserLoginValidation = object({
    email: string({ required_error: 'Email is required' }).email({
        message: 'Invalid email address',
    }),
    password: string({ required_error: 'Password is required' }).min(8, {
        message: 'The password must have than 8 or more characters',
    }),
});

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    email: string;
    password: string;
    passwordResetToken: string;
    passwordResetExpires: string;
    createdAt: Date;
    isAdmin: boolean;
    isActive: boolean;
    type: EUserType;

    comparePassword(this: IUser, password: string): Promise<boolean>;
}

const userMongooseSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
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
        default: EUserType.NORMAL_USER,
    },
});

userMongooseSchema.pre<IUser>('save', async function (next) {
    const user = this as IUser;
    if (!user.isModified('password')) return next();

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);
    next();
});

export const comparePassword = async function (password: string, hashPassword: string): Promise<boolean> {
    return await compare(password, hashPassword);
};

export const CUserModel = model<IUser>('CUserModel', userMongooseSchema);
