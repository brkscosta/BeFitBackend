import ErrorHandlerBase from './ErrorHandlerBase';

class EmailException extends ErrorHandlerBase {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}

export default EmailException;
