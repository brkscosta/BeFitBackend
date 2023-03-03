namespace NodeJS {
    interface ProcessEnv {
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
}
