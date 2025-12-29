import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

// Layout for all authenticated pages (navbar always visible)
const AppLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-bg-dark">
      <Navbar />
      <main className="min-h-screen">{children}</main>
    </div>
  );
};

export default AppLayout;
