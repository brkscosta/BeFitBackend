namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        PORT: number;
        MONGO_DB_CONN_URL: string;
        GMAIL_EMAIL: string;
        MONGO_DB_NAME: string;
        GMAIL_PASSWORD: string;
        ACCESS_TOKEN_SECRET: string;
    }
}
