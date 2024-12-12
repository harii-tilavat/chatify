import React from "react";
import { BaseProps } from "../utils/types";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute: React.FC<BaseProps> = ({ children }) => {
  const { currentUser } = useAuthStore();
  return currentUser ? children : <Navigate to={"/login"} />;
};

export default ProtectedRoute;
