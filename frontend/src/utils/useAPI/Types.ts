import type { ArgsProps } from 'antd/es/notification/interface';

type RequestMethod = 'post' | 'put' | 'patch' | 'delete' | 'get';

export interface UseAPIProps {
  APIController: string;
  APIMethod: string;
  isCallback?: boolean;
  requestMethod?: RequestMethod;
  errorTemplate?: ArgsProps;
  successTemplate?: ArgsProps;
  requestBody?: object;
  requestQueryParams?: object;
  authRequired?:boolean;
}

export interface useQueryFetcherParams {
  requestBody?: object;
  requestQueryParams?: object;
  requestMethod: RequestMethod;
}

export interface callbackParams {
  requestBody?: object;
  requestQueryParams?: object;
}

export type QueryKey = [string, useQueryFetcherParams];

export type ReturnedCallback = (callbackParams?: callbackParams) => Promise<any>;

type State<T> = {
  data?: T;
  isLoading: boolean;
  error?: Error;
  refetch: () => void;
};

export type UseAPIReturn<T> = [State<T>, ReturnedCallback];

export interface serverApiInstanceProps{
  data?:object,
  method:string,
  params?:object,
  url:string;
  accessToken?:string;
}
