import express from "express";
import { iocContainer as Container } from "../config/container";
import { TYPES } from "../config/types";
import { ILoggerService } from "../interfaces/ILoggerService";
import { IMovieService } from "../interfaces/IMovieService";
import MovieController from "../controllers/MovieController";

const router = express.Router();
const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);
const movieService = Container.get<IMovieService>(TYPES.MovieService);
const movieController = new MovieController(loggerService, movieService);

router.get("/", (req, res) => movieController.getMovieList(req, res));

export default router;
