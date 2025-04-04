import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import NotFound from "@/page/NotFound";
import MainLayout from "@/layout/MainLayout";
import Spinner from "@/component/Spinner";
import SettingsPage from "@/page/SettingPage";
import Editor from "@/page/Editor";
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
    element: <MainLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Spinner />}><Home /></Suspense> },
      { path: "login", element: <Suspense fallback={<Spinner />}><Login /></Suspense> },
      { path: "register", element: <Suspense fallback={<Spinner />}><Register /></Suspense> },
      { path: "settings", element: <Suspense fallback={<Spinner />}><SettingsPage /></Suspense> },
      { path: "editor", element: <Suspense fallback={<Spinner />}><Editor /></Suspense> },
      { path: "editor/:slug", element: <Suspense fallback={<Spinner />}><Editor /></Suspense> },
      { path: "article/:slug", element: <Suspense fallback={<Spinner />}><Article /></Suspense> },
      { path: "profile/:username", element: <Suspense fallback={<Spinner />}><Profile /></Suspense> },
      { path: "profile/:username/favorites", element: <Suspense fallback={<Spinner />}><Profile /></Suspense> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
