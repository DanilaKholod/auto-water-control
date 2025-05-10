import {useCallback, useContext} from 'react';
import {QueryFunctionContext, useMutation, useQuery, useQueryClient} from 'react-query';
import noop from 'lodash-es/noop';
//import { REQUEST_ERROR } from '@/hooks/useAPI/Templates';
import {
  callbackParams,
  QueryKey,
  ReturnedCallback,
  UseAPIProps,
  UseAPIReturn,
  useQueryFetcherParams,
} from '@/utils/useAPI/Types';
import {serverApiInstance} from "@/utils/useAPI/serverApiInstance";
import {useSession} from "next-auth/react";
import {ApiContext} from "@/utils/NotificationProvider";
import {REQUEST_ERROR, REQUEST_SUCCESS} from "@/utils/useAPI/Templates";

export default function useAPI<T = any>({
  APIController,
  isCallback = false,
  APIMethod,
  requestMethod = 'get',
  errorTemplate = REQUEST_ERROR,
  successTemplate = REQUEST_SUCCESS,
  requestBody,
  authRequired=true,
  requestQueryParams,
}: UseAPIProps): UseAPIReturn<T> {
  const url = `${APIController}/${APIMethod}`;
  const providerApi = useContext(ApiContext)
  const { data: session }:any = useSession();

  const queryClient = useQueryClient();

  const api = useContext(ApiContext)

  const fetchAPI = useCallback(
    async ({ requestBody, requestQueryParams, requestMethod }: useQueryFetcherParams) => {
        // console.log('requestBody', requestBody);
        // console.log('requestQueryParams', requestQueryParams);
        // console.log('requestMethod', requestMethod);
        // console.log('url', url);

        try {
            const response = await serverApiInstance<T>({
                data: requestBody,
                method: requestMethod,
                params: requestQueryParams,
                url: url,
                accessToken:session?.accessToken
        });
            api?.success(successTemplate);
            return response
      } catch (err: any) {
            api?.error(errorTemplate)
            //TODO Добавить вызов уведомления об ошибке через notification
            //console.log(errorTemplate);
            console.log('Возникла ошибка при запросе на бэкенд!')
            throw new Error(err.message);
      }
    },
    [session, url]
  );

  const queryFetcher = useCallback(
    async ({ queryKey }: QueryFunctionContext<[string, useQueryFetcherParams]>) => {
      const [, { requestBody, requestQueryParams, requestMethod }] = queryKey;
      return await fetchAPI({ requestBody, requestQueryParams, requestMethod });
    },
    [fetchAPI]
  );

  const mutationFetcher = useCallback(
    async ({ requestBody, requestQueryParams }: callbackParams) => {
      const response = await fetchAPI({ requestBody, requestQueryParams, requestMethod });

      return { response, requestQueryParams, requestMethod };
    },
    [fetchAPI, requestMethod]
  );

  const { isLoading, error, data, refetch } = useQuery<T, Error, T, QueryKey>({
    queryKey: [url, { requestBody, requestQueryParams, requestMethod }],
    queryFn: queryFetcher,
    enabled: !isCallback && (authRequired == false || (authRequired == true && session !== undefined))

  });

  const { mutateAsync } = useMutation({
    mutationFn: mutationFetcher,

    onSuccess: ({ requestQueryParams, requestMethod }) => {
      queryClient
        .invalidateQueries({
          queryKey: [url, { requestBody, requestQueryParams, requestMethod }],
        })
        .catch(noop);
    },
  });

  const callback = useCallback<ReturnedCallback>(
    async (callbackParams) => {
        if(authRequired==false || (authRequired==true && session!=undefined)){
            const requestBody=callbackParams?.requestBody
            const requestQueryParams=callbackParams?.requestQueryParams
            try {
                const { response } = await mutateAsync({ requestBody, requestQueryParams });
                api?.success( successTemplate)
                return response
            }
            catch(err: any) {
                api?.error(errorTemplate)
            }
        }
        return new Promise(noop);
    },
    [authRequired, mutateAsync, session]
  );

  return [{ data, isLoading, error: error ? error : undefined, refetch }, callback];
}
