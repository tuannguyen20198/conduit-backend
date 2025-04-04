import { useAuth } from "@/context/AuthContext";
import { createArticle, getArticleBySlug, updateArticle } from "@/lib/api";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const useEditor = (refreshArticles?: () => void) => {
  const { articleId } = useParams(); // Lấy articleId nếu có
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ tags: string[]; title: string; description: string }>({
    mode: "onSubmit",
    defaultValues: { tags: [] },
  });
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags); // Cập nhật tags vào form
    if (tags.length > 0) clearErrors("tags");
  };

  const onSubmitArticles = async (data: any) => {
    if (!data.tags || data.tags.length === 0) {
      setError("tags", { type: "required", message: "Tags is required" });
      return;
    }

    if (articleId) {
      // Nếu có articleId thì gọi hàm update
      await updateArticle(articleId, data);
    } else {
      // Nếu không có articleId thì gọi hàm create
      await createArticle(data);
    }
  };

  const updateArticle = async (articleId: string, data: any) => {
    try {
      await updateArticle(articleId, data);
      alert("Bài viết đã được cập nhật");
      refreshArticles?.();
      navigate("/", { replace: true });
    } catch (err: any) {
      setApiErrors([err.message || "Đã xảy ra lỗi khi cập nhật bài viết!"]);
    }
  };

  // Load bài viết khi có articleId
  useEffect(() => {
    if (articleId) {
      const fetchArticleData = async () => {
        const articleData = await getArticleBySlug(articleId);
        setValue("title", articleData.title);
        setValue("description", articleData.description);
        setValue("tags", articleData.tagList || []);
      };

      fetchArticleData();
    }
  }, [articleId, setValue]);

  return {
    register,
    handleSubmit,
    onSubmitArticles,
    user,
    apiErrors,
    tags,
    setTags,
    handleTagsChange,
    errors,
  };
};

export default useEditor;
