import Spinner from "@/component/Spinner";
import { useAuth } from "@/context/AuthContext";
import useFeeds from "@/hook/useFeeds";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  
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

  const articlesPerPage = 10;

  // If no user, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Fetch articles when tab changes
  useEffect(() => {
    // Ensure that when the tab changes, the page is reset to 1
  }, [activeTab]);

  const handleTabClick = (tab: 'myArticles' | 'favoritedArticles') => {
    const mappedTab = tab === 'favoritedArticles' ? 'favorited' : tab;
    setActiveTab(mappedTab); // Update active tab
  };

  function handleLike(slug: any, favorited: any, favoritesCount: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="profile-header">
                <img
                  src={user?.image || "http://i.imgur.com/Qr71crq.jpg"}
                  className="user-img"
                  alt="User Image"
                />
                <div className="user-details">
                  <h4>{user?.username}</h4>
                  <p>{user?.bio || "This user hasn't written a bio yet."}</p>
                  <div className="action-buttons">
                    <button className="btn btn-sm hover:btn-outline-primary hover:text-white action-btn">
                      <i className="ion-plus-round"></i> Follow {user?.username}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary action-btn">
                      <Link to="/settings" ><i className="ion-gear-a"></i> Edit Profile Settings</Link>
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

            {articles.map((article: any) => (
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
                  <button 
                    className="btn btn-outline-primary btn-sm pull-xs-right" 
                    onClick={() => handleLike(article.slug, article.favorited, article.favoritesCount)}
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
            ))}

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
