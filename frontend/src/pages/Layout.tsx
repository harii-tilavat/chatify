import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
const Layout = () => {
  return (
    <main>
      <Navbar />
      <div className="main-content">
        <Outlet />
      </div>
      {/* <Footer /> */}
    </main>
  );
};

export default Layout;
