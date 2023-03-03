import ErrorHandler from './ErrorHandler';

class MongooseErrorWrapper extends ErrorHandler {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}

export default MongooseErrorWrapper;
