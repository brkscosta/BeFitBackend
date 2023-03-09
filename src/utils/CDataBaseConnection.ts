import mongoose from 'mongoose';
import { CMongooseException } from '../errors/CMongooseException';
import { CLogger } from '../utils/CLogger';
import { IEnverionmentVariables } from './CEnvironmentLoader';

export class CDatabaseConnection {
    private readonly url: string;
    private logger: CLogger;

    constructor(logger: CLogger, env: IEnverionmentVariables) {
        this.logger = logger;
        this.url = env.MONGO_DB_CONN_URL;

        mongoose.set('strictQuery', true);

        mongoose.connection.on('error', (error: Error) => {
            if (error) {
                throw new CMongooseException(400, error.message);
            }
        });
    }

    /**
     * Connnect to the database
     */
    public async connect() {
        await mongoose.connect(this.url);

        this.logger.info('🟢 Mongo db connected');
    }

    /**
     * Disconnect the database
     */
    public async disconnect() {
        await mongoose.disconnect();

        this.logger.info('🔴 Mongo db disconnected');
    }
}
