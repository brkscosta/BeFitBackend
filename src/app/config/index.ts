import dotenv from 'dotenv';
import path from 'path';

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface IEnverionment {
    NODE_ENV: string;
    PORT: number;
    MONGO_USERNAME: string;
    MONGO_PASSWORD: string;
    MONGO_DB_NAME: string;
    MONGO_DB_NAME_DEV: string;
    MONGO_DOMAIN: string;
    SEND_GRID_API_KEY: string | undefined;
    SECRET_HASH_TOKEN: string | undefined;
}

interface IConfig {
    NODE_ENV: string;
    PORT: number;
    MONGO_USERNAME: string;
    MONGO_PASSWORD: string;
    MONGO_DB_NAME: string;
    MONGO_DB_NAME_DEV: string;
    MONGO_DOMAIN: string;
    SEND_GRID_API_KEY: string | undefined;
    SECRET_HASH_TOKEN: string | undefined;
}

// Loading process.env as ENV interface

const getConfig = (): IEnverionment => {
    return {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT ? Number(process.env.PORT) : 3333,
        MONGO_USERNAME: process.env.MONGO_USERNAME,
        MONGO_PASSWORD: process.env.MONGO_PASSWORD,
        MONGO_DB_NAME: process.env.MONGO_DB_NAME,
        MONGO_DB_NAME_DEV: process.env.MONGO_DB_NAME_DEV,
        MONGO_DOMAIN: process.env.MONGO_DOMAIN,
        SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
        SECRET_HASH_TOKEN: process.env.SECRET_HASH_TOKEN,
    };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: IEnverionment): IConfig => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in config.env`);
        }
    }
    return config as IConfig;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
