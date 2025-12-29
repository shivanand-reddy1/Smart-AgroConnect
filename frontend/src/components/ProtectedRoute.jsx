import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../layouts/AppLayout";
import { isTokenValid } from "../utils/auth";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const tokenOk = isTokenValid();

  if (!tokenOk) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Wrap all protected routes with AppLayout (navbar always visible)
  return <AppLayout>{children}</AppLayout>;
};

export default ProtectedRoute;
