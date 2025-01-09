import appRoot from "app-root-path";
import dotenv from "dotenv";

dotenv.config({ path: `${appRoot}/.env` });

export default {
  NODE_ENV: process.env.NODE_ENV,
  APP_ROOT: appRoot.path,
  PORT: process.env.PORT,

  API_ROOT: `${process.env.API_ROOT}/v${process.env.VERSION}`,

  DATABASE_URL: process.env.DATABASE_URL,

  TMDB_URL: process.env.TMDB_URL ?? "https://api.themoviedb.org/3",

  API_KEY: process.env.API_KEY!,
};
