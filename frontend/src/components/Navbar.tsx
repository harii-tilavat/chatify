import { Link, useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useModal } from "../context/ModalContext";
import Avatar from "./Avatar";
import Dropdown from "./Dropdown";

const Navbar = () => {
  const { currentUser, logout } = useAuthStore();
  const { openModal } = useModal();
  const naviagate = useNavigate();
  const navList = [
    { label: "Profile", icon: <User size={16} />, action: () => naviagate("/profile") },
    { label: "Settings", icon: <Settings size={16} />, action: () => naviagate("/settings") },
    { label: "Logout", icon: <LogOut size={16} />, action: handleLogout },
  ];
  function handleLogout() {
    openModal({
      title: "Logout?",
      description: "Are you sure you want to log out?",
      onConfirm: logout,
    });
  }
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatify</h1>
              {/* <pre>{JSON.stringify(currentUser)}</pre> */}
            </Link>
          </div>

          {!currentUser && (
            <div className="flex items-center gap-2">
              <Link to={"/settings"} className={`btn btn-sm gap-2 transition-colors`}>
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </div>
          )}

          {currentUser && (
            <Dropdown label="Options" items={navList}>
              <Avatar user={currentUser} />
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
