import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface IEnvironment {
    NODE_ENV: string;
    PORT: number;
    MONGO_USERNAME: string;
    MONGO_PASSWORD: string;
    MONGO_DB_NAME: string;
    MONGO_DB_NAME_DEV: string;
    MONGO_DOMAIN: string;
    GMAIL_EMAIL: string;
    GMAIL_PASSWORD: string;
    ACCESS_TOKEN_SECRET: string;
}

export interface IEnverionmentVariables {
    NODE_ENV: string;
    PORT: number;
    MONGO_USERNAME: string;
    MONGO_PASSWORD: string;
    MONGO_DB_NAME: string;
    MONGO_DB_NAME_DEV: string;
    MONGO_DOMAIN: string;
    GMAIL_EMAIL: string;
    GMAIL_PASSWORD: string;
    ACCESS_TOKEN_SECRET: string;
}

class CEnvironmentLoader {
    private config: IEnverionmentVariables;

    constructor() {
        const env = this.getConfig();
        this.config = this.getSanitizedConfig(env);
    }

    private getConfig(): IEnvironment {
        return {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT ? Number(process.env.PORT) : 3333,
            MONGO_USERNAME: process.env.MONGO_USERNAME,
            MONGO_PASSWORD: process.env.MONGO_PASSWORD,
            MONGO_DB_NAME: process.env.MONGO_DB_NAME,
            MONGO_DB_NAME_DEV: process.env.MONGO_DB_NAME_DEV,
            MONGO_DOMAIN: process.env.MONGO_DOMAIN,
            GMAIL_EMAIL: process.env.GMAIL_EMAIL,
            GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
            ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        };
    }

    private getSanitizedConfig(env: IEnvironment): IEnverionmentVariables {
        for (const [key, value] of Object.entries(env)) {
            if (value === undefined) {
                throw new Error(`Missing key ${key} in config.env`);
            }
        }
        return env as IEnverionmentVariables;
    }

    public get(): IEnverionmentVariables {
        return this.config;
    }
}

export default CEnvironmentLoader;
