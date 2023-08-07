import mongoose from 'mongoose';
import MongooseException from '../errors/MongooseException';
import { ILogger } from '../utils/Logger';
import { IEnverionmentVariables } from './EnvironmentLoader';

export interface IDatabaseConnection {
    /**
     * Connnect to the database
     */
    connect(): Promise<void>;
    /**
     * Disconnect the database
     */
    disconnect(): Promise<void>;
}

export default class DatabaseConnection implements IDatabaseConnection {
    private readonly url: string;
    private logger: ILogger;
    private dbName: string;

    constructor(logger: ILogger, env: IEnverionmentVariables) {
        this.logger = logger;
        this.url = env.MONGO_DB_CONN_URL;
        this.dbName = env.MONGO_DB_NAME;

        mongoose.set('strictQuery', true);

        mongoose.connection.on('error', (error: Error) => {
            if (error) {
                throw new MongooseException(400, error.message);
            }
        });
    }

    public async connect() {
        await mongoose.connect(this.url, { dbName: this.dbName });

        this.logger.info('🟢 Mongo db connected');
    }

    public async disconnect() {
        await mongoose.disconnect();

        this.logger.info('🔴 Mongo db disconnected');
    }
}
