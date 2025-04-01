import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/lib/api"; // API calls
// Hook lấy dữ liệu Profile và bài viết của người dùng
const useProfile = (username) => {
    // Fetch thông tin người dùng
    const { data: profileData, isLoading: isProfileLoading, error: profileError, } = useQuery({
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
