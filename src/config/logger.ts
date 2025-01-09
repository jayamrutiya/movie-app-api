// Load logging library
import morgan from 'morgan';
import { injectable } from 'inversify';
import winston, { createLogger, format, transports } from 'winston';

import ENV from './env';
import { ILoggerService } from '../interfaces/ILoggerService';

const { combine, timestamp, printf } = format;

// eslint-disable-next-line @typescript-eslint/no-shadow
const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

// instantiate a new Winston logger with the settings defined above
@injectable()
export class LoggerService implements ILoggerService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _logger: any;

    constructor() {
        // define the custom settings for each transport(file, console)
        const options = {
            file_error: {
                level: 'error',
                filename: `${ENV.APP_ROOT}/logs/error.log`,
                handleExceptions: true,
                json: true,
                maxsize: 5242880, // 5 MB
                maxFiles: 5,
                colorize: false,
                format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
            },
            file_combined: {
                filename: `${ENV.APP_ROOT}/logs/combined.log`,
                handleExceptions: true,
                json: true,
                maxsize: 5242880, // 5 MB
                maxFiles: 5,
                colorize: false,
                format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
            },
            console: {
                level: 'debug',
                handleExceptions: true,
                json: false,
                colorize: true,
                format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
            },
        };

        this._logger = createLogger({
            transports: [new transports.File(options.file_error), new transports.File(options.file_combined)],
            exitOnError: false, // do not exit on handled exceptions
        });

        // add console logs only if not in production environment
        if (ENV.NODE_ENV !== 'production') {
            this._logger.add(new transports.Console(options.console));
        }
    }

    getLogger(): winston.Logger {
        return this._logger;
    }
}

// create a stream object with a 'write' function that will be used by 'morgan'
// Configure morgan
const morganOption = {
    stream: {
        write: (message: string) => new LoggerService().getLogger().info(message.trim()),
    },
};

// export configured morgan
export const morganLogger = morgan('combined', morganOption);
