import { Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import ClubDetailWrapper from "./pages/communityDetail/ClubDetailWrapper";
import ExploreWrapper from "./pages/explore/ExploreWrapper";
import Home from "./pages/Home";
import { LoginPage } from "./pages/login/LoginPage";
import { SignupPage } from "./pages/signup/SignupPage";
import { AppProvider, useApp } from "./contexts/AppContext";
import { MyPage } from "./pages/mypage/MyPage";
import { MyPageWrapper } from "./pages/mypage/MyPageWrapper";
import { MyMeetingsWrapper } from "./pages/mypage/MyMeetingsWrapper";

function AppRoutes() {
  const navigate = useNavigate();
  const { handleLogin } = useApp();

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={
          <LoginPage 
            onClose={() => navigate("/")}
            onSignupClick={() => navigate("/signup")}
            onLoginSuccess={(userData, token) => {
              handleLogin(userData, token);
              navigate("/");
            }}
          />
        }
      />

      <Route path="/explore" element={<ExploreWrapper />} />

      <Route path="/club/:id" element={<ClubDetailWrapper />} />
      <Route path="/community/:id" element={<ClubDetailWrapper />} />

      <Route
        path="/signup"
        element={
          <SignupPage
            onClose={() => navigate("/")}
            onLoginClick={() => navigate("/login")}
          />
        }
      />

      <Route 
        path="/mypage"
        element={ <MyPageWrapper />}
      />

      <Route 
        path="/meetings"
        element={ <MyMeetingsWrapper />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-center" richColors />
      <AppRoutes />
    </AppProvider>
  );
}