import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useFeeds from "@/hook/useFeeds";
import Spinner from "./Spinner";

const Feed: React.FC = () => {
  const {
    authToken,
    activeTab,
    setActiveTab,
    selectedTags,
    setSelectedTags,
    setCurrentPage,
    articles,
    isLoading,
    setIsLoading,
    error,
    pageCount,
    handlePageClick,
    handleLike,
    tags,
    currentPage,
  } = useFeeds();

  useEffect(() => {
    // Khi selectedTags thay đổi, chuyển tab sang "tag"
    if (selectedTags.length > 0) {
      setActiveTab("tag");
    }
  }, [selectedTags]); // Chạy mỗi khi selectedTags thay đổi

  return (
    <div className="container page">
      <div className="row">
        <div className="col-md-9">
          <div className="feed-toggle">
            <ul className="nav nav-pills outline-active">
              {authToken && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "your" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("your");
                      setSelectedTags([]);  // Reset selected tags when switching to 'Your Feed'
                      setCurrentPage(1);
                    }}
                  >
                    Your Feed
                  </button>
                </li>
              )}
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "global" ? "active" : ""}`}
                  onClick={() => {
                    setActiveTab("global");
                    setSelectedTags([]);  // Reset selected tags when switching to 'Global Feed'
                    setCurrentPage(1);
                  }}
                >
                  Global Feed
                </button>
              </li>

              {/* Hiển thị tab cho tag đã chọn */}
              {selectedTags.length > 0 && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === "tag" ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab("tag");
                      setCurrentPage(1);
                    }}
                  >
                    #{selectedTags[0]} {/* Hiển thị tên tag đã chọn */}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Hiển thị loading spinner khi đang tải */}
          {isLoading && (
            <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
              <Spinner />
            </div>
          )}

          {!isLoading && error && <p className="error-message">{error}</p>}
          {!isLoading && articles.length === 0 && <p>No articles found.</p>}

          {!isLoading &&
            articles.map((article) => (
              <div key={article.slug} className="article-preview">
                <div className="article-meta d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Link to={`/profile/${article.author.username}`}>
                      <img src={article.author.image} alt={article.author.username} />
                    </Link>
                    <div className="info">
                      <p className="author">
                        {article.author.username}
                      </p>
                      <span className="date">{new Date(article.createdAt).toDateString()}</span>
                    </div>
                    <button
                      className={`btn btn-sm border-0 shadow-none pull-xs-right focus:ring-0 outline-none ${
                        article.favorited ? "btn-primary" : "btn-outline-primary"
                      }`}
                      onClick={() => handleLike(article.slug, article.favorited, article.favoritesCount)}
                    >
                      <i className="ion-heart"></i> {article.favoritesCount}
                    </button>
                  </div>
                </div>
                <Link to={`/article/${article.slug}`} className="preview-link">
                  <h1>{article.title}</h1>
                  <p>{article.description}</p>
                  <span>Read more...</span>
                  <ul className="tag-list">
                    {article.tagList.map((tag, index) => (
                      <li key={index} className="tag-default tag-pill tag-outline">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Link>
              </div>
            ))}
        </div>
        <div className="col-md-3 order-md-last cursor-pointer">
          <Sidebar
            tags={tags || []}
            selectedTags={selectedTags}
            setSelectedTags={(tags: string[]) => {
              setIsLoading(true);  // Hiển thị spinner ngay lập tức
              setSelectedTags(tags); // Khi chọn tag, cập nhật selectedTags
              setCurrentPage(1);  // Reset lại trang
            }}
          />
        </div>
      </div>

      {!isLoading && (
        <ReactPaginate
          previousLabel={"←"}
          nextLabel={"→"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
          onPageChange={handlePageClick}
          forcePage={currentPage - 1} // ✅ Giúp ReactPaginate cập nhật ngay lập tức
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
  );
};

export default Feed;
