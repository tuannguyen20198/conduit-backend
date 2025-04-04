import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // Dùng AuthContext để lấy thông tin người dùng
import axios from "axios"; // Dùng axios để gọi API

const FollowButton = ({ profileUsername }: { profileUsername: string }) => {
  const { user } = useAuth(); // Lấy người dùng hiện tại từ AuthContext
  const [isFollowing, setIsFollowing] = useState(false); // Trạng thái follow của người dùng
  const [loading, setLoading] = useState(false); // Trạng thái loading khi gửi yêu cầu
  const [error, setError] = useState<string | null>(null); // Lỗi khi gọi API

  // Lấy trạng thái follow từ localStorage khi component mount
  useEffect(() => {
    const storedFollowState = localStorage.getItem(`follow_${profileUsername}`);
    if (storedFollowState === 'true') {
      setIsFollowing(true);
    } else {
      setIsFollowing(false);
    }
  }, [profileUsername]);

  // Hàm follow/unfollow
  const handleFollow = async () => {
    if (!user) {
      return; // Nếu không có user, không thể follow
    }

    setLoading(true);
    setError(null);

    try {
      // Nếu người dùng chưa follow, gửi yêu cầu follow
      if (!isFollowing) {
        await axios.post(`http://localhost:3000/api/profiles/${profileUsername}/follow`, {}, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Đảm bảo bạn truyền token người dùng
          },
        });

        setIsFollowing(true); // Cập nhật trạng thái follow
        localStorage.setItem(`follow_${profileUsername}`, 'true'); // Lưu trạng thái vào localStorage
      } else {
        // Nếu đã follow, gửi yêu cầu unfollow
        await axios.delete(`http://localhost:3000/api/profiles/${profileUsername}/follow`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setIsFollowing(false); // Cập nhật trạng thái unfollow
        localStorage.setItem(`follow_${profileUsername}`, 'false'); // Lưu trạng thái vào localStorage
      }
    } catch (err) {
      console.error("Follow API error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn btn-sm ${isFollowing ? 'btn-outline-secondary' : 'btn-primary'}`}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? (
        <span>Loading...</span>
      ) : isFollowing ? (
        <span>Unfollow</span>
      ) : (
        <span>Follow</span>
      )}
    </button>
  );
};

export default FollowButton;
