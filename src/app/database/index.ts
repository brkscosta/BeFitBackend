import mongoose from 'mongoose';
import Logger from '../utils/Logger';
import MongooseErrorWrapper from '../utils/MongooseError';

const BASE_URL = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DOMAIN}/`;

class Database {
    private url: string;
    private logger = new Logger();
    private message: string;
    private success: boolean;

    constructor() {
        this.success = true;
        this.message = '';
        mongoose.set('strictQuery', false);
        if (process.env.NODE_ENV === 'DEV') {
            this.url = `${BASE_URL}${process.env.MONGO_DB_NAME_DEV}?retryWrites=true&w=majority`;
        } else {
            this.url = `${BASE_URL}${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
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
            throw new MongooseErrorWrapper(400, this.message);
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
            throw new MongooseErrorWrapper(400, this.message);
        }

        this.logger.info('🔴 Mongo db disconnected');
    }
}

export default Database;
