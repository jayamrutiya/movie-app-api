import { Container } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { ILoggerService } from "../interfaces/ILoggerService";
import { EmployeeService } from "../services/EmployeeService";
import { LoggerService } from "./logger";
import { TYPES } from "./types";
import { IAxiosService } from "../interfaces/IAxiosService";
import { AxiosService } from "./axios";
import { IMovieService } from "../interfaces/IMovieService";
import { MovieService } from "../services/MovieService";

const iocContainer = new Container();

// make inversify aware of inversify-binding-decorat    ors
iocContainer.load(buildProviderModule());

// services
iocContainer.bind<ILoggerService>(TYPES.LoggerService).to(LoggerService);
iocContainer.bind<IAxiosService>(TYPES.AxiosService).to(AxiosService);
iocContainer.bind<IMovieService>(TYPES.MovieService).to(MovieService);

// Repository

export { iocContainer };
