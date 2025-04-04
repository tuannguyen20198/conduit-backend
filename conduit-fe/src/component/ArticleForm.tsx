import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "./FormInput";
import FormTags from "./FormTags";
import { getArticleBySlug, createArticle, updateArticle } from "@/lib/api"; // Hàm gọi API lấy bài viết theo slug và cập nhật bài viết

const EditorForm = ({ onSubmit, apiErrors }: any) => {
  const { slug } = useParams(); // Lấy slug từ URL
  const methods = useForm({ mode: "onChange" });
  const { handleSubmit, setValue, formState: { errors } } = methods;
  const [loading, setLoading] = useState(true);
  const [articleData, setArticleData] = useState<any>(null);

  // Hàm cập nhật tags
  const handleTagsChange = (tags: string[]) => {
    setValue("tags", tags); // Cập nhật tags trong form
  };

  // Khi slug thay đổi, gọi API để lấy dữ liệu bài viết hoặc chuẩn bị để tạo bài viết mới
  useEffect(() => {
    const fetchArticle = async () => {
      if (slug) {
        try {
          const data = await getArticleBySlug(slug); // Gọi API lấy dữ liệu bài viết
          setArticleData(data);
          setLoading(false);

          // Cập nhật các trường trong form với dữ liệu bài viết
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("body", data.body);
          setValue("tags", data.tagList || []); // Cập nhật tags từ tagList
        } catch (error) {
          console.error("Failed to load article", error);
          setLoading(false);
        }
      } else {
        setLoading(false); // Không có slug thì không cần gọi API, chỉ cần form trống để tạo mới
      }
    };

    fetchArticle();
  }, [slug, setValue]);

  // Nếu đang tải dữ liệu thì hiển thị loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Hàm xử lý submit form
  const handleFormSubmit = async (data: any) => {
    if (slug) {
      // Nếu có slug, gọi API để cập nhật bài viết
      try {
        const updatedArticle = await updateArticle(slug, data);
        console.log("Article updated successfully", updatedArticle);
      } catch (error) {
        console.error("Error updating article", error);
      }
    } else {
      // Nếu không có slug, gọi API để tạo bài viết mới
      try {
        const newArticle = await createArticle(data);
        console.log("Article created successfully", newArticle);
      } catch (error) {
        console.error("Error creating article", error);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="form-group mb-3">
          <FormInput name="title" placeholder="Article Title" type="text" />
        </div>

        <div className="form-group mb-3">
          <FormInput name="description" placeholder="What's this article about?" type="text" />
        </div>

        <div className="form-group mb-3">
          <FormInput name="body" placeholder="Write your article" type="markdown" />
        </div>

        <div className="form-group mb-3">
          <fieldset className="form-group">
            <FormTags
              onTagsChange={handleTagsChange}
              setError={methods.setError}
              clearErrors={methods.clearErrors}
              defaultTags={articleData?.tagList || []} // Truyền tags nếu có từ bài viết
            />
            {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
          </fieldset>
        </div>

        <button className="btn btn-primary" type="submit">
          {slug ? "Update Article" : "Create Article"} {/* Hiển thị nút khác nhau cho tạo mới và cập nhật */}
        </button>
      </form>
    </FormProvider>
  );
};

export default EditorForm;
