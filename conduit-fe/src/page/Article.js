import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import ArticleForm from "@/component/ArticleForm";
import useArticles from "@/hook/useArticles";
const Article = () => {
    const [apiErrors] = useState([]);
    const { onSubmitArticles } = useArticles();
    return (_jsx("div", { className: "editor-page", children: _jsx("div", { className: "container page", children: _jsx("div", { className: "row", children: _jsx("div", { className: "col-md-10 offset-md-1 col-xs-12", children: _jsx(ArticleForm, { onSubmit: onSubmitArticles, apiErrors: apiErrors }) }) }) }) }));
};
export default Article;
