import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import NotFound from "@/page/NotFound";
import MainLayout from "@/layout/MainLayout";
import Spinner from "@/component/Spinner";
import SettingsPage from "@/page/SettingPage";
// import ArticleForm from "@/component/ArticleForm";
// Lazy load pages
const Home = lazy(() => import("@/page/Home"));
const Login = lazy(() => import("@/page/Login"));
const Register = lazy(() => import("@/page/Register"));
const Settings = lazy(() => import("@/page/Settings"));
const Article = lazy(() => import("@/page/Article"));
const Profile = lazy(() => import("@/page/Profile"));
const router = createBrowserRouter([
    {
        path: "/",
        element: _jsx(MainLayout, {}),
        children: [
            { index: true, element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Home, {}) }) },
            { path: "login", element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Login, {}) }) },
            { path: "register", element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Register, {}) }) },
            { path: "settings", element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(SettingsPage, {}) }) },
            { path: "editor", element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Article, {}) }) },
            // { path: "article/:slug", element: <Suspense fallback={<Spinner />}><ArticleForm /></Suspense> },
            { path: "profile/:username", element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Profile, {}) }) },
            { path: "profile/:username/favorites", element: _jsx(Suspense, { fallback: _jsx(Spinner, {}), children: _jsx(Profile, {}) }) },
        ],
    },
    { path: "*", element: _jsx(NotFound, {}) },
]);
const AppRouter = () => _jsx(RouterProvider, { router: router });
export default AppRouter;
