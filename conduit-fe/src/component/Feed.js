import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import useFeeds from "@/hook/useFeeds";
import Spinner from "./Spinner";
const Feed = () => {
    const { authToken, activeTab, setActiveTab, selectedTags, setSelectedTags, setCurrentPage, articles, isLoading, setIsLoading, error, pageCount, handlePageClick, handleLike, tags, currentPage, } = useFeeds();
    useEffect(() => {
        // Khi selectedTags thay đổi, chuyển tab sang "tag"
        if (selectedTags.length > 0) {
            setActiveTab("tag");
        }
    }, [selectedTags]); // Chạy mỗi khi selectedTags thay đổi
    return (_jsxs("div", { className: "container page", children: [_jsxs("div", { className: "row", children: [_jsxs("div", { className: "col-md-9", children: [_jsx("div", { className: "feed-toggle", children: _jsxs("ul", { className: "nav nav-pills outline-active", children: [authToken && (_jsx("li", { className: "nav-item", children: _jsx("button", { className: `nav-link ${activeTab === "your" ? "active" : ""}`, onClick: () => {
                                                    setActiveTab("your");
                                                    setSelectedTags([]); // Reset selected tags when switching to 'Your Feed'
                                                    setCurrentPage(1);
                                                }, children: "Your Feed" }) })), _jsx("li", { className: "nav-item", children: _jsx("button", { className: `nav-link ${activeTab === "global" ? "active" : ""}`, onClick: () => {
                                                    setActiveTab("global");
                                                    setSelectedTags([]); // Reset selected tags when switching to 'Global Feed'
                                                    setCurrentPage(1);
                                                }, children: "Global Feed" }) }), selectedTags.length > 0 && (_jsx("li", { className: "nav-item", children: _jsxs("button", { className: `nav-link ${activeTab === "tag" ? "active" : ""}`, onClick: () => {
                                                    setActiveTab("tag");
                                                    setCurrentPage(1);
                                                }, children: ["#", selectedTags[0], " "] }) }))] }) }), isLoading && (_jsx("div", { className: "fixed inset-0 flex justify-center items-center bg-opacity-75 z-50", children: _jsx(Spinner, {}) })), !isLoading && error && _jsx("p", { className: "error-message", children: error }), !isLoading && articles.length === 0 && _jsx("p", { children: "No articles found." }), !isLoading &&
                                articles.map((article) => (_jsxs("div", { className: "article-preview", children: [_jsx("div", { className: "article-meta d-flex justify-content-between align-items-center", children: _jsxs("div", { className: "d-flex align-items-center", children: [_jsx(Link, { to: `/profile/${article.author.username}`, children: _jsx("img", { src: article.author.image, alt: article.author.username }) }), _jsxs("div", { className: "info", children: [_jsx(Link, { to: `/profile/${article.author.username}`, className: "author", children: article.author.username }), _jsx("span", { className: "date", children: new Date(article.createdAt).toDateString() })] }), _jsxs("button", { className: `btn btn-sm border-0 shadow-none pull-xs-right focus:ring-0 outline-none ${article.favorited ? "btn-primary" : "btn-outline-primary"}`, onClick: () => handleLike(article.slug, article.favorited, article.favoritesCount), children: [_jsx("i", { className: "ion-heart" }), " ", article.favoritesCount] })] }) }), _jsxs(Link, { to: `/article/${article.slug}`, className: "preview-link", children: [_jsx("h1", { children: article.title }), _jsx("p", { children: article.description }), _jsx("span", { children: "Read more..." }), _jsx("ul", { className: "tag-list", children: article.tagList.map((tag, index) => (_jsx("li", { className: "tag-default tag-pill tag-outline", children: tag }, index))) })] })] }, article.slug)))] }), _jsx("div", { className: "col-md-3 order-md-last cursor-pointer", children: _jsx(Sidebar, { tags: tags || [], selectedTags: selectedTags, setSelectedTags: (tags) => {
                                setIsLoading(true); // Hiển thị spinner ngay lập tức
                                setSelectedTags(tags); // Khi chọn tag, cập nhật selectedTags
                                setCurrentPage(1); // Reset lại trang
                            } }) })] }), !isLoading && (_jsx(ReactPaginate, { previousLabel: "←", nextLabel: "→", breakLabel: "...", pageCount: pageCount, marginPagesDisplayed: 1, pageRangeDisplayed: 2, onPageChange: handlePageClick, forcePage: currentPage - 1, containerClassName: "pagination", pageClassName: "page-item", pageLinkClassName: "page-link", previousClassName: "page-item", nextClassName: "page-item", previousLinkClassName: "hidden", nextLinkClassName: "hidden", activeClassName: "active", disabledClassName: "disabled" }))] }));
};
export default Feed;
