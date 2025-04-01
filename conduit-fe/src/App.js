import { jsx as _jsx } from "react/jsx-runtime";
import AppRouter from "@/router/route";
import ErrorBoundary from "./provider/ErrorBoundary";
const App = () => {
    return (_jsx(ErrorBoundary, { children: _jsx(AppRouter, {}) }));
};
export default App;
