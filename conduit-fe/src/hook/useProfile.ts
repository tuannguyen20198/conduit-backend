import { useQuery } from "@tanstack/react-query";
import { getProfile, getArticles } from "@/lib/api"; // API calls
import { ArticleFormData } from "@/interfaces/article";

// Định nghĩa kiểu dữ liệu của Profile

// Hook lấy dữ liệu Profile và bài viết của người dùng
const useProfile = (username: string) => {
  // Fetch thông tin người dùng
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery<ProfileData>({
    queryKey: ["profile", username],
    queryFn: () => getProfile(username), // Hàm API lấy thông tin người dùng
    retry: 3, // Cố gắng lại 3 lần nếu có lỗi
    staleTime: 1000 * 60 * 5, // Dữ liệu sẽ tươi mới trong 5 phút
  });

  // Fetch bài viết của người dùng
  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    error: articlesError,
  } = useQuery<ArticleData>({
    queryKey: ["articles", username],
    queryFn: () =>
      getArticles({
        author: username, // Chỉ lấy bài viết của tác giả có username là tham số
        limit: 10, // Giới hạn số lượng bài viết, bạn có thể thay đổi
      }),
    enabled: !!profileData, // Chỉ fetch bài viết khi profile đã được tải xong
    retry: 3, // Cố gắng lại 3 lần nếu có lỗi
    staleTime: 1000 * 60 * 5, // Dữ liệu sẽ tươi mới trong 5 phút
  });

  const isLoading = isProfileLoading || isArticlesLoading;
  const error = profileError || articlesError;

  return {
    profileData,
    articlesData,
    isLoading,
    error,
  };
};

export default useProfile;
