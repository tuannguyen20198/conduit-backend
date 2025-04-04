import { useAuth } from "@/context/AuthContext";
import { ArticleFormData } from "@/interfaces/article";
import React, { useEffect, useState } from "react";
import { useTags } from "./useTags";
import {
  favoriteArticle,
  followUser,
  getArticles,
  unfavoriteArticle,
  unfollowUser,
} from "@/lib/api";
import { useNavigate } from "react-router-dom";

const useFeeds = () => {
  const [activeTab, setActiveTab] = useState<
    "your" | "global" | "tag" | "favorited" | "myArticles" | "favoritedArticles"
  >("global");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<ArticleFormData[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const articlesPerPage = 10;
  const { user: authToken } = useAuth();
  const { data: tags } = useTags();
  const pageCount = Math.max(1, Math.ceil(totalArticles / articlesPerPage));
  const navigate = useNavigate();

  // Chạy khi hash trong URL thay đổi
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && !selectedTags.includes(hash)) {
      setSelectedTags([hash]); // Chọn tag khi có hash
      setActiveTab("tag"); // Chuyển sang tab tag
    }
  }, [selectedTags]);

  // Fetch articles for the current tab, tags, and user preferences
  const fetchArticles = async () => {
    setIsLoading(true);
    const startTime = Date.now(); // Bắt đầu tính thời gian
    try {
      let author = undefined;
      let favorites = undefined;

      // Log các tham số trước khi gọi API để kiểm tra
      console.log("activeTab:", activeTab);
      console.log("user:", user);
      console.log("selectedTags:", selectedTags);
      console.log("currentPage:", currentPage);

      // Nếu đang ở tab 'your' (bài viết của những người đã follow)
      if (activeTab === "your" && user) {
        const followingUsers = user.following || [];
        if (followingUsers.length > 0) {
          // Lấy bài viết của những người đã follow
          author = followingUsers.join(",");
        } else {
          setArticles([]); // Nếu chưa follow ai thì không có bài viết
          setTotalArticles(0);
          return;
        }
      }

      // Nếu đang ở tab 'favorited' (bài viết đã yêu thích)
      if (activeTab === "favorited" && user) {
        const likedArticles = JSON.parse(
          localStorage.getItem("likedArticles") || "{}"
        );
        favorites = Object.keys(likedArticles).join(",");
      }

      // Nếu đang ở tab 'favoritedArticles' (bài viết yêu thích của người dùng)
      if (activeTab === "favoritedArticles" && user) {
        // Lấy danh sách bài viết mà người dùng đã thích
        const likedArticles = JSON.parse(
          localStorage.getItem("likedArticles") || "{}"
        );
        favorites = Object.keys(likedArticles).join(","); // Lấy danh sách slug bài viết yêu thích
      }

      // Nếu đang ở tab 'myArticles' (bài viết của chính bạn)
      if (activeTab === "myArticles" && user) {
        author = user.username; // Lấy bài viết của chính người dùng
      }

      console.log("author:", author); // Log giá trị của author

      // Gọi API với tham số đã được xác định
      const response = await getArticles({
        author, // Lấy bài viết của người đã follow (tab "your") hoặc bài viết của chính người dùng (tab "myArticles")
        tag: selectedTags.length ? selectedTags.join(",") : undefined,
        offset: (currentPage - 1) * articlesPerPage,
        limit: articlesPerPage,
        favorites, // Lấy bài viết yêu thích (chỉ ở tab "favorited")
      });

      const storedLikes = JSON.parse(
        localStorage.getItem("likedArticles") || "{}"
      );

      setArticles(
        response.articles.map(
          (article: { slug: string | number; favorited: any }) => ({
            ...article,
            favorited: storedLikes[article.slug] ?? article.favorited,
          })
        )
      );
      setTotalArticles(response.articlesCount); // Cập nhật đúng tổng số bài viết
    } catch (err) {
      setError("Failed to load articles");
    } finally {
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 500; // Thời gian tối thiểu để spinner hiển thị
      setTimeout(
        () => setIsLoading(false),
        Math.max(0, minLoadingTime - elapsedTime)
      );
    }
  };

  // Chạy khi các giá trị thay đổi (tab, tags, page)
  useEffect(() => {
    fetchArticles();
  }, [selectedTags, currentPage, activeTab]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected + 1);
  };

  const handleLike = async (
    slug: string,
    favorited: boolean,
    favoritesCount: number
  ) => {
    if (!user) {
      alert("Bạn cần đăng nhập để like bài viết!");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
    }

    const validFavoritesCount = isNaN(favoritesCount) ? 0 : favoritesCount;
    const storedLikes = JSON.parse(
      localStorage.getItem("likedArticles") || "{}"
    );
    const currentLikes = storedLikes[slug] || [];

    const updatedFavorited = !currentLikes.includes(user.username);

    const updatedFavoritesCount = updatedFavorited
      ? validFavoritesCount + 1
      : Math.max(validFavoritesCount - 1, 0);

    const updatedLikedBy = updatedFavorited
      ? [...currentLikes, user.username]
      : currentLikes.filter((username: string) => username !== user.username);

    storedLikes[slug] = updatedLikedBy;
    localStorage.setItem("likedArticles", JSON.stringify(storedLikes));

    setArticles((prev) =>
      prev.map((article) =>
        article.slug === slug
          ? {
              ...article,
              favorited: updatedFavorited,
              favoritesCount: updatedFavoritesCount,
              likedBy: updatedLikedBy,
            }
          : article
      )
    );

    try {
      if (updatedFavorited) {
        await favoriteArticle(slug);
      } else {
        await unfavoriteArticle(slug);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái yêu thích:", err);
      setArticles((prev) =>
        prev.map((article) =>
          article.slug === slug
            ? {
                ...article,
                favorited: favorited,
                favoritesCount: favorited
                  ? validFavoritesCount + 1
                  : Math.max(validFavoritesCount - 1, 0),
              }
            : article
        )
      );
    }
  };

  const handleFollow = async (username: string, following: boolean) => {
    try {
      const updatedUser = following
        ? await unfollowUser(username)
        : await followUser(username);
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article.author.username === username
            ? {
                ...article,
                author: { ...article.author, following: updatedUser.following },
              }
            : article
        )
      );
    } catch (err) {
      console.error("Error updating follow status", err);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTags([tag]);
    setActiveTab("tag"); // Chuyển sang tab tag
    window.location.hash = tag; // Cập nhật URL hash
  };

  return {
    activeTab,
    authToken,
    tags,
    setActiveTab,
    selectedTags,
    setSelectedTags,
    currentPage,
    setCurrentPage,
    articles,
    setArticles,
    totalArticles,
    setTotalArticles,
    isLoading,
    setIsLoading,
    error,
    setError,
    pageCount,
    handlePageClick,
    handleLike,
    handleFollow,
    handleTagClick,
  };
};

export default useFeeds;
