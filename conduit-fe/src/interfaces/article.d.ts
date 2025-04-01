export interface ArticleFormData {
  slug: string;
  title: string;
  description: string;
  createdAt: string;
  author: Author;
  favorited: boolean;
  favoritesCount: number;
  tagList: string[];
  likedBy: string[];
}

export interface AritcleProps {
  article?: { title: string; description: string };
  register: any;
  handleSubmit: any;
  onSubmit: any;
  tags: string[];
  setTags: any;
  mutation: any;
  errors: any;
  errorMessages: string[];
}

export interface ArticleFormProps {
  onSubmit: (data: any) => void;
  apiErrors: string[];
}

interface FormTagsProps {
  onTagsChange: (tags: string[]) => void;
  setError: UseFormSetError<any>; // Nhận setError từ React Hook Form
  clearErrors: (name: string) => void;
}
