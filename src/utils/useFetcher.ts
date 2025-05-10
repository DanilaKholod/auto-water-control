import useSWR, { SWRConfiguration } from 'swr';
import apiInstance from "@/utils/apiInstance";

const fetcherApi = (url: string) => apiInstance.get(url).then(res => res.data);

const useFetch = <dataType>(url: string | null, options?: SWRConfiguration) => {
    const { data, error = false, isLoading, mutate } = useSWR<dataType>(url, fetcherApi, options);
    return { data, error, isLoading, mutate };
};

export default useFetch;