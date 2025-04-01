import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Feed from "@/component/Feed";
const Home = () => {
    return (_jsxs("div", { className: "home-page", children: [_jsx("div", { className: "banner", children: _jsxs("div", { className: "container", children: [_jsx("h1", { className: "logo-font", children: "conduit" }), _jsx("p", { children: "A place to share your knowledge." })] }) }), _jsx(Feed, {})] }));
};
export default Home;
