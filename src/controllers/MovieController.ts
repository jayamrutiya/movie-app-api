import { ILoggerService } from "../interfaces/ILoggerService";
import { IMovieService } from "../interfaces/IMovieService";
import BaseController from "./BaseController";
import * as express from "express";

export default class MovieController extends BaseController {
  private _loggerService: ILoggerService;
  private _movieService: IMovieService;

  constructor(loggerService: ILoggerService, movieService: IMovieService) {
    super();
    this._loggerService = loggerService;
    this._movieService = movieService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getMovieList(req: express.Request, res: express.Response) {
    try {
      const { page, year } = req.query;

      const getMovieList = await this._movieService.getMovieList(
        Number(year),
        Number(page)
      );

      // Return the response
      return this.sendJSONResponse(
        res,
        "Movie List",
        {
          page,
        },
        getMovieList
      );
    } catch (error) {
      return this.sendErrorResponse(req, res, error);
    }
  }
}
