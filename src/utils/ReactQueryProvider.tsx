"use client";
import { QueryClient, QueryClientProvider } from 'react-query';
import {useMemo} from "react";

const ReactQueryProvider = ({ children }: any) => {
    const queryClient = useMemo(() => new QueryClient(), []);
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
};

export default ReactQueryProvider;