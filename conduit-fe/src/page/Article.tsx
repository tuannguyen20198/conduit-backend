import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axiosConfig';
import ReactMarkdown from 'react-markdown';
import { MDXEditor } from '@mdxeditor/editor';
import rehypeRaw from 'rehype-raw';
import Comment from '@/component/Comment';
// Định nghĩa kiểu cho bài viết (Article)
interface Author {
  username: string;
  image: string;
}

interface Article {
  [x: string]: any;
  title: string;
  body: string;
  createdAt: string;
  author: Author;
  favoritesCount: number;
  tagList: string[];
  slug: string;
}

const Article = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng hiện tại
  const { slug } = useParams(); // Lấy slug của bài viết từ URL
  const navigate = useNavigate(); // Sử dụng `useNavigate` thay vì `history.push`

  const [article, setArticle] = useState<Article | null>(null); // Chỉ định kiểu dữ liệu cho `article`
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi khi gọi API
  const [isFollowing, setIsFollowing] = useState(false); // Trạng thái theo dõi (Follow/Unfollow)

  // Gọi API để lấy bài viết
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${slug}`);
        setArticle(response.data.article.article); // Lưu trữ dữ liệu bài viết vào state
        setLoading(false); // Đổi trạng thái loading
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle(); // Chỉ gọi khi slug có giá trị
    }
  }, [slug]);

  // Check if the user is already following the author
  useEffect(() => {
    if (user && article) {
      setIsFollowing(article.author.username === user.username || (user.following as string[])?.includes(article.author.username));
    }
  }, [user, article]);

  // Handle follow/unfollow user
  const handleFollowToggle = async (username: string) => {
    try {
      if (isFollowing) {
        // Call handleUnfollow function if already following
        await handleUnfollow(username);
      } else {
        // Follow user
        await api.post(`/profiles/${username}/follow`);
        setIsFollowing(true); // Update local state
        alert('Followed successfully');
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  // Handle unfollow user
  const handleUnfollow = async (username: string) => {
    try {
      // Send the unfollow request
      await api.delete(`/profiles/${username}/follow`);
      setIsFollowing(false); // Update local state after unfollow
      alert('Unfollowed successfully');
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  // Handle favorite article
  const handleFavorite = async () => {
    try {
      const response = await api.post(`/articles/${slug}/favorite`);
      setArticle((prevArticle) =>
        prevArticle
          ? {
            ...prevArticle,
            favoritesCount: response.data.article.favoritesCount,
          }
          : prevArticle
      );
    } catch (err) {
      console.log(err);
    }
  };

  // Handle delete article
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        if (user && article?.author.username === user.username) {
          await api.delete(`/articles/${slug}`);
          alert('Article deleted');
          navigate('/'); // Chuyển hướng về trang chủ sau khi xóa bài viết
        } else {
          alert('You can only delete your own article');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (loading) return <div>Loading...</div>; // Hiển thị loading khi đang tải dữ liệu
  if (error) return <div>Error: {error}</div>; // Hiển thị lỗi nếu có

  if (!article) return <div>Article not found.</div>; // Nếu không có bài viết, thông báo lỗi

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <a href={`/profile/${article.author?.username}`}>
              <img src={article.author?.image || 'http://i.imgur.com/Qr71crq.jpg'} alt="author" />
            </a>
            <div className="info">
              <a href={`/profile/${article.author?.username}`} className="author">
                {article.author?.username}
              </a>
              <span className="date">{article.createdAt}</span>
            </div>

            {/* Kiểm tra nếu người dùng không phải là tác giả thì hiển thị nút Follow/Unfollow */}
            {user && user?.username !== article.author?.username && (
              <button className="btn btn-sm btn-outline-secondary" onClick={() => handleFollowToggle(article.author?.username)}>
                <i className={isFollowing ? 'ion-minus-round' : 'ion-plus-round'} />
                &nbsp; {isFollowing ? `Unfollow ${article.author?.username}` : `Follow ${article.author?.username}`}
              </button>
            )}

            {/* Hiển thị nút Favorite cho tất cả người dùng */}
            <button className="btn btn-sm btn-outline-primary" onClick={handleFavorite}>
              <i className="ion-heart" />
              &nbsp; Favorite Article <span className="counter">({article.favoritesCount})</span>
            </button>

            {/* Kiểm tra nếu người dùng là tác giả bài viết thì mới hiển thị nút Edit và Delete */}
            {user && user?.username === article.author?.username && (
              <>
                <button className="btn btn-sm btn-outline-secondary">
                  <Link to={`/editor/${article.slug}`}><i className="ion-edit"></i> Edit Article</Link>
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={handleDelete}>
                  <i className="ion-trash-a" /> Delete Article
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{article.body}</ReactMarkdown>
            <ul className="tag-list">
              {article.tagList?.map((tag) => (
                <li className="tag-default tag-pill tag-outline" key={tag}>
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
      </div>
      <Comment/>
    </div>
  );
};

export default Article;
