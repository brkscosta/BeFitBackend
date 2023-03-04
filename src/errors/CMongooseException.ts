import CErrorHandlerBase from './CErrorHandlerBase';

class CMongooseException extends CErrorHandlerBase {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}

export default CMongooseException;
