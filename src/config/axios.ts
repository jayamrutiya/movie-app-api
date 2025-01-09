import { injectable } from "inversify";
import { IAxiosService } from "../interfaces/IAxiosService";
import { InternalServerError } from "../errors/InternalServerError";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

@injectable()
export class AxiosService implements IAxiosService {
  async GET(
    url: string,
    config: AxiosRequestConfig<any> | undefined
  ): Promise<AxiosResponse<any, any>> {
    try {
      const response = await axios.get(url, config);

      return response;
    } catch (error) {
      throw new InternalServerError(
        `Something went wrong in Axios GET service ${error}`
      );
    }
  }
}
