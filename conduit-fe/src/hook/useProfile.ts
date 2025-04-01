import { useQuery } from "@tanstack/react-query";
import { getProfile, getArticles } from "@/lib/api"; // API calls
import { ArticleFormData } from "@/interfaces/article";

// Định nghĩa kiểu dữ liệu của Profile
interface ProfileData {
  username: string;
  bio: string;
  image: string;
}

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

  const isLoading = isProfileLoading;
  const error = profileError;

  return {
    profileData,
    isLoading,
    error,
  };
};

export default useProfile;
