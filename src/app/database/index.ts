import mongoose from 'mongoose';
import sanitizedConfig from '../config';

const BASE_URL = `mongodb+srv://${sanitizedConfig.MONGO_USERNAME}:${sanitizedConfig.MONGO_PASSWORD}@${sanitizedConfig.MONGO_DOMAIN}/`;

class Database {
    private url: string = '';

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
            console.log(`🟢 Mongo db connected:`, connection.connection.host);
        } catch (error) {
            const typedError = error as Error;
            console.log(typedError?.message);
        }
    }
}

export default Database;
