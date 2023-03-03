import z from 'zod';
import ErrorHandler from './ErrorHandler';

class ZodError extends ErrorHandler {
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

export default ZodError;
