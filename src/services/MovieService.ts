import { inject, injectable } from "inversify";
import { IMovieService } from "../interfaces/IMovieService";
import { IAxiosService } from "../interfaces/IAxiosService";
import { TYPES } from "../config/types";
import { ILoggerService } from "../interfaces/ILoggerService";
import env from "../config/env";

@injectable()
export class MovieService implements IMovieService {
  private _loggerService: ILoggerService;
  private _axiosService: IAxiosService;

  constructor(
    @inject(TYPES.AxiosService) axiosService: IAxiosService,
    @inject(TYPES.LoggerService) loggerService: ILoggerService
  ) {
    this._axiosService = axiosService;
    this._loggerService = loggerService;
    this._loggerService.getLogger().info(`Creating: ${this.constructor.name}`);
  }

  async getMovieList(year: number = 2025, page: number = 1): Promise<any> {
    const url = `${env.TMDB_URL}/discover/movie?api_key=${env.API_KEY}&include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&year=${year}`;
    const config = {
      headers: { accept: "application/json" },
    };
    const getMovies = await this._axiosService.GET(url, config);

    const response: any = [];

    for (const movie of getMovies.data.results) {
      let getMovieCredit;
      try {
        getMovieCredit = await this.getMovieCredit(movie.id, env.API_KEY);
      } catch (error) {
        response.push({
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: [],
        });
      }
      if (!(getMovieCredit instanceof Error)) {
        const filterEditor = getMovieCredit.crew
          .filter((d) => d.known_for_department === "Editing")
          .map((editor) => editor.name);

        response.push({
          title: movie.title,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          editors: [...filterEditor],
        });
      }
    }

    return response;
  }

  async getMovieCredit(movieId: number, apiKey: string): Promise<any> {
    const url = `${env.TMDB_URL}/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;
    const config = {
      headers: { accept: "application/json" },
    };
    const response = await this._axiosService.GET(url, config);
    return response.data;
  }
}
