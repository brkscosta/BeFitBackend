import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

class CLogger {
    private logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
            transports: [
                new DailyRotateFile({
                    level: 'info',
                    dirname: process.platform === 'win32' ? '/Repos/BeFit/BeFitBackend/logs' : '~/logs',
                    filename: 'application-%DATE%.log',
                    datePattern: 'DD-MM-YYYY',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                }),
            ],
        });

        if (process.env.NODE_ENV !== 'production') {
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

export default CLogger;
