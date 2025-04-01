import { jsx as _jsx } from "react/jsx-runtime";
const Spinner = () => {
    return (_jsx("div", { className: "flex items-center justify-center h-screen", children: _jsx("div", { className: "w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" }) }));
};
export default Spinner;
