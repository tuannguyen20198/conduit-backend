import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const TanstackQueryProvider = ({ children }) => {
    const queryClient = useMemo(() => new QueryClient(), []);
    return (_jsxs(QueryClientProvider, { client: queryClient, children: [children, _jsx(ReactQueryDevtools, { initialIsOpen: false })] }));
};
export default TanstackQueryProvider;
