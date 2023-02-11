namespace NodeJS {
    interface ProcessEnv {
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
}
