import { Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
import Layout from "../pages/Layout";
// import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SettingsPage from "../pages/SettingPage";
import HomePage from "../pages/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
