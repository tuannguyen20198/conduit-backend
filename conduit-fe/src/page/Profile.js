import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Spinner from "@/component/Spinner";
import { useAuth } from "@/context/AuthContext";
import useFeeds from "@/hook/useFeeds";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Link, Navigate } from "react-router-dom";
const Profile = () => {
    const { user } = useAuth();
    const { activeTab, setActiveTab, articles, isLoading, error, currentPage, pageCount, handlePageClick, } = useFeeds(); // Using the updated useFeeds hook
    const articlesPerPage = 10;
    // If no user, redirect to login page
    if (!user) {
        return _jsx(Navigate, { to: "/login" });
    }
    // Fetch articles when tab changes
    useEffect(() => {
        // Ensure that when the tab changes, the page is reset to 1
    }, [activeTab]);
    const handleTabClick = (tab) => {
        const mappedTab = tab === 'favoritedArticles' ? 'favorited' : tab;
        setActiveTab(mappedTab); // Update active tab
    };
    function handleLike(slug, favorited, favoritesCount) {
        throw new Error("Function not implemented.");
    }
    return (_jsxs("div", { className: "profile-page", children: [_jsx("div", { className: "user-info", children: _jsx("div", { className: "container", children: _jsx("div", { className: "row", children: _jsx("div", { className: "col-xs-12 col-md-10 offset-md-1", children: _jsxs("div", { className: "profile-header", children: [_jsx("img", { src: user?.image || "http://i.imgur.com/Qr71crq.jpg", className: "user-img", alt: "User Image" }), _jsxs("div", { className: "user-details", children: [_jsx("h4", { children: user?.username }), _jsx("p", { children: user?.bio || "This user hasn't written a bio yet." }), _jsxs("div", { className: "action-buttons", children: [_jsxs("button", { className: "btn btn-sm hover:btn-outline-primary hover:text-white action-btn", children: [_jsx("i", { className: "ion-plus-round" }), " Follow ", user?.username] }), _jsx("button", { className: "btn btn-sm btn-outline-secondary action-btn", children: _jsxs(Link, { to: "/settings", children: [_jsx("i", { className: "ion-gear-a" }), " Edit Profile Settings"] }) })] })] })] }) }) }) }) }), _jsx("div", { className: "container", children: _jsx("div", { className: "row", children: _jsxs("div", { className: "col-xs-12 col-md-10 offset-md-1", children: [_jsx("div", { className: "articles-toggle", children: _jsxs("ul", { className: "nav nav-pills outline-active", children: [_jsx("li", { className: "nav-item", children: _jsx("a", { className: `nav-link ${activeTab === 'myArticles' ? 'active' : ''}`, onClick: () => handleTabClick('myArticles'), href: "#", children: "My Articles" }) }), _jsx("li", { className: "nav-item", children: _jsx("a", { className: `nav-link ${activeTab === 'favoritedArticles' ? 'active' : ''}`, onClick: () => handleTabClick('favoritedArticles'), href: "#", children: "Favorited Articles" }) })] }) }), isLoading && _jsx(Spinner, {}), error && _jsx("div", { children: error }), articles.map((article) => (_jsxs("div", { className: "article-preview", children: [_jsxs("div", { className: "article-meta", children: [_jsx("a", { href: `/profile/${article.author.username}`, children: _jsx("img", { src: article.author.image || "http://i.imgur.com/Qr71crq.jpg", alt: article.author.username }) }), _jsxs("div", { className: "info", children: [_jsx("a", { href: `/profile/${article.author.username}`, className: "author", children: article.author.username }), _jsx("span", { className: "date", children: article.createdAt })] }), _jsxs("button", { className: "btn btn-outline-primary btn-sm pull-xs-right", onClick: () => handleLike(article.slug, article.favorited, article.favoritesCount), children: [_jsx("i", { className: "ion-heart" }), " ", article.favoritesCount] })] }), _jsxs("a", { href: `/article/${article.slug}`, className: "preview-link", children: [_jsx("h1", { children: article.title }), _jsx("p", { children: article.description }), _jsx("span", { children: "Read more..." }), _jsx("ul", { className: "tag-list", children: article.tagList.map((tag) => (_jsx("li", { className: "tag-default tag-pill tag-outline", children: tag }, tag))) })] })] }, article.slug))), !isLoading && (_jsx(ReactPaginate, { previousLabel: "←", nextLabel: "→", breakLabel: "...", pageCount: pageCount, marginPagesDisplayed: 1, pageRangeDisplayed: 2, onPageChange: handlePageClick, forcePage: currentPage - 1, containerClassName: "pagination", pageClassName: "page-item", pageLinkClassName: "page-link", previousClassName: "page-item", nextClassName: "page-item", previousLinkClassName: "hidden", nextLinkClassName: "hidden", activeClassName: "active", disabledClassName: "disabled" }))] }) }) })] }));
};
export default Profile;
