import mongoose from 'mongoose';
import CMongooseException from '../errors/CMongooseException';
import Logger from '../utils/CLogger';
import { IEnverionmentVariables } from './CEnvironmentLoader';

class CDatabaseConnection {
    private url: string;
    private logger: Logger;
    private message: string;
    private success: boolean;
    readonly BASE_URL: string;

    constructor(logger: Logger, env: IEnverionmentVariables) {
        this.BASE_URL = `mongodb+srv://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_DOMAIN}/`;

        this.logger = logger;
        this.success = true;
        this.message = '';
        mongoose.set('strictQuery', false);

        if (env.NODE_ENV === 'DEV') {
            this.url = `${this.BASE_URL}${env.MONGO_DB_NAME_DEV}?retryWrites=true&w=majority`;
        } else {
            this.url = `${this.BASE_URL}${env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
        }
    }

    /**
     * Connnect to the database
     */
    public async connect() {
        await mongoose.connect(this.url).catch((error: Error) => {
            if (error) {
                this.message = error.message;
                this.success = false;
            }
        });

        if (!this.success) {
            throw new CMongooseException(400, this.message);
        }

        this.logger.info('🟢 Mongo db connected');
    }

    /**
     * Disconnect the database
     */
    public async disconnect() {
        await mongoose.disconnect().catch((error: Error) => {
            if (error) {
                this.message = error.message;
                this.success = false;
            }
        });

        if (!this.success) {
            throw new CMongooseException(400, this.message);
        }

        this.logger.info('🔴 Mongo db disconnected');
    }
}

export default CDatabaseConnection;
