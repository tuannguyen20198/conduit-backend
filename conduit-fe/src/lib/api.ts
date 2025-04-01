import api from "./axiosConfig";

const handleAPIError = (error: any) => {
  if (error.response) {
    throw new Error(
      error.response.data.errors
        ? JSON.stringify(error.response.data.errors)
        : "API Error"
    );
  } else {
    throw new Error(error.message);
  }
};

// ✅ Đăng ký (Register)
export const registerUser = async (user: {
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const { data } = await api.post("/users", { user });
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Đăng nhập (Login)
export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const { data } = await api.post("/users/login", { user });
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Lấy thông tin người dùng hiện tại
export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/user");
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Cập nhật thông tin người dùng
export const updateUser = async (
  userData: Partial<{
    email: string;
    username: string;
    bio: string;
    image: string;
  }>
) => {
  try {
    const { data } = await api.put("/user", { user: userData });

    if (!data?.user) throw new Error("Invalid API response"); // Kiểm tra API có trả về user không

    return data;
  } catch (error) {
    handleAPIError(error);
    throw error; // Thêm throw để đảm bảo lỗi bị bắt
  }
};

// ✅ Lấy danh sách bài viết
export const getArticles = async (params: any) => {
  const url = params.feed ? "/feed" : `/articles`;

  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
};

// ✅ Lấy thông tin bài viết theo slug
export const getArticle = async (slug: string) => {
  try {
    const { data } = await api.get(`/articles/${slug}`);
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

// ✅ Các API khác (theo dõi user, thêm bài viết, xóa bài viết, v.v.) vẫn giữ nguyên...
export const getTags = async () => {
  try {
    const { data } = await api.get("/tags");
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

export const getArticleBySlug = async (slug: string) => {
  try {
    const { data } = await api.get(`/articles/${slug}`);
    return data;
  } catch (error) {
    handleAPIError(error);
  }
};

export const createArticle = async (data: any) => {
  console.log("Payload gửi lên API:", data);

  try {
    const response = await api.post("/articles", {
      article: {
        title: data.title,
        description: data.description,
        body: data.body,
        tagList: data.tags || [],
      },
    });

    console.log("Response từ server:", response.data);

    if (response.status === 200) {
      alert("Article published successfully!");
    }
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const followUser = async (username: string) => {
  const response = await api.post(`/profiles/${username}/follow`);
  return response.data;
};

export const unfollowUser = async (username: string) => {
  const response = await api.delete(`/profiles/${username}/follow`);
  return response.data;
};

export const favoriteArticle = async (slug: string) => {
  const response = await api.post(`/articles/${slug}/favorite`);
  return response.data;
};

export const unfavoriteArticle = async (slug: string) => {
  const response = await api.delete(`/articles/${slug}/favorite`);
  return response.data;
};
export const getMe = async () => {
  try {
    const { data } = await api.get("/user");
    return data.user; // API trả về { user: { id, email, username, ... } }
  } catch (error) {
    throw error;
  }
};

export const getProfile = async (username: string) => {
  try {
    const { data } = await api.get(`/profiles/${username}`); // API trả về { profile: { id, email, username, ... } }
    return data.profile;
  } catch (error) {
    throw error;
  }
};
