import { FormProvider, useForm } from "react-hook-form";
import FormInput from "./FormInput";
import FormTags from "./FormTags";
import SubmitButton from "./SubmitButton";
import useArticles from "@/hook/useArticles";

const ArticleForm = ({ onSubmit, apiErrors }: any) => {
  const {methods, handleSubmit, handleTagsChange, errors} = useArticles();

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {apiErrors.length > 0 && (
          <ul className="error-messages">
            {apiErrors.map((err: any, index: number) => (
              <li key={index} className="text-danger">{err}</li>
            ))}
          </ul>
        )}

        <FormInput name="title" placeholder="Article Title" />
        <FormInput name="description" placeholder="What's this article about?" />

        <FormInput name="body" placeholder="Write your article" type="markdown" />


        <fieldset className="form-group">
          <FormTags onTagsChange={handleTagsChange} setError={methods.setError} clearErrors={methods.clearErrors} />
          {errors.tags && <p className="text-danger">{String(errors.tags.message)}</p>}
        </fieldset>

        <SubmitButton label="Publish Article" />
      </form>
    </FormProvider>
  );
};

export default ArticleForm;
