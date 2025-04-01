import Header from "@/component/Header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <Header />
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="container mx-auto p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center p-4 mt-12">
        <p>© 2025 RealWorld Clone</p>
      </footer>
    </div>
  );
};

export default MainLayout;
