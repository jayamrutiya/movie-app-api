import winston from 'winston';

export interface ILoggerService {
    getLogger(): winston.Logger;
}
