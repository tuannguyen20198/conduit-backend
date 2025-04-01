import { useAuth } from "@/context/AuthContext";
import { createArticle } from "@/lib/api";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const useArticles = (refreshArticles?: () => void) => {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ tags: string[] }>({
    mode: "onSubmit",
    defaultValues: { tags: [] }, // ✅ Đảm bảo `tags` là array từ đầu
  });

  const [apiErrors, setApiErrors] = useState<string[]>([]); // Lưu lỗi từ API
  const [tags, setTags] = useState<string[]>([]); // State lưu tags
  const navigate = useNavigate();
  const { user } = useAuth();
  const methods = useForm();
  const [submittedContent, setSubmittedContent] = useState("");

  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags); // ✅ Cập nhật `tags` vào form
    if (tags.length > 0) clearErrors("tags"); // ✅ Xóa lỗi nếu có
  };

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;

    newPage;

    // ✅ Đảm bảo fetch lại dữ liệu ngay lập tức khi page thay đổi
    createArticle(newPage);
  };
  const onSubmit = async (data: any) => {
    console.log("🚀 Dữ liệu form trước khi gửi:", data);

    if (!data.tags || data.tags.length === 0) {
      methods.setError("tags", {
        type: "required",
        message: "Tags is required",
      });
      return;
    }

    console.log("✅ Final Payload:", data);
    setSubmittedContent(data.markdown); // Hiển thị markdown sau khi submit
  };

  const onSubmitArticles = async (data: any) => {
    try {
      await createArticle(data);
      alert("Bài viết đã được đăng");

      // ✅ Cập nhật lại danh sách bài viết mà không reload
      refreshArticles?.();

      // ✅ Điều hướng về trang chủ mà không refresh
      navigate("/", { replace: true });
    } catch (err: any) {
      setApiErrors([err.message || "Đã xảy ra lỗi!"]);
    }
  };
  return {
    register,
    handleSubmit,
    onSubmit,
    user,
    onSubmitArticles,
    handlePageClick,
    errors,
    apiErrors,
    setApiErrors,
    tags,
    setTags,
    handleTagsChange,
    methods,
  };
};

export default useArticles;
