import { Response } from 'express';
import Logger from '../utils/Logger';

class ErrorHandler<T> {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    handleError(error: T, customMessage?: string, res?: Response): void {
        if (error instanceof Error) {
            this.logger.error(customMessage ? customMessage : error.message);

            res?.status(500).json({ message: error.name });
        } else {
            this.logger.error('Unknown error');
        }
    }
}

export default ErrorHandler;
