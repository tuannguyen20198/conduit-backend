import { useState } from "react";
import axios from "axios";
import useArticles from "@/hook/useEditor";
import EditorForm from "@/component/ArticleForm";

const Editor = () => {
  const [apiErrors] = useState<string[]>([]);
  const {onSubmitArticles} = useArticles();

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <EditorForm onSubmit={onSubmitArticles} apiErrors={apiErrors} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
