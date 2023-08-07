import ErrorHandlerBase from './ErrorHandlerBase';

class MongooseException extends ErrorHandlerBase {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}

export default MongooseException;
