import React from "react";

// Layout for Login and Register pages (no navbar)
const AuthLayout = ({ children }) => {
  return <div className="min-h-screen">{children}</div>;
};

export default AuthLayout;
