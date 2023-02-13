import mongoose from 'mongoose';
import sanitizedConfig from '../config';
import ErrorHandler from '../utils/ErrorHandler';
import Logger from '../utils/Logger';

const BASE_URL = `mongodb+srv://${sanitizedConfig.MONGO_USERNAME}:${sanitizedConfig.MONGO_PASSWORD}@${sanitizedConfig.MONGO_DOMAIN}/`;

class Database {
    private url: string;
    private logger = new Logger();
    private errorHandler = new ErrorHandler();

    constructor() {
        mongoose.set('strictQuery', false);
        if (sanitizedConfig.NODE_ENV === 'DEV') {
            this.url = `${BASE_URL}${sanitizedConfig.MONGO_DB_NAME_DEV}?retryWrites=true&w=majority`;
        } else {
            this.url = `${BASE_URL}${sanitizedConfig.MONGO_DB_NAME}?retryWrites=true&w=majority`;
        }
    }

    async connect() {
        try {
            const connection = await mongoose.connect(this.url);
            this.logger.info('🟢 Mongo db connected', { ip: connection.connection.host });
        } catch (error) {
            this.errorHandler.handleError(error, '🔴 Error on connect to the mongo database');
        }
    }
}

export default Database;
