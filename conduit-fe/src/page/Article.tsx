import { useState } from "react";
import axios from "axios";
import ArticleForm from "@/component/ArticleForm";
import api from "@/lib/axiosConfig";
import { createArticle } from "@/lib/api";
import useArticles from "@/hook/useArticles";

const Article = () => {
  const [apiErrors] = useState<string[]>([]);
  const {onSubmitArticles} = useArticles();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ArticleForm onSubmit={onSubmitArticles} apiErrors={apiErrors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Article;
