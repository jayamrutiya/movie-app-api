import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IAxiosService {
  GET(
    url: string,
    config: AxiosRequestConfig<any> | undefined
  ): Promise<AxiosResponse<any, any>>;
}
