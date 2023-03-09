import { CErrorHandlerBase } from './CErrorHandlerBase';

export class CEmailException extends CErrorHandlerBase {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}
