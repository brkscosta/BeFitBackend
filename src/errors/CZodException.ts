import z from 'zod';
import { CErrorHandlerBase } from './CErrorHandlerBase';

export class CZodException extends CErrorHandlerBase {
    constructor(statusCode: number, zodError: z.ZodIssue[]) {
        super(statusCode, 'Zod Error');
        this.composedErrorMessage = this.getErrorsMessages(zodError);
        this.statusCode = statusCode;
    }

    private getErrorsMessages(zodError: z.ZodIssue[]): { [composedErrorMessage: string]: string } {
        const errorMessages: { [composedErrorMessage: string]: string } = {};

        zodError.forEach((issue) => {
            errorMessages[issue.path[0]] = issue.message;
        });

        return errorMessages;
    }
}
