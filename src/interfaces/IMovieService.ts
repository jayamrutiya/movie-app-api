export interface IMovieService {
  getMovieList(year: number, page: number): Promise<any>;

  getMovieCredit(movieId: number, token: string): Promise<any>;
}
