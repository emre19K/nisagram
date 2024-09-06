import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./pages/HomePage";
import Profile from "./pages/ProfilePage";
import CreatePost from "./pages/CreatePostPage";
import Navbar from "./components/navigation/Navbar";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import VerificationComplete from "./pages/VerificationCompletePage";
import "./index.css";
import Settings from "./pages/SettingsPage";
import { getLoginCookie } from "./util/LoginCookie";
import ForbiddenPage from "./pages/ForbiddenPage";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPasswort from "./pages/ResetPasswordPage";
import { AlertProvider } from "./util/CustomAlert";
import SearchBarPage from "./pages/SearchBarPage";

function AppContent() {
  return (
    <AlertProvider>
      <Router>
        <App />
      </Router>
    </AlertProvider>
  );
}

// Middleware component to check for token
function AuthMiddleware({ children }) {
  const token = getLoginCookie();

  const publicRoutes = [
    "/accounts/login",
    "/accounts/register",
    "/user/verify",
    "/forbidden",
    "/",
    "/forgotpassword",
    "/settings"
  ];

  if (!token && !publicRoutes.includes(window.location.pathname)) {
    return <Navigate to="/forbidden" />;
  }

  return children;
}

function App() {
  const location = useLocation();
  const token = getLoginCookie();

  const hideNavBarRoutes = [
    "/accounts/login",
    "/accounts/register",
    "/user/verify",
    "/forbidden",
    "/forgotpassword",
    "/resetpassword"
  ];

  return (
    <div>
      {token && !hideNavBarRoutes.includes(location.pathname) && <Navbar />}
      <div
        className={
          !hideNavBarRoutes.includes(location.pathname) ? "content" : ""
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <AuthMiddleware>
                <Home />
              </AuthMiddleware>
            }
          />
          <Route
            path="/profile/:_id"
            element={
              <AuthMiddleware>
                <Profile />
              </AuthMiddleware>
            }
          />
          <Route path="/accounts/register" element={<Register />} />
          <Route path="/accounts/login" element={<Login />} />
          <Route
            path="/posts/create"
            element={
              <AuthMiddleware>
                <CreatePost />
              </AuthMiddleware>
            }
          />
          <Route path="/user/verify" element={<VerificationComplete />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPasswort />} />
          <Route path="/search" element={<SearchBarPage/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default AppContent;
