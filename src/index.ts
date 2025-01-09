import app from "./config/express";
import ENV from "./config/env";
import { iocContainer as Container } from "./config/container";
import { ILoggerService } from "./interfaces/ILoggerService";
import { TYPES } from "./config/types";

app.listen(ENV.PORT, () => {
  const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
  loggerService
    .getLogger()
    .info(`⚡️[server]: Server is running at http://localhost:${ENV.PORT}`);
  loggerService
    .getLogger()
    .info(`⚡️[server]: API ROOT: http://localhost:${ENV.PORT}${ENV.API_ROOT}`);
});
