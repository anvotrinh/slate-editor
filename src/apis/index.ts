import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { nonce } from '../utils/const';
import { BaseApiResponse, ApiRequestConfig } from './types';

axios.interceptors.request.use(
  (config: AxiosRequestConfig): AxiosRequestConfig => {
    if (!config.method || config.method.toUpperCase() !== 'POST') return config;
    if (config.data instanceof FormData) {
      config.data.append('nonce', nonce);
    }
    return config;
  }
);
// Any status codes that falls outside the range of 2xx, automatically-serialized to
// normal BaseApiResponse with ok = false and error, to make error field available for
// any case.
axios.interceptors.response.use(
  (response: AxiosResponse<BaseApiResponse>): BaseApiResponse => response.data,
  (error: AxiosError): Promise<BaseApiResponse> => {
    return Promise.resolve({
      ok: false,
      error: error.message,
    });
  }
);

type RequestConfig = ApiRequestConfig & AxiosRequestConfig;
export function axiosRequest<T>(config: RequestConfig): Promise<T> {
  const { abortSignal, ...axiosConfig } = config;
  // add abortSignal from thunk to axios, so when abort thunk, axios
  // request also abort.
  if (abortSignal) {
    const source = axios.CancelToken.source();
    abortSignal.addEventListener('abort', () => source.cancel());
    axiosConfig.cancelToken = source.token;
  }
  return axios.request(axiosConfig);
}
export function axiosGet<T>(url: string, config?: RequestConfig): Promise<T> {
  return axiosRequest({
    url,
    method: 'GET',
    ...config,
  });
}
export function axiosPost<T>(
  url: string,
  data: FormData,
  config?: RequestConfig
): Promise<T> {
  return axiosRequest({
    url,
    method: 'POST',
    data,
    ...config,
  });
}

export * from './types';
export * from './image';
export * from './post';
export * from './embed';
export * from './object';
export * from './series';
export * from './topic';
export * from './tag';
