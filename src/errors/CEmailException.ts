import CErrorHandlerBase from './CErrorHandlerBase';

class CEmailException extends CErrorHandlerBase {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}

export default CEmailException;
