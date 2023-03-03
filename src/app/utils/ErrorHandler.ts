import { Error as MongooseError } from 'mongoose';

class ErrorHandler extends MongooseError {
    statusCode: number;
    composedErrorMessage: { [composedErrorMessage: string]: string };

    constructor(statusCode: number, menssage: string) {
        super(menssage);
        this.statusCode = statusCode;
        this.composedErrorMessage = {};
    }
}

export default ErrorHandler;
