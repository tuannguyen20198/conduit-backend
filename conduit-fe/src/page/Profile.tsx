import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import useFeeds from "@/hook/useFeeds";
import useProfile from "@/hook/useProfile";
import Spinner from "@/component/Spinner";
import ReactPaginate from "react-paginate";
import FollowButton from "@/component/FollowButton";

const Profile = () => {
  const { user } = useAuth(); // Current authenticated user
  const {
    activeTab,
    setActiveTab,
    articles,
    isLoading,
    error,
    currentPage,
    pageCount,
    handlePageClick,
  } = useFeeds(); // Using the updated useFeeds hook
  const { username } = useParams(); // Lấy username từ URL
  const { profileData, articlesData } = useProfile(username!);


  const articlesPerPage = 10;

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Set default tab to "myArticles" when the component loads for the first time
  useEffect(() => {
    if (!activeTab) {
      setActiveTab('myArticles'); // Set "myArticles" as the default active tab
    }
  }, [activeTab, setActiveTab]);

  // Ensure active tab is "myArticles" when visiting a specific user's profile
  useEffect(() => {
    if (username) {
      setActiveTab('myArticles'); // Set "myArticles" as the active tab when visiting any user's profile page
    }
  }, [username, setActiveTab]);

  // Handle tab click and change active tab
  const handleTabClick = (tab: 'myArticles' | 'favoritedArticles') => {
    setActiveTab(tab); // Update active tab
  };

  // Filter articles by favorites count (only for 'favoritedArticles')
  const filteredArticles = articles.filter((article: any) => {
    if (activeTab === 'favoritedArticles') {
      return article.favoritesCount >= 1; // Only show articles with at least 1 like
    }
    return true; // For 'myArticles', show all
  });

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="profile-header">
                <img
                  src={profileData?.image || "http://i.imgur.com/Qr71crq.jpg"}
                  className="user-img"
                  alt="User Image"
                />
                <div className="user-details">
                  <h4>{profileData?.username}</h4>
                  <p>{profileData?.bio || "This user hasn't written a bio yet."}</p>
                  <div className="action-buttons" style={{ display: 'flex', gap: '8px',justifyContent: 'center' }}>
                    {/* Nút Follow (nếu không phải là chính mình) */}
                    {profileData?.username !== user?.username && (
                      <FollowButton profileUsername={profileData?.username || ""} />
                    )}

                    {/* Nút chỉnh sửa thông tin */}
                    <button className="btn btn-sm btn-outline-secondary action-btn">
                      <Link to="/settings"><i className="ion-gear-a"></i> Edit Profile Settings</Link>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'myArticles' ? 'active' : ''}`}
                    onClick={() => handleTabClick('myArticles')}
                    href="#"
                  >
                    My Articles
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link ${activeTab === 'favoritedArticles' ? 'active' : ''}`}
                    onClick={() => handleTabClick('favoritedArticles')}
                    href="#"
                  >
                    Favorited Articles
                  </a>
                </li>
              </ul>
            </div>

            {isLoading && <Spinner />}
            {error && <div>{error}</div>}

            {/* If there are no articles */}
            {filteredArticles.length === 0 ? (
              <div className="no-articles">
                <h4>No articles to display.</h4>
              </div>
            ) : (
              filteredArticles.map((article: any) => (
                <div className="article-preview" key={article.slug}>
                  <div className="article-meta">
                    <a href={`/profile/${article.author.username}`}>
                      <img src={article.author.image || "http://i.imgur.com/Qr71crq.jpg"} alt={article.author.username} />
                    </a>
                    <div className="info">
                      <a href={`/profile/${article.author.username}`} className="author">
                        {article.author.username}
                      </a>
                      <span className="date">{article.createdAt}</span>
                    </div>
                    {/* Disable like button in "My Articles" tab */}
                    <button
                      className="btn btn-outline-primary btn-sm pull-xs-right"
                      disabled={activeTab === 'myArticles'} // Disable if it's "My Articles" tab
                    >
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>
                  <a href={`/article/${article.slug}`} className="preview-link">
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    <span>Read more...</span>
                    <ul className="tag-list">
                      {article.tagList.map((tag: string) => (
                        <li className="tag-default tag-pill tag-outline" key={tag}>{tag}</li>
                      ))}
                    </ul>
                  </a>
                </div>
              ))
            )}

            {!isLoading && (
              <ReactPaginate
                previousLabel={"←"}
                nextLabel={"→"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                forcePage={currentPage - 1}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                nextClassName="page-item"
                previousLinkClassName="hidden"
                nextLinkClassName="hidden"
                activeClassName="active"
                disabledClassName="disabled"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
