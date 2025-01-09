import { TYPES } from "../../config/types";
import { iocContainer as Container } from "../../config/container";
import { ILoggerService } from "../../interfaces/ILoggerService";
import { IAxiosService } from "../../interfaces/IAxiosService";
import { Mock } from "ts-mockery";
import { MovieService } from "../MovieService";
import { InternalServerError } from "../../errors/InternalServerError";

describe("Movie Service", () => {
  const loggerService = Container.get<ILoggerService>(TYPES.LoggerService);

  const axiosGetMock = {
    data: {
      results: [
        {
          id: 1,
          title: "joker",
          release_date: "2025-02-02",
          vote_average: 8.2,
        },
      ],
    },
  };

  const axiosService: IAxiosService = Mock.of<IAxiosService>({
    GET: jest.fn().mockResolvedValue(axiosGetMock),
  });

  const movieService = new MovieService(axiosService, loggerService);
  let mockUrl;
  let mockConfig;
  beforeAll(() => {
    console.log("Do database connection.");
    mockUrl =
      "https://api.themoviedb.org/3/discover/movie?api_key=74c4cb10f4a5f059375e1664c63d246b&include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&year=2025";
    mockConfig = {
      headers: { accept: "application/json" },
    };
  });

  afterAll((done) => {
    console.log("Database disconnect.");
    done();
  });

  describe("getMovieList", () => {
    it("should fetch and return a list of movies with editors", async () => {
      const mockCredits = {
        crew: [
          { name: "Editor 1", known_for_department: "Editing" },
          { name: "Sound Designer", known_for_department: "Sound" },
        ],
      };

      jest.spyOn(movieService, "getMovieCredit").mockResolvedValue(mockCredits);
      const movieList = await movieService.getMovieList(2025, 1);
      expect(axiosService.GET).toBeCalledWith(mockUrl, mockConfig);
      expect(movieList).toEqual([
        {
          title: "joker",
          release_date: "2025-02-02",
          vote_average: 8.2,
          editors: ["Editor 1"],
        },
      ]);
    });

    it("should fetch and return a list of movies with no editors", async () => {
      const mockCredits = {
        crew: [
          { name: "Editor 1", known_for_department: "Sound" },
          { name: "Sound Designer", known_for_department: "Sound" },
        ],
      };

      jest.spyOn(movieService, "getMovieCredit").mockResolvedValue(mockCredits);
      const movieList = await movieService.getMovieList(2025, 1);
      expect(axiosService.GET).toBeCalledWith(mockUrl, mockConfig);
      expect(movieList).toEqual([
        {
          title: "joker",
          release_date: "2025-02-02",
          vote_average: 8.2,
          editors: [],
        },
      ]);
    });

    it("should fetch and return a list of movies with editors if credit api fail", async () => {
      jest
        .spyOn(movieService, "getMovieCredit")
        .mockResolvedValue(new InternalServerError("Something went wrong"));
      const movieList = await movieService.getMovieList(2025, 1);
      expect(axiosService.GET).toBeCalledWith(mockUrl, mockConfig);
      expect(movieList).toEqual([]);
    });
  });

  describe("getMovieCredit", () => {
    const mockAxiosService = Mock.of<IAxiosService>({
      GET: jest.fn(),
    });

    const movieService = new MovieService(mockAxiosService, loggerService);

    it("should return movie credits when GET is successful", async () => {
      // Mock response for the GET call
      const mockResponse: any = {
        data: {
          crew: [
            { name: "Editor 1", known_for_department: "Editing" },
            { name: "Sound Designer", known_for_department: "Sound" },
          ],
        },
      };

      // Mock GET method implementation
      jest.spyOn(mockAxiosService, "GET").mockResolvedValue(mockResponse);

      // Function parameters
      const movieId = 1;
      const apiKey = "mockApiKey";

      // Expected URL and config
      const expectedUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;
      const expectedConfig = {
        headers: { accept: "application/json" },
      };

      // Call the function
      const credits = await movieService.getMovieCredit(movieId, apiKey);

      // Assertions
      expect(mockAxiosService.GET).toBeCalledWith(expectedUrl, expectedConfig);
      expect(credits).toEqual(mockResponse.data);
    });

    it("should throw an error if GET request fails", async () => {
      // Mock GET method to reject
      jest
        .spyOn(mockAxiosService, "GET")
        .mockRejectedValue(new Error("Network Error"));

      const movieId = 1;
      const apiKey = "mockApiKey";

      // Expect the function to throw
      await expect(
        movieService.getMovieCredit(movieId, apiKey)
      ).rejects.toThrow("Network Error");

      // Verify that the GET method was called
      const expectedUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;
      const expectedConfig = {
        headers: { accept: "application/json" },
      };
      expect(mockAxiosService.GET).toBeCalledWith(expectedUrl, expectedConfig);
    });
  });
});
