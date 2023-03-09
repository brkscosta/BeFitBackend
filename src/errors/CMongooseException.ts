import { CErrorHandlerBase } from './CErrorHandlerBase';

export class CMongooseException extends CErrorHandlerBase {
    constructor(statusCode: number, message: string) {
        super(statusCode, message);
    }
}
