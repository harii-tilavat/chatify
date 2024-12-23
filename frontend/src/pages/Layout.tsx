import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
// import { Loader } from "lucide-react";
// import Footer from "../components/Footer";
const Layout = () => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <main>
      <Navbar />
      <div className="main-content">
        <div className="main-container h-screen">
          <Outlet />
        </div>
      </div>
      {/* <Footer /> */}
    </main>
  );
};

export default Layout;
