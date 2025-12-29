import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Weather from "./pages/Weather";
import PestDetection from "./pages/PestDetection";
import Chatbot from "./pages/Chatbot";
import MarketPrices from "./pages/MarketPrices";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import Marketplace from "./pages/Marketplace";
import Forum from "./pages/Forum";
import KnowledgeHub from "./pages/KnowledgeHub";
import Profile from "./pages/Profile";
import FertilizerAlerts from "./pages/FertilizerAlerts";
import { Toaster } from "react-hot-toast";
import { isTokenValid } from "./utils/auth";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  const isAuthenticated = () => isTokenValid();

  return (
    <LanguageProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes - No Navbar */}
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthLayout>
                  <Login />
                </AuthLayout>
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <AuthLayout>
                  <Register />
                </AuthLayout>
              )
            }
          />

          {/* Protected Routes - Navbar Always Visible */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weather"
            element={
              <ProtectedRoute>
                <Weather />
              </ProtectedRoute>
            }
          />
          <Route
            path="/market-prices"
            element={
              <ProtectedRoute>
                <MarketPrices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schemes"
            element={
              <ProtectedRoute>
                <GovernmentSchemes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forum"
            element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/knowledge-hub"
            element={
              <ProtectedRoute>
                <KnowledgeHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pest-detection"
            element={
              <ProtectedRoute>
                <PestDetection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fertilizer-alerts"
            element={
              <ProtectedRoute>
                <FertilizerAlerts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated() ? "/dashboard" : "/login"}
                replace
              />
            }
          />

          {/* Catch all - redirect to dashboard or login */}
          <Route
            path="*"
            element={
              <Navigate
                to={isAuthenticated() ? "/dashboard" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
