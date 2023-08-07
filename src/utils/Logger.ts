import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { IEnverionmentVariables } from './EnvironmentLoader';

export interface ILogger {
    info: (message: string, meta?: Record<string, unknown>) => void;

    warn: (message: string, meta?: Record<string, unknown>) => void;

    error: (message: string, meta?: Record<string, unknown>) => void;
}

export default class Logger implements ILogger {
    private logger;
    private environmentLoader: IEnverionmentVariables;

    constructor(environmentLoader: IEnverionmentVariables) {
        this.environmentLoader = environmentLoader;
        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
            transports: [
                new DailyRotateFile({
                    level: 'info',
                    dirname: 'logs',
                    filename: 'befit-%DATE%.log',
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        });

        if (this.environmentLoader.NODE_ENV !== 'PROD') {
            this.logger.add(
                new transports.Console({
                    format: format.simple(),
                })
            );
        }
    }

    public info(message: string, meta?: Record<string, unknown>): void {
        this.logger.info(message, meta);
    }

    public warn(message: string, meta?: Record<string, unknown>): void {
        this.logger.warn(message, meta);
    }

    public error(message: string, meta?: Record<string, unknown>): void {
        this.logger.error(message, meta);
    }
}
